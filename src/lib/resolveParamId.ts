// 動的ルートの [id] セグメントは、実行環境(next dev / Vercel本番)によって
// URLエンコードされたまま渡ることもあれば、既にデコード済みで渡ることもある。
// 日本語IDのジム・選手等が本番で404になる問題があったため、両方のパターンで
// 検索できるよう候補を列挙する。
export function idCandidates(rawId: string): string[] {
  const candidates = [rawId];
  try {
    const decoded = decodeURIComponent(rawId);
    if (decoded !== rawId) candidates.push(decoded);
  } catch {
    // 不正なパーセントエンコーディングは無視して rawId のみ試す
  }
  return candidates;
}
