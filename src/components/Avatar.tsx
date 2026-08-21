import type { SportSlug } from "@/lib/types";
import FighterIcon from "./FighterIcon";

const sportVar: Record<SportSlug, string> = {
  mma: "var(--sport-mma)",
  bjj: "var(--sport-bjj)",
  kickboxing: "var(--sport-kickboxing)",
  boxing: "var(--sport-boxing)",
};

export default function Avatar({
  name,
  sport,
  size = 56,
}: {
  name: string;
  sport: SportSlug;
  size?: number;
}) {
  return (
    <div
      title={name}
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        color: sportVar[sport],
        background: `color-mix(in srgb, ${sportVar[sport]} 18%, var(--surface))`,
        border: `1px solid color-mix(in srgb, ${sportVar[sport]} 40%, transparent)`,
      }}
    >
      <FighterIcon className="h-[62%] w-[62%]" />
    </div>
  );
}
