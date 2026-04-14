import * as fs from "fs/promises";
import { counterJsonPath } from "./dataPaths.js";

export type RedirectCounts = Record<string, number>;

let writeChain: Promise<void> = Promise.resolve();

async function readCounts(): Promise<RedirectCounts> {
  try {
    const raw = await fs.readFile(counterJsonPath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const out: RedirectCounts = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
        out[k] = Math.floor(v);
      }
    }
    return out;
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw e;
  }
}

async function writeCounts(counts: RedirectCounts): Promise<void> {
  const text = JSON.stringify(counts, null, 2) + "\n";
  await fs.writeFile(counterJsonPath(), text, "utf8");
}

export async function getRedirectCounts(): Promise<RedirectCounts> {
  return readCounts();
}

export async function incrementRedirectCount(slug: string): Promise<void> {
  const run = writeChain.then(async () => {
    const counts = await readCounts();
    counts[slug] = (counts[slug] ?? 0) + 1;
    await writeCounts(counts);
  });
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  await run;
}
