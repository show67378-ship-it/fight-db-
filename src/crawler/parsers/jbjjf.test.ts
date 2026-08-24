import { describe, expect, it } from "vitest";
import { jbjjfParser } from "./jbjjf";
import type { ParsedGymRecord, ParsedRecord } from "../core/types";

function isGym(record: ParsedRecord): record is ParsedGymRecord {
  return record.kind === "gym";
}

// 実サイトの構造を模した最小フィクスチャ(実アクセスは行わない仕様37)。
const FIXTURE_HTML = `
<html><body>
<section id="hokkaido">
<h2>北海道</h2>
<ul class="ulType01">
<li>
	<strong>パラエストラ札幌		 （PARAESTRA SAPPORO）
		No. 2652</strong><br />
 	指導者： 俵谷実 <br />
					住所： 北海道札幌市東区北九条東10丁目3-26 パールコート光星10 1F<br />
							TEL： 011-733-5301<br />
							URL：<a href="https://www.facebook.com/paraestrasapporo/" target="_BLANK">https://www.facebook.com/paraestrasapporo/</a>
			</li>
	<li>
	<strong>パラエストラ室蘭		 （PARAESTRA MURORAN）
		No. 3268</strong><br />
 	指導者： 工藤匡敏 <br />
									URL：<a href="https://www.facebook.com/paramurobjj/" target="_BLANK">https://www.facebook.com/paramurobjj/</a>
			</li>
</ul>
</section>
</body></html>
`;

// JBJJFは「関東」等の広域地方見出しを使うため、都道府県は住所から再抽出する必要がある。
const REGION_FIXTURE_HTML = `
<html><body>
<section id="kanto">
<h2>関東</h2>
<ul class="ulType01">
<li>
	<strong>パラエストラ東京		 （PARAESTRA TOKYO）
		No. 1</strong><br />
 	指導者： 山田太郎 <br />
					住所： 東京都練馬区豊玉北1-6-13<br />
							TEL： 03-0000-0000<br />
			</li>
</ul>
</section>
</body></html>
`;

describe("jbjjfParser", () => {
  it("「関東」等の広域地方見出しではなく、住所から都道府県を判定する", async () => {
    const records = await jbjjfParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: REGION_FIXTURE_HTML, status: 200 }) },
      "https://www.jbjjf.com/academylist_latest/",
    );
    expect(records.filter(isGym)[0]).toMatchObject({
      name: "パラエストラ東京",
      prefecture: "東京都",
      city: "練馬区",
    });
  });

  it("section 内の li をジムレコードへ変換する", async () => {
    const records = await jbjjfParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://www.jbjjf.com/academylist_latest/",
    );

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      kind: "gym",
      name: "パラエストラ札幌",
      nameEn: "PARAESTRA SAPPORO",
      representative: "俵谷実",
      prefecture: "北海道",
      phone: "011-733-5301",
      disciplines: ["bjj"],
    });
    const gymRecords = records.filter(isGym);
    expect(gymRecords[0].address).toContain("札幌市東区");
    expect(gymRecords[0].websiteUrl).toBe("https://www.facebook.com/paraestrasapporo/");
  });

  it("住所/電話がない行でも欠落せず解析する", async () => {
    const records = await jbjjfParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://www.jbjjf.com/academylist_latest/",
    );
    const muroran = records.filter(isGym).find((r) => r.name === "パラエストラ室蘭");
    expect(muroran).toBeDefined();
    expect(muroran?.address).toBeUndefined();
    expect(muroran?.phone).toBeUndefined();
    // 住所が無い場合、地方見出し(北海道)を都道府県として誤用しない(住所からしか判定しない)。
    expect(muroran?.prefecture).toBeUndefined();
  });
});
