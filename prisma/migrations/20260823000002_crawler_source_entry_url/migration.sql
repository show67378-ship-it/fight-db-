-- AlterTable: CrawlerSource に entryUrl (クロール開始URL) を追加。
-- baseUrl はドメイン、entryUrl は実際に巡回を開始するページ。
ALTER TABLE "CrawlerSource" ADD COLUMN "entryUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CrawlerSource" ALTER COLUMN "entryUrl" DROP DEFAULT;
