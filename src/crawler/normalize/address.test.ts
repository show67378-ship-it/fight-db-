import { describe, expect, it } from "vitest";
import { extractPrefecture, extractCity } from "./address";

describe("extractPrefecture", () => {
  it("先頭の都道府県を抽出する", () => {
    expect(extractPrefecture("東京都渋谷区代々木1-1-1")).toBe("東京都");
    expect(extractPrefecture("北海道札幌市東区北九条東10丁目3-26")).toBe("北海道");
  });

  it("都道府県が含まれない場合は undefined", () => {
    expect(extractPrefecture("渋谷区代々木1-1-1")).toBeUndefined();
  });

  it("空/未指定は undefined", () => {
    expect(extractPrefecture(undefined)).toBeUndefined();
    expect(extractPrefecture("")).toBeUndefined();
  });
});

describe("extractCity", () => {
  it("市区町村を抽出する", () => {
    expect(extractCity("東京都渋谷区代々木1-1-1")).toBe("渋谷区");
    expect(extractCity("大阪府大阪市西成区山王3-7-3")).toBe("大阪市西成区");
  });

  it("郡+町村の複合表記を1つの市区町村として扱う", () => {
    expect(extractCity("北海道河東郡音更町宝来東町南1-11-1")).toBe("河東郡音更町");
  });
});
