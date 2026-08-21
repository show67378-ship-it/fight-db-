import Link from "next/link";
import SportTag from "./SportTag";
import type { Gym } from "@/lib/types";

export default function GymCard({ gym }: { gym: Gym }) {
  return (
    <Link
      href={`/gyms/${gym.id}`}
      className="block rounded-lg border border-border bg-surface p-5 transition hover:border-accent"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {gym.sports.map((s) => (
            <SportTag key={s} sport={s} />
          ))}
        </div>
        {gym.planTier !== "free" && (
          <span className="font-head rounded-sm bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            PR
          </span>
        )}
      </div>
      <p className="font-head mt-3 text-base font-semibold text-ink">{gym.name}</p>
      <p className="mt-1 text-xs text-ink-dim">
        {gym.prefecture}{gym.city}
      </p>
      <p className="mt-3 line-clamp-2 text-sm text-ink-dim">{gym.description}</p>
      <p className="mt-3 text-xs font-medium text-ink-dim">{gym.trialInfo}</p>
    </Link>
  );
}
