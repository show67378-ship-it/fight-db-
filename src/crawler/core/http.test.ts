import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PoliteFetcher, FetchError } from "./http";

// robots.txt チェックは常に許可させる(このテストの関心事ではないため)。
vi.mock("./robots", () => ({
  CRAWLER_USER_AGENT: "test-agent",
  isAllowedByRobots: async () => true,
}));

describe("PoliteFetcher (fake timers / backoff)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("HTTP 503 を指数バックオフでリトライし、最終的に成功する", async () => {
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount < 3) {
          return { ok: false, status: 503, text: async () => "" };
        }
        return { ok: true, status: 200, text: async () => "<html>ok</html>" };
      }),
    );

    const fetcher = new PoliteFetcher({ rateLimitMs: 0, maxConcurrency: 1, maxRetries: 3 });
    const promise = fetcher.fetchText("https://retry-test.example/page");
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.html).toBe("<html>ok</html>");
    expect(callCount).toBe(3);
  });

  it("リトライ上限を超えたら例外を投げ、呼び出し元は捕捉できる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503, text: async () => "" }),
    );

    const fetcher = new PoliteFetcher({ rateLimitMs: 0, maxConcurrency: 1, maxRetries: 2 });
    const promise = fetcher.fetchText("https://retry-fail-test.example/page");
    const assertion = expect(promise).rejects.toThrow(FetchError);
    await vi.runAllTimersAsync();
    await assertion;
  });
});

describe("PoliteFetcher (real timers)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("404 のような非リトライ対象エラーは即座に失敗する", async () => {
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        callCount++;
        return { ok: false, status: 404, text: async () => "" };
      }),
    );

    const fetcher = new PoliteFetcher({ rateLimitMs: 0, maxConcurrency: 1, maxRetries: 3 });
    await expect(fetcher.fetchText("https://not-found-test.example/page")).rejects.toThrow();
    expect(callCount).toBe(1);
  });
});
