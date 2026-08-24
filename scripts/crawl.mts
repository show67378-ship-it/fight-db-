// 全国DBフルクロール CLI(仕様 39, 41: まず手動フルクロールを完成させる)。
// 使い方:
//   npx tsx scripts/crawl.mts                     # 有効な全 source を FULL クロール
//   npx tsx scripts/crawl.mts --dry-run            # DB へ書き込まず取得/解析/重複判定のみ確認
//   npx tsx scripts/crawl.mts --source=jbjjf-academy,jbc-gym  # 指定 source のみ(SOURCE_ONLY)
//   npx tsx scripts/crawl.mts --retry-failed        # 直近の run で失敗した source のみ再試行
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { crawlAll } from "../src/crawler/jobs/crawlAll";
import type { CrawlType } from "../src/crawler/core/types";

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const retryFailed = argv.includes("--retry-failed");
  const sourceArg = argv.find((a) => a.startsWith("--source="));
  const sourceIds = sourceArg ? sourceArg.slice("--source=".length).split(",") : undefined;
  return { dryRun, retryFailed, sourceIds };
}

async function main() {
  const { dryRun, retryFailed, sourceIds } = parseArgs(process.argv.slice(2));
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  let targetSourceIds = sourceIds;
  let crawlType: CrawlType = sourceIds ? "source_only" : "full";

  if (retryFailed) {
    const lastRun = await prisma.crawlRun.findFirst({ orderBy: { startedAt: "desc" } });
    if (!lastRun) {
      console.log("直近の crawl_run が見つかりません。先に通常のクロールを実行してください。");
      await prisma.$disconnect();
      return;
    }
    const failed = await prisma.crawlSourceRun.findMany({
      where: { crawlRunId: lastRun.id, status: "failed" },
      select: { sourceId: true },
    });
    targetSourceIds = failed.map((f) => f.sourceId);
    crawlType = "retry_failed";
    if (targetSourceIds.length === 0) {
      console.log("直近の run に失敗した source はありませんでした。");
      await prisma.$disconnect();
      return;
    }
  }

  console.log(
    `crawl start: type=${crawlType} dryRun=${dryRun} sources=${targetSourceIds?.join(",") ?? "(all enabled)"}`,
  );

  const { crawlRunId } = await crawlAll({
    prisma,
    crawlType,
    dryRun,
    sourceIds: targetSourceIds,
    triggeredBy: "cli",
  });

  const result = await prisma.crawlRun.findUnique({ where: { id: crawlRunId } });
  console.log("=== crawl_run 結果 ===");
  console.log(JSON.stringify(result, null, 2));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
