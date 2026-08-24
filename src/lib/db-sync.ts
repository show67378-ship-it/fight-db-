"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const MIGRATION_NAME = "20260823000000_add_verified_and_edit_requests";

// 本番DBがコードの前提(schema.prisma)より古いまま止まっている場合に、
// 不足している列・テーブルを追加して追いつかせるための復旧アクション。
// すべて IF NOT EXISTS 付きなので、何度実行しても安全(既にあれば何もしない)。
export async function syncDatabaseSchema() {
  const statements = [
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "nameKana" TEXT`,
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "primarySport" TEXT`,
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "priorityRank" INTEGER`,
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER`,
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "prestigeScore" DOUBLE PRECISION`,
    `ALTER TABLE "Gym" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "Athlete" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER`,
    `ALTER TABLE "Athlete" ADD COLUMN IF NOT EXISTS "primaryOrganization" TEXT`,
    `ALTER TABLE "Athlete" ADD COLUMN IF NOT EXISTS "prominenceScore" DOUBLE PRECISION`,
    `ALTER TABLE "Athlete" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false`,
    `CREATE TABLE IF NOT EXISTS "EditRequest" (
      "id" TEXT NOT NULL,
      "targetType" TEXT NOT NULL,
      "targetId" TEXT NOT NULL,
      "targetName" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "contactName" TEXT,
      "contactEmail" TEXT,
      "status" TEXT NOT NULL DEFAULT 'new',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "EditRequest_pkey" PRIMARY KEY ("id")
    )`,
  ];

  try {
    for (const sql of statements) {
      await prisma.$executeRawUnsafe(sql);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    redirect(`/admin/db-sync?error=1&msg=${encodeURIComponent(message)}`);
  }

  // 正式なマイグレーション履歴にも記録しておく(将来 prisma migrate deploy を
  // 実行したときに、この内容を二重適用しようとして失敗しないようにするため)。
  // 失敗しても致命的ではないので握りつぶす。
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, finished_at, applied_steps_count)
       VALUES ($1, $2, $3, now(), now(), 1)
       ON CONFLICT (id) DO NOTHING`,
      randomUUID(),
      "manual-runtime-fix",
      MIGRATION_NAME
    );
  } catch {
    // _prisma_migrations が無い等、記録できなくても本体の修復は完了しているので無視する
  }

  redirect("/admin/db-sync?done=1");
}
