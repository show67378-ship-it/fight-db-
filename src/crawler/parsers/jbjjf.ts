// JBJJF(日本ブラジリアン柔術連盟)加盟アカデミー一覧 parser。
// https://www.jbjjf.com/academylist_latest/ は「北海道・東北・関東・甲信越北陸・東海・近畿・
// 中国四国・九州沖縄」という広域地方区分の見出しでまとまっており、都道府県ごとではない
// (北海道のみ地方=都道府県と一致)。見出しをそのまま prefecture に使うと「関東」等の
// 実在しない都道府県が入ってしまうため、必ず住所文字列から都道府県を再抽出する。
import * as cheerio from "cheerio";
import type { ParsedGymRecord, ParserContext, SourceParser } from "../core/types";
import { extractPrefecture, extractCity } from "../normalize/address";

function extractParenthesized(text: string): { rest: string; inner?: string } {
  const match = text.match(/[（(]([^）)]+)[）)]/);
  if (!match) return { rest: text };
  return { rest: text.replace(match[0], "").trim(), inner: match[1].trim() };
}

export const jbjjfParser: SourceParser = {
  async run(ctx: ParserContext, entryUrl: string): Promise<ParsedGymRecord[]> {
    const page = await ctx.fetchPage(entryUrl);
    const $ = cheerio.load(page.html);
    $("br").replaceWith("\n");

    const records: ParsedGymRecord[] = [];

    $("section[id] > h2").each((_, h2El) => {
      const section = $(h2El).parent();

      section.find("ul.ulType01 > li").each((_, li) => {
        const lines = ($(li).text() ?? "")
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length === 0) return;

        const nameLines: string[] = [];
        let representative: string | undefined;
        let address: string | undefined;
        let phone: string | undefined;

        for (const line of lines) {
          if (line.startsWith("指導者")) {
            representative = line.split(/[：:]/).slice(1).join(":").trim() || undefined;
          } else if (line.startsWith("住所")) {
            address = line.split(/[：:]/).slice(1).join(":").trim() || undefined;
          } else if (line.startsWith("TEL")) {
            phone = line.split(/[：:]/).slice(1).join(":").trim() || undefined;
          } else if (line.startsWith("URL")) {
            // href から別途取得するのでここでは無視
          } else {
            nameLines.push(line);
          }
        }

        const nameBlock = nameLines.join(" ").replace(/No\.\s*\d+/g, "").trim();
        const { rest: jaName, inner: enName } = extractParenthesized(nameBlock);
        const name = (jaName || nameBlock).trim();
        if (!name) return;

        const href = $(li).find("a[href]").first().attr("href");
        const prefecture = extractPrefecture(address);

        records.push({
          kind: "gym",
          name,
          nameEn: enName,
          representative,
          address,
          prefecture,
          city: extractCity(address, prefecture),
          phone,
          websiteUrl: href?.startsWith("http") ? href : undefined,
          disciplines: ["bjj"],
          sourceUrl: entryUrl,
        });
      });
    });

    ctx.log("JBJJF parse complete", { FOUND_GYMS: records.length });
    return records;
  },
};
