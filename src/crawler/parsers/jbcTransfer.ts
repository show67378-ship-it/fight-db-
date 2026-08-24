// JBC ジム所属変更(移籍)情報 parser。
// https://jbc.or.jp/transfer/ の table(リングネーム/日付/所属元/→/所属先)から
// 選手の「現在の所属ジム」を取得する(仕様19のジム発見にも寄与)。
import * as cheerio from "cheerio";
import type { ParsedFighterRecord, ParserContext, SourceParser } from "../core/types";

export const jbcTransferParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedFighterRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const records: ParsedFighterRecord[] = [];
    const seen = new Set<string>(); // 同一選手が複数回移籍している場合、最新行(先頭)のみ採用

    $("table tbody tr").each((_, tr) => {
      const cells = $(tr)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();
      if (cells.length < 5) return;
      const [ringName, , , , toGym] = cells;
      if (!ringName || seen.has(ringName)) return;
      seen.add(ringName);

      records.push({
        kind: "fighter",
        name: ringName,
        gymNameRaw: toGym || undefined,
        organization: "JBC",
        discipline: "boxing",
        sourceUrl: entryUrl,
      });
    });

    ctx.log("JBC transfer parse complete", { FOUND_FIGHTERS: records.length });
    return records;
  },
};
