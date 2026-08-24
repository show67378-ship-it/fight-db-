// 住所文字列から都道府県・市区町村を抽出する。ジオコーディングは行わず、
// 文字列パターンのみで安全に判定できる範囲に留める(誤爆するくらいなら null)。

export const PREFECTURES = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
];

export function extractPrefecture(address: string | undefined | null): string | undefined {
  if (!address) return undefined;
  const trimmed = address.trim();
  return PREFECTURES.find((pref) => trimmed.startsWith(pref));
}

// 都道府県の直後から、番地(数字)が現れる直前までを市区町村とみなす簡易抽出。
export function extractCity(address: string | undefined | null, prefecture?: string): string | undefined {
  if (!address) return undefined;
  const pref = prefecture ?? extractPrefecture(address);
  if (!pref) return undefined;

  const rest = address.trim().slice(pref.length);
  // 「郡+町/村」(例: 河東郡音更町)、政令指定都市の「市+区」(例: 大阪市西成区)を
  // 優先的に複合表記としてまとめ、なければ単純な市区町村区切りを使う。
  const gunMatch = rest.match(/^(.*?郡.*?[町村])/);
  if (gunMatch) return gunMatch[1];
  const cityWardMatch = rest.match(/^(.*?市.*?区)/);
  if (cityWardMatch) return cityWardMatch[1];
  const match = rest.match(/^(.*?[市区町村])/);
  return match ? match[1] : undefined;
}
