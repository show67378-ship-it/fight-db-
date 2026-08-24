// JBC 登録・変更情報 parser。
// https://jbc.or.jp/register/ の table(ジム/変更日付/変更前/→/変更後)には
// 「新ジム開設」「名称変更」「住所変更」「閉鎖」等が混在する。
// 誤ったデータを作らないよう、意味が一意に確定する「新ジム開設」行(変更前列がその文言のもの)
// だけを新規ジム候補として扱い、それ以外(改称・移転・閉鎖等)は既存ジムとの照合が必要なため
// このバージョンでは取り込まない(仕様44: 件数よりデータ品質を優先)。
import * as cheerio from "cheerio";
import type { ParsedGymRecord, ParserContext, SourceParser } from "../core/types";
import { extractPrefecture, extractCity } from "../normalize/address";

const NEW_GYM_MARKER = "新ジム開設";

export const jbcRegisterParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedGymRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const records: ParsedGymRecord[] = [];

    $("table tbody tr").each((_, tr) => {
      const cells = $(tr)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();
      if (cells.length < 5) return;
      const [gymName, , before, , after] = cells;
      if (!gymName || before !== NEW_GYM_MARKER || !after) return;

      const prefecture = extractPrefecture(after);
      if (!prefecture) return; // 住所として解釈できない値は取り込まない

      records.push({
        kind: "gym",
        name: gymName,
        address: after,
        prefecture,
        city: extractCity(after, prefecture),
        disciplines: ["boxing"],
        sourceUrl: entryUrl,
      });
    });

    ctx.log("JBC register parse complete", { FOUND_NEW_GYMS: records.length });
    return records;
  },
};
