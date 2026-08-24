// クローラー共通の型定義。各 parser はこの契約にだけ依存する。
// サイトごとの HTML 変更が他サイトの parser に影響しないよう、
// parser は「生ページ → ParsedRecord[]」の変換だけを担当する。

export type CrawlType = "full" | "incremental" | "source_only" | "retry_failed";

export interface ParsedGymRecord {
  kind: "gym";
  name: string;
  nameEn?: string;
  representative?: string;
  address?: string;
  prefecture?: string;
  city?: string;
  phone?: string;
  websiteUrl?: string;
  disciplines: string[]; // Discipline id (例: "bjj", "boxing")
  sourceUrl: string;
}

export interface ParsedFighterRecord {
  kind: "fighter";
  name: string;
  nameEn?: string;
  gymNameRaw?: string; // 所属ジムの表記ゆれを含む生テキスト。Gym 突合は orchestrator 側で行う。
  weightClass?: string;
  organization?: string;
  discipline?: string; // Discipline id(例: "mma","kickboxing","boxing")。未指定時は "mma" 扱い。
  // 公式サイトの選手詳細ページから取得できた場合のみ設定(仕様25: 書いていない情報は推測しない)。
  record?: { wins: number; losses: number; draws: number };
  nationality?: string;
  birthdate?: string; // YYYY-MM-DD
  heightCm?: number;
  sourceUrl: string;
}

export interface ParsedEventRecord {
  kind: "event";
  name: string;
  organizationId?: string;
  eventDate?: Date;
  eventDateRaw?: string;
  venue?: string;
  prefecture?: string;
  city?: string;
  officialUrl?: string;
  sourceUrl: string;
}

export type ParsedRecord = ParsedGymRecord | ParsedFighterRecord | ParsedEventRecord;

export interface FetchedPage {
  url: string;
  html: string;
  status: number;
}

export interface ParserContext {
  fetchPage: (url: string) => Promise<FetchedPage>;
  // RIZIN等、JavaScriptでページ内容を描画するサイト向け。ヘッドレスブラウザで
  // 実際にレンダリングした後のHTMLを返す(通常のfetchPageより低速・重い)。
  // ヘッドレスブラウザを使わない source では未提供(orchestrator側で必要な場合のみ渡す)。
  fetchRenderedPage?: (url: string) => Promise<FetchedPage>;
  log: (message: string, fields?: Record<string, unknown>) => void;
}

export interface SourceParser {
  // 単一のエントリーポイント URL から巡回を開始し、発見したレコードを返す。
  // サイト固有のページネーション・詳細ページ追跡は parser 内で完結させる。
  run: (ctx: ParserContext, entryUrl: string) => Promise<ParsedRecord[]>;
}
