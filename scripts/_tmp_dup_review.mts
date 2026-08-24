import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const candidates = await prisma.duplicateCandidate.findMany({ where: { status: "pending" } });
console.log("total pending:", candidates.length);

const gymIds = Array.from(new Set(candidates.flatMap((c) => [c.entityAId, c.entityBId])));
const gyms = await prisma.gym.findMany({
  where: { id: { in: gymIds } },
  select: { id: true, name: true, prefecture: true, city: true, address: true, phone: true, websiteUrl: true },
});
const byId = new Map(gyms.map((g) => [g.id, g]));

const rows = candidates.map((c) => {
  const a = byId.get(c.entityAId);
  const b = byId.get(c.entityBId);
  return { id: c.id, strength: c.matchStrength, reasons: c.matchReasons, a, b };
});

// 強度別に件数集計
const byStrength = new Map<string, number>();
for (const r of rows) byStrength.set(r.strength, (byStrength.get(r.strength) ?? 0) + 1);
console.log("by strength:", [...byStrength.entries()]);

console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
