// 1件の ParsedEventRecord を大会DBへ反映する。
// 公式URL(officialUrl)を一意キーとして扱い、同一大会の重複作成を防ぐ。
import type { PrismaClient } from "../../generated/prisma/client";
import type { ParsedEventRecord } from "../core/types";
import { slugifyForId } from "../core/slug";

export interface ApplyEventOptions {
  prisma: PrismaClient;
  record: ParsedEventRecord;
  dryRun: boolean;
}

export type ApplyEventOutcome = "created" | "updated" | "skipped";

export async function applyEventRecord({
  prisma,
  record,
  dryRun,
}: ApplyEventOptions): Promise<ApplyEventOutcome> {
  if (!record.name) return "skipped";

  const existing = record.officialUrl
    ? await prisma.event.findFirst({ where: { officialUrl: record.officialUrl }, select: { id: true } })
    : null;

  if (existing) {
    if (!dryRun) {
      await prisma.event.update({
        where: { id: existing.id },
        data: {
          name: record.name,
          eventDate: record.eventDate,
          eventDateRaw: record.eventDateRaw,
          venue: record.venue,
          prefecture: record.prefecture,
          city: record.city,
        },
      });
    }
    return "updated";
  }

  if (!dryRun) {
    // id は officialUrl(取得元ごとに一意)から生成する。日付+会場名だけだと、
    // 同日同会場で複数カードが開催されるケース等で衝突しうるため使わない。
    const idBasis = record.officialUrl ?? `${record.organizationId ?? "event"}-${record.eventDateRaw ?? record.name}-${Date.now()}`;
    await prisma.event.create({
      data: {
        id: slugifyForId("event", idBasis),
        organizationId: record.organizationId,
        name: record.name,
        eventDate: record.eventDate,
        eventDateRaw: record.eventDateRaw,
        venue: record.venue,
        prefecture: record.prefecture,
        city: record.city,
        officialUrl: record.officialUrl,
        status: "scheduled",
      },
    });
  }
  return "created";
}
