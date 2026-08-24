// 全国DBフルクロールの親処理(仕様6)。
// crawl_run作成 → 有効な crawler_sources 取得 → source毎に順次クロール →
// Raw保存 → 正規化 → 重複判定 → DB保存 → source完了 → 集計、という流れを実装する。
// 1つの source で例外が発生しても、他の source の処理は継続する(仕様: 一部失敗で全体停止しない)。
import type { PrismaClient } from "../../generated/prisma/client";
import type { CrawlType, ParsedRecord } from "../core/types";
import { PoliteFetcher, RobotsDisallowedError } from "../core/http";
import { PoliteBrowserFetcher } from "../core/browserFetch";
import { canonicalizeUrl } from "../core/canonicalUrl";
import { contentHash } from "../core/contentHash";
import { sourceLogger } from "../core/logger";
import { getParser } from "../sources/registry";
import { seedSources } from "./seedSources";
import { applyGymRecord } from "./applyGymRecord";
import { applyFighterRecord } from "./applyFighterRecord";
import { applyEventRecord } from "./applyEventRecord";

export interface CrawlAllOptions {
  prisma: PrismaClient;
  crawlType: CrawlType;
  dryRun: boolean;
  sourceIds?: string[]; // source_only / retry_failed で対象を絞る場合に指定
  triggeredBy?: string;
}

export interface CrawlAllResult {
  crawlRunId: string;
}

