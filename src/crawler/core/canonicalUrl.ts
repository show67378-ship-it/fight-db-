// URL 重複取得防止のための canonical URL 生成(仕様 34)。
// utm 等の計測用パラメータを除去し、末尾スラッシュ・大文字小文字などを正規化する。

const TRACKING_PARAM_PREFIXES = ["utm_", "fbclid", "gclid", "yclid", "mc_"];

export function canonicalizeUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  url.hash = "";

  const keptParams: [string, string][] = [];
  for (const [key, value] of url.searchParams.entries()) {
    const lower = key.toLowerCase();
    if (TRACKING_PARAM_PREFIXES.some((p) => lower.startsWith(p))) continue;
    keptParams.push([key, value]);
  }
  keptParams.sort(([a], [b]) => a.localeCompare(b));
  url.search = "";
  for (const [key, value] of keptParams) url.searchParams.append(key, value);

  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  url.pathname = pathname;
  url.hostname = url.hostname.toLowerCase();

  return url.toString();
}
