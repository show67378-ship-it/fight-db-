import Link from "next/link";
import { getAthletes, getDreamMatches } from "@/lib/data";
import { organizations } from "@/lib/taxonomy";
import type { DreamMatchCard } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function AdminDreamMatchesPage() {
  const cards = getDreamMatches();
  const athletes = getAthletes();
  const getAthleteName = (id: string) => athletes.find((a) => a.id === id)?.name ?? "(削除済みの選手)";

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="font-head mt-3 text-3xl font-bold text-ink">次に観たい試合管理</h1>
        </div>
        <Link
          href="/admin/dream-matches/new"
          className="font-head rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          + 新規追加
        </Link>
      </div>

      {organizations.map((org) => {
        const orgCards = cards.filter((c) => c.organization === org.slug);
        return (
          <section key={org.slug} className="mt-8">
            <h2 className="font-head text-sm font-semibold uppercase tracking-wide text-ink-dim">
              {org.name}({orgCards.length}件)
            </h2>
            <div className="mt-3 space-y-2">
              {orgCards.map((c) => (
                <CardRow key={c.id} card={c} getAthleteName={getAthleteName} />
              ))}
              {orgCards.length === 0 && <p className="text-sm text-ink-dim">該当カードなし</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CardRow({
  card,
  getAthleteName,
}: {
  card: DreamMatchCard;
  getAthleteName: (id: string) => string;
}) {
  return (
    <Link
      href={`/admin/dream-matches/${card.id}`}
      className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent"
    >
      <div>
        <p className="font-head text-sm font-semibold text-ink">
          {getAthleteName(card.athleteAId)} vs {getAthleteName(card.athleteBId)}
        </p>
        <p className="tabular text-xs text-ink-dim">{card.votes}票</p>
      </div>
      <span className="font-head text-xs uppercase text-ink-dim">編集 →</span>
    </Link>
  );
}
