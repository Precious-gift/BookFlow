# BookFlow Frontend Application

**Status:** Scaffolded & Frozen Tokens Configured (Ticket T-06)  
**Framework:** Next.js (App Router)  
**Design Reference:** `ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md`

---

## 1. Overview

The BookFlow frontend is a responsive web application built with Next.js (App Router), TypeScript, React, Tailwind CSS, and TanStack Query. It serves three strictly isolated route boundaries:
- Public Customer Booking (`/b/[slug]`) — Accountless guest booking
- Business Owner SaaS Portal (`/portal`) — Authenticated single-operator management
- Platform Administrator Portal (`/admin`) — System-level oversight and metrics

## 2. Technology Stack & Installed Dependencies

- **Framework:** Next.js `16.4.0` (App Router, Turbopack)
- **UI Runtime:** React `19.3.0`, React DOM `19.3.0`
- **Language:** TypeScript `5.x`
- **Styling:** Tailwind CSS `4.x` with `@tailwindcss/postcss` and `@tailwindcss/turbopack`
- **Server State / Cache:** TanStack Query (`@tanstack/react-query`) `^5.104.2`
- **Typography:** Inter (via `next/font/google`)
- **Linting:** ESLint `9.x` with `eslint-config-next`

## 3. Design System Tokens & Configuration

All design system tokens are strictly frozen per `ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md` and configured in both `src/app/globals.css` (`@theme`) and `tailwind.config.ts`:

### Core Brand Tokens
- `primary`: `#2563EB`
- `primary-hover`: `#1D4ED8`
- `primary-subtle`: `#EFF6FF`
- `secondary-accent`: `#0D9488`
- `secondary-hover`: `#0F766E`
- `background`: `#F8FAFC`
- `surface`: `#FFFFFF`
- `surface-secondary`: `#F1F5F9`
- `surface-tertiary`: `#E2E8F0`
- `border`: `#E2E8F0`
- `border-hover`: `#CBD5E1`
- `border-focus`: `#2563EB`
- `text-primary`: `#0F172A`
- `text-secondary`: `#475569`
- `text-muted`: `#94A3B8`

### Semantic Appointment Status Tokens
- **`Pending`**: Text `#B45309`, Tint `#FEF3C7`, Border `#FCD34D`, Highlight `#F59E0B`
- **`Confirmed`**: Text `#0369A1`, Tint `#E0F2FE`, Border `#BAE6FD`, Highlight `#0284C7`
- **`Completed`**: Text `#047857`, Tint `#D1FAE5`, Border `#A7F3D0`, Highlight `#10B981`
- **`Cancelled`**: Text `#BE123C`, Tint `#FFE4E6`, Border `#FECDD3`, Highlight `#F43F5E`

### Spacing & Geometry
- **8-Point Grid Spacing:** `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-10` (40px), `space-12` (48px), `space-16` (64px)
- **Radii:** `sm` (4px), `md` (6px), `lg` (8px), `xl` (12px), `full` (9999px)

## 4. Architecture Implementation Decisions

1. **Tailwind CSS v4 Configuration & Redundancy Elimination:** The project bootstrapped with Tailwind CSS v4. Design tokens are declared natively in `src/app/globals.css` using the `@theme` directive, which generates 100% of the CSS utility classes. The `@config` directive in `globals.css` was evaluated and removed as redundant because `@theme` is first-class in v4 and removing `@config` eliminated dynamic file parsing overhead while producing byte-for-byte identical output CSS (14,356 bytes). `tailwind.config.ts` is retained as the authoritative TypeScript design-token catalog and typed contract for unit test suites and external tools.
2. **ES Module Configuration:** `"type": "module"` is configured in `package.json` to ensure clean compatibility with Node 24 runtime without CJS/ESM reparsing warnings.
3. **QueryClientProvider Integration (getQueryClient Pattern):** Implemented in `src/providers/query-provider.tsx` (and re-exported as `QueryClientProvider.tsx`) using TanStack Query's official `getQueryClient()` pattern. On the server, a new `QueryClient` is created per request to avoid cross-request leaks; on the client, a singleton is preserved across renders, preventing cache loss during Suspense transitions. Configured with `staleTime: 60000ms`, `refetchOnWindowFocus: false`, and `retry: 1`.

## 5. Verification Commands

Run the following commands inside `frontend/`:

```bash
# Production Build
npm run build

# Code Linting
npm run lint

# Development Server
npm run dev
```

Both `npm run build` and `npm run lint` execute cleanly with exit code `0` and 0 warnings.
