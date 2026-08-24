import Link from "next/link";
import { getAthletes, getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import type { Athlete, Gym } from "@/lib/types";
import { matchesQuery } from "@/lib/search";
import GymCard from "@/components/GymCard";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "検索 | 格闘.com",
};

function matchesAthlete(a: Athlete, q: string): boolean {
  // 選手名(氏名・よみがな・異名)のみで判定する。経歴文などに他選手の名前が
  // 言及されているだけで無関係な選手がヒットしてしまうのを防ぐため。
  return matchesQuery(q, a.name, a.nameKana, a.nickname);
}

function matchesGym(g: Gym, q: string): boolean {
  return matchesQuery(q, g.name, g.nameKana, g.prefecture, g.city, g.address, g.description);
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

  const [allAthletes, allGyms] = await Promise.all([getAthletes(), getGyms()]);
  const gymById = new Map(allGyms.map((g) => [g.id, g]));
  const athletes = q ? allAthletes.filter((a) => activeSports.includes(a.sport) && matchesAthlete(a, q)) : [];
  const gyms = q ? allGyms.filter((g) => activeSports.some((s) => g.sports.includes(s)) && matchesGym(g, q)) : [];
  const hasResults = athletes.length > 0 || gyms.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Search</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">検索結果</h1>

      <form action="/search" method="GET" className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="選手名・ジム名・地域・団体などで検索"
          className="min-w-[240px] flex-1 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="font-head rounded-sm bg-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          検索
        </button>
      </form>

      {!q && <p className="mt-8 text-sm text-ink-dim">キーワードを入力して選手・ジムを検索してください。</p>}

      {q && !hasResults && (
        <p className="mt-8 text-sm text-ink-dim">「{q}」に一致する選手・ジムは見つかりませんでした。</p>
      )}

      {athletes.length > 0 && (
        <section className="mt-10">
          <h2 className="font-head text-lg font-bold text-ink">選手({athletes.length}件)</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((a) => (
              <Link
                key={a.id}
                href={`/athletes/${a.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-accent"
              >
                <Avatar name={a.name} sport={a.sport} size={52} />
                <div className="min-w-0">
                  <p className="font-head truncate text-base font-semibold text-ink">{a.name}</p>
                  <p className="text-xs text-ink-dim">
                    {a.weightClass}
                    {a.gymId && ` ・ ${gymById.get(a.gymId)?.name ?? ""}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {gyms.length > 0 && (
        <section className="mt-10">
          <h2 className="font-head text-lg font-bold text-ink">ジム({gyms.length}件)</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gyms.map((g) => (
              <GymCard key={g.id} gym={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
