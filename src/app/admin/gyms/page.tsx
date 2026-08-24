import Link from "next/link";
import { getGyms } from "@/lib/data";
import { matchesQuery } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function AdminGymsPage({ searchParams }: PageProps<"/admin/gyms">) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim() ?? "";
  const allGyms = await getGyms();
  const gyms = q ? allGyms.filter((g) => matchesQuery(q, g.name, g.nameKana, g.prefecture, g.city)) : allGyms;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジム管理</h1>
        </div>
        <Link
          href="/admin/gyms/new"
          className="font-head rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          + 新規追加
        </Link>
      </div>

      <form action="/admin/gyms" method="GET" className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="ジム名・都道府県・市区町村で検索"
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
            href="/admin/gyms"
            className="font-head flex items-center rounded-sm border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-dim transition hover:text-ink"
          >
            クリア
          </Link>
        )}
      </form>
      <p className="tabular mt-3 text-xs text-ink-dim">
        {gyms.length}件{q && ` / 全${allGyms.length}件`}
      </p>

      <div className="mt-3 space-y-2">
        {gyms.map((g) => (
          <Link
            key={g.id}
            href={`/admin/gyms/${g.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent"
          >
            <div>
              <p className="font-head flex items-center gap-2 text-sm font-semibold text-ink">
                {g.name}
                {g.verified && (
                  <span className="rounded-sm border border-good/40 bg-good-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-good">
                    確認済み
                  </span>
                )}
              </p>
              <p className="text-xs text-ink-dim">
                {g.prefecture}
                {g.city} ・ {g.sports.join(", ")}
              </p>
            </div>
            <span className="font-head text-xs uppercase text-ink-dim">編集 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
