import Link from "next/link";
import { getAthletes } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminAthletesPage() {
  const athletes = getAthletes();

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

      <div className="mt-6 space-y-2">
        {athletes.map((a) => (
          <Link
            key={a.id}
            href={`/admin/athletes/${a.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent"
          >
            <div>
              <p className="font-head text-sm font-semibold text-ink">{a.name}</p>
              <p className="text-xs text-ink-dim">
                {a.weightClass} ・ {a.organizations.join(", ") || "所属団体なし"}
              </p>
            </div>
            <span className="font-head text-xs uppercase text-ink-dim">編集 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
