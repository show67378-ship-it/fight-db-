import { notFound } from "next/navigation";
import { getAthlete, getMatch } from "@/lib/data";
import PredictionWidget from "@/components/PredictionWidget";
import SportTag from "@/components/SportTag";
import OrgTag from "@/components/OrgTag";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({ params }: PageProps<"/matches/[id]">) {
  const { id } = await params;
  const match = await getMatch(id);
  if (!match) notFound();

  const athleteA = await getAthlete(match.athleteAId);
  const athleteB = await getAthlete(match.athleteBId);
  if (!athleteA || !athleteB) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex gap-1.5">
        <OrgTag organization={match.organization} />
        <SportTag sport={match.sport} />
      </div>
      <h1 className="font-head mt-3 text-2xl font-bold text-ink">{match.eventName}</h1>
      <p className="mt-1 text-sm text-ink-dim">
        {match.eventDate} ・ {match.venue}
      </p>

      <div className="mt-6">
        <PredictionWidget match={match} athleteA={athleteA} athleteB={athleteB} />
      </div>
    </div>
  );
}
