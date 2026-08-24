import { createHash } from "node:crypto";

// 差分更新(仕様 27)・Raw データの重複検知に使う content hash。
export function contentHash(payload: string): string {
  return createHash("sha256").update(payload).digest("hex");
}
