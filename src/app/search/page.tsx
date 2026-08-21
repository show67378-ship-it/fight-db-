import Link from "next/link";
import { getAthletes, getGym, getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import GymCard from "@/components/GymCard";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "検索 | 格闘.com",
};

function matchesAthlete(a: ReturnType<typeof getAthletes>[number], q: string): boolean {
  return [a.name, a.nameKana, a.nickname, a.weightClass, a.gymNote, a.bio, a.backbone, a.fightingStyle, a.stance]
    .filter((v): v is string => Boolean(v))
    .some((v) => v.includes(q));
}

function matchesGym(g: ReturnType<typeof getGyms>[number], q: string): boolean {
  return [g.name, g.prefecture, g.city, g.address, g.description]
    .filter((v): v is string => Boolean(v))
    .some((v) => v.includes(q));
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";

  const athletes = q ? getAthletes().filter((a) => activeSports.includes(a.sport) && matchesAthlete(a, q)) : [];
  const gyms = q ? getGyms().filter((g) => activeSports.some((s) => g.sports.includes(s)) && matchesGym(g, q)) : [];
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
                    {a.gymId && ` ・ ${getGym(a.gymId)?.name ?? ""}`}
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
