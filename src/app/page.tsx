import Link from "next/link";
import { getAthlete, getAthletes, getDreamMatches, getGyms, getMatches } from "@/lib/data";
import { activeSports, visibleSports } from "@/lib/taxonomy";
import MatchPreviewCard from "@/components/MatchPreviewCard";
import GymCard from "@/components/GymCard";
import SportTag from "@/components/SportTag";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default function Home() {
  const athletes = getAthletes().filter((a) => activeSports.includes(a.sport));
  const athleteExists = (id: string) => getAthlete(id) !== undefined;
  const openMatches = getMatches()
    .filter(
      (m) =>
        m.status === "open" &&
        activeSports.includes(m.sport) &&
        athleteExists(m.athleteAId) &&
        athleteExists(m.athleteBId)
    )
    .slice(0, 3);
  const topDreamMatches = getDreamMatches()
    .filter(
      (c) => activeSports.includes(c.sport) && athleteExists(c.athleteAId) && athleteExists(c.athleteBId)
    )
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);
  const eligibleGyms = getGyms().filter((g) => g.sports.some((s) => activeSports.includes(s)));
  const featuredGyms = pickFeatured(eligibleGyms);
  const featuredAthletes = pickFeatured(athletes);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <h1 className="font-head max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl">
            観るだけじゃない。<br />予想して、投票して、応援する。
          </h1>
          <p className="mt-5 max-w-xl text-ink-dim">
            MMAの勝敗予想とドリームマッチ投票で楽しむ、参加型の格闘技プラットフォーム。
            <br />
            選手・ジムの情報もまとめて見つかります。
          </p>

          <form
            action="/search"
            method="GET"
            className="mt-8 flex max-w-xl flex-wrap gap-2 rounded-lg border border-accent/40 bg-surface p-2 shadow-lg shadow-black/20"
          >
            <input
              name="q"
              placeholder="選手名・ジム名・地域・団体で検索"
              className="min-w-[200px] flex-1 rounded-sm bg-transparent px-3 py-3 text-base text-ink placeholder:text-ink-dim focus:outline-none"
            />
            <button
              type="submit"
              className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
            >
              検索する
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/matches"
              className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
            >
              勝敗予想に投票する
            </Link>
            <Link
              href="/dream-matches"
              className="font-head rounded-sm border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-accent"
            >
              次に観たい試合に投票する
            </Link>
            <Link
              href="/gyms"
              className="font-head rounded-sm border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-accent"
            >
              格闘技を始めるジムを探す
            </Link>
            <Link
              href="/athletes"
              className="font-head rounded-sm border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-accent"
            >
              選手の魅力を知る
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim">
                対応競技
              </span>
              {visibleSports.map((s) => (
                <Link key={s.slug} href={`/${s.slug}`}>
                  <SportTag sport={s.slug} />
                </Link>
              ))}
            </div>
            <p className="font-head text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              格闘<span className="text-accent">.com</span>
            </p>
          </div>
        </div>
      </section>

      {/* Gyms */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-head text-xs font-semibold uppercase tracking-wide text-accent">Gym</p>
            <h2 className="font-head mt-1 text-2xl font-bold text-ink">注目のジム</h2>
          </div>
          <Link href="/gyms" className="text-xs font-medium text-ink-dim hover:text-ink">
            ジムを探す →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGyms.map((g) => (
            <GymCard key={g.id} gym={g} />
          ))}
        </div>
      </section>

      {/* Predictions */}
      <section id="predictions" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-head text-xs font-semibold uppercase tracking-wide text-accent">Prediction</p>
              <h2 className="font-head mt-1 text-2xl font-bold text-ink">注目の勝敗予想</h2>
            </div>
            <Link href="/matches" className="text-xs font-medium text-ink-dim hover:text-ink">
              すべて見る →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openMatches.map((m) => (
              <MatchPreviewCard
                key={m.id}
                match={m}
                athleteA={getAthlete(m.athleteAId)!}
                athleteB={getAthlete(m.athleteBId)!}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dream match ranking */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-head text-xs font-semibold uppercase tracking-wide text-accent">Dream Match</p>
              <h2 className="font-head mt-1 text-2xl font-bold text-ink">次に観たい試合ランキング</h2>
            </div>
            <Link href="/dream-matches" className="text-xs font-medium text-ink-dim hover:text-ink">
              全ランキングを見る →
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {topDreamMatches.map((card, i) => {
              const a = getAthlete(card.athleteAId)!;
              const b = getAthlete(card.athleteBId)!;
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <span className="font-head w-8 text-2xl font-bold text-accent">{i + 1}</span>
                  <Avatar name={a.name} sport={card.sport} size={40} />
                  <span className="font-head flex-1 text-sm font-medium text-ink">
                    {a.name} <span className="text-ink-dim">vs</span> {b.name}
                  </span>
                  <Avatar name={b.name} sport={card.sport} size={40} />
                  <span className="tabular w-24 text-right text-sm font-semibold text-ink">
                    {card.votes.toLocaleString("ja-JP")}票
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Athletes */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-head text-xs font-semibold uppercase tracking-wide text-accent">Athlete</p>
              <h2 className="font-head mt-1 text-2xl font-bold text-ink">注目の選手</h2>
            </div>
            <Link href="/athletes" className="text-xs font-medium text-ink-dim hover:text-ink">
              選手を探す →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAthletes.map((a) => (
              <Link
                key={a.id}
                href={`/athletes/${a.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-accent"
              >
                <Avatar name={a.name} sport={a.sport} size={52} />
                <div className="min-w-0">
                  <p className="font-head truncate text-base font-semibold text-ink">{a.name}</p>
                  <p className="text-xs text-ink-dim">{a.weightClass}</p>
                  <p className="tabular mt-1 text-xs text-ink-dim">
                    {a.record ? `${a.record.wins}-${a.record.losses}-${a.record.draws}` : "戦績未確認"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-ink-dim">
        選手データ {athletes.length}件を掲載中(開発中のプレビューデータです)
      </p>
    </div>
  );
}

function pickFeatured<T extends { featured?: boolean }>(items: T[], limit = 3): T[] {
  const marked = items.filter((i) => i.featured);
  return (marked.length > 0 ? marked : items).slice(0, limit);
}
