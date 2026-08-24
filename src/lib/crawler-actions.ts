"use server";

// 管理画面からのクロール操作。
// 仕様31: ブラウザリクエストへクロール処理を直接ぶら下げず、バックグラウンドで実行する。
// Next.js のサーバーアクションはリクエスト応答に紐づくため、ここでは
// detached な子プロセスとして scripts/crawl.mts を起動し、応答はすぐに返す。
// 進捗はプロセスの生死ではなく DB(CrawlRun/CrawlSourceRun)をポーリングして確認する設計。
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

const PROJECT_ROOT = path.join(process.cwd());
const LOG_DIR = path.join(PROJECT_ROOT, ".crawl-logs");

export async function startCrawl(formData: FormData): Promise<void> {
  const dryRun = formData.get("dryRun") === "on";
  const sourceIdsRaw = formData.get("sourceIds");
  const sourceIds =
    typeof sourceIdsRaw === "string" && sourceIdsRaw.trim().length > 0
      ? sourceIdsRaw.trim()
      : undefined;

  const args = ["tsx", "scripts/crawl.mts"];
  if (dryRun) args.push("--dry-run");
  if (sourceIds) args.push(`--source=${sourceIds}`);

  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  const logFile = path.join(LOG_DIR, `crawl-${Date.now()}.log`);
  const out = fs.openSync(logFile, "a");
  const err = fs.openSync(logFile, "a");

  const child = spawn("npx", args, {
    cwd: PROJECT_ROOT,
    env: process.env,
    detached: true,
    stdio: ["ignore", out, err],
    shell: process.platform === "win32",
  });
  child.unref();

  revalidatePath("/admin/crawl");
}

export async function resolveDuplicateCandidate(
  id: string,
  status: "confirmed_duplicate" | "rejected",
): Promise<void> {
  await prisma.duplicateCandidate.update({
    where: { id },
    data: { status, resolvedAt: new Date(), resolvedBy: "admin" },
  });
  revalidatePath("/admin/crawl");
}
