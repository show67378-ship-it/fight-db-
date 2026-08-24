// 1件の ParsedFighterRecord を選手DBへ反映し、所属ジム欄から仕様19の
// 「大会/選手 → 所属ジム発見」を試みる。住所が分からないジムは新規作成せず、
// 既存ジムとの高信頼マッチのみ FighterGym として連携する(誤った新規ジム作成を防ぐ)。
import type { PrismaClient } from "../../generated/prisma/client";
import type { ParsedFighterRecord } from "../core/types";
import { slugifyForId } from "../core/slug";
import { normalizeGymName, nameSimilarity } from "../normalize/name";

export interface ApplyFighterOptions {
  prisma: PrismaClient;
  record: ParsedFighterRecord;
  sourceId: string;
  trustScore: number;
  dryRun: boolean;
}

export type ApplyFighterOutcome = "created" | "updated" | "skipped";

const GYM_MATCH_THRESHOLD = 0.88;

// 各parserが record.organization に入れる生の団体名 → 選手一覧の団体タクソノミー(OrganizationSlug)へのマッピング。
// taxonomy(src/lib/taxonomy.ts)の organizations 一覧と対応させること。
const ORGANIZATION_SLUG_MAP: Record<string, string> = {
  RIZIN: "rizin",
  修斗: "shooto",
  RISE: "rise",
  JBC: "jbc",
  DEEP: "deep",
};

function toOrganizationSlug(organization: string | undefined): string | undefined {
  if (!organization) return undefined;
  return ORGANIZATION_SLUG_MAP[organization];
}

export async function applyFighterRecord({
  prisma,
  record,
  sourceId,
  trustScore,
  dryRun,
}: ApplyFighterOptions): Promise<{ outcome: ApplyFighterOutcome; gymLinked: boolean }> {
  if (!record.name) return { outcome: "skipped", gymLinked: false };

  const normalizedName = normalizeGymName(record.name); // 選手名にも同じ全角/表記正規化を流用
  const existing = await findExistingAthlete(prisma, record.name, normalizedName);

  let athleteId = existing?.id;

  if (!dryRun) {
    if (existing) {
      await updateAthleteFillingBlanks(prisma, existing.id, record, normalizedName);
    } else {
      athleteId = slugifyForId("athlete", record.name);
      const organizationSlug = toOrganizationSlug(record.organization);
      await prisma.athlete.create({
        data: {
          id: athleteId,
          name: record.name,
          nameKana: "",
          sport: record.discipline ?? "mma",
          // Athlete.organizations は既存UI(OrgTag)が固定タクソノミーでしか解決できない
          // 閉じた値集合のため、taxonomy(src/lib/taxonomy.ts)に登録済みの団体のみ入れる。
          organizations: organizationSlug ? [organizationSlug] : [],
          primaryOrganization: organizationSlug,
          photo: "",
          weightClass: record.weightClass ?? "",
          nationality: record.nationality ?? "",
          birthdate: record.birthdate,
          heightCm: record.heightCm,
          record: record.record,
          normalizedName,
          sourceUrl: record.sourceUrl,
          active: true,
          verified: false,
        },
      });
    }

    if (athleteId) {
      await recordFighterEntitySources(prisma, athleteId, record, sourceId, trustScore);
    }
  }

  let gymLinked = false;
  if (record.gymNameRaw && athleteId) {
    const gymId = await findMatchingGymId(prisma, record.gymNameRaw);
    if (gymId && !dryRun) {
      await prisma.fighterGym
        .upsert({
          where: {
            id: `fg-${athleteId}-${gymId}`,
          },
          create: {
            id: `fg-${athleteId}-${gymId}`,
            fighterId: athleteId,
            gymId,
            current: true,
            sourceId,
          },
          update: { current: true },
        })
        .catch(() => undefined);
      gymLinked = true;
    }
  }

  return { outcome: existing ? "updated" : "created", gymLinked };
}

