import { getAthletes, getDreamMatches, getVisibleCommentsByType } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import DreamMatchesBrowser from "@/components/DreamMatchesBrowser";
import type { Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DreamMatchesPage({ searchParams }: PageProps<"/dream-matches">) {
  const { comment } = await searchParams;
  const [allAthletes, allDreamMatches, dreamMatchComments] = await Promise.all([
    getAthletes(),
    getDreamMatches(),
    getVisibleCommentsByType("dreamMatch"),
  ]);
  const athletes = allAthletes.filter((a) => activeSports.includes(a.sport));
  const athleteIds = new Set(athletes.map((a) => a.id));
  const dreamMatches = allDreamMatches.filter(
    (c) => activeSports.includes(c.sport) && athleteIds.has(c.athleteAId) && athleteIds.has(c.athleteBId)
  );

  const commentsByCard: Record<string, Comment[]> = {};
  for (const c of dreamMatchComments) {
    (commentsByCard[c.targetId] ??= []).push(c);
  }

  return (
    <DreamMatchesBrowser
      athletes={athletes}
      dreamMatches={dreamMatches}
      commentsByCard={commentsByCard}
      commentStatus={Array.isArray(comment) ? comment[0] : comment}
    />
  );
}
