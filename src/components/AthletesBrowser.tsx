"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { visibleSports } from "@/lib/taxonomy";
import type { Athlete, Gym, SportSlug } from "@/lib/types";
import Avatar from "@/components/Avatar";
import SportTag from "@/components/SportTag";

export default function AthletesBrowser({ athletes, gyms }: { athletes: Athlete[]; gyms: Gym[] }) {
  const [sportFilter, setSportFilter] = useState<SportSlug | "all">("all");

  const filtered = useMemo(
    () => athletes.filter((a) => sportFilter === "all" || a.sport === sportFilter),
    [athletes, sportFilter]
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Athletes</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">選手一覧</h1>

      <div className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <SportTag sport={a.sport} />
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
    </div>
  );
}
