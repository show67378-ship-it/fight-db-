// JBC(日本ボクシングコミッション)全国ジム住所録 parser。
// https://jbc.or.jp/gym/ は地区見出し(h3) + table(名称/住所/電話番号) の繰り返しで、
// 全地区が1ページにまとまっている。都道府県はaddress文字列から推定する。
import * as cheerio from "cheerio";
import type { ParsedGymRecord, ParserContext, SourceParser } from "../core/types";
import { extractPrefecture } from "../normalize/address";

export const jbcParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedGymRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const records: ParsedGymRecord[] = [];

    $("figure.wp-block-table table tbody tr").each((_, tr) => {
      const cells = $(tr)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();
      const [name, address, phone] = cells;
      if (!name) return;

      records.push({
        kind: "gym",
        name,
        address: address || undefined,
        prefecture: extractPrefecture(address),
        phone: phone || undefined,
        disciplines: ["boxing"],
        sourceUrl: entryUrl,
      });
    });

    ctx.log("JBC parse complete", { FOUND_GYMS: records.length });
    return records;
  },
};
