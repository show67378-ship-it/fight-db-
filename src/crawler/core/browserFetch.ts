// RIZIN等、JavaScriptで内容を描画するサイト向けのヘッドレスブラウザ経由フェッチャー。
// PoliteFetcher(core/http.ts)と同じくrate limit・robots.txt尊重を行うが、
// 実際のページ描画にはPlaywright(Chromium)を使う。1ページの取得コストが高いため、
// 通常のPoliteFetcherとは別クラスとして分離している。
import type { Browser } from "playwright";
import { CRAWLER_USER_AGENT, isAllowedByRobots } from "./robots";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class PoliteBrowserFetcher {
  private lastRequestAt = 0;
  private browserPromise: Promise<Browser> | null = null;

  constructor(private readonly opts: { rateLimitMs: number; timeoutMs?: number }) {}

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      // playwright は重い依存のため、実際に必要になった時だけ動的importする。
      this.browserPromise = import("playwright").then(({ chromium }) => chromium.launch());
    }
    return this.browserPromise;
  }

  async fetchText(url: string): Promise<{ html: string; status: number }> {
    const allowed = await isAllowedByRobots(url);
    if (!allowed) throw new Error(`robots.txt disallows crawling: ${url}`);

    const elapsed = Date.now() - this.lastRequestAt;
    const wait = this.opts.rateLimitMs - elapsed;
    if (wait > 0) await sleep(wait);
    this.lastRequestAt = Date.now();

    const browser = await this.getBrowser();
    const page = await browser.newPage({ userAgent: CRAWLER_USER_AGENT });
    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: this.opts.timeoutMs ?? 30_000,
      });
      const html = await page.content();
      return { html, status: response?.status() ?? 200 };
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browserPromise) {
      const browser = await this.browserPromise;
      await browser.close();
      this.browserPromise = null;
    }
  }
}
