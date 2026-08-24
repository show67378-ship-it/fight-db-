// クロール専用の構造化ロガー。個人情報・APIキーは出力しない(仕様 36)。
// 例: 2026-08-23 SOURCE=JBJJF URL=... STATUS=SUCCESS FOUND_GYMS=30

const REDACT_KEYS = new Set(["apiKey", "api_key", "password", "authorization", "token"]);

function formatFields(fields?: Record<string, unknown>): string {
  if (!fields) return "";
  return Object.entries(fields)
    .filter(([key]) => !REDACT_KEYS.has(key))
    .map(([key, value]) => `${key.toUpperCase()}=${value}`)
    .join(" ");
}

export function crawlLog(message: string, fields?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const suffix = formatFields(fields);
  console.log(`${timestamp} ${message}${suffix ? " " + suffix : ""}`);
}

export function sourceLogger(sourceName: string) {
  return (message: string, fields?: Record<string, unknown>) =>
    crawlLog(message, { SOURCE: sourceName, ...fields });
}
