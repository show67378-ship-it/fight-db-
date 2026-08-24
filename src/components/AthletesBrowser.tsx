"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { organizations, visibleSports } from "@/lib/taxonomy";
import type { Athlete, Gym, OrganizationSlug, SportSlug } from "@/lib/types";
import { matchesQuery } from "@/lib/search";
import Avatar from "@/components/Avatar";
import SportTag from "@/components/SportTag";
import OrgTag from "@/components/OrgTag";

export default function AthletesBrowser({ athletes, gyms }: { athletes: Athlete[]; gyms: Gym[] }) {
  const [sportFilter, setSportFilter] = useState<SportSlug | "all">("all");
  const [orgFilter, setOrgFilter] = useState<OrganizationSlug | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return athletes.filter((a) => {
      const sportOk = sportFilter === "all" || a.sport === sportFilter;
      const orgOk = orgFilter === "all" || a.organizations.includes(orgFilter);
      const queryOk = matchesQuery(query, a.name, a.nameKana, a.nickname);
      return sportOk && orgOk && queryOk;
    });
  }, [athletes, sportFilter, orgFilter, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Athletes</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">選手一覧</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="選手名・よみがな・異名で検索"
        className="mt-6 w-full rounded-sm border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
      />

      <div className="mt-4 space-y-3">
        <div>
          <p className="font-head mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-dim">競技</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSportFilter("all")}
              className={`font-head rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                sportFilter === "all"
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border bg-surface text-ink-dim hover:text-ink"
              }`}
            >
              すべて
            </button>
            {visibleSports.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSportFilter(s.slug)}
                className={`font-head rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  sportFilter === s.slug
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-border bg-surface text-ink-dim hover:text-ink"
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-head mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-dim">団体</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOrgFilter("all")}
              className={`font-head rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                orgFilter === "all"
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border bg-surface text-ink-dim hover:text-ink"
              }`}
            >
              すべて
            </button>
            {organizations.map((o) => (
              <button
                key={o.slug}
                onClick={() => setOrgFilter(o.slug)}
                className={`font-head rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  orgFilter === o.slug
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-border bg-surface text-ink-dim hover:text-ink"
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="tabular mt-4 text-xs text-ink-dim">{filtered.length}名の選手が見つかりました</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const gym = a.gymId ? gyms.find((g) => g.id === a.gymId) : undefined;
          return (
            <Link
              key={a.id}
              href={`/athletes/${a.id}`}
              className="rounded-lg border border-border bg-surface p-5 transition hover:border-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar name={a.name} sport={a.sport} size={52} />
                <div className="min-w-0">
                  <p className="font-head truncate text-base font-semibold text-ink">{a.name}</p>
                  <p className="text-xs text-ink-dim">{a.weightClass}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {a.organizations.map((o) => (
                    <OrgTag key={o} organization={o} />
                  ))}
                  <SportTag sport={a.sport} />
                </div>
                <span className="tabular text-sm font-semibold text-ink">
                  {a.record ? `${a.record.wins}-${a.record.losses}-${a.record.draws}` : "戦績未確認"}
                </span>
              </div>
              {(gym || a.gymNote) && (
                <p className="mt-3 text-xs text-ink-dim">{gym?.name ?? a.gymNote}</p>
              )}
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-dim">条件に合う選手が見つかりませんでした。</p>
      )}
    </div>
  );
}
