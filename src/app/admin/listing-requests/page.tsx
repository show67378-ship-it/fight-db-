import Link from "next/link";
import { getListingRequests } from "@/lib/data";
import { updateListingRequestStatus } from "@/lib/actions";
import { getSport } from "@/lib/taxonomy";
import type { GymListingRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusLabel: Record<GymListingRequestStatus, string> = {
  new: "未対応",
  reviewing: "確認中",
  added: "掲載済み",
  rejected: "見送り",
};

function nextStatus(current: GymListingRequestStatus): GymListingRequestStatus {
  if (current === "new") return "reviewing";
  if (current === "reviewing") return "added";
  if (current === "added") return "rejected";
  return "new";
}

export default async function AdminListingRequestsPage() {
  const requests = await getListingRequests();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジム掲載依頼一覧</h1>
      <p className="mt-2 text-sm text-ink-dim">
        掲載を承認する場合は、内容を確認のうえ
        <Link href="/admin/gyms/new" className="text-accent hover:underline">
          ジムの新規追加
        </Link>
        から手動で登録し、ステータスを「掲載済み」にしてください。
      </p>

      {requests.length === 0 && <p className="mt-6 text-sm text-ink-dim">まだ依頼はありません。</p>}

      <div className="mt-6 space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-head text-base font-semibold text-ink">{req.gymName}</p>
                <p className="text-xs text-ink-dim">
                  {req.prefecture}
                  {req.city} ・ {req.sports.map((s) => getSport(s).shortName).join(", ") || "競技未選択"} ・{" "}
                  {new Date(req.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
              <form action={updateListingRequestStatus.bind(null, req.id, nextStatus(req.status))}>
                <button
                  type="submit"
                  className={`font-head rounded-sm border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                    req.status === "new"
                      ? "border-warn/40 bg-warn-soft text-warn"
                      : req.status === "reviewing"
                        ? "border-accent/40 bg-accent-soft text-accent"
                        : req.status === "added"
                          ? "border-good/40 bg-good-soft text-good"
                          : "border-border bg-surface-2 text-ink-dim"
                  }`}
                >
                  {statusLabel[req.status]}
                </button>
              </form>
            </div>
            <dl className="mt-3 space-y-1 text-sm text-ink-dim">
              {req.address && <p>住所: {req.address}</p>}
              {req.phone && <p>電話: {req.phone}</p>}
              {req.websiteUrl && <p>公式HP: {req.websiteUrl}</p>}
              {req.description && <p>紹介: {req.description}</p>}
              {req.instructors && (
                <p className="whitespace-pre-wrap">主な指導者: {req.instructors}</p>
              )}
              {req.belongingAthletes && (
                <p className="whitespace-pre-wrap">所属選手: {req.belongingAthletes}</p>
              )}
              <p className="pt-1 text-ink">
                担当者: {req.contactName} ・ {req.contactEmail}
              </p>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
