import Link from "next/link";
import { getAthletes } from "@/lib/data";
import { organizations } from "@/lib/taxonomy";
import type { Athlete } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminAthletesPage({ searchParams }: PageProps<"/admin/athletes">) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";
  const allAthletes = getAthletes();
  const athletes = q
    ? allAthletes.filter((a) =>
        [a.name, a.nameKana, a.nickname, a.weightClass].filter((v): v is string => Boolean(v)).some((v) => v.includes(q))
      )
    : allAthletes;
  const unaffiliated = athletes.filter((a) => a.organizations.length === 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="font-head mt-3 text-3xl font-bold text-ink">選手管理</h1>
        </div>
        <Link
          href="/admin/athletes/new"
          className="font-head rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          + 新規追加
        </Link>
      </div>

      <form action="/admin/athletes" method="GET" className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="選手名・よみがな・異名・階級で検索"
          className="min-w-[240px] flex-1 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="font-head rounded-sm border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition hover:border-accent"
        >
          検索
        </button>
        {q && (
          <Link
            href="/admin/athletes"
            className="font-head flex items-center rounded-sm border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-dim transition hover:text-ink"
          >
            クリア
          </Link>
        )}
      </form>
      {q && (
        <p className="tabular mt-3 text-xs text-ink-dim">
          {athletes.length}件 / 全{allAthletes.length}件
        </p>
      )}

      {organizations.map((org) => {
        const orgAthletes = athletes.filter((a) => a.organizations.includes(org.slug));
        return (
          <section key={org.slug} className="mt-8">
            <h2 className="font-head text-sm font-semibold uppercase tracking-wide text-ink-dim">
              {org.name}({orgAthletes.length}名)
            </h2>
            <div className="mt-3 space-y-2">
              {orgAthletes.map((a) => (
                <AthleteRow key={a.id} athlete={a} />
              ))}
              {orgAthletes.length === 0 && <p className="text-sm text-ink-dim">該当選手なし</p>}
            </div>
          </section>
        );
      })}

      {unaffiliated.length > 0 && (
        <section className="mt-8">
          <h2 className="font-head text-sm font-semibold uppercase tracking-wide text-ink-dim">
            所属団体なし({unaffiliated.length}名)
          </h2>
          <div className="mt-3 space-y-2">
            {unaffiliated.map((a) => (
              <AthleteRow key={a.id} athlete={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AthleteRow({ athlete: a }: { athlete: Athlete }) {
  return (
    <Link
      href={`/admin/athletes/${a.id}`}
      className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent"
    >
      <div>
        <p className="font-head text-sm font-semibold text-ink">{a.name}</p>
        <p className="text-xs text-ink-dim">{a.weightClass}</p>
      </div>
      <span className="font-head text-xs uppercase text-ink-dim">編集 →</span>
    </Link>
  );
}
