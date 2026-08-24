// 1件の ParsedGymRecord を正規化 → 重複判定 → DB 反映(dry-run 時はSELECTのみ)する。
// 既存の手入力データ(1,360件)を壊さないよう、自動更新は「既存フィールドが空のときだけ埋める」
// 方針に限定する(強い一致であっても、人手で入力済みの値を自動上書きしない)。
import type { PrismaClient } from "../../generated/prisma/client";
import type { ParsedGymRecord } from "../core/types";
import { slugifyForId } from "../core/slug";
import { normalizeGymName } from "../normalize/name";
import { extractCity } from "../normalize/address";
import { findBestMatch, type DedupeCandidateGym } from "../deduplicate/gymDedupe";

export interface ApplyGymOptions {
  prisma: PrismaClient;
  record: ParsedGymRecord;
  sourceId: string;
  trustScore: number;
  dryRun: boolean;
}

export type ApplyGymOutcome = "created" | "updated" | "skipped" | "duplicate_flagged";

const DEFAULT_TRIAL_INFO = "体験・見学については直接お問い合わせください";

export async function applyGymRecord({
  prisma,
  record,
  sourceId,
  trustScore,
  dryRun,
}: ApplyGymOptions): Promise<ApplyGymOutcome> {
  if (!record.prefecture) {
    // 都道府県が特定できないレコードは、住所付きの正しいデータを優先する方針(仕様44)により
    // 新規ジムとしては作成しない(既存ジムとの強い一致更新のみ許可)。
  }

  const candidatesRaw = await prisma.gym.findMany({
    where: record.prefecture ? { prefecture: record.prefecture } : undefined,
    select: {
      id: true,
      name: true,
      normalizedName: true,
      prefecture: true,
      city: true,
      phone: true,
      websiteUrl: true,
      googlePlaceId: true,
    },
    take: 5000,
  });
  const candidates: DedupeCandidateGym[] = candidatesRaw;

  const { match, strength, reasons } = findBestMatch(
    {
      name: record.name,
      prefecture: record.prefecture,
      city: record.city ?? extractCity(record.address, record.prefecture),
      phone: record.phone,
      websiteUrl: record.websiteUrl,
    },
    candidates,
  );

  if (strength === "strong" && match) {
    if (!dryRun) {
      await updateGymFillingBlanks(prisma, match.id, record);
      await recordEntitySources(prisma, "gym", match.id, record, sourceId, trustScore);
      await linkDisciplines(prisma, match.id, record.disciplines, sourceId);
    }
    return "updated";
  }

  if (!record.prefecture) {
    return "skipped";
  }

  const id = await uniqueGymId(prisma, record.name);
  const city = record.city ?? extractCity(record.address, record.prefecture) ?? "";

  if (!dryRun) {
    await prisma.gym.create({
      data: {
        id,
        name: record.name,
        normalizedName: normalizeGymName(record.name),
        nameEn: record.nameEn,
        sports: record.disciplines,
        prefecture: record.prefecture,
        city,
        address: record.address,
        phone: record.phone,
        trialInfo: DEFAULT_TRIAL_INFO,
        photo: "",
        description: "",
        websiteUrl: record.websiteUrl,
        representative: record.representative,
        active: true,
        verified: false,
      },
    });
    await recordEntitySources(prisma, "gym", id, record, sourceId, trustScore);
    await linkDisciplines(prisma, id, record.disciplines, sourceId);

    if ((strength === "medium" || strength === "weak") && match) {
      await prisma.duplicateCandidate
        .upsert({
          where: {
            entityType_entityAId_entityBId: {
              entityType: "gym",
              entityAId: id,
              entityBId: match.id,
            },
          },
          create: {
            id: `dup-${id}-${match.id}`,
            entityType: "gym",
            entityAId: id,
            entityBId: match.id,
            matchStrength: strength,
            matchReasons: reasons,
          },
          update: {},
        })
        .catch(() => undefined); // 稀な id 衝突等で失敗しても全体は止めない
      return "duplicate_flagged";
    }
  }

  return "created";
}

async function uniqueGymId(prisma: PrismaClient, name: string): Promise<string> {
  const base = slugifyForId("gym", name);
  let candidate = base;
  let suffix = 2;
  // 既存 slug と衝突する場合のみ連番を付与する(通常は初回で確定する)。
  while (await prisma.gym.findUnique({ where: { id: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

async function updateGymFillingBlanks(
  prisma: PrismaClient,
  gymId: string,
  record: ParsedGymRecord,
): Promise<void> {
  const existing = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!existing) return;

  const patch: Record<string, unknown> = {};
  if (!existing.address && record.address) patch.address = record.address;
  if (!existing.phone && record.phone) patch.phone = record.phone;
  if (!existing.websiteUrl && record.websiteUrl) patch.websiteUrl = record.websiteUrl;
  if (!existing.representative && record.representative) patch.representative = record.representative;
  if (!existing.nameEn && record.nameEn) patch.nameEn = record.nameEn;
  if (!existing.normalizedName) patch.normalizedName = normalizeGymName(existing.name);
  patch.lastVerifiedAt = new Date();

  if (Object.keys(patch).length > 0) {
    await prisma.gym.update({ where: { id: gymId }, data: patch });
  }
}

async function linkDisciplines(
  prisma: PrismaClient,
  gymId: string,
  disciplineIds: string[],
  sourceId: string,
): Promise<void> {
  for (const disciplineId of disciplineIds) {
    await prisma.gymDiscipline
      .upsert({
        where: { gymId_disciplineId: { gymId, disciplineId } },
        create: { id: `gd-${gymId}-${disciplineId}`, gymId, disciplineId, sourceId },
        update: {},
      })
      .catch(() => undefined);
  }
}

async function recordEntitySources(
  prisma: PrismaClient,
  entityType: string,
  entityId: string,
  record: ParsedGymRecord,
  sourceId: string,
  trustScore: number,
): Promise<void> {
  const confidence = trustScore / 5;
  const fields: [string, string | undefined][] = [
    ["name", record.name],
    ["address", record.address],
    ["phone", record.phone],
    ["websiteUrl", record.websiteUrl],
    ["representative", record.representative],
  ];
  for (const [fieldName, value] of fields) {
    if (!value) continue;
    await prisma.entitySource.create({
      data: {
        id: `es-${entityType}-${entityId}-${fieldName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        entityType,
        entityId,
        fieldName,
        value,
        sourceId,
        sourceUrl: record.sourceUrl,
        confidenceScore: confidence,
      },
    });
  }
}
