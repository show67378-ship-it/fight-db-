// 名称の表記ゆれ正規化(仕様 23)。
// あくまで「同一判定・検索」用の normalizedName を作るためのもので、
// 表示用の original name(Gym.name / Athlete.name)は絶対に書き換えない。

const CORPORATE_PREFIXES = [/^株式会社/, /^有限会社/, /^\(株\)/, /^\(有\)/];
const NOISE_SUFFIXES = [
  /GYM\.?$/i,
  /ACADEMY$/i,
  /ジム$/,
  /アカデミー$/,
  /道場$/,
  /支部$/,
  /本部$/,
];

function toHalfWidth(input: string): string {
  return input
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
    )
    .replace(/　/g, " ");
}

export function normalizeGymName(rawName: string): string {
  let name = toHalfWidth(rawName).trim();
  name = name.replace(/\s+/g, " ");

  for (const pattern of CORPORATE_PREFIXES) {
    name = name.replace(pattern, "");
  }
  name = name.trim();

  // 末尾の GYM/ACADEMY/道場等は「同一施設の表記ゆれ」判定用に一段階だけ剥がす。
  // ブランド名自体は壊さないよう、1回のみ適用する。
  for (const pattern of NOISE_SUFFIXES) {
    const stripped = name.replace(pattern, "").trim();
    if (stripped.length >= 2) {
      name = stripped;
      break;
    }
  }

  return name.toUpperCase().replace(/[^\p{L}\p{N}]/gu, "");
}

// レーベンシュタイン距離ベースの単純な類似度(0〜1)。外部依存を増やさないための自前実装。
export function nameSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  const distance = dp[a.length][b.length];
  const maxLen = Math.max(a.length, b.length);
  return 1 - distance / maxLen;
}
