// 既存の src/data/*.json を PostgreSQL(Prisma)に一括インポートするスクリプト。
// 実行: npx tsx scripts/migrate-json-to-db.mts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJson(file: string): any[] {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));
}

async function main() {
  const gyms = readJson("gyms.json");
  const athletes = readJson("athletes.json");
  const matches = readJson("matches.json");
  const dreamMatches = readJson("dream-matches.json");
  const trialApplications = readJson("trial-applications.json");
  const listingRequests = readJson("listing-requests.json");

  console.log(`gyms: ${gyms.length}, athletes: ${athletes.length}, matches: ${matches.length}, dreamMatches: ${dreamMatches.length}, trialApplications: ${trialApplications.length}, listingRequests: ${listingRequests.length}`);

  for (const g of gyms) {
    await prisma.gym.upsert({
      where: { id: g.id },
      create: {
        id: g.id,
        name: g.name,
        sports: g.sports,
        prefecture: g.prefecture,
        city: g.city,
        address: g.address,
        phone: g.phone,
        contactEmail: g.contactEmail,
        trialInfo: g.trialInfo,
        photo: g.photo,
        planTier: g.planTier ?? "free",
        description: g.description,
        instructors: g.instructors ?? undefined,
        websiteUrl: g.websiteUrl,
        featured: g.featured ?? false,
      },
      update: {},
    });
  }
  console.log("gyms imported");

  for (const a of athletes) {
    await prisma.athlete.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        name: a.name,
        nameKana: a.nameKana,
        sport: a.sport,
        organizations: a.organizations,
        photo: a.photo,
        birthdate: a.birthdate,
        heightCm: a.heightCm,
        weightKg: a.weightKg,
        reachCm: a.reachCm,
        weightClass: a.weightClass,
        nationality: a.nationality,
        gymId: a.gymId,
        gymNote: a.gymNote,
        bio: a.bio,
        nickname: a.nickname,
        signatureMove: a.signatureMove,
        fightingStyle: a.fightingStyle,
        stance: a.stance,
        backbone: a.backbone,
        sns: a.sns ?? [],
        record: a.record ?? undefined,
        recordNote: a.recordNote,
        sourceUrl: a.sourceUrl,
        featured: a.featured ?? false,
      },
      update: {},
    });
  }
  console.log("athletes imported");

  for (const m of matches) {
    await prisma.match.upsert({
      where: { id: m.id },
      create: {
        id: m.id,
        sport: m.sport,
        organization: m.organization,
        eventName: m.eventName,
        eventDate: m.eventDate,
        venue: m.venue,
        athleteAId: m.athleteAId,
        athleteBId: m.athleteBId,
        status: m.status,
        votesA: m.votesA ?? 0,
        votesB: m.votesB ?? 0,
        resultWinnerId: m.resultWinnerId,
        sourceUrl: m.sourceUrl,
      },
      update: {},
    });
  }
  console.log("matches imported");

  for (const c of dreamMatches) {
    await prisma.dreamMatchCard.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        sport: c.sport,
        organization: c.organization,
        athleteAId: c.athleteAId,
        athleteBId: c.athleteBId,
        votes: c.votes ?? 0,
      },
      update: {},
    });
  }
  console.log("dream matches imported");

  for (const t of trialApplications) {
    await prisma.trialApplication.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        gymId: t.gymId,
        name: t.name,
        phone: t.phone,
        email: t.email,
        preferredDate: t.preferredDate,
        message: t.message,
        status: t.status,
        createdAt: new Date(t.createdAt),
      },
      update: {},
    });
  }
  console.log("trial applications imported");

  for (const r of listingRequests) {
    await prisma.gymListingRequest.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        gymName: r.gymName,
        sports: r.sports,
        prefecture: r.prefecture,
        city: r.city,
        address: r.address,
        phone: r.phone,
        websiteUrl: r.websiteUrl,
        description: r.description,
        contactName: r.contactName,
        contactEmail: r.contactEmail,
        status: r.status,
        createdAt: new Date(r.createdAt),
      },
      update: {},
    });
  }
  console.log("listing requests imported");

  console.log("done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
