import type {
  Athlete,
  DreamMatchCard,
  Gym,
  GymInstructor,
  GymListingRequest,
  Match,
  OrganizationSlug,
  SportSlug,
  TrialApplication,
} from "./types";
import { prisma } from "./prisma";

export { sports, organizations, getSport, getOrganization } from "./taxonomy";

// ジム・選手・試合・ドリームマッチのデータは PostgreSQL(Prisma)に保存されており、
// 管理画面(/admin)から編集できます。実在情報には各項目に出典URLを付与しています。
// このファイルはPrisma(DB接続)を使うため、クライアントコンポーネントから直接importしないでください
// (競技・団体の一覧だけが必要な場合は "@/lib/taxonomy" を使ってください)。

function toGym(row: {
  id: string;
  name: string;
  sports: string[];
  prefecture: string;
  city: string;
  address: string | null;
  phone: string | null;
  contactEmail: string | null;
  trialInfo: string;
  photo: string;
  planTier: string;
  description: string;
  instructors: unknown;
  websiteUrl: string | null;
  featured: boolean;
}): Gym {
  return {
    id: row.id,
    name: row.name,
    sports: row.sports as SportSlug[],
    prefecture: row.prefecture,
    city: row.city,
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    contactEmail: row.contactEmail ?? undefined,
    trialInfo: row.trialInfo,
    photo: row.photo,
    planTier: row.planTier as Gym["planTier"],
    description: row.description,
    instructors: (row.instructors as GymInstructor[] | null) ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    featured: row.featured,
  };
}

function toAthlete(row: {
  id: string;
  name: string;
  nameKana: string;
  sport: string;
  organizations: string[];
  photo: string;
  birthdate: string | null;
  heightCm: number | null;
  weightKg: number | null;
  reachCm: number | null;
  weightClass: string;
  nationality: string;
  gymId: string | null;
  gymNote: string | null;
  bio: string | null;
  nickname: string | null;
  signatureMove: string | null;
  fightingStyle: string | null;
  stance: string | null;
  backbone: string | null;
  sns: unknown;
  record: unknown;
  recordNote: string | null;
  sourceUrl: string | null;
  featured: boolean;
}): Athlete {
  return {
    id: row.id,
    name: row.name,
    nameKana: row.nameKana,
    sport: row.sport as SportSlug,
    organizations: row.organizations as OrganizationSlug[],
    photo: row.photo,
    birthdate: row.birthdate ?? undefined,
    heightCm: row.heightCm ?? undefined,
    weightKg: row.weightKg ?? undefined,
    reachCm: row.reachCm ?? undefined,
    weightClass: row.weightClass,
    nationality: row.nationality,
    gymId: row.gymId ?? undefined,
    gymNote: row.gymNote ?? undefined,
    bio: row.bio ?? undefined,
    nickname: row.nickname ?? undefined,
    signatureMove: row.signatureMove ?? undefined,
    fightingStyle: row.fightingStyle ?? undefined,
    stance: row.stance ?? undefined,
    backbone: row.backbone ?? undefined,
    sns: (row.sns as Athlete["sns"] | null) ?? [],
    record: (row.record as Athlete["record"] | null) ?? undefined,
    recordNote: row.recordNote ?? undefined,
    sourceUrl: row.sourceUrl ?? undefined,
    featured: row.featured,
  };
}

function toMatch(row: {
  id: string;
  sport: string;
  organization: string;
  eventName: string;
  eventDate: string;
  venue: string;
  athleteAId: string;
  athleteBId: string;
  status: string;
  votesA: number;
  votesB: number;
  resultWinnerId: string | null;
  sourceUrl: string | null;
}): Match {
  return {
    id: row.id,
    sport: row.sport as SportSlug,
    organization: row.organization as OrganizationSlug,
    eventName: row.eventName,
    eventDate: row.eventDate,
    venue: row.venue,
    athleteAId: row.athleteAId,
    athleteBId: row.athleteBId,
    status: row.status as Match["status"],
    votesA: row.votesA,
    votesB: row.votesB,
    resultWinnerId: row.resultWinnerId ?? undefined,
    sourceUrl: row.sourceUrl ?? undefined,
  };
}

