# Agent notes

## Intent

Bootcamp-friendly **REST + Express** demo: short links via `GET /:slug` → `redirect`, plus tiny analytics. Keep changes small and readable for learners.

## Layout

- **`src/index.ts`** — Express app, route order matters (`/health`, `/analytics`, `/analytics.json` before `/:slug`).
- **`src/redirects.ts`** — loads slug map from `data.json` (via `dataPaths`).
- **`src/counters.ts`** — read/write `counter.json` with serialized writes.
- **`src/dataPaths.ts`** — `process.cwd()` or `DATA_DIR` for both JSON files.

## Conventions

- **`dist/`** is gitignored; production runs compiled output after `npm run build`.
- Prefer **`PORT`** from the environment when listening.
- Do not rely on **`zustand`** here (unused dependency); avoid adding more deps unless necessary.

## Teaching angle

When editing, favor clarity over clever abstractions—this repo doubles as a teaching artifact.
