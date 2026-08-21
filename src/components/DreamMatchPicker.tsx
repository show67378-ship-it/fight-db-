"use client";

import { useState } from "react";
import type { Athlete } from "@/lib/types";

export default function DreamMatchPicker({
  athlete,
  allAthletes,
}: {
  athlete: Athlete;
  allAthletes: Athlete[];
}) {
  const opponents = allAthletes.filter(
    (a) => a.id !== athlete.id && a.organizations.some((o) => athlete.organizations.includes(o))
  );
  const [selected, setSelected] = useState(opponents[0]?.id ?? "");
  const [submitted, setSubmitted] = useState(false);

  if (athlete.organizations.length === 0 || opponents.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
        この選手と誰の試合が見たい?
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="font-head text-sm font-semibold text-ink">{athlete.name} vs</span>
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setSubmitted(false);
          }}
          className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {opponents.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSubmitted(true)}
          className="font-head rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          投票する
        </button>
      </div>
      {submitted && (
        <p className="mt-3 text-xs text-good">
          「{athlete.name} vs {opponents.find((o) => o.id === selected)?.name}」に投票しました(デモ版)。
        </p>
      )}
    </div>
  );
}
