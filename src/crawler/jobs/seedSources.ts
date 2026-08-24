// crawler_sources / disciplines を設定ファイル(sources.config.ts)から DB へ同期する。
// 実行のたびに呼び、コード側の追加を DB に反映する(手動での DB 編集も今後は可能)。
import type { PrismaClient } from "../../generated/prisma/client";
import { DISCIPLINE_SEEDS, ORGANIZATION_SEEDS, SOURCE_SEEDS } from "../sources.config";

export async function seedSources(prisma: PrismaClient): Promise<void> {
  for (const d of DISCIPLINE_SEEDS) {
    await prisma.discipline.upsert({
      where: { id: d.id },
      create: { id: d.id, name: d.name, category: d.category },
      update: { name: d.name, category: d.category },
    });
  }

  for (const o of ORGANIZATION_SEEDS) {
    await prisma.organization.upsert({
      where: { id: o.id },
      create: { id: o.id, name: o.name, organizationType: o.organizationType, officialUrl: o.officialUrl },
      update: { name: o.name, organizationType: o.organizationType, officialUrl: o.officialUrl },
    });
  }

  for (const s of SOURCE_SEEDS) {
    const existing = await prisma.crawlerSource.findUnique({
      where: { id: s.id },
      select: { parserName: true },
    });
    // parser が新たに実装された(unimplemented → 実装済み)タイミングでは
    // 設定側の enabled を反映する。それ以外は管理画面からの手動トグルを尊重して触らない。
    const justImplemented = existing?.parserName === "unimplemented" && s.parserName !== "unimplemented";

    await prisma.crawlerSource.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        baseUrl: s.baseUrl,
        entryUrl: s.entryUrl,
        category: s.category,
        disciplineId: s.disciplineId,
        sourceType: s.sourceType,
        isOfficial: s.isOfficial,
        trustScore: s.trustScore,
        enabled: s.enabled,
        rateLimitMs: s.rateLimitMs,
        maxConcurrency: s.maxConcurrency,
        parserName: s.parserName,
      },
      update: {
        name: s.name,
        baseUrl: s.baseUrl,
        entryUrl: s.entryUrl,
        category: s.category,
        disciplineId: s.disciplineId,
        sourceType: s.sourceType,
        isOfficial: s.isOfficial,
        trustScore: s.trustScore,
        parserName: s.parserName,
        ...(justImplemented ? { enabled: s.enabled } : {}),
      },
    });
  }
}
