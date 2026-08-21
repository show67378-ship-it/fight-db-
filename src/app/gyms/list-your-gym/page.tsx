import { sports } from "@/lib/taxonomy";
import { submitListingRequest } from "@/lib/actions";

export const metadata = {
  title: "ジム掲載依頼 | 格闘.com",
};

const inputCls =
  "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none";
const labelCls = "font-head text-xs font-semibold uppercase tracking-wide text-ink-dim";

export default async function ListYourGymPage({
  searchParams,
}: PageProps<"/gyms/list-your-gym">) {
  const { submitted } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Gym</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジム掲載依頼</h1>
      <p className="mt-2 text-ink-dim">
        格闘.comにまだ掲載されていないジムの方は、こちらから掲載をご依頼いただけます。
        <strong className="text-ink">情報を掲載するだけなら無料</strong>です。内容を確認のうえ掲載いたします。
      </p>

      {submitted === "1" ? (
        <div className="mt-8 rounded-lg border border-good/30 bg-good-soft p-6 text-sm text-good">
          掲載依頼を受け付けました。内容を確認のうえ、順次掲載いたします。
        </div>
      ) : (
        <form action={submitListingRequest} className="mt-8 space-y-5">
          <div>
            <label className={labelCls}>ジム名</label>
            <input name="gymName" required className={`mt-1 ${inputCls}`} />
          </div>

          <div>
            <label className={labelCls}>対応競技</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {sports.map((s) => (
                <label key={s.slug} className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" name="sports" value={s.slug} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>都道府県</label>
              <input name="prefecture" required className={`mt-1 ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>市区町村・エリア</label>
              <input name="city" required className={`mt-1 ${inputCls}`} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>番地・住所(任意)</label>
              <input name="address" className={`mt-1 ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>電話番号(任意)</label>
              <input name="phone" className={`mt-1 ${inputCls}`} />
            </div>
          </div>

          <div>
            <label className={labelCls}>ジム公式HP(任意)</label>
            <input name="websiteUrl" className={`mt-1 ${inputCls}`} />
          </div>

          <div>
            <label className={labelCls}>ジムの紹介(任意)</label>
            <textarea name="description" rows={3} className={`mt-1 ${inputCls}`} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>ご担当者名</label>
              <input name="contactName" required className={`mt-1 ${inputCls}`} />
            </div>
            <div>
              <label className={labelCls}>ご連絡先メール</label>
              <input type="email" name="contactEmail" required className={`mt-1 ${inputCls}`} />
            </div>
          </div>
          <p className="text-xs text-ink-dim">
            ご連絡先は掲載内容の確認のためだけに使用し、サイト上には公開しません。
          </p>

          <button
            type="submit"
            className="font-head rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
          >
            掲載を依頼する
          </button>
        </form>
      )}
    </div>
  );
}
