import { notFound } from "next/navigation";
import Link from "next/link";
import { athletesBySport, getAthlete, getDreamMatches, getSport, gymsBySport, matchesBySport } from "@/lib/data";
import { visibleSports } from "@/lib/taxonomy";
import type { SportSlug } from "@/lib/types";
import MatchPreviewCard from "@/components/MatchPreviewCard";
import GymCard from "@/components/GymCard";
import Avatar from "@/components/Avatar";

export function generateStaticParams() {
  return visibleSports.map((s) => ({ sport: s.slug }));
}

export const dynamic = "force-dynamic";

function pickFeatured<T extends { featured?: boolean }>(items: T[], limit = 3): T[] {
  const marked = items.filter((i) => i.featured);
  return (marked.length > 0 ? marked : items).slice(0, limit);
}

export default async function SportPage({ params }: PageProps<"/[sport]">) {
  const { sport: slug } = await params;
  if (!visibleSports.some((s) => s.slug === slug)) notFound();

  const sport = getSport(slug as SportSlug);
  const sportAthletes = athletesBySport(sport.slug);
  const athleteIds = new Set(sportAthletes.map((a) => a.id));
  const sportMatches = matchesBySport(sport.slug).filter(
    (m) => m.status === "open" && athleteIds.has(m.athleteAId) && athleteIds.has(m.athleteBId)
  );
  const sportDreamMatches = getDreamMatches()
    .filter((c) => c.sport === sport.slug && athleteIds.has(c.athleteAId) && athleteIds.has(c.athleteBId))
    .sort((a, b) => b.votes - a.votes);
  const sportGyms = gymsBySport(sport.slug);

  const featuredGyms = pickFeatured(sportGyms);
  const featuredAthletes = pickFeatured(sportAthletes);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Category
          </p>
          <h1 className="font-head mt-3 text-4xl font-bold text-ink">{sport.name}</h1>
          <p className="mt-3 max-w-xl text-ink-dim">
            {sport.name}のジム・勝敗予想・次に観たい試合・選手情報をまとめてチェック。
          </p>
        </div>
      </section>

      {/* ジム情報 */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-head text-xl font-bold text-ink">{sport.name}が学べるジム</h2>
          <Link href="/gyms" className="text-xs font-medium text-ink-dim hover:text-ink">
            すべてのジムを見る →
          </Link>
        </div>
        {featuredGyms.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredGyms.map((g) => (
              <GymCard key={g.id} gym={g} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-dim">現在掲載中のジムはありません。</p>
        )}
      </section>

      {/* 勝敗予想 */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <h2 className="font-head text-xl font-bold text-ink">勝敗予想</h2>
            <Link href="/matches" className="text-xs font-medium text-ink-dim hover:text-ink">
              すべての勝敗予想を見る →
            </Link>
          </div>
          {sportMatches.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sportMatches.slice(0, 3).map((m) => (
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
        </div>
      </section>

      {/* 次に観たい試合 */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-head text-xl font-bold text-ink">次に観たい試合</h2>
          <Link href="/dream-matches" className="text-xs font-medium text-ink-dim hover:text-ink">
            すべての次に観たい試合を見る →
          </Link>
        </div>
        {sportDreamMatches.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sportDreamMatches.slice(0, 3).map((card) => {
              const a = getAthlete(card.athleteAId)!;
              const b = getAthlete(card.athleteBId)!;
              return (
                <div key={card.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                  <Avatar name={a.name} sport={card.sport} size={36} />
                  <span className="font-head flex-1 truncate text-sm font-medium text-ink">
                    {a.name} <span className="text-ink-dim">vs</span> {b.name}
                  </span>
                  <Avatar name={b.name} sport={card.sport} size={36} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-dim">現在対戦カードはありません。</p>
        )}
      </section>

      {/* 選手情報 */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <h2 className="font-head text-xl font-bold text-ink">選手</h2>
            <Link href="/athletes" className="text-xs font-medium text-ink-dim hover:text-ink">
              すべての選手を見る →
            </Link>
          </div>
          {featuredAthletes.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAthletes.map((a) => (
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
          ) : (
            <p className="mt-4 text-sm text-ink-dim">現在掲載中の選手はいません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
