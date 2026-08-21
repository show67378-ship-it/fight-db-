import { notFound } from "next/navigation";
import Link from "next/link";
import { athletesBySport, getAthlete, getSport, gymsBySport, matchesBySport } from "@/lib/data";
import { visibleSports } from "@/lib/taxonomy";
import type { SportSlug } from "@/lib/types";
import MatchPreviewCard from "@/components/MatchPreviewCard";
import GymCard from "@/components/GymCard";
import Avatar from "@/components/Avatar";

export function generateStaticParams() {
  return visibleSports.map((s) => ({ sport: s.slug }));
}

export const dynamic = "force-dynamic";

export default async function SportPage({ params }: PageProps<"/[sport]">) {
  const { sport: slug } = await params;
  if (!visibleSports.some((s) => s.slug === slug)) notFound();

  const sport = getSport(slug as SportSlug);
  const sportAthletes = athletesBySport(sport.slug);
  const athleteIds = new Set(sportAthletes.map((a) => a.id));
  const sportMatches = matchesBySport(sport.slug).filter(
    (m) => m.status === "open" && athleteIds.has(m.athleteAId) && athleteIds.has(m.athleteBId)
  );
  const sportGyms = gymsBySport(sport.slug);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Category
          </p>
          <h1 className="font-head mt-3 text-4xl font-bold text-ink">{sport.name}</h1>
          <p className="mt-3 max-w-xl text-ink-dim">
            {sport.name}の勝敗予想・選手情報・ジムをまとめてチェック。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="font-head text-xl font-bold text-ink">勝敗予想</h2>
        {sportMatches.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sportMatches.map((m) => (
              <MatchPreviewCard
                key={m.id}
                match={m}
                athleteA={getAthlete(m.athleteAId)!}
                athleteB={getAthlete(m.athleteBId)!}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-dim">現在受付中の予想はありません。</p>
        )}
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <h2 className="font-head text-xl font-bold text-ink">選手</h2>
            <Link href="/athletes" className="text-xs font-medium text-ink-dim hover:text-ink">
              全選手を見る →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sportAthletes.map((a) => (
              <Link
                key={a.id}
                href={`/athletes/${a.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-accent"
              >
                <Avatar name={a.name} sport={a.sport} size={44} />
                <div className="min-w-0">
                  <p className="font-head truncate text-sm font-semibold text-ink">{a.name}</p>
                  <p className="tabular text-xs text-ink-dim">
                    {a.record ? `${a.record.wins}-${a.record.losses}-${a.record.draws}` : "戦績未確認"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-head text-xl font-bold text-ink">{sport.name}が学べるジム</h2>
          <Link href="/gyms" className="text-xs font-medium text-ink-dim hover:text-ink">
            ジム検索へ →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sportGyms.map((g) => (
            <GymCard key={g.id} gym={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
