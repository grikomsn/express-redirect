# express-redirect

Tiny **Express** app built for a bootcamp segment on **REST APIs**: one dynamic `GET` route resolves short slugs from JSON and responds with an HTTP redirect—enough to show routing, handlers, status codes, and a read from the filesystem.

## Stack

- Node **20+**, **Express 5**, **TypeScript**
- Slugs and targets live in `data.json`; redirect counts in `counter.json` (both can live under `DATA_DIR` if set)

## Run locally

```bash
npm install
npm run dev          # tsx watch — http://localhost:3000
# or
npm run build && npm start
```

`PORT` defaults to `3000`. Production hosts (e.g. Railway) set `PORT` for you.

## Routes

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/health` | `200` + plain `ok` |
| GET | `/analytics` | Simple HTML table of hit counts per slug |
| GET | `/analytics.json` | Same counts as JSON |
| GET | `/:slug` | `302` to URL from `data.json`, or `404` |

Named routes are registered **before** `/:slug` so paths like `/analytics` are not treated as slugs.

## Data

- **`data.json`** — map of slug → destination URL (committed example; adjust as needed).
- **`counter.json`** — auto-updated hit counts (in repo as a starter; on PaaS use a volume + `DATA_DIR` if counts must survive redeploys).

## Deploy

Configured for **Railway** via `railway.toml` (Nixpacks: `npm run build`, then `npm start`). Set **`DATA_DIR`** to a mounted volume path if you want durable `data.json` / `counter.json`.
