# Launch Page SSR Plan — Cached Public Shell + Client Personalization

> Goal: server-render the launch product list so Google sees products and the first
> paint shows real content (no skeleton flash), while keeping all the interactivity
> and per-user data working. Cache the public list once and let per-user bits fill in
> on the browser.

## Context

- **Next.js version:** 16.1.6 (App Router)
- **Current page:** `app/launch/page.tsx` — a single `"use client"` component
- **Data hooks:** `usePagedProducts`, `useProductStats`, `useCategories` (React Query)
- **API client:** `api/client.ts` — plain `fetch`, no cache options
- **Auth:** HTTP-only cookie; user-specific fields (`bookmarked`, admin overrides) come
  from the client session, not the server.

## Key Next.js 16 facts (verified against v16.1.6 docs)

1. **`fetch` is NOT cached by default** — must opt in via `cache: 'force-cache'` or
   `next: { revalidate }`.
2. **`searchParams` opts a route out of the Full Route Cache** — the launch page reads
   filters (`category`, `page`, `q`, …), so the route renders **dynamically per request**.
3. **Data Cache and Full Route Cache are independent** — even though the route is dynamic,
   the individual product-list `fetch` can still be cached in the Data Cache.

## Why a full server-component rewrite is the wrong move

The page is full of browser-only interactivity that cannot run on the server:
search box, filter tabs, pagination, bookmark buttons, submit-product modal, `/`-key
shortcut, smooth scroll. So this is a **hybrid split**, not an all-server rewrite.

## Architecture: cached public shell + client personalization

```
Request /launch?category=3
        │
   ┌────▼─────────────────────────────────────────┐
   │ SERVER                                        │
   │  fetch products  ── NO auth cookie ──┐        │
   │                                      ▼        │
   │            Next Data Cache (shared, public)   │
   │            keyed by URL: ?category=3          │
   │            revalidate: 60s                    │
   │  → renders product list HTML                  │
   └────┬──────────────────────────────────────────┘
        │ sends HTML (products already visible, no skeleton)
   ┌────▼─────────────────────────────────────────┐
   │ BROWSER                                       │
   │  React Query refetches WITH cookie            │
   │  → gets bookmarked / admin per-user fields    │
   │  → updates the buttons in place               │
   └───────────────────────────────────────────────┘
```

### Responsibility split

| Piece                            | Where it runs               | Cached?                 |
| -------------------------------- | --------------------------- | ----------------------- |
| Product list (public fields)     | Server                      | ✅ Yes, shared, 60s     |
| Page HTML shell                  | Server                      | ❌ No (searchParams)    |
| Bookmarked / admin buttons       | Browser (React Query, cookie) | ❌ Never — per-user    |
| Search / filters / pagination    | Browser                     | n/a (interactive)       |

### The safety rule

**The server fetch must NOT send the auth cookie.** That keeps the response:

- **Shareable** — identical for every user, so caching is correct.
- **Safe** — no risk of one user's bookmarks leaking into another's cached page.

`http.get(path)` without `{ auth: true }` already omits credentials, so the public
fetch is naturally cacheable.

## Implementation steps

### 1. Add a cached server fetch for the public product list

Create a server-only fetch (or extend `api/client.ts`) that hits the products endpoint
without the auth cookie and opts into the Data Cache:

```ts
// runs on the server; public, shared across users
fetch(`${BASE_URL}/products?${params}`, {
  next: { revalidate: 60, tags: ["products"] },
})
```

- `revalidate: 60` → cache the public list for 60s per unique URL (filter combo).
- `tags: ["products"]` → allows instant cache busting via `revalidateTag("products")`
  when a new product is submitted/approved (instead of waiting for the 60s window).

### 2. Split `app/launch/page.tsx`

- **`page.tsx`** → becomes an `async` **server component** ("shell"):
  - `await searchParams`
  - does the cached public fetch for the first page of products (+ stats, categories)
  - prefetches that data into a React Query `QueryClient`
  - wraps children in `<HydrationBoundary state={dehydrate(queryClient)}>`
- **`LaunchClient.tsx`** → the **current `"use client"` component**, essentially unchanged:
  - keeps using `usePagedProducts` / `useProductStats` / `useCategories`
  - on first render the hooks find the data already in cache (no skeleton)

### 3. Wire React Query SSR hydration

- Prefetch the same query keys the client hooks use, so hydration matches:
  - `["products", "paged", status, categoryId, dateFilter, sortBy, search, upvoted, page, pageSize]`
  - `["product", "stats"]`
  - reference categories key
- After hydration, the client refetches **with** the auth cookie to populate per-user
  fields (`bookmarked`, admin visibility), updating the UI in place.

### 4. Cache invalidation on writes

- On product submit/approve, call `revalidateTag("products")` (server action or route
  handler) so the cached public list refreshes immediately.

## Gotchas / open questions

- **Query-key parity:** server prefetch keys must exactly match the client hook keys or
  hydration won't hit and you'll get a refetch + flash. Verify against
  `features/products/hooks.ts`.
- **SSR-safe fetch layer:** the server fetch must use an absolute URL
  (`NEXT_PUBLIC_API_BASE_URL`) and not depend on `window`. Current `http` client uses
  `BASE_URL` already, but confirm it runs in a Node context.
- **Public vs authed response shape:** the public (uncookied) response will have
  `bookmarked: false`/absent; the client refetch fills the real value. Confirm the
  backend returns a consistent shape for anonymous requests.
- **nuqs on the server:** use its server-side adapter to parse `searchParams` during
  prefetch so values match the client parsers.
- **Per-user data must never be cached** — only the anonymous list fetch is cached; the
  authed client fetch is never stored by Next.

## Cheaper alternative (if SEO is NOT the goal)

If the goal is only "feels snappier" (not Google indexing), skip SSR entirely and just
add caching to the existing client hook — `usePagedProducts` currently has **no
`staleTime`**, so it refetches on every visit (the skeleton flash):

```ts
// features/products/hooks.ts → usePagedProducts
staleTime: 2 * 60 * 1000,        // data stays fresh 2 min → instant on return navigation
placeholderData: (prev) => prev, // keep old list visible while next page loads
```

This is ~90% of the perceived-speed win for ~1% of the effort, but does **nothing** for
SEO/first-paint on a cold visit.

## Decision summary

- Do the SSR split **if SEO / crawlers seeing products matters.**
- Use the cached-public-shell pattern — render fresh per request, cache only the
  anonymous list in the Data Cache.
- Never cache per-user data; let it hydrate on the client.
- If only perceived speed matters, the `staleTime` one-liner is enough.
