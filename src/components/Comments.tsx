import { postComment } from "@/lib/actions";
import type { Comment, CommentTargetType } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Comments({
  targetType,
  targetId,
  comments,
  status,
  hideHeading,
  className,
}: {
  targetType: CommentTargetType;
  targetId: string;
  comments: Comment[];
  status?: string;
  hideHeading?: boolean;
  className?: string;
}) {
  const boundSubmit = postComment.bind(null, targetType, targetId);
  const inputCls =
    "w-full rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-accent focus:outline-none";
  const labelCls = "font-head text-[11px] font-semibold uppercase tracking-wide text-ink-dim";

  return (
    <div className={className ?? "mt-10 border-t border-border pt-6"}>
      {!hideHeading && (
        <h2 className="font-head text-lg font-bold text-ink">
          コメント <span className="tabular text-ink-dim">({comments.length})</span>
        </h2>
      )}

      {status === "flagged" && (
        <p className="mt-3 rounded-sm border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          不適切な内容と判定されたため、コメントは公開されませんでした。
        </p>
      )}
      {status === "posted" && (
        <p className="mt-3 rounded-sm border border-good/30 bg-good-soft px-4 py-3 text-sm text-good">
          コメントを投稿しました。
        </p>
      )}

      <div className="mt-4 space-y-3">
        {comments.length === 0 && <p className="text-sm text-ink-dim">まだコメントはありません。</p>}
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-head text-xs font-semibold text-ink">{c.authorName || "匿名"}</span>
              <span className="tabular text-[11px] text-ink-dim">{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-dim">{c.body}</p>
          </div>
        ))}
      </div>

      <form action={boundSubmit} className="mt-6 space-y-3">
        <div>
          <label className={labelCls}>お名前(任意)</label>
          <input name="authorName" maxLength={40} placeholder="匿名" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>コメント</label>
          <textarea name="body" rows={3} required maxLength={500} className={`mt-1 ${inputCls}`} />
        </div>
        <button
          type="submit"
          className="font-head rounded-sm bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          コメントする
        </button>
        <p className="text-[11px] text-ink-dim">
          誹謗中傷など不適切な内容は自動判定により公開されない場合があります。
        </p>
      </form>
    </div>
  );
}
