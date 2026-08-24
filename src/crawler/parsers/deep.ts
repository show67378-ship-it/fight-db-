// DEEP 選手一覧 parser。
// https://www.deep2001.com/fighters/ は静的HTMLに ul.fighterList (五十音の見出しごとに分割)で
// 全選手が列挙されている。各 li a の href は選手自身のプロフィールページではなく
// Sherdog/Tapology 等の外部戦績サイトへのリンクで、空の場合もある。
// 所属ジムや戦績は公式サイト側に構造化データが無いため取得しない(仕様25)。
import * as cheerio from "cheerio";
import type { ParsedFighterRecord, ParserContext, SourceParser } from "../core/types";

export const deepParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedFighterRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const records: ParsedFighterRecord[] = [];
    const seen = new Set<string>();

    $("ul.fighterList li a").each((_, el) => {
      const name = $(el).text().replace(/\s+/g, " ").trim();
      if (!name || seen.has(name)) return;
      seen.add(name);

      const href = $(el).attr("href");
      const sourceUrl = href ? new URL(href, entryUrl).toString() : entryUrl;

      records.push({
        kind: "fighter",
        name,
        organization: "DEEP",
        discipline: "mma",
        sourceUrl,
      });
    });

    ctx.log("DEEP parse complete", { FOUND_FIGHTERS: records.length });
    return records;
  },
};
