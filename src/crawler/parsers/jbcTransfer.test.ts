import { describe, expect, it } from "vitest";
import { jbcTransferParser } from "./jbcTransfer";

const FIXTURE_HTML = `
<html><body>
<table><thead><tr><th>リングネーム</th><th>日付</th><th>所属元</th><th></th><th>所属先</th></tr></thead>
<tbody>
<tr><td>外村 大貴</td><td>2026年3月7日より</td><td>ワタナベジム</td><td>→</td><td>EBISU K's BOX</td></tr>
<tr><td>守隨 あゆみ</td><td>2026年3月9日より</td><td>TEAM 10COUNTジム</td><td>→</td><td>Dangan品川ボクシングフィットネス</td></tr>
</tbody></table>
</body></html>
`;

describe("jbcTransferParser", () => {
  it("移籍先を現在の所属ジムとして抽出する", async () => {
    const records = await jbcTransferParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/transfer/",
    );
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      kind: "fighter",
      name: "外村 大貴",
      gymNameRaw: "EBISU K's BOX",
      organization: "JBC",
      discipline: "boxing",
    });
  });
});
