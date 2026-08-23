import { notFound } from "next/navigation";
import { getAthlete, getMatch } from "@/lib/data";
import { idCandidates } from "@/lib/resolveParamId";
import PredictionWidget from "@/components/PredictionWidget";
import SportTag from "@/components/SportTag";
import OrgTag from "@/components/OrgTag";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({ params }: PageProps<"/matches/[id]">) {
  const { id } = await params;
  // 動的セグメントがURLエンコードされたまま渡るか、デコード済みで渡るかは環境によって
  // 異なるため、日本語id等は両方のパターンで検索する(idCandidates参照)。
  let match: Awaited<ReturnType<typeof getMatch>>;
  for (const candidate of idCandidates(id)) {
    match = await getMatch(candidate);
    if (match) break;
  }
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
