import * as fs from "fs/promises";
import { dataJsonPath } from "./dataPaths.js";

export async function loadData() {
  const data = await fs.readFile(dataJsonPath(), "utf8");
  return JSON.parse(data) as any;
}

export async function resolveRedirect(slug: string) {
  const redirects = await loadData();
  return redirects[slug];
}
