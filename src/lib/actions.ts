"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readJson, writeJson } from "./store";
import type {
  Athlete,
  Gym,
  GymInstructor,
  GymListingRequest,
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
  };
}

export async function createGym(formData: FormData) {
  const gyms = readJson<Gym[]>("gyms.json");
  gyms.push(gymFromForm(formData));
  writeJson("gyms.json", gyms);
  revalidatePath("/", "layout");
  redirect("/admin/gyms");
}

export async function updateGym(id: string, formData: FormData) {
  const gyms = readJson<Gym[]>("gyms.json");
  const idx = gyms.findIndex((g) => g.id === id);
  if (idx === -1) redirect("/admin/gyms");
  gyms[idx] = gymFromForm(formData, gyms[idx]);
  writeJson("gyms.json", gyms);
  revalidatePath("/", "layout");
  redirect("/admin/gyms");
}

export async function deleteGym(id: string) {
  const gyms = readJson<Gym[]>("gyms.json");
  writeJson(
    "gyms.json",
    gyms.filter((g) => g.id !== id)
  );
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
    weightClass: str(formData, "weightClass"),
    nationality: str(formData, "nationality"),
    gymId: optStr(formData, "gymId"),
    gymNote: optStr(formData, "gymNote"),
    bio: optStr(formData, "bio"),
    nickname: optStr(formData, "nickname"),
    signatureMove: optStr(formData, "signatureMove"),
    fightingStyle: optStr(formData, "fightingStyle"),
    sns,
    record,
    recordNote: optStr(formData, "recordNote"),
    sourceUrl: optStr(formData, "sourceUrl"),
  };
}

export async function createAthlete(formData: FormData) {
  const athletes = readJson<Athlete[]>("athletes.json");
  athletes.push(athleteFromForm(formData));
  writeJson("athletes.json", athletes);
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

export async function updateAthlete(id: string, formData: FormData) {
  const athletes = readJson<Athlete[]>("athletes.json");
  const idx = athletes.findIndex((a) => a.id === id);
  if (idx === -1) redirect("/admin/athletes");
  athletes[idx] = athleteFromForm(formData, athletes[idx]);
  writeJson("athletes.json", athletes);
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

export async function deleteAthlete(id: string) {
  const athletes = readJson<Athlete[]>("athletes.json");
  writeJson(
    "athletes.json",
    athletes.filter((a) => a.id !== id)
  );
  revalidatePath("/", "layout");
  redirect("/admin/athletes");
}

export async function submitTrialApplication(gymId: string, formData: FormData) {
  const applications = readJson<TrialApplication[]>("trial-applications.json");
  applications.unshift({
    id: newId("apply", str(formData, "name")),
    gymId,
    name: str(formData, "name"),
    phone: optStr(formData, "phone"),
    email: optStr(formData, "email"),
    preferredDate: optStr(formData, "preferredDate"),
    message: optStr(formData, "message"),
    status: "new",
    createdAt: new Date().toISOString(),
  });
  writeJson("trial-applications.json", applications);
  revalidatePath("/admin/applications");
  redirect(`/gyms/${gymId}?applied=1`);
}

export async function updateTrialApplicationStatus(id: string, status: TrialApplication["status"]) {
  const applications = readJson<TrialApplication[]>("trial-applications.json");
  const idx = applications.findIndex((a) => a.id === id);
  if (idx !== -1) {
    applications[idx].status = status;
    writeJson("trial-applications.json", applications);
  }
  revalidatePath("/admin/applications");
}

export async function submitListingRequest(formData: FormData) {
  const requests = readJson<GymListingRequest[]>("listing-requests.json");
  requests.unshift({
    id: newId("listing", str(formData, "gymName")),
    gymName: str(formData, "gymName"),
    sports: formData.getAll("sports") as SportSlug[],
    prefecture: str(formData, "prefecture"),
    city: str(formData, "city"),
    address: optStr(formData, "address"),
    phone: optStr(formData, "phone"),
    websiteUrl: optStr(formData, "websiteUrl"),
    description: optStr(formData, "description"),
    contactName: str(formData, "contactName"),
    contactEmail: str(formData, "contactEmail"),
    status: "new",
    createdAt: new Date().toISOString(),
  });
  writeJson("listing-requests.json", requests);
  revalidatePath("/admin/listing-requests");
  redirect("/gyms/list-your-gym?submitted=1");
}

export async function updateListingRequestStatus(id: string, status: GymListingRequest["status"]) {
  const requests = readJson<GymListingRequest[]>("listing-requests.json");
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx].status = status;
    writeJson("listing-requests.json", requests);
  }
  revalidatePath("/admin/listing-requests");
}
