import { describe, expect, it } from "vitest";
import { shootoParser } from "./shooto";
import type { ParsedFighterRecord, ParsedRecord } from "../core/types";

function isFighter(record: ParsedRecord): record is ParsedFighterRecord {
  return record.kind === "fighter";
}

const LIST_HTML = `
<html><body>
<table class="table table-bg fighter-table">
<tr><th>名前</th><th>Name</th><th>所属</th><th>最新戦積</th><th>階級</th></tr>
<tr><td><a href="./?id=1634">岡見  勇信</a></td><td>YUSHIN OKAMI</td><td>EXFIGHT</td><td>2024-11-30</td><td>ミドル級 [ -83.9 Kg ]</td></tr>
<tr><td><a href="./?id=9">ジェイソン ブリッツ チルダーズ</a></td><td>Jason Childers</td><td>BULLPEN MUAYTHAI</td><td></td><td>フェザー級 [ -65.8 Kg ]</td></tr>
</table>
</body></html>
`;

const DETAIL_HTML_1634 = `
<html><body>
<div class="pf-fighter-country">国籍 : <span><a href="#">日本</a><span></div>
<div class="pf-fighter-birth">生年月日 : <span>1981 / 7 / 21</span></div>
<div class="pf-fighter-height">身長 : <span>188 cm</span></div>
<table class="table result-list">
<tr><td>2024-11-30</td><td style="text-align:center;">○</td><td>キム ジェヨン</td></tr>
<tr><td>2023-12-02</td><td style="text-align:center;">○</td><td>キム ジェヨン</td></tr>
<tr><td>2020-01-01</td><td style="text-align:center;">●</td><td>誰か</td></tr>
</table>
</body></html>
`;

describe("shootoParser", () => {
  it("選手一覧+詳細ページから戦績・国籍・生年月日・身長を取得する", async () => {
    const records = await shootoParser.run(
      {
        log: () => {},
        fetchPage: async (url) => {
          if (url.includes("id=1634")) return { url, html: DETAIL_HTML_1634, status: 200 };
          if (url.includes("id=9")) return { url, html: "<html><body></body></html>", status: 200 };
          return { url, html: LIST_HTML, status: 200 };
        },
      },
      "https://www.shooto-mma.com/fighters/",
    );
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      kind: "fighter",
      name: "岡見 勇信",
      nameEn: "YUSHIN OKAMI",
      gymNameRaw: "EXFIGHT",
      organization: "修斗",
      nationality: "日本",
      birthdate: "1981-07-21",
      heightCm: 188,
      record: { wins: 2, losses: 1, draws: 0 },
    });
  });

  it("詳細ページに情報がない選手は record 等が未設定のままになる(推測しない)", async () => {
    const records = await shootoParser.run(
      {
        log: () => {},
        fetchPage: async (url) => {
          if (url.includes("id=9")) return { url, html: "<html><body></body></html>", status: 200 };
          if (url.includes("id=1634")) return { url, html: DETAIL_HTML_1634, status: 200 };
          return { url, html: LIST_HTML, status: 200 };
        },
      },
      "https://www.shooto-mma.com/fighters/",
    );
    const jason = records.filter(isFighter).find((r) => r.name.includes("ジェイソン"));
    expect(jason?.record).toBeUndefined();
    expect(jason?.nationality).toBeUndefined();
  });

  it("ヘッダー行はレコードとして数えない", async () => {
    const records = await shootoParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: LIST_HTML, status: 200 }) },
      "https://www.shooto-mma.com/fighters/",
    );
    expect(records.some((r) => r.name === "名前")).toBe(false);
  });
});
