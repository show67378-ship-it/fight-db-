import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function inferOrganization(a: { organizations: string[]; sourceUrl: string | null }): string | null {
  if (a.organizations.includes("rizin")) return "rizin";
  if (a.organizations.includes("breakingdown")) return "breakingdown";
  if (!a.sourceUrl) return null;
  if (a.sourceUrl.includes("shooto-mma.com")) return "shooto";
  if (a.sourceUrl.includes("rise-rc.com")) return "rise";
  if (a.sourceUrl.includes("jbc.or.jp")) return "jbc";
  return null;
}

const athletes = await prisma.athlete.findMany({
  select: { id: true, organizations: true, sourceUrl: true, featured: true, nickname: true, record: true },
});

let updated = 0;
for (const a of athletes) {
  const primaryOrganization = inferOrganization(a);

  // 活躍度スコア(ヒューリスティック): 実在の戦績・注目選手指定等、根拠のある値から算出する。
  // 個々の選手について「チャンピオンかどうか」等を裏取りする情報源が無いため、
  // featured フラグ(サイト側で明示的に注目選手指定)・勝敗数を代理指標として使う。
  const record = a.record as { wins: number; losses: number; draws: number } | null;
  let prominenceScore = 0;
  if (a.featured) prominenceScore += 1000;
  if (record) {
    prominenceScore += record.wins * 2 - record.losses * 0.5 + record.draws * 0.2;
  }
  if (a.nickname) prominenceScore += 10;

  await prisma.athlete.update({
    where: { id: a.id },
    data: { primaryOrganization, prominenceScore },
  });
  updated++;
}
console.log("updated:", updated);
await prisma.$disconnect();
