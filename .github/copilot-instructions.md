**Project Overview**
- **Type**: SvelteKit + TypeScript single-repo app (frontend + lightweight backend routes). We are using Svelte 5. Don't use legacy APIs.
- **Data layer**: Prisma (PostgreSQL) — client generated to `src/generated/prisma` and used via `src/lib/prisma.ts`.
- **Why this structure**: SvelteKit routes live under `src/routes`, server-side logic is colocated with route files (`+server.ts`), and Prisma keeps DB schema in `prisma/schema.prisma` for safe, typed access.

**Where to look first**
- `src/routes/+page.svelte`, `src/routes/api/reports/+server.ts` — examples of UI and server API.
- `src/lib/prisma.ts` — Prisma client instantiation using `@prisma/adapter-pg` and `DATABASE_URL`.
- `prisma/schema.prisma` — canonical DB model (see `Report` model).
- `prisma/seed.ts` — seed script that creates synthetic `Report` rows around Frankfurt.
- `vite.config.ts`, `svelte.config.js` — build/test integration (Vitest + Playwright, Tailwind + daisyUI).

**Common workflows & commands**
- Install dependencies: `npm install` (or `pnpm install`).
- Dev server: `npm run dev` (starts Vite + SvelteKit).
- Build: `npm run build`; preview: `npm run preview`.
- Regenerate Prisma client after schema changes: `npx prisma generate` (client output path: `src/generated/prisma`).
- Reset DB and seed (dangerous — wipes DB): `npm run dev:reset` (runs `prisma migrate reset --force && prisma db push && prisma db seed`).
- Run tests: `npm run test` (uses Vitest; browser tests run via Playwright per `vite.config.ts`).
- Formatting / linting: `npm run format` and `npm run lint`.

**Environment & secrets**
- The app reads `DATABASE_URL` via `dotenv` in the seed script and via SvelteKit's `$env/static/private` in runtime.
- Use a local Postgres for development and set `DATABASE_URL` appropriately before running `npm run dev:reset`.
- Seed count and radius can be controlled by `SEED_COUNT` and `SEED_RADIUS_METERS` env vars or CLI arg to `prisma/seed.ts`.

**Data model and API patterns**
- Single main model: `Report { id, deviceId, timestamp, latitude, longitude }` in `prisma/schema.prisma`.
- Server route example: `src/routes/api/reports/+server.ts` exposes:
  - `GET` that runs a parameterized raw SQL aggregation (rounded lat/lon bins). It accepts a `decimals` / `detail` query parameter (clamped 0–6) to control grouping precision.
  - `POST` that creates a `Report` with a `timestamp: new Date()`.
- Notes: the GET uses `prisma.$queryRaw` with an interpolated numeric parameter for `ROUND(..., ${decimals})` — prefer the existing clamping and parsing guard to avoid injection.

**Testing notes**
- Vitest config in `vite.config.ts` defines two projects: a browser project (Playwright) and a server project (node). Browser tests target `src/**/*.svelte.{test,spec}.{js,ts}`.
- To run headless browser tests locally ensure Playwright browsers are installed: `npx playwright install`.

**Code patterns & conventions**
- Use SvelteKit +server files for server logic; prefer `prisma` client imported from `src/lib/prisma.ts` to reuse adapter/config.
- Prisma client is ESM: imports use `.../client.js` (generated). Keep `generator client` output as-is.
- When adding DB fields: update `prisma/schema.prisma`, run `npx prisma migrate dev` (or `prisma db push` for quick changes), then `npx prisma generate`.

**Edge cases and gotchas**
- `prisma/seed.ts` uses `PrismaPg` adapter and imports the generated client directly — running seed requires Node with ESM support or `tsx`/`ts-node`.
- `dev:reset` is destructive: it resets migrations and runs seed. Run only after backing up any important data.
- Rounding precision in cluster SQL is clamped in code — don't remove the clamp without adding further validation.

**How AI agents should help (concise rules)**
- Prefer small, focused edits: change a single route or component and run tests. Mention touched files in PR description.
- When changing DB schema: suggest the exact `prisma migrate` commands and update the generated import paths if necessary.
- For performance-sensitive queries (e.g., clustering), prefer adding indexed columns or materialized views; propose a migration and a small benchmark script.
- For UI changes, follow existing Tailwind/daisyUI classes. See `.github/instructions/daisyui.instructions.md` for allowed patterns.

**If you need to run something locally (example commands, PowerShell)**
```
cd 'e:\Projects\WebstormProjects\igek'
# install
npm install

# dev server
npm run dev

# reset DB (local Postgres required and DATABASE_URL set)
$env:DATABASE_URL = 'postgres://user:pass@localhost:5432/igek'; npm run dev:reset

# run unit & browser tests
npm run test
```

If any part of this file is unclear or you want more examples (PR template snippets, recommended PR size limits, or automatic checks to add), tell me which area to expand.
