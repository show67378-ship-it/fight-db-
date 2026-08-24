// 電話番号を比較用に数字のみへ正規化する。表示用の元の値はそのまま保持すること。
export function normalizePhone(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 9) return undefined; // 桁数が明らかに不足していれば無効とみなす
  return digits;
}
