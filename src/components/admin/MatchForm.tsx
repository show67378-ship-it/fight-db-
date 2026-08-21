import { getAthletes, organizations, sports } from "@/lib/data";
import type { Match } from "@/lib/types";

const inputCls =
  "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";
const labelCls = "font-head text-xs font-semibold uppercase tracking-wide text-ink-dim";

export default function MatchForm({
  match,
  action,
}: {
  match?: Match;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const athletes = getAthletes();

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>競技</label>
          <select name="sport" defaultValue={match?.sport ?? "mma"} className={`mt-1 ${inputCls}`}>
            {sports.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>団体</label>
          <select name="organization" defaultValue={match?.organization ?? organizations[0]?.slug} className={`mt-1 ${inputCls}`}>
            {organizations.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>大会名</label>
        <input name="eventName" defaultValue={match?.eventName} required className={`mt-1 ${inputCls}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>開催日</label>
          <input type="date" name="eventDate" defaultValue={match?.eventDate} required className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>会場</label>
          <input name="venue" defaultValue={match?.venue} required className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>選手A</label>
          <select name="athleteAId" defaultValue={match?.athleteAId} required className={`mt-1 ${inputCls}`}>
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
          <select name="athleteBId" defaultValue={match?.athleteBId} required className={`mt-1 ${inputCls}`}>
            <option value="">選択してください</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>状態</label>
          <select name="status" defaultValue={match?.status ?? "open"} className={`mt-1 ${inputCls}`}>
            <option value="open">投票受付中</option>
            <option value="closed">終了(結果あり)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>選手A票数</label>
          <input type="number" name="votesA" defaultValue={match?.votesA ?? 0} className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>選手B票数</label>
          <input type="number" name="votesB" defaultValue={match?.votesB ?? 0} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div>
        <label className={labelCls}>勝者(任意・終了した試合のみ)</label>
        <select name="resultWinnerId" defaultValue={match?.resultWinnerId ?? ""} className={`mt-1 ${inputCls}`}>
          <option value="">未定</option>
          {athletes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>出典URL(任意)</label>
        <input name="sourceUrl" defaultValue={match?.sourceUrl} className={`mt-1 ${inputCls}`} />
      </div>

      <button
        type="submit"
        className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
      >
        {match ? "更新する" : "追加する"}
      </button>
    </form>
  );
}
