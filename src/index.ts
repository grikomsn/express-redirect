import express from "express";
import { getRedirectCounts, incrementRedirectCount } from "./counters.js";
import { ensureDataDir } from "./dataPaths.js";
import { resolveRedirect } from "./redirects.js";

const app = express();
app.set("trust proxy", 1);

app.get("/health", (_req, res) => {
  res.status(200).type("text/plain").send("ok");
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.get("/analytics", async (_req, res) => {
  const counts = await getRedirectCounts();
  const rows = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(
      ([slug, n]) =>
        `<tr><td><code>${escapeHtml(slug)}</code></td><td>${n}</td></tr>`
    )
    .join("\n");
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirect analytics</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; max-width: 40rem; }
    h1 { font-size: 1.25rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f5f5f5; }
    td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
    .empty { color: #666; }
  </style>
</head>
<body>
  <h1>Redirect counts by slug</h1>
  ${
    rows.length
      ? `<table>
  <thead><tr><th>Slug</th><th>Redirects</th></tr></thead>
  <tbody>${rows}</tbody>
</table>`
      : `<p class="empty">No redirects recorded yet.</p>`
  }
</body>
</html>`;
  res.type("html").send(body);
});

app.get("/analytics.json", async (_req, res) => {
  const counts = await getRedirectCounts();
  res.json(counts);
});

app.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const redirect = await resolveRedirect(slug);
  if (redirect) {
    await incrementRedirectCount(slug);
    res.redirect(redirect);
    console.log(`Redirecting to ${redirect}`);
  } else {
    res.status(404).send("Not found");
    console.log(`Not found: ${slug}`);
  }
});

const port = Number(process.env.PORT) || 3000;

await ensureDataDir();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
