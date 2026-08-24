import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const rows = await prisma.athlete.findMany({
  where: { primaryOrganization: { not: null }, organizations: { isEmpty: true } },
  select: { id: true, primaryOrganization: true },
});
console.log("to update:", rows.length);

let updated = 0;
for (const r of rows) {
  await prisma.athlete.update({
    where: { id: r.id },
    data: { organizations: [r.primaryOrganization!] },
  });
  updated++;
}
console.log("updated:", updated);
await prisma.$disconnect();
