import { describe, expect, it } from "vitest";
import { riseParser } from "./rise";

const LIST_HTML = `
<html><body>
<div class="c-list p-page__content">
<div class="c-list__item -three">
  <a href="https://rise-rc.com/fighter/ami/">
    <p class="c-list__item-thumbnail"><img src="x.jpg"></p>
    <h3 class="p-fighter__title">愛弥</h3>
    <span class="p-fighter__english">Ami</span>
    <span class="p-fighter__gym">（NEXT LEVEL 渋谷）</span>
  </a>
</div>
</div>
</body></html>
`;

const DETAIL_HTML_AMI = `
<html><body>
<div class="p-fighter__profile">
  <p>身長／160cm</p>
  <p>生年月日／2001年12月25日</p>
  <p>戦歴／5戦4勝1敗（2KO）</p>
</div>
</body></html>
`;

describe("riseParser", () => {
  it("選手カード+詳細ページから戦績・身長・生年月日を取得する", async () => {
    const records = await riseParser.run(
      {
        log: () => {},
        fetchPage: async (url) => {
          if (url.includes("/fighter/ami/")) return { url, html: DETAIL_HTML_AMI, status: 200 };
          return { url, html: LIST_HTML, status: 200 };
        },
      },
      "https://rise-rc.com/fighter",
    );
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      kind: "fighter",
      name: "愛弥",
      nameEn: "Ami",
      gymNameRaw: "NEXT LEVEL 渋谷",
      organization: "RISE",
      discipline: "kickboxing",
      heightCm: 160,
      birthdate: "2001-12-25",
      record: { wins: 4, losses: 1, draws: 0 },
    });
  });
});
