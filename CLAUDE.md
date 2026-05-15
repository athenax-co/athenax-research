# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start dev server on port 3543
bun build      # Production build
bun lint       # ESLint
bun format     # Prettier (writes in place)
bunx tsc --noEmit  # Type-check without emitting
```

No test suite exists in this project.

## Architecture

### Feature Structure (canonical — follow this for all new domain work)

New features go in `features/<name>/` and are fully self-contained:

```
features/papers/
  index.ts          ← public barrel — only import from here externally
  types.ts          ← TypeScript interfaces only, no logic
  api.ts            ← fetch functions using http helpers from api/client.ts
  hooks.ts          ← React Query wrappers around api.ts
  components/
    PaperPage.tsx
    PaperEditor.tsx
    FullScreenEditorDialog.tsx
```

**Rules:**
- External code always imports from `@/features/<name>` (the barrel), never from deep paths like `@/features/<name>/hooks`.
- Internal files within the feature use relative imports (`../hooks`, `../types`) to avoid circular barrel imports.
- `index.ts` exports types with `export type`, hooks with `export *`, and components as named exports.
- `api.ts` uses `http` from `@/api/client` — use `{ auth: true }` for protected endpoints, omit for public.
- `components/` holds only feature-specific components. Shared/reusable components stay in `components/`.

### API Client (`api/client.ts`)

`api/client.ts` exports `BASE_URL`, `handleResponse<T>`, and the `http` helper:

```ts
http.get<T>(path)                        // public — no credentials
http.get<T>(path, { auth: true })        // protected — sends cookie
http.post<T>(path, body, { auth: true })
http.patch<T>(path, body, { auth: true })
http.put<T>(path, body, { auth: true })
http.del<T>(path, { auth: true })
```

**Never use raw `fetch` in feature api files.** Always use `http`.

### Legacy Structure (existing non-feature code — do not extend)

- **`types/`** — shared types not owned by a feature (`auth.ts`, `reference.ts`, `product.ts`)
- **`api/`** — legacy fetch files (`auth.ts`, `reference.ts`, `product.ts`) still use raw fetch. Migrate to `http` when touching.
- **`hooks/queries/`** — legacy React Query hooks (`useAuth.ts`, `useReference.ts`, `useProduct.ts`). Non-query hooks stay at `hooks/` root.

`lib/api.ts` handles the Payload CMS content API (`https://admin.athenax.co/api`) for articles and research — separate concern, not part of the feature structure.

### Global State

`components/GlobalProvider.tsx` is the root provider. It owns:
- Singleton `QueryClient`
- Auth session via `useSession()` (React Query)
- Toast notification system (via `showToast` in context and `_globalShowToast` for non-component callers)
- Login/Register/CategoryPicker modal state
- `user` override pattern — `setUser()` allows immediate UI update before session refetch completes

The context value (`useGlobal()`) exposes: `user`, `setUser`, `showToast`, `handleAuthClick`, `selectedLab`, `setSelectedLab`.

### Authentication Flow

- Custom JWT backend at `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000/api/v1`)
- Sessions are HTTP-only cookies set by the backend
- `useSession()` calls `POST /user/verify` on mount; cached 5 min
- Login/Register happen in modals (`components/ui/`), not dedicated pages
- Dedicated pages exist only for: `/verify-email`, `/forgot-password`, `/reset-password` (under `app/(auth)/`)
- After email verification, `CategoryPickerModal` auto-shows if user has no categories

### Path Alias

`@/*` maps to the project root. Always use `@/` for imports rather than relative paths.

### Styling

Tailwind CSS v4. Four font CSS variables available: `--font-inter`, `--font-londrina`, `--font-space-grotesk` (primary body font), `--font-vt323`. Utility helper `cn()` in `utils/lib.ts` combines `clsx` + `tailwind-merge`.

**Buttons:** Always use the `Button` component from `@/components/ui/button`. Never use a raw `<button className="btn ...">`. Use `buttonVariants` when you need the class string without the component wrapper (e.g. on a `<Link>` element). Variants: `default` (primary/red), `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`. Only use raw `<button>` for fully custom UI controls (e.g. stepper rows, nav arrows) that don't map to any variant and would conflict with the `btn` base class.

### Local-only Persistence

`utils/lib.ts` exports `dbRead()`/`dbWrite()` for localStorage. Used for bookmarks, votes, follows — not for auth state (auth uses cookies only).
