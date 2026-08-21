"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import type { Athlete, Match } from "@/lib/types";

function pct(a: number, b: number) {
  const total = a + b;
  if (total === 0) return { a: 50, b: 50 };
  return { a: Math.round((a / total) * 1000) / 10, b: Math.round((b / total) * 1000) / 10 };
}

const noopSubscribe = () => () => {};

export default function PredictionWidget({
  match,
  athleteA,
  athleteB,
}: {
  match: Match;
  athleteA: Athlete;
  athleteB: Athlete;
}) {
  const [votesA, setVotesA] = useState(match.votesA);
  const [votesB, setVotesB] = useState(match.votesB);
  const [voted, setVoted] = useState<"A" | "B" | null>(null);
  const storageKey = `vote:${match.id}`;

  const persistedVote = useSyncExternalStore(
    noopSubscribe,
    () => window.localStorage.getItem(storageKey),
    () => null
  );
  const shareUrl = useSyncExternalStore(
    noopSubscribe,
    () => window.location.href,
    () => `https://example.com/matches/${match.id}`
  );
  const effectiveVoted = voted ?? (persistedVote === "A" || persistedVote === "B" ? persistedVote : null);

  const isOpen = match.status === "open";
  const canVote = isOpen && effectiveVoted === null;
  const { a: pctA, b: pctB } = pct(votesA, votesB);
  const total = votesA + votesB;

  function castVote(choice: "A" | "B") {
    if (!canVote) return;
    if (choice === "A") setVotesA((v) => v + 1);
    else setVotesB((v) => v + 1);
    setVoted(choice);
    window.localStorage.setItem(storageKey, choice);
  }

  const shareText = `${athleteA.name} vs ${athleteB.name}、あなたはどっちが勝つと思う？ #格闘com`;
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
          {isOpen ? "勝敗予想 受付中" : "予想結果"}
        </span>
        {!isOpen && (
          <span className="font-head rounded-sm bg-surface-2 px-2 py-0.5 text-[11px] font-semibold uppercase text-ink-dim">
            投票終了
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link href={`/athletes/${athleteA.id}`} className="flex flex-col items-center gap-2 text-center">
          <Avatar name={athleteA.name} sport={match.sport} size={64} />
          <span className="font-head text-sm font-semibold text-ink">{athleteA.name}</span>
        </Link>
        <span className="font-head text-sm font-semibold text-ink-dim">VS</span>
        <Link href={`/athletes/${athleteB.id}`} className="flex flex-col items-center gap-2 text-center">
          <Avatar name={athleteB.name} sport={match.sport} size={64} />
          <span className="font-head text-sm font-semibold text-ink">{athleteB.name}</span>
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="tabular font-semibold text-ink">{pctA}%</span>
          <span className="tabular font-semibold text-ink">{pctB}%</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-accent transition-all" style={{ width: `${pctA}%` }} />
          <div className="h-full bg-ink-dim/40 transition-all" style={{ width: `${pctB}%` }} />
        </div>
        <p className="tabular text-center text-xs text-ink-dim">総投票数: {total.toLocaleString("ja-JP")}票</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => castVote("A")}
          disabled={!canVote}
          className={`font-head rounded-sm border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition ${
            effectiveVoted === "A"
              ? "border-accent bg-accent text-accent-ink"
              : "border-border bg-surface-2 text-ink hover:border-accent disabled:opacity-40"
          }`}
        >
          {athleteA.name}が勝つ
        </button>
        <button
          onClick={() => castVote("B")}
          disabled={!canVote}
          className={`font-head rounded-sm border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition ${
            effectiveVoted === "B"
              ? "border-accent bg-accent text-accent-ink"
              : "border-border bg-surface-2 text-ink hover:border-accent disabled:opacity-40"
          }`}
        >
          {athleteB.name}が勝つ
        </button>
      </div>

      {effectiveVoted && isOpen && (
        <p className="mt-3 text-center text-xs text-good">投票ありがとうございました。結果発表をお楽しみに。</p>
      )}

      {!isOpen && match.resultWinnerId && (
        <p className="mt-3 text-center text-sm text-ink">
          結果: <span className="font-semibold text-accent">
            {match.resultWinnerId === athleteA.id ? athleteA.name : athleteB.name}
          </span>{" "}
          の勝利
        </p>
      )}

      <a
        href={intentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-head mt-5 flex items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-dim transition hover:border-accent hover:text-ink"
      >
        Xでシェアする
      </a>
    </div>
  );
}
