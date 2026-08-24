import { getAllComments } from "@/lib/data";
import { deleteComment } from "@/lib/actions";
import type { CommentTargetType } from "@/lib/types";

export const dynamic = "force-dynamic";

const targetLabel: Record<CommentTargetType, string> = {
  match: "勝敗予想",
  dreamMatch: "次に観たい試合",
};

const targetPath: Record<CommentTargetType, (id: string) => string> = {
  match: (id) => `/matches/${id}`,
  dreamMatch: () => "/dream-matches",
};

const reasonLabel: Record<string, string> = {
  admin: "管理者が削除",
  ng_word: "自動判定(不適切な単語)",
  url_spam: "自動判定(URL含む)",
  spam_pattern: "自動判定(スパムの疑い)",
  too_long: "自動判定(長すぎる)",
  empty: "自動判定(空欄)",
};

export default async function AdminCommentsPage() {
  const comments = await getAllComments();
  const flaggedCount = comments.filter((c) => c.status === "removed" && c.removedReason !== "admin").length;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">コメント管理</h1>
      <p className="mt-2 text-sm text-ink-dim">
        勝敗予想・次に観たい試合ページに投稿されたコメントです。不適切と自動判定されたものは公開されず、ここにのみ表示されます。
        {flaggedCount > 0 && <span className="ml-2 text-warn">(自動非公開 {flaggedCount}件)</span>}
      </p>

      {comments.length === 0 && <p className="mt-6 text-sm text-ink-dim">まだコメントはありません。</p>}

      <div className="mt-6 space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg border p-5 ${
              c.status === "removed" ? "border-border bg-surface-2 opacity-70" : "border-border bg-surface"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-ink-dim">
                  {targetLabel[c.targetType]} ・{" "}
                  <a
                    href={targetPath[c.targetType](c.targetId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    ページを見る
                  </a>
                </p>
                <p className="font-head mt-1 text-sm font-semibold text-ink">{c.authorName || "匿名"}</p>
                <p className="text-xs text-ink-dim">{new Date(c.createdAt).toLocaleString("ja-JP")}</p>
              </div>
              {c.status === "visible" ? (
                <form action={deleteComment.bind(null, c.id, c.targetType, c.targetId)}>
                  <button
                    type="submit"
                    className="font-head rounded-sm border border-accent/40 bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent transition hover:opacity-80"
                  >
                    削除する
                  </button>
                </form>
              ) : (
                <span className="font-head rounded-sm border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-dim">
                  {reasonLabel[c.removedReason ?? ""] ?? "非公開"}
                </span>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
