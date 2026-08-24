import { describe, expect, it } from "vitest";
import { jbcParser } from "./jbc";
import type { ParsedGymRecord, ParsedRecord } from "../core/types";

function isGym(record: ParsedRecord): record is ParsedGymRecord {
  return record.kind === "gym";
}

const FIXTURE_HTML = `
<html><body>
<h3 class="wp-block-heading">北日本地区</h3>
<figure class="wp-block-table is-style-regular"><table><thead><tr><th>名称</th><th>住所</th><th>電話番号</th></tr></thead><tbody>
<tr><td>協栄札幌赤坂ジム</td><td>北海道札幌市豊平区西岡四条6-9-22</td><td>011-852-5886</td></tr>
<tr><td>大翔</td><td>新潟県十日町市伊達甲1704-2</td><td>025-758-3300</td></tr>
</tbody></table></figure>
<h3 class="wp-block-heading">東日本地区</h3>
<figure class="wp-block-table"><table><thead><tr><th>名称</th><th>住所</th><th>電話番号</th></tr></thead><tbody>
<tr><td>全日本パブリックジム</td><td>千葉県我孫子市布佐下新田28-2　A号室</td><td></td></tr>
</tbody></table></figure>
</body></html>
`;

describe("jbcParser", () => {
  it("全地区のテーブルからジムレコードを抽出する", async () => {
    const records = await jbcParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/gym/",
    );
    expect(records).toHaveLength(3);
    expect(records[0]).toMatchObject({
      kind: "gym",
      name: "協栄札幌赤坂ジム",
      prefecture: "北海道",
      phone: "011-852-5886",
      disciplines: ["boxing"],
    });
  });

  it("電話番号が空のレコードも欠落なく取り込む", async () => {
    const records = await jbcParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/gym/",
    );
    const pub = records.filter(isGym).find((r) => r.name === "全日本パブリックジム");
    expect(pub?.phone).toBeUndefined();
    expect(pub?.prefecture).toBe("千葉県");
  });
});