function toDreamMatch(row: {
  id: string;
  sport: string;
  organization: string;
  athleteAId: string;
  athleteBId: string;
  votes: number;
}): DreamMatchCard {
  return {
    id: row.id,
    sport: row.sport as SportSlug,
    organization: row.organization as OrganizationSlug,
    athleteAId: row.athleteAId,
    athleteBId: row.athleteBId,
    votes: row.votes,
  };
}

function toTrialApplication(row: {
  id: string;
  gymId: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferredDate: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
}): TrialApplication {
  return {
    id: row.id,
    gymId: row.gymId,
    name: row.name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    preferredDate: row.preferredDate ?? undefined,
    message: row.message ?? undefined,
    status: row.status as TrialApplication["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

function toListingRequest(row: {
  id: string;
  gymName: string;
  sports: string[];
  prefecture: string;
  city: string;
  address: string | null;
  phone: string | null;
  websiteUrl: string | null;
  description: string | null;
  contactName: string;
  contactEmail: string;
  status: string;
  createdAt: Date;
}): GymListingRequest {
  return {
    id: row.id,
    gymName: row.gymName,
    sports: row.sports as SportSlug[],
    prefecture: row.prefecture,
    city: row.city,
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    description: row.description ?? undefined,
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    status: row.status as GymListingRequest["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getGyms(): Promise<Gym[]> {
  const rows = await prisma.gym.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toGym);
}

export async function getAthletes(): Promise<Athlete[]> {
  const rows = await prisma.athlete.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toAthlete);
}

export async function getMatches(): Promise<Match[]> {
  const rows = await prisma.match.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toMatch);
}

export async function getDreamMatches(): Promise<DreamMatchCard[]> {
  const rows = await prisma.dreamMatchCard.findMany();
  return rows.map(toDreamMatch);
}

export async function getTrialApplications(): Promise<TrialApplication[]> {
  const rows = await prisma.trialApplication.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toTrialApplication);
}

export async function getListingRequests(): Promise<GymListingRequest[]> {
  const rows = await prisma.gymListingRequest.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toListingRequest);
}

export async function getAthlete(id: string): Promise<Athlete | undefined> {
  const row = await prisma.athlete.findUnique({ where: { id } });
  return row ? toAthlete(row) : undefined;
}

export async function getGym(id: string): Promise<Gym | undefined> {
  const row = await prisma.gym.findUnique({ where: { id } });
  return row ? toGym(row) : undefined;
}

export async function getMatch(id: string): Promise<Match | undefined> {
  const row = await prisma.match.findUnique({ where: { id } });
  return row ? toMatch(row) : undefined;
}

export async function getDreamMatch(id: string): Promise<DreamMatchCard | undefined> {
  const row = await prisma.dreamMatchCard.findUnique({ where: { id } });
  return row ? toDreamMatch(row) : undefined;
}

export async function gymsBySport(sport: SportSlug): Promise<Gym[]> {
  const rows = await prisma.gym.findMany({ where: { sports: { has: sport } }, orderBy: { createdAt: "desc" } });
  return rows.map(toGym);
}

export async function athletesBySport(sport: SportSlug): Promise<Athlete[]> {
  const rows = await prisma.athlete.findMany({ where: { sport }, orderBy: { createdAt: "desc" } });
  return rows.map(toAthlete);
}

export async function matchesBySport(sport: SportSlug): Promise<Match[]> {
  const rows = await prisma.match.findMany({ where: { sport }, orderBy: { createdAt: "desc" } });
  return rows.map(toMatch);
}

export async function matchesByOrganization(organization: OrganizationSlug): Promise<Match[]> {
  const rows = await prisma.match.findMany({ where: { organization }, orderBy: { createdAt: "desc" } });
  return rows.map(toMatch);
}

export async function athletesByOrganization(organization: OrganizationSlug): Promise<Athlete[]> {
  const rows = await prisma.athlete.findMany({
    where: { organizations: { has: organization } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAthlete);
}
