export type SportSlug = "mma" | "bjj" | "kickboxing" | "boxing";

export interface Sport {
  slug: SportSlug;
  name: string;
  shortName: string;
  accent: string;
}

export type OrganizationSlug =
  | "ufc"
  | "rizin"
  | "breakingdown"
  | "deep"
  | "pancrase"
  | "shooto"
  | "rise"
  | "k1"
  | "jbc"
  | "wba"
  | "wbo"
  | "wbc"
  | "ibf";

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
  nameKana?: string;
  sports: SportSlug[];
  // 複数競技を教えるジムの主要ジャンル(表示順の並び替えに使用)。未設定はundefined。
  primarySport?: SportSlug;
  // 全体順位: 競技を問わず最優先で並べたい場合の手動指定。未設定はundefined(自動順)。
  priorityRank?: number;
  // ジャンル内順位の手動調整(小さいほど先に表示)。未設定はundefined(自動順)。
  displayOrder?: number;
  // 名門度(自動算出): 所属選手数・実績等から算出。高いほど上位表示。
  prestigeScore?: number;
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
  featured?: boolean;
  // trueの場合、クロールによる自動更新の対象外(管理画面での手動編集は可能)
  verified?: boolean;
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
  reachCm?: number;
  weightClass: string;
  nationality: string;
  gymId?: string;
  gymNote?: string;
  // 全体順位の手動調整(小さいほど先に表示)。未設定はundefined(自動順)。
  displayOrder?: number;
  // 所属団体(表示順の並び替えに使用)。取得元から自動判定、または手動設定。未設定はundefined。
  primaryOrganization?: OrganizationSlug;
  // 活躍度(自動算出): 戦績・注目選手指定等から算出。高いほど上位表示。
  prominenceScore?: number;
  bio?: string;
  nickname?: string;
  signatureMove?: string;
  fightingStyle?: string;
  stance?: string;
  backbone?: string;
  sns: { platform: string; handle: string }[];
  record?: { wins: number; losses: number; draws: number };
  recordNote?: string;
  sourceUrl?: string;
  featured?: boolean;
  // trueの場合、クロールによる自動更新の対象外(戦績・戦績補足は対象外にならず更新される。管理画面での手動編集は常に可能)
  verified?: boolean;
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

export type EditRequestTargetType = "gym" | "athlete";
export type EditRequestStatus = "new" | "reviewing" | "applied" | "rejected";

export interface EditRequest {
  id: string;
  targetType: EditRequestTargetType;
  targetId: string;
  targetName: string;
  content: string;
  contactName?: string;
  contactEmail?: string;
  status: EditRequestStatus;
  createdAt: string;
}

export type CommentTargetType = "match" | "dreamMatch";
export type CommentStatus = "visible" | "removed";

export interface Comment {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  authorName?: string;
  body: string;
  status: CommentStatus;
  removedReason?: string;
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
