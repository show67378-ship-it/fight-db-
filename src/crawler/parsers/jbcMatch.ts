// JBC 試合予定 parser。
// https://jbc.or.jp/match/ は「YYYY年MM月DD日 会場名」を投稿タイトルとする
// カード一覧(ページネーションなし、直近の予定のみ)。
import * as cheerio from "cheerio";
import type { ParsedEventRecord, ParserContext, SourceParser } from "../core/types";

const TITLE_PATTERN = /^(\d{4})年(\d{2})月(\d{2})日\s*(.+)$/;

export const jbcMatchParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedEventRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const records: ParsedEventRecord[] = [];
    const seen = new Set<string>();

    $("h5.vk_post_title a").each((_, a) => {
      const title = $(a).text().trim();
      const href = $(a).attr("href");
      if (!title || !href || seen.has(href)) return;
      seen.add(href);

      const match = title.match(TITLE_PATTERN);
      if (!match) return; // 想定外の形式は取り込まず(hallucination防止・仕様25と同じ方針)
      const [, year, month, day, venue] = match;
      const eventDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

      records.push({
        kind: "event",
        name: venue,
        organizationId: "jbc",
        eventDate,
        eventDateRaw: title,
        venue,
        officialUrl: href,
        sourceUrl: href,
      });
    });

    ctx.log("JBC match parse complete", { FOUND_EVENTS: records.length });
    return records;
  },
};
