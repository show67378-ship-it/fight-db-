import { getAthletes, organizations, sports } from "@/lib/data";
import type { DreamMatchCard } from "@/lib/types";

const inputCls =
  "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";
const labelCls = "font-head text-xs font-semibold uppercase tracking-wide text-ink-dim";

export default async function DreamMatchForm({
  card,
  action,
}: {
  card?: DreamMatchCard;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const athletes = await getAthletes();

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>競技</label>
          <select name="sport" defaultValue={card?.sport ?? "mma"} className={`mt-1 ${inputCls}`}>
            {sports.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>団体</label>
          <select name="organization" defaultValue={card?.organization ?? organizations[0]?.slug} className={`mt-1 ${inputCls}`}>
            {organizations.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>選手A</label>
          <select name="athleteAId" defaultValue={card?.athleteAId} required className={`mt-1 ${inputCls}`}>
            <option value="">選択してください</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>選手B</label>
          <select name="athleteBId" defaultValue={card?.athleteBId} required className={`mt-1 ${inputCls}`}>
            <option value="">選択してください</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>投票数</label>
        <input type="number" name="votes" defaultValue={card?.votes ?? 0} className={`mt-1 ${inputCls}`} />
      </div>

      <button
        type="submit"
        className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
      >
        {card ? "更新する" : "追加する"}
      </button>
    </form>
  );
}
