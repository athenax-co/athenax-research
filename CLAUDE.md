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

### 3-Layer API Structure

Code is organized into three distinct layers — types, API, hooks:

- **`types/`** — TypeScript interfaces only. No logic. `auth.ts` holds all auth-related types; `reference.ts` holds `CategoryOut`, `UniversityOut`, `LabOut`, `CategoryRef`.
- **`api/`** — Fetch functions only. Import types from `types/`, use `handleResponse` and `BASE_URL` from `api/client.ts`. No React.
  - `api/client.ts` — `BASE_URL` (from `NEXT_PUBLIC_API_BASE_URL` env) and shared `handleResponse<T>` helper
  - `api/auth.ts` — auth endpoints (`/user/*`)
  - `api/reference.ts` — reference data endpoints (`/category`, `/university`, `/lab`)
- **`hooks/queries/`** — React Query wrappers around `api/` functions. Import types directly from `types/`, never re-exported from `api/`. All query hooks live here (`useAuth.ts`, `useReference.ts`). Non-query hooks (e.g. `useCountdown.ts`) stay at `hooks/` root.

`lib/api.ts` is a separate concern — it handles the Payload CMS content API (`https://admin.athenax.co/api`) for articles and research. It is **not** part of the 3-layer structure above.

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

### Local-only Persistence

`utils/lib.ts` exports `dbRead()`/`dbWrite()` for localStorage. Used for bookmarks, votes, follows — not for auth state (auth uses cookies only).
