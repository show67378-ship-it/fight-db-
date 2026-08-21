import { sports } from "@/lib/data";
import type { Gym } from "@/lib/types";

const inputCls =
  "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";
const labelCls = "font-head text-xs font-semibold uppercase tracking-wide text-ink-dim";

export default function GymForm({
  gym,
  action,
}: {
  gym?: Gym;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 space-y-5">
      <div>
        <label className={labelCls}>ジム名</label>
        <input name="name" defaultValue={gym?.name} required className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <label className={labelCls}>対応競技</label>
        <div className="mt-2 flex flex-wrap gap-4">
          {sports.map((s) => (
            <label key={s.slug} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="sports"
                value={s.slug}
                defaultChecked={gym?.sports.includes(s.slug)}
              />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>都道府県</label>
          <input name="prefecture" defaultValue={gym?.prefecture} required className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>市区町村・エリア</label>
          <input name="city" defaultValue={gym?.city} required className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>番地・住所(任意)</label>
          <input name="address" defaultValue={gym?.address} className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>電話番号(任意)</label>
          <input name="phone" defaultValue={gym?.phone} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          ジム連絡先メール(任意・体験申込をここへ転送する際に使います)
        </label>
        <input type="email" name="contactEmail" defaultValue={gym?.contactEmail} className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <label className={labelCls}>体験・見学情報</label>
        <input name="trialInfo" defaultValue={gym?.trialInfo} required className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <label className={labelCls}>紹介文</label>
        <textarea name="description" defaultValue={gym?.description} rows={3} required className={`mt-1 ${inputCls}`} />
      </div>

      <div>
        <label className={labelCls}>
          主な指導者(任意・1行に1人。「名前,肩書き」の形式、肩書きは省略可)
        </label>
        <textarea
          name="instructors"
          defaultValue={gym?.instructors?.map((i) => (i.title ? `${i.name},${i.title}` : i.name)).join("\n")}
          rows={3}
          placeholder={"例:\n山田太郎,黒帯・元プロ選手\n佐藤次郎"}
          className={`mt-1 ${inputCls}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>掲載プラン</label>
          <select name="planTier" defaultValue={gym?.planTier ?? "free"} className={`mt-1 ${inputCls}`}>
            <option value="free">無料</option>
            <option value="standard">スタンダード</option>
            <option value="premium">プレミアム</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>ジム公式HP(任意)</label>
          <input name="websiteUrl" defaultValue={gym?.websiteUrl} className={`mt-1 ${inputCls}`} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="featured" defaultChecked={gym?.featured} />
        トップページの「注目のジム」に表示する
      </label>

      <button
        type="submit"
        className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
      >
        {gym ? "更新する" : "追加する"}
      </button>
    </form>
  );
}
