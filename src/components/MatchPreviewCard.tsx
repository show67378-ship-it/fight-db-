import Link from "next/link";
import Avatar from "./Avatar";
import SportTag from "./SportTag";
import OrgTag from "./OrgTag";
import type { Athlete, Match } from "@/lib/types";

function pct(a: number, b: number) {
  const total = a + b;
  if (total === 0) return { a: 50, b: 50 };
  return { a: Math.round((a / total) * 100), b: Math.round((b / total) * 100) };
}

export default function MatchPreviewCard({
  match,
  athleteA,
  athleteB,
}: {
  match: Match;
  athleteA: Athlete;
  athleteB: Athlete;
}) {
  const { a, b } = pct(match.votesA, match.votesB);
  const total = match.votesA + match.votesB;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-lg border border-border bg-surface p-5 transition hover:border-accent"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <OrgTag organization={match.organization} />
          <SportTag sport={match.sport} />
        </div>
        <span className="text-xs text-ink-dim">{match.eventDate}</span>
      </div>
      <p className="mt-2 text-xs text-ink-dim">{match.eventName}</p>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar name={athleteA.name} sport={match.sport} size={44} />
          <span className="font-head text-xs font-semibold text-ink">{athleteA.name}</span>
        </div>
        <span className="font-head text-xs text-ink-dim">VS</span>
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar name={athleteB.name} sport={match.sport} size={44} />
          <span className="font-head text-xs font-semibold text-ink">{athleteB.name}</span>
        </div>
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-accent" style={{ width: `${a}%` }} />
        <div className="h-full bg-ink-dim/40" style={{ width: `${b}%` }} />
      </div>
      <div className="tabular mt-1.5 flex justify-between text-[11px] text-ink-dim">
        <span>{a}%</span>
        <span>総投票 {total.toLocaleString("ja-JP")}</span>
        <span>{b}%</span>
      </div>
    </Link>
  );
}
