import { getGyms, organizations, sports } from "@/lib/data";
import type { Athlete } from "@/lib/types";

const inputCls =
  "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";
const labelCls = "font-head text-xs font-semibold uppercase tracking-wide text-ink-dim";

export default function AthleteForm({
  athlete,
  action,
}: {
  athlete?: Athlete;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const gyms = getGyms();

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>氏名</label>
          <input name="name" defaultValue={athlete?.name} required className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>よみがな</label>
          <input name="nameKana" defaultValue={athlete?.nameKana} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>競技</label>
          <select name="sport" defaultValue={athlete?.sport ?? "mma"} className={`mt-1 ${inputCls}`}>
            {sports.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>所属団体</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {organizations.map((o) => (
              <label key={o.slug} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="organizations"
                  value={o.slug}
                  defaultChecked={athlete?.organizations.includes(o.slug)}
                />
                {o.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>階級</label>
          <input name="weightClass" defaultValue={athlete?.weightClass} required className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>国籍</label>
          <input name="nationality" defaultValue={athlete?.nationality} required className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>異名(任意)</label>
          <input name="nickname" defaultValue={athlete?.nickname} placeholder="例: 世界のTK" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>得意技(任意)</label>
          <input name="signatureMove" defaultValue={athlete?.signatureMove} placeholder="例: 右ストレート" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>ファイトスタイル(任意)</label>
          <input name="fightingStyle" defaultValue={athlete?.fightingStyle} placeholder="例: レスラー・パンチャー" className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>生年月日(任意)</label>
          <input type="date" name="birthdate" defaultValue={athlete?.birthdate} className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>身長cm(任意)</label>
          <input type="number" step="0.1" name="heightCm" defaultValue={athlete?.heightCm} className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>体重kg(任意)</label>
          <input type="number" step="0.1" name="weightKg" defaultValue={athlete?.weightKg} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div>
        <label className={labelCls}>所属ジム(任意)</label>
        <select name="gymId" defaultValue={athlete?.gymId ?? ""} className={`mt-1 ${inputCls}`}>
          <option value="">未設定</option>
          {gyms.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>所属ジム補足(任意・例: 所属ジム名やジムDB未掲載の場合)</label>
        <input name="gymNote" defaultValue={athlete?.gymNote} className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <label className={labelCls}>経歴・紹介文(任意)</label>
        <textarea name="bio" defaultValue={athlete?.bio} rows={2} className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <p className={labelCls}>戦績(任意・3つとも入力すると表示されます)</p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <input type="number" name="wins" placeholder="勝" defaultValue={athlete?.record?.wins} className={inputCls} />
          <input type="number" name="losses" placeholder="敗" defaultValue={athlete?.record?.losses} className={inputCls} />
          <input type="number" name="draws" placeholder="分" defaultValue={athlete?.record?.draws} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>戦績に関する補足(任意)</label>
        <input name="recordNote" defaultValue={athlete?.recordNote} className={`mt-1 ${inputCls}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>SNS種類(任意・例: X)</label>
          <input name="snsPlatform" defaultValue={athlete?.sns[0]?.platform} className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>SNSアカウント(任意・例: @handle)</label>
          <input name="snsHandle" defaultValue={athlete?.sns[0]?.handle} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div>
        <label className={labelCls}>出典URL(任意)</label>
        <input name="sourceUrl" defaultValue={athlete?.sourceUrl} className={`mt-1 ${inputCls}`} />
      </div>

      <button
        type="submit"
        className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
      >
        {athlete ? "更新する" : "追加する"}
      </button>
    </form>
  );
}
