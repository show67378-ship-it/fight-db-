import { describe, expect, it } from "vitest";
import { normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("ハイフン等を除去して数字だけにする", () => {
    expect(normalizePhone("011-733-5301")).toBe("0117335301");
  });

  it("同じ番号は表記が違っても同じ正規化結果になる", () => {
    expect(normalizePhone("03-1234-5678")).toBe(normalizePhone("０３−１２３４−５６７８".replace(/[０-９－]/g, (c) => (c === "－" ? "-" : String.fromCharCode(c.charCodeAt(0) - 0xfee0)))));
  });

  it("桁数が不足する場合は undefined", () => {
    expect(normalizePhone("12-34")).toBeUndefined();
  });

  it("未指定は undefined", () => {
    expect(normalizePhone(undefined)).toBeUndefined();
    expect(normalizePhone(null)).toBeUndefined();
  });
});
