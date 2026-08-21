export type SportSlug = "mma" | "bjj" | "kickboxing" | "boxing";

export interface Sport {
  slug: SportSlug;
  name: string;
  shortName: string;
  accent: string;
}

export type OrganizationSlug = "rizin" | "breakingdown";

export interface Organization {
  slug: OrganizationSlug;
  name: string;
}

export interface GymInstructor {
  name: string;
  title?: string;
}

export interface Gym {
  id: string;
  name: string;
  sports: SportSlug[];
  prefecture: string;
  city: string;
  address?: string;
  phone?: string;
  contactEmail?: string;
  trialInfo: string;
  photo: string;
  planTier: "free" | "standard" | "premium";
  description: string;
  instructors?: GymInstructor[];
  websiteUrl?: string;
}

export interface Athlete {
  id: string;
  name: string;
  nameKana: string;
  sport: SportSlug;
  organizations: OrganizationSlug[];
  photo: string;
  birthdate?: string;
  heightCm?: number;
  weightKg?: number;
  weightClass: string;
  nationality: string;
  gymId?: string;
  gymNote?: string;
  bio?: string;
  nickname?: string;
  signatureMove?: string;
  fightingStyle?: string;
  sns: { platform: string; handle: string }[];
  record?: { wins: number; losses: number; draws: number };
  recordNote?: string;
  sourceUrl?: string;
}

export type PredictionStatus = "open" | "closed";

export interface Match {
  id: string;
  sport: SportSlug;
  organization: OrganizationSlug;
  eventName: string;
  eventDate: string;
  venue: string;
  athleteAId: string;
  athleteBId: string;
  status: PredictionStatus;
  votesA: number;
  votesB: number;
  resultWinnerId?: string;
  sourceUrl?: string;
}

export interface DreamMatchCard {
  id: string;
  sport: SportSlug;
  organization: OrganizationSlug;
  athleteAId: string;
  athleteBId: string;
  votes: number;
}

export type TrialApplicationStatus = "new" | "contacted" | "done";

export interface TrialApplication {
  id: string;
  gymId: string;
  name: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  message?: string;
  status: TrialApplicationStatus;
  createdAt: string;
}

export type GymListingRequestStatus = "new" | "reviewing" | "added" | "rejected";

export interface GymListingRequest {
  id: string;
  gymName: string;
  sports: SportSlug[];
  prefecture: string;
  city: string;
  address?: string;
  phone?: string;
  websiteUrl?: string;
  description?: string;
  contactName: string;
  contactEmail: string;
  status: GymListingRequestStatus;
  createdAt: string;
}