// 既存選手は、既に入力済みの値を自動で上書きしない(空欄のみ埋める)。
// 戦績(record)だけは「より詳しい情報が取れた場合は更新する」扱いとする
// (既存クロール分の record は同じ公式ソースの取得結果なので、上書きしても情報の劣化にならないため)。
async function updateAthleteFillingBlanks(
  prisma: PrismaClient,
  athleteId: string,
  record: ParsedFighterRecord,
  normalizedName: string,
): Promise<void> {
  const existing = await prisma.athlete.findUnique({ where: { id: athleteId } });
  if (!existing) return;

  const patch: Record<string, unknown> = { normalizedName };
  if (!existing.nationality && record.nationality) patch.nationality = record.nationality;
  if (!existing.birthdate && record.birthdate) patch.birthdate = record.birthdate;
  if (!existing.heightCm && record.heightCm) patch.heightCm = record.heightCm;
  if (record.record) patch.record = record.record;
  const organizationSlug = toOrganizationSlug(record.organization);
  if (!existing.primaryOrganization && organizationSlug) {
    patch.primaryOrganization = organizationSlug;
    if (existing.organizations.length === 0) patch.organizations = [organizationSlug];
  }

  await prisma.athlete.update({ where: { id: athleteId }, data: patch });
}

const ATHLETE_MATCH_THRESHOLD = 0.95; // 選手名は同姓同名の別人もいるため、ジムより厳しめに設定

// 既存選手を name / normalizedName の完全一致でまず探し、見つからなければ類似度でフォールバックする。
// normalizedName 未整備の既存(クロール導入前)選手も、表記ゆれ(スペース有無等)だけの
// 別人ではない同一人物として正しく拾うため。
async function findExistingAthlete(
  prisma: PrismaClient,
  name: string,
  normalizedName: string,
): Promise<{ id: string } | null> {
  const exact = await prisma.athlete.findFirst({
    where: { OR: [{ normalizedName }, { name }] },
    select: { id: true },
  });
  if (exact) return exact;

  const candidates = await prisma.athlete.findMany({
    select: { id: true, name: true, normalizedName: true },
    take: 5000,
  });
  let best: { id: string; score: number } | null = null;
  for (const c of candidates) {
    const candidateNormalized = c.normalizedName ?? normalizeGymName(c.name);
    const score = nameSimilarity(normalizedName, candidateNormalized);
    if (score >= ATHLETE_MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { id: c.id, score };
    }
  }
  return best ? { id: best.id } : null;
}

async function findMatchingGymId(prisma: PrismaClient, gymNameRaw: string): Promise<string | null> {
  const target = normalizeGymName(gymNameRaw);
  if (!target || target.length < 2) return null;

  const exact = await prisma.gym.findFirst({
    where: { normalizedName: target },
    select: { id: true },
  });
  if (exact) return exact.id;

  // normalizedName 未整備の既存ジムも拾えるよう、名称類似度で緩くフォールバック検索する。
  const candidates = await prisma.gym.findMany({
    select: { id: true, name: true, normalizedName: true },
    take: 3000,
  });
  let best: { id: string; score: number } | null = null;
  for (const c of candidates) {
    const candidateNormalized = c.normalizedName ?? normalizeGymName(c.name);
    const score = nameSimilarity(target, candidateNormalized);
    if (score >= GYM_MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { id: c.id, score };
    }
  }
  return best?.id ?? null;
}

// 情報ソースを保持する(仕様10)。所属ジム欄等、複数ソースが競合しうる項目の追跡に使う。
async function recordFighterEntitySources(
  prisma: PrismaClient,
  athleteId: string,
  record: ParsedFighterRecord,
  sourceId: string,
  trustScore: number,
): Promise<void> {
  const fields: [string, string | undefined][] = [
    ["name", record.name],
    ["gymNameRaw", record.gymNameRaw],
    ["weightClass", record.weightClass],
    ["organization", record.organization],
    ["nationality", record.nationality],
    ["birthdate", record.birthdate],
    ["heightCm", record.heightCm?.toString()],
    ["record", record.record ? `${record.record.wins}-${record.record.losses}-${record.record.draws}` : undefined],
  ];
  for (const [fieldName, value] of fields) {
    if (!value) continue;
    await prisma.entitySource.create({
      data: {
        id: `es-fighter-${athleteId}-${fieldName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        entityType: "fighter",
        entityId: athleteId,
        fieldName,
        value,
        sourceId,
        sourceUrl: record.sourceUrl,
        confidenceScore: trustScore / 5,
      },
    });
  }
}
