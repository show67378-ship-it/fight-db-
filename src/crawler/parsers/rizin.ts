// RIZIN 選手一覧 parser。
// https://jp.rizinff.com/fighters/mma (および /fighters/kick) はJavaScriptで選手カードを
// 描画するSPA的なページのため、ctx.fetchRenderedPage(ヘッドレスブラウザ)で取得する。
// 選手名は取れるが、公式サイトには所属ジムや戦績が構造化データとして存在しないため、
// それらは取得しない(仕様25: 書かれていない情報は推測しない)。
import * as cheerio from "cheerio";
import type { ParsedFighterRecord, ParserContext, SourceParser } from "../core/types";

function makeRizinParser(discipline: "mma" | "kickboxing"): SourceParser {
  return {
    async run(ctx: ParserContext, entryUrl: string): Promise<ParsedFighterRecord[]> {
      if (!ctx.fetchRenderedPage) {
        throw new Error("fetchRenderedPage is not available in this context");
      }
      const page = await ctx.fetchRenderedPage(entryUrl);
      const $ = cheerio.load(page.html);

      const records: ParsedFighterRecord[] = [];
      const seen = new Set<string>();

      $("#member-list .person").each((_, el) => {
        const anchor = $(el).find("a").first();
        const h4Html = anchor.find("h4").first().html() ?? "";
        const [nameJaRaw, nameEnRaw] = h4Html.split(/<br\s*\/?>/i);
        const nameJa = cheerio.load(`<div>${nameJaRaw ?? ""}</div>`)("div").text().trim();
        const nameEn = nameEnRaw ? cheerio.load(`<div>${nameEnRaw}</div>`)("div").text().trim() : undefined;
        if (!nameJa || seen.has(nameJa)) return;
        seen.add(nameJa);

        const href = anchor.attr("href");
        const sourceUrl = href ? new URL(href, entryUrl).toString() : entryUrl;

        records.push({
          kind: "fighter",
          name: nameJa,
          nameEn,
          organization: "RIZIN",
          discipline,
          sourceUrl,
        });
      });

      ctx.log("RIZIN parse complete", { DISCIPLINE: discipline, FOUND_FIGHTERS: records.length });
      return records;
    },
  };
}

export const rizinMmaParser = makeRizinParser("mma");
export const rizinKickParser = makeRizinParser("kickboxing");
