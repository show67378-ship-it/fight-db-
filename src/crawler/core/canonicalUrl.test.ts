import { describe, expect, it } from "vitest";
import { canonicalizeUrl } from "./canonicalUrl";

describe("canonicalizeUrl", () => {
  it("utm パラメータを除去する", () => {
    expect(canonicalizeUrl("https://example.com/gym?utm_source=x&id=1")).toBe(
      "https://example.com/gym?id=1",
    );
  });

  it("末尾スラッシュを正規化する", () => {
    expect(canonicalizeUrl("https://example.com/gym/")).toBe("https://example.com/gym");
  });

  it("ハッシュを除去する", () => {
    expect(canonicalizeUrl("https://example.com/gym#section")).toBe("https://example.com/gym");
  });

  it("同じ意味の URL は同じ canonical URL になる", () => {
    const a = canonicalizeUrl("https://Example.com/gym/?utm_campaign=abc&id=5");
    const b = canonicalizeUrl("https://example.com/gym?id=5");
    expect(a).toBe(b);
  });
});