export async function crawlAll({
  prisma,
  crawlType,
  dryRun,
  sourceIds,
  triggeredBy,
}: CrawlAllOptions): Promise<CrawlAllResult> {
  await seedSources(prisma);

  const allEnabled = await prisma.crawlerSource.findMany({
    where: { enabled: true, parserName: { not: "unimplemented" } },
  });
  const targets = sourceIds
    ? allEnabled.filter((s) => sourceIds.includes(s.id))
    : allEnabled;

  const crawlRun = await prisma.crawlRun.create({
    data: {
      id: `run-${Date.now()}`,
      crawlType,
      dryRun,
      triggeredBy,
      totalSources: targets.length,
      status: "running",
    },
  });

  const totals = {
    pagesFetched: 0,
    gymsFound: 0,
    gymsCreated: 0,
    gymsUpdated: 0,
    fightersFound: 0,
    eventsFound: 0,
    duplicateCandidates: 0,
    completedSources: 0,
    failedSources: 0,
    errorsCount: 0,
  };

  for (const source of targets) {
    const log = sourceLogger(source.name);
    const sourceRun = await prisma.crawlSourceRun.create({
      data: {
        id: `sr-${crawlRun.id}-${source.id}`,
        crawlRunId: crawlRun.id,
        sourceId: source.id,
        status: "running",
        startedAt: new Date(),
      },
    });

    const stats = { pagesFetched: 0, recordsFound: 0, created: 0, updated: 0, skipped: 0, errors: 0 };
    let browserFetcher: PoliteBrowserFetcher | null = null;

    // fetchPage/fetchRenderedPage 共通の後処理(URL/Raw保存・ページ数カウント)。
    const persistFetch = async (url: string, html: string, status: number) => {
      const canonical = canonicalizeUrl(url);
      stats.pagesFetched++;
      if (!dryRun) {
        await prisma.crawlUrl
          .upsert({
            where: { crawlRunId_canonicalUrl: { crawlRunId: crawlRun.id, canonicalUrl: canonical } },
            create: {
              id: `cu-${crawlRun.id}-${contentHash(canonical).slice(0, 16)}`,
              crawlRunId: crawlRun.id,
              sourceId: source.id,
              url,
              canonicalUrl: canonical,
              status: "completed",
              crawledAt: new Date(),
            },
            update: { status: "completed", crawledAt: new Date() },
          })
          .catch(() => undefined);

        await prisma.crawlRawRecord.create({
          data: {
            id: `raw-${crawlRun.id}-${contentHash(canonical).slice(0, 16)}`,
            crawlRunId: crawlRun.id,
            sourceId: source.id,
            sourceUrl: url,
            rawPayload: html,
            contentHash: contentHash(html),
          },
        });
      }
      return { url, html, status };
    };

    try {
      const parser = getParser(source.parserName);
      if (!parser) throw new Error(`parser not found: ${source.parserName}`);

      const fetcher = new PoliteFetcher({
        rateLimitMs: source.rateLimitMs,
        maxConcurrency: source.maxConcurrency,
      });

      const records: ParsedRecord[] = await parser.run(
        {
          log,
          fetchPage: async (url: string) => {
            const { html, status } = await fetcher.fetchText(url);
            return persistFetch(url, html, status);
          },
          fetchRenderedPage: async (url: string) => {
            if (!browserFetcher) {
              browserFetcher = new PoliteBrowserFetcher({ rateLimitMs: source.rateLimitMs });
            }
            const { html, status } = await browserFetcher.fetchText(url);
            return persistFetch(url, html, status);
          },
        },
        source.entryUrl,
      );

      stats.recordsFound = records.length;

      for (const record of records) {
        // 1レコードの処理失敗(id衝突等)で同じsourceの残りが全滅しないよう、
        // レコード単位でも例外を握りつぶして次へ進む。
        try {
          if (record.kind === "gym") {
            totals.gymsFound++;
            const outcome = await applyGymRecord({
              prisma,
              record,
              sourceId: source.id,
              trustScore: source.trustScore,
              dryRun,
            });
            if (outcome === "created") {
              stats.created++;
              totals.gymsCreated++;
            } else if (outcome === "updated") {
              stats.updated++;
              totals.gymsUpdated++;
            } else if (outcome === "duplicate_flagged") {
              stats.created++;
              totals.gymsCreated++;
              totals.duplicateCandidates++;
            } else {
              stats.skipped++;
            }
          } else if (record.kind === "fighter") {
            totals.fightersFound++;
            const { outcome } = await applyFighterRecord({
              prisma,
              record,
              sourceId: source.id,
              trustScore: source.trustScore,
              dryRun,
            });
            if (outcome === "created") stats.created++;
            else if (outcome === "updated") stats.updated++;
            else stats.skipped++;
          } else if (record.kind === "event") {
            totals.eventsFound++;
            const outcome = await applyEventRecord({ prisma, record, dryRun });
            if (outcome === "created") stats.created++;
            else if (outcome === "updated") stats.updated++;
            else stats.skipped++;
          }
        } catch (recordErr) {
          stats.errors++;
          log("record apply failed", {
            STATUS: "RECORD_FAILED",
            NAME: record.name,
            ERROR: recordErr instanceof Error ? recordErr.message : String(recordErr),
          });
        }
      }

      await prisma.crawlSourceRun.update({
        where: { id: sourceRun.id },
        data: {
          status: "completed",
          finishedAt: new Date(),
          pagesFetched: stats.pagesFetched,
          recordsFound: stats.recordsFound,
          createdCount: stats.created,
          updatedCount: stats.updated,
          skippedCount: stats.skipped,
          errorCount: stats.errors,
        },
      });
      await prisma.crawlerSource.update({
        where: { id: source.id },
        data: { lastCrawledAt: new Date(), lastSuccessAt: new Date(), status: "idle" },
      });

      totals.completedSources++;
      totals.pagesFetched += stats.pagesFetched;
      totals.errorsCount += stats.errors;
      log("crawl source completed", {
        STATUS: "SUCCESS",
        PAGES: stats.pagesFetched,
        FOUND: stats.recordsFound,
        CREATED: stats.created,
        UPDATED: stats.updated,
        RECORD_ERRORS: stats.errors,
      });
    } catch (err) {
      const message =
        err instanceof RobotsDisallowedError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err);

      await prisma.crawlSourceRun.update({
        where: { id: sourceRun.id },
        data: {
          status: "failed",
          finishedAt: new Date(),
          pagesFetched: stats.pagesFetched,
          errorCount: 1,
          errorMessage: message,
        },
      });
      await prisma.crawlerSource.update({
        where: { id: source.id },
        data: { lastErrorAt: new Date(), status: "failed" },
      });

      totals.failedSources++;
      totals.errorsCount++;
      totals.pagesFetched += stats.pagesFetched;
      log("crawl source failed", { STATUS: "FAILED", ERROR: message });
      // 仕様: 一部 source が失敗しても全体を止めず、次の source へ進む。
    } finally {
      if (browserFetcher) await (browserFetcher as PoliteBrowserFetcher).close().catch(() => undefined);
    }
  }

  await prisma.crawlRun.update({
    where: { id: crawlRun.id },
    data: {
      status: "completed",
      finishedAt: new Date(),
      completedSources: totals.completedSources,
      failedSources: totals.failedSources,
      pagesFetched: totals.pagesFetched,
      gymsFound: totals.gymsFound,
      gymsCreated: totals.gymsCreated,
      gymsUpdated: totals.gymsUpdated,
      fightersFound: totals.fightersFound,
      eventsFound: totals.eventsFound,
      duplicateCandidates: totals.duplicateCandidates,
      errorsCount: totals.errorsCount,
    },
  });

  return { crawlRunId: crawlRun.id };
}
