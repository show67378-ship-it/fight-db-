import { describe, expect, it } from "vitest";
import { deepParser } from "./deep";

const LIST_HTML = `
<html><body>
<h3>ア行</h3>
<ul class="fighterList">
  <li><a href="https://www.sherdog.com/fighter/Takeshi-Aota-382237" target="blank">青田剛</a></li>
  <li><a href="" target="blank">阿出川凌真</a></li>
</ul>
<h3>カ行</h3>
<ul class="fighterList">
  <li><a href="https://www.tapology.com/fightcenter/fighters/452047-kazuki" target="blank">一輝 </a></li>
  <li><a href="https://www.sherdog.com/fighter/Takeshi-Aota-382237" target="blank">青田剛</a></li>
</ul>
</body></html>
`;

describe("deepParser", () => {
  it("ul.fighterList から選手名と外部プロフィールURLを取得し organization=DEEP を付与する", async () => {
    const records = await deepParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: LIST_HTML, status: 200 }) },
      "https://www.deep2001.com/fighters/",
    );
    expect(records).toHaveLength(3);
    expect(records[0]).toMatchObject({
      kind: "fighter",
      name: "青田剛",
      organization: "DEEP",
      discipline: "mma",
      sourceUrl: "https://www.sherdog.com/fighter/Takeshi-Aota-382237",
    });
  });

  it("href が空の選手は entryUrl を sourceUrl として使う", async () => {
    const records = await deepParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: LIST_HTML, status: 200 }) },
      "https://www.deep2001.com/fighters/",
    );
    const noHref = records.find((r) => r.name === "阿出川凌真");
    expect(noHref?.sourceUrl).toBe("https://www.deep2001.com/fighters/");
  });

  it("同名選手は重複排除する", async () => {
    const records = await deepParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: LIST_HTML, status: 200 }) },
      "https://www.deep2001.com/fighters/",
    );
    expect(records.filter((r) => r.name === "青田剛")).toHaveLength(1);
  });
});
