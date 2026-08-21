export interface EventBrand {
  name: string;
  description: string;
  sourceUrl: string;
}

// 実在の日本国内MMA大会・団体情報(公開情報をもとに作成、出典URL付き)。
// 最新の開催状況は各団体の公式サイトでご確認ください。

export const proEvents: EventBrand[] = [
  {
    name: "RIZIN",
    description: "MMA・キックボクシングを主催する国内最大級の総合格闘技プロモーション。",
    sourceUrl: "https://jp.rizinff.com/",
  },
  {
    name: "パンクラス(PANCRASE)",
    description: "「世界標準」を掲げる老舗のプロMMA団体。ナンバリング大会を継続開催。",
    sourceUrl: "https://www.pancrase.co.jp/",
  },
  {
    name: "DEEP(DEEP JEWELSほか)",
    description: "老舗プロMMA団体。女子部門「DEEP JEWELS」や地域開催の「IMPACT」シリーズを展開。",
    sourceUrl: "https://www.deep2001.com/future/",
  },
  {
    name: "修斗(プロフェッショナル修斗)",
    description: "日本最古参の総合格闘技団体・ルール。「Professional Shooto」としてナンバリング大会を開催。",
    sourceUrl: "https://www.shooto-mma.com/schedule/",
  },
  {
    name: "GRACHAN",
    description: "2008年創設、2012年に再始動した中堅プロMMA団体。音楽とイベントを融合した大会運営が特徴。",
    sourceUrl: "https://grachan.jp/news/2025-2026schedule/",
  },
];

export const amateurEvents: EventBrand[] = [
  {
    name: "アマチュア修斗",
    description:
      "一般社団法人日本修斗協会が運営する公式アマチュアMMA大会。全国の地方大会(沖縄・北信越・関西・九州・東海・東北・四国・北海道・中国・関東)を経て全国大会につながる。",
    sourceUrl: "https://j-shooto.com/category/amateur/",
  },
  {
    name: "アマチュアパンクラス(Cage Fight シリーズ)",
    description: "パンクラスが運営するアマチュア向けケージファイト大会。提携ジムで開催。",
    sourceUrl: "https://www.pancrase.co.jp/amateur/schedule/",
  },
  {
    name: "Amateur GLADIATOR",
    description:
      "プロ団体GLADIATORが公認するアマチュアMMAトーナメントシリーズ。2023年7月創設。",
    sourceUrl: "https://www.amateur-gladiator.com/",
  },
  {
    name: "AMMAC RDX CUP",
    description:
      "一般社団法人JMOC(日本MMA審判機構)が運営するアマチュアMMA大会。プロに近いルールの「カテゴリーS」と、IMMAF世界基準ルールの「カテゴリーA」の2部門制。",
    sourceUrl: "https://www.ammac-japan.org/",
  },
];
