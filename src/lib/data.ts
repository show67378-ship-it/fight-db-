import type {
  Athlete,
  DreamMatchCard,
  EditRequest,
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
  nameKana: string | null;
  sports: string[];
  primarySport: string | null;
  priorityRank: number | null;
  displayOrder: number | null;
  prestigeScore: number | null;
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
  verified: boolean;
}): Gym {
  return {
    id: row.id,
    name: row.name,
    nameKana: row.nameKana ?? undefined,
    sports: row.sports as SportSlug[],
    primarySport: (row.primarySport as SportSlug | null) ?? undefined,
    priorityRank: row.priorityRank ?? undefined,
    displayOrder: row.displayOrder ?? undefined,
    prestigeScore: row.prestigeScore ?? undefined,
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
    verified: row.verified,
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
  displayOrder: number | null;
  primaryOrganization: string | null;
  prominenceScore: number | null;
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
  verified: boolean;
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
    displayOrder: row.displayOrder ?? undefined,
    primaryOrganization: (row.primaryOrganization as OrganizationSlug | null) ?? undefined,
    prominenceScore: row.prominenceScore ?? undefined,
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
    verified: row.verified,
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

function toEditRequest(row: {
  id: string;
  targetType: string;
  targetId: string;
  targetName: string;
  content: string;
  contactName: string | null;
  contactEmail: string | null;
  status: string;
  createdAt: Date;
}): EditRequest {
  return {
    id: row.id,
    targetType: row.targetType as EditRequest["targetType"],
    targetId: row.targetId,
    targetName: row.targetName,
    content: row.content,
    contactName: row.contactName ?? undefined,
    contactEmail: row.contactEmail ?? undefined,
    status: row.status as EditRequest["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

// 表示順(ジムと選手で順序が異なる指定のため別々に定義)。
const GYM_SPORT_ORDER: SportSlug[] = ["mma", "bjj", "kickboxing", "boxing"];
const ATHLETE_SPORT_ORDER: SportSlug[] = ["mma", "kickboxing", "boxing", "bjj"];

// ジムの都道府県表示順。指定の8都道府県 → 地方ブロック(東北→北陸→関東→中部→近畿→中国→四国→九州→沖縄)の順。
const PREFECTURE_ORDER: string[] = [
  "東京都", "神奈川県", "千葉県", "埼玉県", "大阪府", "北海道", "福岡県", "愛知県",
  // 東北
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  // 北陸
  "新潟県", "富山県", "石川県", "福井県",
  // 関東(上記8県以外)
  "茨城県", "栃木県", "群馬県",
  // 中部(北陸・愛知を除く)
  "山梨県", "長野県", "岐阜県", "静岡県",
  // 近畿(大阪を除く)
  "三重県", "滋賀県", "京都府", "兵庫県", "奈良県", "和歌山県",
  // 中国
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  // 四国
  "徳島県", "香川県", "愛媛県", "高知県",
  // 九州(福岡を除く)
  "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  // 沖縄
  "沖縄県",
];

// 選手の所属団体表示順(仕様: UFC > RIZIN > BREAKINGDOWN > DEEP > 修斗 > パンクラス > その他)。
const ORGANIZATION_TIER_ORDER: OrganizationSlug[] = [
  "ufc", "rizin", "breakingdown", "deep", "shooto", "pancrase", "rise", "k1", "jbc", "wba", "wbo", "wbc", "ibf",
];

function sportRank(order: SportSlug[], sport: SportSlug | undefined): number {
  if (!sport) return order.length;
  const idx = order.indexOf(sport);
  return idx === -1 ? order.length : idx;
}

function prefectureRank(prefecture: string): number {
  const idx = PREFECTURE_ORDER.indexOf(prefecture);
  return idx === -1 ? PREFECTURE_ORDER.length : idx;
}

function organizationRank(org: string | undefined): number {
  if (!org) return ORGANIZATION_TIER_ORDER.length;
  const idx = ORGANIZATION_TIER_ORDER.indexOf(org as OrganizationSlug);
  return idx === -1 ? ORGANIZATION_TIER_ORDER.length : idx;
}

// 表示優先順位: 1) 全体順位(手動) 2) 競技順 3) ジャンル内順位(手動) 4) 都道府県 5) 名門度(自動算出)
function sortGyms(gyms: Gym[]): Gym[] {
  return [...gyms].sort((a, b) => {
    const priorityDiff =
      (a.priorityRank ?? Number.MAX_SAFE_INTEGER) - (b.priorityRank ?? Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;
    const sportDiff =
      sportRank(GYM_SPORT_ORDER, a.primarySport ?? a.sports[0]) -
      sportRank(GYM_SPORT_ORDER, b.primarySport ?? b.sports[0]);
    if (sportDiff !== 0) return sportDiff;
    const orderDiff = (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    const prefDiff = prefectureRank(a.prefecture) - prefectureRank(b.prefecture);
    if (prefDiff !== 0) return prefDiff;
    const prestigeDiff = (b.prestigeScore ?? 0) - (a.prestigeScore ?? 0); // 高いほど上位
    if (prestigeDiff !== 0) return prestigeDiff;
    return a.name.localeCompare(b.name, "ja");
  });
}

// 表示優先順位: 1) 全体順位(手動) 2) 競技順 3) 所属団体順 4) 活躍度(自動算出)
function sortAthletes(athletes: Athlete[]): Athlete[] {
  return [...athletes].sort((a, b) => {
    const orderDiff = (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    const sportDiff = sportRank(ATHLETE_SPORT_ORDER, a.sport) - sportRank(ATHLETE_SPORT_ORDER, b.sport);
    if (sportDiff !== 0) return sportDiff;
    const orgDiff = organizationRank(a.primaryOrganization) - organizationRank(b.primaryOrganization);
    if (orgDiff !== 0) return orgDiff;
    const prominenceDiff = (b.prominenceScore ?? 0) - (a.prominenceScore ?? 0); // 高いほど上位
    if (prominenceDiff !== 0) return prominenceDiff;
    return a.name.localeCompare(b.name, "ja");
  });
}

export async function getGyms(): Promise<Gym[]> {
  const rows = await prisma.gym.findMany({ orderBy: { createdAt: "desc" } });
  return sortGyms(rows.map(toGym));
}

export async function getAthletes(): Promise<Athlete[]> {
  const rows = await prisma.athlete.findMany({ orderBy: { createdAt: "desc" } });
  return sortAthletes(rows.map(toAthlete));
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

export async function getEditRequests(): Promise<EditRequest[]> {
  const rows = await prisma.editRequest.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toEditRequest);
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
  return sortGyms(rows.map(toGym));
}

export async function athletesBySport(sport: SportSlug): Promise<Athlete[]> {
  const rows = await prisma.athlete.findMany({ where: { sport }, orderBy: { createdAt: "desc" } });
  return sortAthletes(rows.map(toAthlete));
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
