import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "src", "data");

export function readJson<T>(file: string): T {
  const p = path.join(dataDir, file);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

export function writeJson<T>(file: string, data: T): void {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
