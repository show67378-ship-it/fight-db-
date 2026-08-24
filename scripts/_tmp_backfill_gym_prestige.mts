import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 名門度スコア(ヒューリスティック):設立年等の情報源が無いため、
// 「所属選手数」「所属選手の実績(勝数)」「著名選手(featured/RIZIN等)の在籍」
// 「情報の充実度(説明文・指導者情報の有無)」「確認済みフラグ」から算出する代理指標。
const gyms = await prisma.gym.findMany({
  select: {
    id: true,
    description: true,
    instructors: true,
    verified: true,
    fighterGyms: {
      select: {
        fighter: { select: { record: true, featured: true, organizations: true } },
      },
    },
  },
});

let updated = 0;
for (const g of gyms) {
  const fighters = g.fighterGyms.map((fg) => fg.fighter);
  let prestigeScore = fighters.length * 3;

  for (const f of fighters) {
    const record = f.record as { wins: number; losses: number; draws: number } | null;
    if (record) prestigeScore += record.wins * 1;
    if (f.featured) prestigeScore += 30;
    if (f.organizations.some((o) => ["rizin", "breakingdown"].includes(o))) prestigeScore += 50;
  }

  if (g.description) prestigeScore += 5;
  if (g.instructors) prestigeScore += 5;
  if (g.verified) prestigeScore += 10;

  await prisma.gym.update({ where: { id: g.id }, data: { prestigeScore } });
  updated++;
}
console.log("updated:", updated);
await prisma.$disconnect();
