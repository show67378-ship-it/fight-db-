import type {
  Athlete,
  DreamMatchCard,
  Gym,
  GymListingRequest,
  Match,
  OrganizationSlug,
  SportSlug,
  TrialApplication,
} from "./types";
import { readJson } from "./store";

export { sports, organizations, getSport, getOrganization } from "./taxonomy";

// ジム・選手・試合・ドリームマッチのデータは src/data/*.json に保存されており、
// 管理画面(/admin)から編集できます。実在情報には各項目に出典URLを付与しています。
// このファイルはNode専用のfsを使うため、クライアントコンポーネントから直接importしないでください
// (競技・団体の一覧だけが必要な場合は "@/lib/taxonomy" を使ってください)。

export function getGyms(): Gym[] {
  return readJson<Gym[]>("gyms.json");
}

export function getAthletes(): Athlete[] {
  return readJson<Athlete[]>("athletes.json");
}

export function getMatches(): Match[] {
  return readJson<Match[]>("matches.json");
}

export function getDreamMatches(): DreamMatchCard[] {
  return readJson<DreamMatchCard[]>("dream-matches.json");
}

export function getTrialApplications(): TrialApplication[] {
  return readJson<TrialApplication[]>("trial-applications.json");
}

export function getListingRequests(): GymListingRequest[] {
  return readJson<GymListingRequest[]>("listing-requests.json");
}

export function getAthlete(id: string): Athlete | undefined {
  return getAthletes().find((a) => a.id === id);
}

export function getGym(id: string): Gym | undefined {
  return getGyms().find((g) => g.id === id);
}

export function getMatch(id: string): Match | undefined {
  return getMatches().find((m) => m.id === id);
}

export function gymsBySport(sport: SportSlug): Gym[] {
  return getGyms().filter((g) => g.sports.includes(sport));
}

export function athletesBySport(sport: SportSlug): Athlete[] {
  return getAthletes().filter((a) => a.sport === sport);
}

export function matchesBySport(sport: SportSlug): Match[] {
  return getMatches().filter((m) => m.sport === sport);
}

export function matchesByOrganization(organization: OrganizationSlug): Match[] {
  return getMatches().filter((m) => m.organization === organization);
}

export function athletesByOrganization(organization: OrganizationSlug): Athlete[] {
  return getAthletes().filter((a) => a.organizations.includes(organization));
}
