"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client";
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

function newId(prefix: string, name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${prefix}-${base}-${suffix}` : `${prefix}-${suffix}`;
}

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function optStr(formData: FormData, key: string): string | undefined {
  const v = str(formData, key);
  return v === "" ? undefined : v;
}

function optNum(formData: FormData, key: string): number | undefined {
  const v = str(formData, key);
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function parseInstructors(raw: string): GymInstructor[] | undefined {
  const list = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const [name, title] = line.split(",").map((s) => s.trim());
      return title ? { name, title } : { name };
    });
  return list.length > 0 ? list : undefined;
}

function gymFromForm(formData: FormData, existing?: Gym): Gym {
  const sportsSel = formData.getAll("sports") as SportSlug[];
  return {
    id: existing?.id ?? newId("gym", str(formData, "name")),
    name: str(formData, "name"),
    sports: sportsSel,
    prefecture: str(formData, "prefecture"),
    city: str(formData, "city"),
    address: optStr(formData, "address"),
    phone: optStr(formData, "phone"),
    contactEmail: optStr(formData, "contactEmail"),
    trialInfo: str(formData, "trialInfo"),
    photo: existing?.photo ?? "",
    planTier: (str(formData, "planTier") || "free") as Gym["planTier"],
    description: str(formData, "description"),
    instructors: parseInstructors(str(formData, "instructors")),
    websiteUrl: optStr(formData, "websiteUrl"),
    featured: bool(formData, "featured"),
  };
}

function gymData(g: Gym) {
  return {
    name: g.name,
    sports: g.sports,
    prefecture: g.prefecture,
    city: g.city,
    address: g.address ?? null,
    phone: g.phone ?? null,
    contactEmail: g.contactEmail ?? null,
    trialInfo: g.trialInfo,
    photo: g.photo,
    planTier: g.planTier,
    description: g.description,
    instructors: (g.instructors as Prisma.InputJsonValue | undefined) ?? Prisma.JsonNull,
    websiteUrl: g.websiteUrl ?? null,
    featured: g.featured ?? false,
  };
}

export async function createGym(formData: FormData) {
  const gym = gymFromForm(formData);
  await prisma.gym.create({ data: { id: gym.id, ...gymData(gym) } });
  revalidatePath("/", "layout");
  redirect("/admin/gyms");
}

export async function updateGym(id: string, formData: FormData) {
  const existing = await prisma.gym.findUnique({ where: { id } });
  if (!existing) redirect("/admin/gyms");
  const gym = gymFromForm(formData, {
    ...existing,
    address: existing.address ?? undefined,
    phone: existing.phone ?? undefined,
    contactEmail: existing.contactEmail ?? undefined,
    instructors: (existing.instructors as GymInstructor[] | null) ?? undefined,
    websiteUrl: existing.websiteUrl ?? undefined,
    sports: existing.sports as SportSlug[],
    planTier: existing.planTier as Gym["planTier"],
  });
  await prisma.gym.update({ where: { id }, data: gymData(gym) });
  revalidatePath("/", "layout");
  redirect("/admin/gyms");
}

export async function deleteGym(id: string) {
  await prisma.gym.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/gyms");
}

function athleteFromForm(formData: FormData, existing?: Athlete): Athlete {
  const organizationsSel = formData.getAll("organizations") as OrganizationSlug[];
  const wins = optNum(formData, "wins");
  const losses = optNum(formData, "losses");
  const draws = optNum(formData, "draws");
  const record =
    wins !== undefined && losses !== undefined && draws !== undefined
      ? { wins, losses, draws }
      : undefined;

  const snsPlatform = optStr(formData, "snsPlatform");
  const snsHandle = optStr(formData, "snsHandle");
  const sns = snsPlatform && snsHandle ? [{ platform: snsPlatform, handle: snsHandle }] : [];

  return {
    id: existing?.id ?? newId("ath", str(formData, "name")),
    name: str(formData, "name"),
    nameKana: str(formData, "nameKana"),
    sport: str(formData, "sport") as SportSlug,
    organizations: organizationsSel,
    photo: existing?.photo ?? "",
    birthdate: optStr(formData, "birthdate"),
    heightCm: optNum(formData, "heightCm"),
    weightKg: optNum(formData, "weightKg"),
    reachCm: optNum(formData, "reachCm"),
    weightClass: str(formData, "weightClass"),
    nationality: str(formData, "nationality"),
    gymId: optStr(formData, "gymId"),
    gymNote: optStr(formData, "gymNote"),
    bio: optStr(formData, "bio"),
    nickname: optStr(formData, "nickname"),
    signatureMove: optStr(formData, "signatureMove"),
    fightingStyle: optStr(formData, "fightingStyle"),
    stance: optStr(formData, "stance"),
    backbone: optStr(formData, "backbone"),
    sns,
    record,
    recordNote: optStr(formData, "recordNote"),
    sourceUrl: optStr(formData, "sourceUrl"),
    featured: bool(formData, "featured"),
  };
}

function athleteData(a: Athlete) {
  return {
    name: a.name,
    nameKana: a.nameKana,
    sport: a.sport,
    organizations: a.organizations,
    photo: a.photo,
    birthdate: a.birthdate ?? null,
    heightCm: a.heightCm ?? null,
    weightKg: a.weightKg ?? null,
    reachCm: a.reachCm ?? null,
    weightClass: a.weightClass,
    nationality: a.nationality,
    gymId: a.gymId ?? null,
    gymNote: a.gymNote ?? null,
    bio: a.bio ?? null,
    nickname: a.nickname ?? null,
    signatureMove: a.signatureMove ?? null,
    fightingStyle: a.fightingStyle ?? null,
    stance: a.stance ?? null,
    backbone: a.backbone ?? null,
    sns: a.sns,
    record: a.record ?? Prisma.JsonNull,
    recordNote: a.recordNote ?? null,
    sourceUrl: a.sourceUrl ?? null,
    featured: a.featured ?? false,
  };
}

export async function createAthlete(formData: FormData) {
  const athlete = athleteFromForm(formData);
  await prisma.athlete.create({ data: { id: athlete.id, ...athleteData(athlete) } });
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

export async function updateAthlete(id: string, formData: FormData) {
  const existing = await prisma.athlete.findUnique({ where: { id } });
  if (!existing) redirect("/admin/athletes");
  const athlete = athleteFromForm(formData, {
    ...existing,
    sport: existing.sport as SportSlug,
    organizations: existing.organizations as OrganizationSlug[],
    birthdate: existing.birthdate ?? undefined,
    heightCm: existing.heightCm ?? undefined,
    weightKg: existing.weightKg ?? undefined,
    reachCm: existing.reachCm ?? undefined,
    gymId: existing.gymId ?? undefined,
    gymNote: existing.gymNote ?? undefined,
    bio: existing.bio ?? undefined,
    nickname: existing.nickname ?? undefined,
    signatureMove: existing.signatureMove ?? undefined,
    fightingStyle: existing.fightingStyle ?? undefined,
    stance: existing.stance ?? undefined,
    backbone: existing.backbone ?? undefined,
    sns: (existing.sns as Athlete["sns"]) ?? [],
    record: (existing.record as Athlete["record"]) ?? undefined,
    recordNote: existing.recordNote ?? undefined,
    sourceUrl: existing.sourceUrl ?? undefined,
  });
  await prisma.athlete.update({ where: { id }, data: athleteData(athlete) });
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

export async function deleteAthlete(id: string) {
  // 選手を削除すると、その選手が絡む勝敗予想・ドリームマッチも参照切れになるため一緒に削除する
  await prisma.$transaction([
    prisma.athlete.delete({ where: { id } }),
    prisma.match.deleteMany({ where: { OR: [{ athleteAId: id }, { athleteBId: id }] } }),
    prisma.dreamMatchCard.deleteMany({ where: { OR: [{ athleteAId: id }, { athleteBId: id }] } }),
  ]);
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

function matchFromForm(formData: FormData, existing?: Match): Match {
  const athleteAId = str(formData, "athleteAId");
  const athleteBId = str(formData, "athleteBId");
  const resultWinnerId = str(formData, "resultWinnerId");
  return {
    id: existing?.id ?? newId("match", str(formData, "eventName")),
    sport: str(formData, "sport") as SportSlug,
    organization: str(formData, "organization") as OrganizationSlug,
    eventName: str(formData, "eventName"),
    eventDate: str(formData, "eventDate"),
    venue: str(formData, "venue"),
    athleteAId,
    athleteBId,
    status: str(formData, "status") as Match["status"],
    votesA: optNum(formData, "votesA") ?? existing?.votesA ?? 0,
    votesB: optNum(formData, "votesB") ?? existing?.votesB ?? 0,
    resultWinnerId: resultWinnerId || undefined,
    sourceUrl: optStr(formData, "sourceUrl"),
  };
}

function matchData(m: Match) {
  return {
    sport: m.sport,
    organization: m.organization,
    eventName: m.eventName,
    eventDate: m.eventDate,
    venue: m.venue,
    athleteAId: m.athleteAId,
    athleteBId: m.athleteBId,
    status: m.status,
    votesA: m.votesA,
    votesB: m.votesB,
    resultWinnerId: m.resultWinnerId ?? null,
    sourceUrl: m.sourceUrl ?? null,
  };
}

export async function createMatch(formData: FormData) {
  const match = matchFromForm(formData);
  await prisma.match.create({ data: { id: match.id, ...matchData(match) } });
  revalidatePath("/", "layout");
  redirect("/admin/matches");
}

export async function updateMatch(id: string, formData: FormData) {
  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) redirect("/admin/matches");
  const match = matchFromForm(formData, {
    ...existing,
    sport: existing.sport as SportSlug,
    organization: existing.organization as OrganizationSlug,
    status: existing.status as Match["status"],
    resultWinnerId: existing.resultWinnerId ?? undefined,
    sourceUrl: existing.sourceUrl ?? undefined,
  });
  await prisma.match.update({ where: { id }, data: matchData(match) });
  revalidatePath("/", "layout");
  redirect("/admin/matches");
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/matches");
}

function dreamMatchFromForm(formData: FormData, existing?: DreamMatchCard): DreamMatchCard {
  const athleteAId = str(formData, "athleteAId");
  const athleteBId = str(formData, "athleteBId");
  return {
    id: existing?.id ?? newId("dream", `${athleteAId}-${athleteBId}`),
    sport: str(formData, "sport") as SportSlug,
    organization: str(formData, "organization") as OrganizationSlug,
    athleteAId,
    athleteBId,
    votes: optNum(formData, "votes") ?? existing?.votes ?? 0,
  };
}

export async function createDreamMatch(formData: FormData) {
  const card = dreamMatchFromForm(formData);
  await prisma.dreamMatchCard.create({
    data: {
      id: card.id,
      sport: card.sport,
      organization: card.organization,
      athleteAId: card.athleteAId,
      athleteBId: card.athleteBId,
      votes: card.votes,
    },
  });
  revalidatePath("/", "layout");
  redirect("/admin/dream-matches");
}

export async function updateDreamMatch(id: string, formData: FormData) {
  const existing = await prisma.dreamMatchCard.findUnique({ where: { id } });
  if (!existing) redirect("/admin/dream-matches");
  const card = dreamMatchFromForm(formData, {
    ...existing,
    sport: existing.sport as SportSlug,
    organization: existing.organization as OrganizationSlug,
  });
  await prisma.dreamMatchCard.update({
    where: { id },
    data: {
      sport: card.sport,
      organization: card.organization,
      athleteAId: card.athleteAId,
      athleteBId: card.athleteBId,
      votes: card.votes,
    },
  });
  revalidatePath("/", "layout");
  redirect("/admin/dream-matches");
}

export async function deleteDreamMatch(id: string) {
  await prisma.dreamMatchCard.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/dream-matches");
}

export async function submitTrialApplication(gymId: string, formData: FormData) {
  await prisma.trialApplication.create({
    data: {
      id: newId("apply", str(formData, "name")),
      gymId,
      name: str(formData, "name"),
      phone: optStr(formData, "phone") ?? null,
      email: optStr(formData, "email") ?? null,
      preferredDate: optStr(formData, "preferredDate") ?? null,
      message: optStr(formData, "message") ?? null,
      status: "new",
    },
  });
  revalidatePath("/admin/applications");
  redirect(`/gyms/${gymId}?applied=1`);
}

export async function updateTrialApplicationStatus(id: string, status: TrialApplication["status"]) {
  await prisma.trialApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
}

export async function submitListingRequest(formData: FormData) {
  await prisma.gymListingRequest.create({
    data: {
      id: newId("listing", str(formData, "gymName")),
      gymName: str(formData, "gymName"),
      sports: formData.getAll("sports") as SportSlug[],
      prefecture: str(formData, "prefecture"),
      city: str(formData, "city"),
      address: optStr(formData, "address") ?? null,
      phone: optStr(formData, "phone") ?? null,
      websiteUrl: optStr(formData, "websiteUrl") ?? null,
      description: optStr(formData, "description") ?? null,
      contactName: str(formData, "contactName"),
      contactEmail: str(formData, "contactEmail"),
      status: "new",
    },
  });
  revalidatePath("/admin/listing-requests");
  redirect("/gyms/list-your-gym?submitted=1");
}

export async function updateListingRequestStatus(id: string, status: GymListingRequest["status"]) {
  await prisma.gymListingRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/listing-requests");
}
