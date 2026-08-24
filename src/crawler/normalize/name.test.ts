import { describe, expect, it } from "vitest";
import { normalizeGymName, nameSimilarity } from "./name";

describe("normalizeGymName", () => {
  it("同じジムの表記ゆれを同一の正規化名にする", () => {
    const a = normalizeGymName("JAPAN TOP TEAM GYM");
    const b = normalizeGymName("Japan Top Team");
    expect(a).toBe(b);
  });

  it("法人表記を除去する", () => {
    expect(normalizeGymName("株式会社パラエストラ東京")).toBe(normalizeGymName("パラエストラ東京"));
  });

  it("全角英数字を半角化して比較できる", () => {
    expect(normalizeGymName("ＡＢＣ　ＧＹＭ")).toBe(normalizeGymName("ABC GYM"));
  });

  it("ブランド名そのものは壊さない(空文字にならない)", () => {
    expect(normalizeGymName("道場")).not.toBe("");
  });
});

describe("nameSimilarity", () => {
  it("完全一致は1", () => {
    expect(nameSimilarity("ABC", "ABC")).toBe(1);
  });

  it("大きく異なる文字列は低いスコア", () => {
    expect(nameSimilarity("パラエストラ札幌", "帝拳ジム")).toBeLessThan(0.4);
  });

  it("わずかな表記差は高いスコア", () => {
    expect(nameSimilarity("パラエストラ東京", "パラエストラ東京本部")).toBeGreaterThan(0.7);
  });
});
