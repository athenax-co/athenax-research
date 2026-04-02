# AthenaX Research

A Next.js frontend for the AthenaX research network — connecting researchers, labs, founders, investors, and sponsors.

## Getting Started

```bash
bun dev     # runs on http://localhost:3543
bun build
bun lint
```

## Project Structure

```
api/           # HTTP fetch functions (one file per domain)
├── client.ts  # BASE_URL + shared handleResponse helper
├── auth.ts    # auth endpoints (/user/*)
└── reference.ts  # categories, universities, labs

types/         # TypeScript interfaces only, no logic
├── auth.ts
└── reference.ts

hooks/
└── queries/   # React Query hooks wrapping api/ functions
    ├── useAuth.ts
    └── useReference.ts

components/
├── GlobalProvider.tsx  # root context: session, toasts, modals
├── Navbar.tsx
├── ui/        # modals, dialogs, form controls
└── page/      # page-specific components

app/           # Next.js app router pages
├── (auth)/    # verify-email, forgot-password, reset-password
└── ...        # all other routes

lib/
└── api.ts     # Payload CMS content API (articles, research)

utils/
└── lib.ts     # cn() helper, localStorage read/write
```

## How It Fits Together

- **`api/`** talks to the backend (`NEXT_PUBLIC_API_BASE_URL`, default `localhost:8000/api/v1`).
- **`hooks/queries/`** wraps those calls in React Query for caching and state.
- **`GlobalProvider`** sits at the root and owns the auth session, toast system, and login/register/category-picker modals. Any component can call `useGlobal()` to access `user`, `showToast`, or `handleAuthClick`.
- **`lib/api.ts`** is separate — it fetches published content (articles, research posts) from the Payload CMS at `https://admin.athenax.co/api`.

## Environment

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```
