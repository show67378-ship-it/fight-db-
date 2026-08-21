"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { visibleSports } from "@/lib/taxonomy";
import type { Gym, SportSlug } from "@/lib/types";
import GymCard from "@/components/GymCard";

export default function GymsBrowser({ gyms }: { gyms: Gym[] }) {
  const [sportFilter, setSportFilter] = useState<SportSlug | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return gyms.filter((g) => {
      const sportOk = sportFilter === "all" || g.sports.includes(sportFilter);
      const q = query.trim();
      const queryOk =
        q === "" ||
        g.name.includes(q) ||
        g.prefecture.includes(q) ||
        g.city.includes(q);
      return sportOk && queryOk;
    });
  }, [gyms, sportFilter, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Gym Search</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジムを探す</h1>
      <p className="mt-2 text-ink-dim">競技・地域からジムを検索できます。</p>
      <p className="mt-2 text-sm text-ink-dim">
        掲載されていないジムの関係者の方は{" "}
        <Link href="/gyms/list-your-gym" className="text-accent hover:underline">
          こちらから掲載を依頼
        </Link>
        できます(無料)。
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ジム名・都道府県・市区町村で検索"
          className="min-w-[240px] flex-1 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none"
        />
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

      <p className="tabular mt-6 text-xs text-ink-dim">{filtered.length}件のジムが見つかりました</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <GymCard key={g.id} gym={g} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-dim">条件に合うジムが見つかりませんでした。</p>
      )}
    </div>
  );
}
