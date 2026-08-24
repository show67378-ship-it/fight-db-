// ジムの重複判定(仕様 22)。
// 強い一致(google_place_id / 電話番号 / 公式URL)は高信頼度の自動更新対象、
// 中程度(名称+住所)・弱い一致(名称類似のみ)は duplicate_candidates として登録し、自動統合しない。
import { normalizeGymName, nameSimilarity } from "../normalize/name";
import { normalizePhone } from "../normalize/phone";

export type MatchStrength = "strong" | "medium" | "weak" | "none";

export interface DedupeCandidateGym {
  id: string;
  name: string;
  normalizedName: string | null;
  prefecture: string;
  city: string;
  phone: string | null;
  websiteUrl: string | null;
  googlePlaceId: string | null;
}

export interface DedupeInput {
  name: string;
  prefecture?: string;
  city?: string;
  phone?: string;
  websiteUrl?: string;
  googlePlaceId?: string;
}

export interface DedupeResult {
  match: DedupeCandidateGym | null;
  strength: MatchStrength;
  reasons: string[];
}

const NAME_SIMILARITY_THRESHOLD = 0.82;

export function findBestMatch(
  input: DedupeInput,
  candidates: DedupeCandidateGym[],
): DedupeResult {
  const inputNormalized = normalizeGymName(input.name);
  const inputPhone = normalizePhone(input.phone);

  let best: DedupeResult = { match: null, strength: "none", reasons: [] };

  for (const candidate of candidates) {
    const reasons: string[] = [];
    let strength: MatchStrength = "none";

    if (input.googlePlaceId && input.googlePlaceId === candidate.googlePlaceId) {
      strength = "strong";
      reasons.push("google_place_id_match");
    }

    const candidatePhone = normalizePhone(candidate.phone ?? undefined);
    if (inputPhone && candidatePhone && inputPhone === candidatePhone) {
      strength = "strong";
      reasons.push("phone_match");
    }

    if (
      input.websiteUrl &&
      candidate.websiteUrl &&
      normalizeUrlForCompare(input.websiteUrl) === normalizeUrlForCompare(candidate.websiteUrl)
    ) {
      strength = "strong";
      reasons.push("official_url_match");
    }

    if (strength !== "strong") {
      const candidateNormalized = candidate.normalizedName ?? normalizeGymName(candidate.name);
      const sameName = inputNormalized === candidateNormalized;
      const sameAddress =
        !!input.prefecture &&
        !!input.city &&
        input.prefecture === candidate.prefecture &&
        input.city === candidate.city;

      if (sameName && sameAddress) {
        strength = "medium";
        reasons.push("name_and_address_match");
      } else {
        const similarity = nameSimilarity(inputNormalized, candidateNormalized);
        if (similarity >= NAME_SIMILARITY_THRESHOLD) {
          strength = "weak";
          reasons.push(`name_similar(${similarity.toFixed(2)})`);
        }
      }
    }

    if (strengthRank(strength) > strengthRank(best.strength)) {
      best = { match: candidate, strength, reasons };
    }
  }

  return best;
}

function strengthRank(strength: MatchStrength): number {
  return { none: 0, weak: 1, medium: 2, strong: 3 }[strength];
}

function normalizeUrlForCompare(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.toLowerCase().replace(/^www\./, "")}`;
  } catch {
    return url.toLowerCase();
  }
}
