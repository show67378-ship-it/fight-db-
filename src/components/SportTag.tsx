import type { SportSlug } from "@/lib/types";
import { getSport } from "@/lib/taxonomy";

const sportVar: Record<SportSlug, string> = {
  mma: "var(--sport-mma)",
  bjj: "var(--sport-bjj)",
  kickboxing: "var(--sport-kickboxing)",
  boxing: "var(--sport-boxing)",
};

export default function SportTag({ sport }: { sport: SportSlug }) {
  const s = getSport(sport);
  return (
    <span
      className="font-head inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        color: sportVar[sport],
        background: `color-mix(in srgb, ${sportVar[sport]} 16%, transparent)`,
      }}
    >
      {s.shortName}
    </span>
  );
}
