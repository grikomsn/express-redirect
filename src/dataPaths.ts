import * as fs from "fs/promises";
import * as path from "path";

function dataDir(): string {
  const fromEnv = process.env.DATA_DIR?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : process.cwd();
}

export function dataJsonPath(): string {
  return path.join(dataDir(), "data.json");
}

export function counterJsonPath(): string {
  return path.join(dataDir(), "counter.json");
}

/** Ensures DATA_DIR exists when set (e.g. Railway volume mount path). */
export async function ensureDataDir(): Promise<void> {
  const fromEnv = process.env.DATA_DIR?.trim();
  if (fromEnv && fromEnv.length > 0) {
    await fs.mkdir(fromEnv, { recursive: true });
  }
}
