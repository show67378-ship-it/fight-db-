import { prisma } from "./prisma";

export async function getCrawlRuns(limit = 10) {
  return prisma.crawlRun.findMany({ orderBy: { startedAt: "desc" }, take: limit });
}

export async function getCrawlRunWithSources(crawlRunId: string) {
  const [run, sourceRuns] = await Promise.all([
    prisma.crawlRun.findUnique({ where: { id: crawlRunId } }),
    prisma.crawlSourceRun.findMany({
      where: { crawlRunId },
      include: { source: true },
      orderBy: { startedAt: "asc" },
    }),
  ]);
  return { run, sourceRuns };
}

export async function getCrawlerSources() {
  return prisma.crawlerSource.findMany({ orderBy: [{ enabled: "desc" }, { name: "asc" }] });
}

export async function getPendingDuplicateCandidates(limit = 30) {
  const candidates = await prisma.duplicateCandidate.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const gymIds = Array.from(
    new Set(candidates.flatMap((c) => [c.entityAId, c.entityBId])),
  );
  const gyms = await prisma.gym.findMany({
    where: { id: { in: gymIds } },
    select: { id: true, name: true, prefecture: true, city: true, address: true, phone: true },
  });
  const gymById = new Map(gyms.map((g) => [g.id, g]));
  return candidates.map((c) => ({
    ...c,
    entityA: gymById.get(c.entityAId),
    entityB: gymById.get(c.entityBId),
  }));
}
