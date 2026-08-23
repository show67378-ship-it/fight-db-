import { submitEditRequest } from "@/lib/actions";
import type { EditRequestTargetType } from "@/lib/types";

export default function EditRequestForm({
  targetType,
  targetId,
  targetName,
  requested,
}: {
  targetType: EditRequestTargetType;
  targetId: string;
  targetName: string;
  requested: boolean;
}) {
  const boundSubmit = submitEditRequest.bind(null, targetType, targetId, targetName);
  const inputCls =
    "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none";
  const labelCls = "font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim";

  if (requested) {
    return (
      <div className="rounded-sm border border-good/30 bg-good-soft p-4 text-sm text-good">
        修正依頼を受け付けました。確認のうえ対応いたします。
      </div>
    );
  }

  return (
    <details className="group">
      <summary className="font-head cursor-pointer text-xs font-semibold uppercase tracking-wide text-ink-dim transition hover:text-ink">
        この{targetType === "gym" ? "ジム" : "選手"}情報に誤りがある方はこちら
      </summary>
      <form action={boundSubmit} className="mt-3 space-y-3">
        <div>
          <label className={labelCls}>修正してほしい内容</label>
          <textarea name="content" rows={3} required className={`mt-1 ${inputCls}`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>お名前(任意)</label>
            <input name="contactName" className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <label className={labelCls}>メール(任意)</label>
            <input type="email" name="contactEmail" className={`mt-1 ${inputCls}`} />
          </div>
        </div>
        <button
          type="submit"
          className="font-head w-full rounded-sm border border-border py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition hover:border-accent"
        >
          修正を依頼する
        </button>
      </form>
    </details>
  );
}
