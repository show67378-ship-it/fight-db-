import { getAthletes, getDreamMatches } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import DreamMatchesBrowser from "@/components/DreamMatchesBrowser";

export const dynamic = "force-dynamic";

export default async function DreamMatchesPage() {
  const [allAthletes, allDreamMatches] = await Promise.all([getAthletes(), getDreamMatches()]);
  const athletes = allAthletes.filter((a) => activeSports.includes(a.sport));
  const athleteIds = new Set(athletes.map((a) => a.id));
  const dreamMatches = allDreamMatches.filter(
    (c) => activeSports.includes(c.sport) && athleteIds.has(c.athleteAId) && athleteIds.has(c.athleteBId)
  );
  return <DreamMatchesBrowser athletes={athletes} dreamMatches={dreamMatches} />;
}
