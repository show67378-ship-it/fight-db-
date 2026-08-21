import { getAthletes, getDreamMatches } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import DreamMatchesBrowser from "@/components/DreamMatchesBrowser";

export const dynamic = "force-dynamic";

export default function DreamMatchesPage() {
  const athletes = getAthletes().filter((a) => activeSports.includes(a.sport));
  const dreamMatches = getDreamMatches().filter((c) => activeSports.includes(c.sport));
  return <DreamMatchesBrowser athletes={athletes} dreamMatches={dreamMatches} />;
}
