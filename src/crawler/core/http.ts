// サイトごとの rate limit / concurrency / retry(指数バックオフ)を扱う fetch ラッパー。
// 仕様(26)に基づき、HTTP 429 / 503 / timeout では指数バックオフし、
// 一定回数失敗したら例外を投げて呼び出し元(source 単位の runner)に委ねる。
import { CRAWLER_USER_AGENT, isAllowedByRobots } from "./robots";

export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

export class RobotsDisallowedError extends Error {
  constructor(url: string) {
    super(`robots.txt disallows crawling: ${url}`);
    this.name = "RobotsDisallowedError";
  }
}

interface RateLimiterOptions {
  rateLimitMs: number;
  maxConcurrency: number;
  maxRetries?: number;
  timeoutMs?: number;
}

const RETRYABLE_STATUS = new Set([429, 503, 502, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// サイト単位でアクセス間隔・同時接続数を制御するシンプルなキュー。
export class PoliteFetcher {
  private lastRequestAt = 0;
  private inFlight = 0;
  private queue: Array<() => void> = [];

  constructor(private readonly opts: RateLimiterOptions) {}

  private async acquireSlot(): Promise<void> {
    if (this.inFlight < this.opts.maxConcurrency) {
      this.inFlight++;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.inFlight++;
  }

  private releaseSlot(): void {
    this.inFlight--;
    const next = this.queue.shift();
    if (next) next();
  }

  private async waitForRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    const wait = this.opts.rateLimitMs - elapsed;
    if (wait > 0) await sleep(wait);
    this.lastRequestAt = Date.now();
  }

  async fetchText(url: string): Promise<{ html: string; status: number }> {
    const allowed = await isAllowedByRobots(url);
    if (!allowed) throw new RobotsDisallowedError(url);

    await this.acquireSlot();
    try {
      await this.waitForRateLimit();
      return await this.fetchWithRetry(url);
    } finally {
      this.releaseSlot();
    }
  }

  private async fetchWithRetry(url: string): Promise<{ html: string; status: number }> {
    const maxRetries = this.opts.maxRetries ?? 3;
    const timeoutMs = this.opts.timeoutMs ?? 20_000;

    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        // 指数バックオフ: 2s, 4s, 8s...
        await sleep(2_000 * 2 ** (attempt - 1));
      }

      let res: Response;
      try {
        res = await fetch(url, {
          headers: { "User-Agent": CRAWLER_USER_AGENT },
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (err) {
        // ネットワーク例外(timeout/DNS失敗等)はリトライ対象。
        lastError = err;
        if (attempt >= maxRetries) {
          throw lastError instanceof Error ? lastError : new FetchError(String(lastError));
        }
        continue;
      }

      if (RETRYABLE_STATUS.has(res.status)) {
        lastError = new FetchError(`retryable status ${res.status}`, res.status);
        if (attempt >= maxRetries) throw lastError;
        continue;
      }

      if (!res.ok) {
        // 404 等リトライ対象外のエラーは即座に失敗させ、無駄なリトライをしない。
        throw new FetchError(`HTTP ${res.status}`, res.status);
      }

      const html = await res.text();
      return { html, status: res.status };
    }
    throw lastError instanceof Error ? lastError : new FetchError(String(lastError));
  }
}
