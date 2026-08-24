import { afterEach, describe, expect, it, vi } from "vitest";
import { isAllowedByRobots } from "./robots";

describe("isAllowedByRobots", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("Disallow に一致するパスは拒否する", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => "User-agent: *\nDisallow: /wp-admin/\n",
      }),
    );
    const allowed = await isAllowedByRobots("https://robots-test-1.example/wp-admin/edit.php");
    expect(allowed).toBe(false);
  });

  it("Disallow に一致しないパスは許可する", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => "User-agent: *\nDisallow: /wp-admin/\n",
      }),
    );
    const allowed = await isAllowedByRobots("https://robots-test-2.example/academylist_latest/");
    expect(allowed).toBe(true);
  });

  it("robots.txt が取得できない場合は安全側に倒して許可する", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    const allowed = await isAllowedByRobots("https://robots-test-3.example/anything");
    expect(allowed).toBe(true);
  });
});
