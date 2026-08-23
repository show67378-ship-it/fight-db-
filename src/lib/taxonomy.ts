import type { Organization, OrganizationSlug, Sport, SportSlug } from "./types";

// 競技・団体は固定の分類のため、ファイルI/Oを行うdata.tsとは分離しています。
// クライアントコンポーネントからはこちらを直接importしてください(data.tsはNode専用のfs読み込みを含むため)。

export const sports: Sport[] = [
  { slug: "mma", name: "MMA", shortName: "MMA", accent: "#E2622F" },
  { slug: "bjj", name: "ブラジリアン柔術", shortName: "BJJ", accent: "#2F8F6B" },
  { slug: "kickboxing", name: "キックボクシング", shortName: "キック", accent: "#3F7BC4" },
  { slug: "boxing", name: "ボクシング", shortName: "ボクシング", accent: "#C4383F" },
];

// 現在サイトで表示する競技。ナビゲーションや一覧表示にはこちらの
// activeSports / visibleSports を使ってください。
export const activeSports: SportSlug[] = ["mma", "bjj", "kickboxing", "boxing"];

export const visibleSports: Sport[] = sports.filter((s) => activeSports.includes(s.slug));

export const organizations: Organization[] = [
  // MMA
  { slug: "ufc", name: "UFC" },
  { slug: "rizin", name: "RIZIN" },
  { slug: "breakingdown", name: "BREAKINGDOWN" },
  { slug: "deep", name: "DEEP" },
  { slug: "shooto", name: "修斗" },
  { slug: "pancrase", name: "パンクラス" },
  // キックボクシング
  { slug: "rise", name: "RISE" },
  { slug: "k1", name: "K-1" },
  // ボクシング
  { slug: "jbc", name: "JBC" },
  { slug: "wba", name: "WBA" },
  { slug: "wbo", name: "WBO" },
  { slug: "wbc", name: "WBC" },
  { slug: "ibf", name: "IBF" },
];

export function getSport(slug: SportSlug): Sport {
  return sports.find((s) => s.slug === slug)!;
}

export function getOrganization(slug: OrganizationSlug): Organization {
  return organizations.find((o) => o.slug === slug)!;
}
