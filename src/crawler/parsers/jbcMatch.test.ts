import { describe, expect, it } from "vitest";
import { jbcMatchParser } from "./jbcMatch";
import type { ParsedEventRecord, ParsedRecord } from "../core/types";

function isEvent(record: ParsedRecord): record is ParsedEventRecord {
  return record.kind === "event";
}

const FIXTURE_HTML = `
<html><body>
<div id="post-1"><h5 class="vk_post_title card-title"><a href="https://jbc.or.jp/2026-08-21-korakuen/">2026年08月21日 後楽園ホール</a></h5></div>
<div id="post-2"><h5 class="vk_post_title card-title"><a href="https://jbc.or.jp/2026-08-22-kobe/">2026年08月22日 神戸市立中央体育館</a></h5></div>
<div id="post-3"><h5 class="vk_post_title card-title"><a href="https://jbc.or.jp/other/">未定</a></h5></div>
</body></html>
`;

describe("jbcMatchParser", () => {
  it("日付+会場のタイトルを大会レコードへ変換する", async () => {
    const records = await jbcMatchParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/match/",
    );
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      kind: "event",
      name: "後楽園ホール",
      venue: "後楽園ホール",
      organizationId: "jbc",
    });
    expect(records.filter(isEvent)[0].eventDate?.toISOString().slice(0, 10)).toBe("2026-08-21");
  });

  it("想定外のタイトル形式は取り込まない(hallucination防止)", async () => {
    const records = await jbcMatchParser.run(
      { log: () => {}, fetchPage: async (url) => ({ url, html: FIXTURE_HTML, status: 200 }) },
      "https://jbc.or.jp/match/",
    );
    expect(records.some((r) => r.name === "未定")).toBe(false);
  });
});
