import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 目視確認の結果、名前は似ているが実際には別ジム(住所が明確に異なる)と判定したペア。
const REJECT_PAIRS = new Set([
  "dup-gym-パラエストラ西東京-gym-パラエストラ東京",
  "dup-gym-トライフォース綱島-gym-トライフォース大島",
  "dup-gym-パラエストラ大阪-gym-パラエストラ東大阪",
  "dup-gym-齋田ボクシングジム-gym-宮田ボクシングジム",
  "dup-gym-山龍ボクシングジム-gym-山木ボクシングジム",
  "dup-gym-杉田ボクシングジム-gym-薮田ボクシングジム",
]);

const pending = await prisma.duplicateCandidate.findMany({ where: { status: "pending" } });

let confirmed = 0;
let rejected = 0;
for (const c of pending) {
  const status = REJECT_PAIRS.has(c.id) ? "rejected" : "confirmed_duplicate";
  await prisma.duplicateCandidate.update({
    where: { id: c.id },
    data: { status, resolvedAt: new Date(), resolvedBy: "claude-review" },
  });
  if (status === "rejected") rejected++;
  else confirmed++;
}
console.log({ total: pending.length, confirmed, rejected });
await prisma.$disconnect();
