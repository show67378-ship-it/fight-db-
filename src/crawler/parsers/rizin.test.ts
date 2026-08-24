import { describe, expect, it } from "vitest";
import { rizinMmaParser, rizinKickParser } from "./rizin";

// ヘッドレスブラウザでレンダリング後に得られる実サイトの構造を模したフィクスチャ(仕様37: 実アクセスなし)。
const FIXTURE_HTML = `
<html><body>
<div id="member-list">
  <div class="word"><h4 id="fighters-a">あ</h4></div>
  <div class="person">
    <a href="https://jp.rizinff.com/_tags/%E6%9C%9D%E5%80%89%E6%9C%AA%E6%9D%A5">
      <img src="x.jpg" alt="朝倉未来">
      <h4>朝倉未来<br>Mikuru Asakura</h4>
    </a>
  </div>
  <div class="person">
    <a href="https://jp.rizinff.com/_tags/%E3%81%82%E3%81%84">
      <img src="y.jpg" alt="あい">
      <h4>あい<br>Ai</h4>
    </a>
  </div>
</div>
</body></html>
`;

describe("rizinMmaParser", () => {
  it("fetchRenderedPage 経由で選手名を取得し discipline=mma を付与する", async () => {
    const records = await rizinMmaParser.run(
      {
        log: () => {},
        fetchPage: async (url) => ({ url, html: "", status: 200 }),
        fetchRenderedPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }),
      },
      "https://jp.rizinff.com/fighters/mma",
    );
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      kind: "fighter",
      name: "朝倉未来",
      nameEn: "Mikuru Asakura",
      organization: "RIZIN",
      discipline: "mma",
    });
  });

  it("fetchRenderedPage が無い場合はエラーになる(通常fetchでは取得できないため)", async () => {
    await expect(
      rizinMmaParser.run(
        { log: () => {}, fetchPage: async (url) => ({ url, html: "", status: 200 }) },
        "https://jp.rizinff.com/fighters/mma",
      ),
    ).rejects.toThrow();
  });
});

describe("rizinKickParser", () => {
  it("discipline=kickboxing を付与する", async () => {
    const records = await rizinKickParser.run(
      {
        log: () => {},
        fetchPage: async (url) => ({ url, html: "", status: 200 }),
        fetchRenderedPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }),
      },
      "https://jp.rizinff.com/fighters/kick",
    );
    expect(records[0]).toMatchObject({ discipline: "kickboxing" });
  });
});
