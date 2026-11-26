# Knallmelder

Anonymous reporting app for fireworks noise. People report a bang in three steps (info, where, when), pick the approximate spot on a map, and the app shows where reports cluster.

**Live demo:** [knallmelder.de](https://knallmelder.de)

<img width="1896" height="1662" alt="Screen Shot 2026-11-26 at 10 39 07" src="https://github.com/user-attachments/assets/7bc71798-e176-422f-8ad2-e0aa3f87c5a9" />


## What it does

- **Report in three steps:** what happened, where (map pick, an approximate spot is enough), when.
- **Hotspots instead of single points:** several reports from one area are marked as a hotspot. Public data is only shown aggregated, so single reports cannot be traced or abused.
- **Anonymous:** no account, no personal data stored with a report.
- **German and English** via `sveltekit-i18n`.

## Tech stack

| Area      | Choice                                                      |
| --------- | ----------------------------------------------------------- |
| App       | SvelteKit 2, Svelte 5, TypeScript, Node adapter             |
| UI        | Tailwind CSS 4, daisyUI, Tabler Icons                        |
| Map       | MapLibre GL (`svelte-maplibre-gl`)                           |
| Data      | PostgreSQL, Prisma 7 with migrations and seed data           |
| Tests     | Vitest, browser tests with Playwright (`vitest-browser-svelte`) |
| Quality   | ESLint, Prettier, `svelte-check`, Husky pre-commit hooks     |
| CI        | GitHub Actions                                               |

## Getting started

Requires Node.js 22 and a PostgreSQL database.

```sh
npm install
cp .env.example .env    # set DATABASE_URL
npm run dev:reset       # reset DB, push schema, load seed data
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command                   | What it does                                  |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Dev server                                     |
| `npm run build`           | Production build (Node adapter)                |
| `npm test`                | Unit and browser tests, single run             |
| `npm run check`           | Type check with `svelte-check`                 |
| `npm run lint`            | Prettier check and ESLint                      |
| `npm run db:migrate:dev`  | Apply migrations to the dev database           |
| `npm run db:migrate:prod` | Apply migrations to the production database   |

## Status

Demo (v0.19.0). Side project, built and run by me end to end: product idea, UI, data model, hosting.

## Use of AI

Built with Claude as a pair programmer for code generation and review. Every change was reviewed by me before it was committed.
