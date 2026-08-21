import { getGyms, getTrialApplications } from "@/lib/data";
import { updateTrialApplicationStatus } from "@/lib/actions";
import type { TrialApplicationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusLabel: Record<TrialApplicationStatus, string> = {
  new: "未対応",
  contacted: "連絡済み",
  done: "対応完了",
};

export default function AdminApplicationsPage() {
  const applications = getTrialApplications();
  const gyms = getGyms();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">体験申込一覧</h1>

      {applications.length === 0 && (
        <p className="mt-6 text-sm text-ink-dim">まだ申込はありません。</p>
      )}

      <div className="mt-6 space-y-3">
        {applications.map((app) => {
          const gym = gyms.find((g) => g.id === app.gymId);
          return (
            <div key={app.id} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-head text-sm font-semibold text-ink">{app.name}</p>
                  <p className="text-xs text-ink-dim">
                    {gym?.name ?? "不明なジム"} ・ {new Date(app.createdAt).toLocaleString("ja-JP")}
                  </p>
                </div>
                <form action={updateTrialApplicationStatus.bind(null, app.id, cycleStatus(app.status))}>
                  <button
                    type="submit"
                    className={`font-head rounded-sm border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                      app.status === "new"
                        ? "border-warn/40 bg-warn-soft text-warn"
                        : app.status === "contacted"
                          ? "border-accent/40 bg-accent-soft text-accent"
                          : "border-good/40 bg-good-soft text-good"
                    }`}
                  >
                    {statusLabel[app.status]}
                  </button>
                </form>
              </div>
              <dl className="mt-3 space-y-1 text-sm text-ink-dim">
                {app.phone && <p>電話: {app.phone}</p>}
                {app.email && <p>メール: {app.email}</p>}
                {app.preferredDate && <p>希望日時: {app.preferredDate}</p>}
                {app.message && <p>メッセージ: {app.message}</p>}
              </dl>

              <div className="mt-4 border-t border-border pt-3">
                {gym?.contactEmail ? (
                  <a
                    href={forwardMailto(gym.contactEmail, gym.name, app)}
                    className="font-head inline-block rounded-sm border border-accent/40 bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent hover:opacity-80"
                  >
                    ジムへメールで転送 →
                  </a>
                ) : (
                  <p className="text-[11px] text-ink-dim">
                    このジムには連絡先メールが登録されていません(ジム管理画面から追加できます)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function forwardMailto(
  gymEmail: string,
  gymName: string,
  app: { name: string; phone?: string; email?: string; preferredDate?: string; message?: string }
): string {
  const subject = `【格闘.com】体験申込のお知らせ(${app.name}様)`;
  const bodyLines = [
    `${gymName} ご担当者様`,
    "",
    "格闘.com経由で以下の体験申込がありましたのでお知らせいたします。",
    "",
    `お名前: ${app.name}`,
    app.phone ? `電話番号: ${app.phone}` : null,
    app.email ? `メール: ${app.email}` : null,
    app.preferredDate ? `希望日時: ${app.preferredDate}` : null,
    app.message ? `メッセージ: ${app.message}` : null,
    "",
    "お手数ですが、直接ご連絡いただけますようお願いいたします。",
  ].filter((line): line is string => line !== null);

  const body = bodyLines.join("\n");
  return `mailto:${gymEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function cycleStatus(current: TrialApplicationStatus): TrialApplicationStatus {
  if (current === "new") return "contacted";
  if (current === "contacted") return "done";
  return "new";
}
