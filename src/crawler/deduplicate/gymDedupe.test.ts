import { describe, expect, it } from "vitest";
import { findBestMatch, type DedupeCandidateGym } from "./gymDedupe";

const existing: DedupeCandidateGym[] = [
  {
    id: "gym-1",
    name: "パラエストラ東京",
    normalizedName: null,
    prefecture: "東京都",
    city: "渋谷区",
    phone: "03-1234-5678",
    websiteUrl: "https://paraestra-tokyo.example",
    googlePlaceId: null,
  },
  {
    id: "gym-2",
    name: "サンライズ拳闘倶楽部",
    normalizedName: null,
    prefecture: "東京都",
    city: "新宿区",
    phone: null,
    websiteUrl: null,
    googlePlaceId: null,
  },
];

describe("findBestMatch", () => {
  it("電話番号一致は strong", () => {
    const result = findBestMatch(
      { name: "パラエストラ東京(移転後)", phone: "０３-１２３４-５６７８".replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)) },
      existing,
    );
    expect(result.strength).toBe("strong");
    expect(result.match?.id).toBe("gym-1");
  });

  it("公式URLのホスト一致は strong", () => {
    const result = findBestMatch(
      { name: "別名義", websiteUrl: "https://www.paraestra-tokyo.example/access" },
      existing,
    );
    expect(result.strength).toBe("strong");
    expect(result.match?.id).toBe("gym-1");
  });

  it("名称+住所一致は medium", () => {
    const result = findBestMatch(
      { name: "パラエストラ東京", prefecture: "東京都", city: "渋谷区" },
      existing,
    );
    expect(result.strength).toBe("medium");
  });

  it("名称類似のみ(表記ゆれレベルの差)は weak", () => {
    // 「倶楽部」→「倶楽舘」の1文字違いのみ。住所等の裏付けがないため medium にはならない。
    const result = findBestMatch({ name: "サンライズ拳闘倶楽舘" }, existing);
    expect(result.strength).toBe("weak");
    expect(result.match?.id).toBe("gym-2");
  });

  it("無関係な名前は none で、自動統合されない", () => {
    const result = findBestMatch({ name: "全く別のジム名称XYZ" }, existing);
    expect(result.strength).toBe("none");
    expect(result.match).toBeNull();
  });
});
