// 修斗 選手紹介一覧 parser。
// https://www.shooto-mma.com/fighters/ の table.fighter-table に全選手(1900名超)が
// 1ページで並んでおり、所属欄から新規ジム発見(仕様19)の元データになる。
// 各選手の詳細ページ(?id=N)を追加取得し、修斗公式戦の戦績(勝敗)・国籍・生年月日・身長を
// 取れる範囲で補完する(仕様: 戦績は公式サイトから)。詳細ページに情報がなければ null のまま。
import * as cheerio from "cheerio";
import type { ParsedFighterRecord, ParserContext, SourceParser } from "../core/types";

function extractLabelledText($: cheerio.CheerioAPI, className: string): string | undefined {
  const text = $(`.${className}`).first().text();
  const value = text.replace(/^[^:：]*[:：]\s*/, "").trim();
  return value || undefined;
}

async function fetchShootoDetail(
  ctx: ParserContext,
  detailUrl: string,
): Promise<Pick<ParsedFighterRecord, "record" | "nationality" | "birthdate" | "heightCm">> {
  try {
    const page = await ctx.fetchPage(detailUrl);
    const $ = cheerio.load(page.html);

    const resultText = $("table.result-list").text();
    const wins = (resultText.match(/○/g) ?? []).length;
    const losses = (resultText.match(/●/g) ?? []).length;
    const draws = (resultText.match(/△/g) ?? []).length;
    const record = wins + losses + draws > 0 ? { wins, losses, draws } : undefined;

    const nationality = extractLabelledText($, "pf-fighter-country");

    const birthText = extractLabelledText($, "pf-fighter-birth");
    const birthMatch = birthText?.match(/(\d{4})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/);
    const birthdate = birthMatch
      ? `${birthMatch[1]}-${birthMatch[2].padStart(2, "0")}-${birthMatch[3].padStart(2, "0")}`
      : undefined;

    const heightText = extractLabelledText($, "pf-fighter-height");
    const heightMatch = heightText?.match(/(\d+(?:\.\d+)?)\s*cm/);
    const heightCm = heightMatch ? Number(heightMatch[1]) : undefined;

    return { record, nationality, birthdate, heightCm };
  } catch {
    // 詳細ページの取得に失敗しても一覧側の情報は活かす(全体を止めない)。
    return {};
  }
}

export const shootoParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedFighterRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);

    const base: ParsedFighterRecord[] = [];

    $("table.fighter-table tbody tr, table.fighter-table tr").each((_, tr) => {
      const cells = $(tr)
        .find("td")
        .map((_, td) => $(td).text().trim())
        .get();
      if (cells.length < 3) return; // ヘッダー行など
      const [nameJa, nameEn, gymRaw] = cells;
      if (!nameJa) return;

      const href = $(tr).find("a[href]").first().attr("href");
      const detailUrl = href ? new URL(href, entryUrl).toString() : entryUrl;

      base.push({
        kind: "fighter",
        name: nameJa.replace(/\s+/g, " ").trim(),
        nameEn: nameEn?.trim() || undefined,
        gymNameRaw: gymRaw?.trim() || undefined,
        organization: "修斗",
        discipline: "mma",
        sourceUrl: detailUrl,
      });
    });

    const records: ParsedFighterRecord[] = [];
    for (const fighter of base) {
      const detail = await fetchShootoDetail(ctx, fighter.sourceUrl);
      records.push({ ...fighter, ...detail });
    }

    ctx.log("Shooto parse complete", { FOUND_FIGHTERS: records.length });
    return records;
  },
};
