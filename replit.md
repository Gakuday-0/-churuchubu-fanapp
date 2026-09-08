# ちゅ〜るちゅーぶ ファン運営サイト

Japanese idol fan website built with React + Vite + TypeScript.

## Run & Operate

- `pnpm --filter @workspace/churuchubu-fan run dev` — start dev server (PORT env var required)
- `pnpm --filter @workspace/churuchubu-fan run build` — production build (dist/public/)
- `pnpm --filter @workspace/churuchubu-fan run typecheck` — TypeScript check
- `pnpm --filter @workspace/api-server run dev` — run the shared API server (port 5000)
- `pnpm run typecheck` — full workspace typecheck
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, React Router v6, Tailwind CSS v4, shadcn/ui
- Shared API: Express 5 (`artifacts/api-server`)
- DB: PostgreSQL + Drizzle ORM (shared `lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)

## Where things live

```
artifacts/churuchubu-fan/
  src/
    components/     # Reusable shared components (index.ts re-exports)
    components/ui/  # shadcn/ui primitives (do not edit directly)
    hooks/          # Custom React hooks (index.ts re-exports)
    layouts/        # Route layouts (MainLayout.tsx = nav + Outlet + footer)
    lib/            # Pure helpers (utils.ts: cn(), formatDateJa())
    pages/          # One file per route
    types/          # Shared TypeScript types (index.ts)
    assets/         # Static assets (images, fonts, etc.)
  public/
    _redirects      # Cloudflare Pages SPA catch-all → index.html
```

## Routes

| Path        | Page component   | Japanese label     |
|-------------|------------------|--------------------|
| `/`         | HomePage         | ホーム             |
| `/live`     | LivePage         | ライブスケジュール |
| `/members`  | MembersPage      | メンバー           |
| `/benefits` | BenefitsPage     | 特典               |
| `/about`    | AboutPage        | このサイトについて |
| `/news`     | NewsPage         | NEWS               |

## Architecture decisions

- **React Router v6** (BrowserRouter) instead of Wouter — explicit user requirement.
- **Cloudflare Pages** — `public/_redirects` contains `/* /index.html 200` for SPA routing.
- **GitHub compatible** — no server-side code in the frontend artifact; pure static build.
- **Mobile-first** — the bottom navigation bar is the shared main navigation across pages.
- **Design-system-ready** — CSS custom properties in `index.css` cover both light and dark mode; swap values to rebrand.

## Gotchas

- Always run codegen after editing `lib/api-spec/openapi.yaml`:
  `pnpm --filter @workspace/api-spec run codegen`
- Vite requires `PORT` and `BASE_PATH` env vars (injected by the workflow system).
- Import from `@/...` (alias → `src/`), never with relative `../../` paths across feature boundaries.
- The `src/components/ui/` directory is managed by shadcn/ui — add components with the CLI, do not edit them manually.

## User preferences

- Mobile-first layout
- Japanese primary labels, English secondary
- No dummy content or placeholder images
- Clean, minimal structure — easy to edit from a mobile phone
