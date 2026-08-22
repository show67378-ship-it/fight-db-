import { notFound } from "next/navigation";
import Link from "next/link";
import { getAthlete, getAthletes, getGym, getMatches } from "@/lib/data";
import Avatar from "@/components/Avatar";
import SportTag from "@/components/SportTag";
import OrgTag from "@/components/OrgTag";
import MatchPreviewCard from "@/components/MatchPreviewCard";
import DreamMatchPicker from "@/components/DreamMatchPicker";

export const dynamic = "force-dynamic";

function age(birthdate: string) {
  const b = new Date(birthdate);
  const now = new Date("2026-08-21");
  let a = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
  return a;
}

export default async function AthleteDetailPage({ params }: PageProps<"/athletes/[id]">) {
  const { id } = await params;
  const athlete = await getAthlete(id);
  if (!athlete) notFound();

  const [gym, allMatches, allAthletes] = await Promise.all([
    athlete.gymId ? getGym(athlete.gymId) : Promise.resolve(undefined),
    getMatches(),
    getAthletes(),
  ]);
  const athleteById = new Map(allAthletes.map((a) => [a.id, a]));
  const athleteMatches = allMatches.filter(
    (m) =>
      (m.athleteAId === athlete.id || m.athleteBId === athlete.id) &&
      athleteById.has(m.athleteAId) &&
      athleteById.has(m.athleteBId)
  );
  const nextMatch = athleteMatches.find((m) => m.status === "open");
  const pastMatches = athleteMatches.filter((m) => m.status === "closed");

  const stats: { label: string; value: string }[] = [];
  if (athlete.record) {
    stats.push({ label: "戦績", value: `${athlete.record.wins}-${athlete.record.losses}-${athlete.record.draws}` });
  }
  if (athlete.birthdate) stats.push({ label: "年齢", value: `${age(athlete.birthdate)}歳` });
  if (athlete.heightCm) stats.push({ label: "身長", value: `${athlete.heightCm}cm` });
  if (athlete.weightKg) stats.push({ label: "体重", value: `${athlete.weightKg}kg` });
  if (athlete.reachCm) stats.push({ label: "リーチ", value: `${athlete.reachCm}cm` });
  if (athlete.fightingStyle) stats.push({ label: "スタイル", value: athlete.fightingStyle });
  if (athlete.signatureMove) stats.push({ label: "得意技", value: athlete.signatureMove });
  if (athlete.stance) stats.push({ label: "構え", value: athlete.stance });
  if (athlete.backbone) stats.push({ label: "バックボーン", value: athlete.backbone });

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex flex-wrap items-start gap-6">
        <Avatar name={athlete.name} sport={athlete.sport} size={96} />
        <div>
          <div className="flex flex-wrap gap-1.5">
            {athlete.organizations.map((o) => (
              <OrgTag key={o} organization={o} />
            ))}
            <SportTag sport={athlete.sport} />
          </div>
          {athlete.nickname && (
            <p className="font-head mt-2 text-xl font-bold uppercase tracking-wide text-accent sm:text-2xl">
              「{athlete.nickname}」
            </p>
          )}
          <h1 className="font-head mt-1 text-3xl font-bold text-ink">{athlete.name}</h1>
          <p className="text-sm text-ink-dim">{athlete.nameKana}</p>
          <p className="mt-2 text-sm text-ink-dim">
            {athlete.weightClass} ・ {athlete.nationality}
            {gym && (
              <>
                {" "}
                ・{" "}
                <Link href={`/gyms/${gym.id}`} className="text-accent hover:underline">
                  {gym.name}
                </Link>
              </>
            )}
            {!gym && athlete.gymNote && <> ・ {athlete.gymNote}</>}
          </p>
        </div>
      </div>

      {athlete.bio && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-dim">{athlete.bio}</p>}

      {stats.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}

      {athlete.recordNote && <p className="mt-3 text-xs text-ink-dim">※ {athlete.recordNote}</p>}

      {athlete.sns.length > 0 && (
        <div className="mt-4 flex gap-3 text-xs text-ink-dim">
          {athlete.sns.map((s) => (
            <span key={s.handle}>
              {s.platform}: {s.handle}
            </span>
          ))}
        </div>
      )}

      {nextMatch && (
        <div className="mt-10">
          <h2 className="font-head text-lg font-bold text-ink">次戦・勝敗予想</h2>
          <div className="mt-3 max-w-md">
            <MatchPreviewCard
              match={nextMatch}
              athleteA={athleteById.get(nextMatch.athleteAId)!}
              athleteB={athleteById.get(nextMatch.athleteBId)!}
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <DreamMatchPicker athlete={athlete} allAthletes={allAthletes} />
      </div>

      {pastMatches.length > 0 && (
        <div className="mt-10">
          <h2 className="font-head text-lg font-bold text-ink">過去の試合</h2>
          <div className="mt-3 space-y-2">
            {pastMatches.map((m) => {
              const opponent = athleteById.get(m.athleteAId === athlete.id ? m.athleteBId : m.athleteAId)!;
              const won = m.resultWinnerId === athlete.id;
              return (
                <Link
                  key={m.id}
                  href={`/matches/${m.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent"
                >
                  <span className="text-sm text-ink">
                    vs {opponent.name} <span className="text-ink-dim">・ {m.eventName}</span>
                  </span>
                  <span className={`font-head text-xs font-semibold uppercase ${won ? "text-good" : "text-ink-dim"}`}>
                    {won ? "WIN" : "LOSE"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {athlete.sourceUrl && (
        <p className="mt-10 text-xs text-ink-dim">
          出典:{" "}
          <a href={athlete.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            {athlete.sourceUrl}
          </a>
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3 text-center">
      <p className="font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim">{label}</p>
      <p className="tabular mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
