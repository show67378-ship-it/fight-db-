// 既存データの ID 規則(例: "gym-095bjj-長崎柔術")に合わせた ID 生成。
export function slugifyForId(prefix: string, name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${base || Date.now()}`;
}
