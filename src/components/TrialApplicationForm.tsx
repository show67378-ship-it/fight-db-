import { submitTrialApplication } from "@/lib/actions";

export default function TrialApplicationForm({ gymId, applied }: { gymId: string; applied: boolean }) {
  const boundSubmit = submitTrialApplication.bind(null, gymId);
  const inputCls =
    "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none";
  const labelCls = "font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim";

  if (applied) {
    return (
      <div className="rounded-sm border border-good/30 bg-good-soft p-4 text-sm text-good">
        お申し込みありがとうございます。ジムからの連絡をお待ちください。
      </div>
    );
  }

  return (
    <form action={boundSubmit} className="space-y-3">
      <div>
        <label className={labelCls}>お名前</label>
        <input name="name" required className={`mt-1 ${inputCls}`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>電話番号(任意)</label>
          <input name="phone" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>メール(任意)</label>
          <input type="email" name="email" className={`mt-1 ${inputCls}`} />
        </div>
      </div>
      <div>
        <label className={labelCls}>希望日時(任意)</label>
        <input name="preferredDate" placeholder="例: 平日夜、週末など" className={`mt-1 ${inputCls}`} />
      </div>
      <div>
        <label className={labelCls}>メッセージ(任意)</label>
        <textarea name="message" rows={2} className={`mt-1 ${inputCls}`} />
      </div>
      <button
        type="submit"
        className="font-head w-full rounded-sm bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
      >
        体験を申し込む
      </button>
    </form>
  );
}
