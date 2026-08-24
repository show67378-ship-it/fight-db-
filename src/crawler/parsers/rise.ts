// RISE(キックボクシング)選手一覧 parser。
// https://rise-rc.com/fighter は階級フィルタのドロップダウンを持つが、
// 選手カード自体(所属ジム込み)は1ページに全件サーバーレンダリングされている。
// 各選手の詳細ページを追加取得し、公式の戦歴(勝敗)・身長・生年月日を取れる範囲で補完する
// (仕様: 戦績は公式サイトから。書いていない情報は推測しない)。
import * as cheerio from "cheerio";
import type { ParsedFighterRecord, ParserContext, SourceParser } from "../core/types";

function stripParens(text: string): string {
  return text.replace(/^[（(]/, "").replace(/[）)]$/, "").trim();
}

function findProfileLine($: cheerio.CheerioAPI, label: string): string | undefined {
  let value: string | undefined;
  $(".p-fighter__profile p").each((_, p) => {
    const text = $(p).text().replace(/\s+/g, "");
    if (text.startsWith(`${label}／`)) {
      value = text.slice(label.length + 1).trim();
    }
  });
  return value || undefined;
}

async function fetchRiseDetail(
  ctx: ParserContext,
  detailUrl: string,
): Promise<Pick<ParsedFighterRecord, "record" | "birthdate" | "heightCm">> {
  try {
    const page = await ctx.fetchPage(detailUrl);
    const $ = cheerio.load(page.html);

    const recordText = findProfileLine($, "戦歴");
    const recordMatch = recordText?.match(/(\d+)戦(\d+)勝(\d+)敗(?:(\d+)分)?/);
    const record = recordMatch
      ? { wins: Number(recordMatch[2]), losses: Number(recordMatch[3]), draws: Number(recordMatch[4] ?? 0) }
      : undefined;

    const birthText = findProfileLine($, "生年月日");
    const birthMatch = birthText?.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    const birthdate = birthMatch
      ? `${birthMatch[1]}-${birthMatch[2].padStart(2, "0")}-${birthMatch[3].padStart(2, "0")}`
      : undefined;

    const heightText = findProfileLine($, "身長");
    const heightMatch = heightText?.match(/(\d+(?:\.\d+)?)\s*cm/);
    const heightCm = heightMatch ? Number(heightMatch[1]) : undefined;

    return { record, birthdate, heightCm };
  } catch {
    // 詳細ページの取得に失敗しても一覧側の情報は活かす(全体を止めない)。
    return {};
  }
}

export const riseParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedFighterRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const base: ParsedFighterRecord[] = [];

    $(".c-list__item").each((_, item) => {
      const anchor = $(item).find("a[href]").first();
      const nameJa = anchor.find(".p-fighter__title").first().text().trim();
      if (!nameJa) return;

      const nameEn = anchor.find(".p-fighter__english").first().text().trim();
      const gymRaw = stripParens(anchor.find(".p-fighter__gym").first().text().trim());
      const href = anchor.attr("href");
      const detailUrl = href ? new URL(href, entryUrl).toString() : entryUrl;

      base.push({
        kind: "fighter",
        name: nameJa,
        nameEn: nameEn || undefined,
        gymNameRaw: gymRaw || undefined,
        organization: "RISE",
        discipline: "kickboxing",
        sourceUrl: detailUrl,
      });
    });

    const records: ParsedFighterRecord[] = [];
    for (const fighter of base) {
      const detail = await fetchRiseDetail(ctx, fighter.sourceUrl);
      records.push({ ...fighter, ...detail });
    }

    ctx.log("RISE parse complete", { FOUND_FIGHTERS: records.length });
    return records;
  },
};
