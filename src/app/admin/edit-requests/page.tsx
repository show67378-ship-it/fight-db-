import Link from "next/link";
import { getEditRequests } from "@/lib/data";
import { updateEditRequestStatus } from "@/lib/actions";
import type { EditRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusLabel: Record<EditRequestStatus, string> = {
  new: "未対応",
  reviewing: "確認中",
  applied: "反映済み",
  rejected: "見送り",
};

function nextStatus(current: EditRequestStatus): EditRequestStatus {
  if (current === "new") return "reviewing";
  if (current === "reviewing") return "applied";
  if (current === "applied") return "rejected";
  return "new";
}

export default async function AdminEditRequestsPage() {
  const requests = await getEditRequests();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">編集依頼一覧</h1>
      <p className="mt-2 text-sm text-ink-dim">
        ジム・選手ページから寄せられた情報修正の依頼です。内容を確認し、必要であれば編集画面から反映のうえステータスを「反映済み」にしてください。
      </p>

      {requests.length === 0 && <p className="mt-6 text-sm text-ink-dim">まだ依頼はありません。</p>}

      <div className="mt-6 space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-ink-dim">{req.targetType === "gym" ? "ジム" : "選手"}</p>
                <Link
                  href={
                    req.targetType === "gym"
                      ? `/admin/gyms/${req.targetId}`
                      : `/admin/athletes/${req.targetId}`
                  }
                  className="font-head text-base font-semibold text-ink hover:text-accent hover:underline"
                >
                  {req.targetName}
                </Link>
                <p className="text-xs text-ink-dim">{new Date(req.createdAt).toLocaleString("ja-JP")}</p>
              </div>
              <form action={updateEditRequestStatus.bind(null, req.id, nextStatus(req.status))}>
                <button
                  type="submit"
                  className={`font-head rounded-sm border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                    req.status === "new"
                      ? "border-warn/40 bg-warn-soft text-warn"
                      : req.status === "reviewing"
                        ? "border-accent/40 bg-accent-soft text-accent"
                        : req.status === "applied"
                          ? "border-good/40 bg-good-soft text-good"
                          : "border-border bg-surface-2 text-ink-dim"
                  }`}
                >
                  {statusLabel[req.status]}
                </button>
              </form>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{req.content}</p>
            {(req.contactName || req.contactEmail) && (
              <p className="mt-3 text-sm text-ink-dim">
                連絡先: {req.contactName ?? "―"} ・ {req.contactEmail ?? "―"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
