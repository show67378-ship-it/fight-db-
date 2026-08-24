import { describe, expect, it } from "vitest";
import { jbcRegisterParser } from "./jbcRegister";

const FIXTURE_HTML = `
<html><body>
<table><thead><tr><th>ジム</th><th>変更日付</th><th>変更前</th><th></th><th>変更後</th></tr></thead>
<tbody>
<tr><td>IBA</td><td>2026年2月12日より</td><td>新ジム開設</td><td>→</td><td>広島県広島市中区榎町11-23-2F</td></tr>
<tr><td>徳山ボクシングジム</td><td>2025年11月12日より</td><td>住所変更</td><td>→</td><td>大阪府東大阪市長栄寺2-12 ツナガルビル2F</td></tr>
</tbody></table>
</body></html>
`;

describe("jbcRegisterParser", () => {
  it("新ジム開設の行だけを新規ジム候補として抽出する", async () => {
    const records = await jbcRegisterParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/register/",
    );
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      kind: "gym",
      name: "IBA",
      prefecture: "広島県",
      disciplines: ["boxing"],
    });
  });

  it("住所変更等、新規開設以外の行は取り込まない", async () => {
    const records = await jbcRegisterParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/register/",
    );
    expect(records.some((r) => r.name === "徳山ボクシングジム")).toBe(false);
  });
});
