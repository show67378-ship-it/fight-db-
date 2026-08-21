import type { Organization, OrganizationSlug, Sport, SportSlug } from "./types";

// 競技・団体は固定の分類のため、ファイルI/Oを行うdata.tsとは分離しています。
// クライアントコンポーネントからはこちらを直接importしてください(data.tsはNode専用のfs読み込みを含むため)。

export const sports: Sport[] = [
  { slug: "mma", name: "MMA", shortName: "MMA", accent: "#E2622F" },
  { slug: "bjj", name: "ブラジリアン柔術", shortName: "BJJ", accent: "#2F8F6B" },
  { slug: "kickboxing", name: "キックボクシング", shortName: "キック", accent: "#3F7BC4" },
  { slug: "boxing", name: "ボクシング", shortName: "ボクシング", accent: "#C4383F" },
];

// 現在サイトで扱う競技(1つずつ完成させる方針のため、まずはMMAに特化)。
// sports自体は既存データの整合性(getSport等)のため4競技分残していますが、
// ナビゲーションや一覧表示にはこちらの activeSports / visibleSports を使ってください。
export const activeSports: SportSlug[] = ["mma"];

export const visibleSports: Sport[] = sports.filter((s) => activeSports.includes(s.slug));

export const organizations: Organization[] = [
  { slug: "rizin", name: "RIZIN" },
  { slug: "breakingdown", name: "BREAKINGDOWN" },
];

export function getSport(slug: SportSlug): Sport {
  return sports.find((s) => s.slug === slug)!;
}

export function getOrganization(slug: OrganizationSlug): Organization {
  return organizations.find((o) => o.slug === slug)!;
}
