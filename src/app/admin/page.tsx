import Link from "next/link";
import { getAthletes, getGyms, getTrialApplications } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const gyms = getGyms();
  const athletes = getAthletes();
  const applications = getTrialApplications();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">管理画面</h1>

      <div className="mt-4 rounded-lg border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
        この管理画面はまだパスワード保護されていません。ローカル環境(localhost)でのみ使用してください。サイトを一般公開する前に、必ず認証機能を追加してください。
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/gyms"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">ジム管理</p>
          <p className="mt-1 tabular text-sm text-ink-dim">{gyms.length}件</p>
        </Link>
        <Link
          href="/admin/athletes"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">選手管理</p>
          <p className="mt-1 tabular text-sm text-ink-dim">{athletes.length}件</p>
        </Link>
        <Link
          href="/admin/applications"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">体験申込一覧</p>
          <p className="mt-1 tabular text-sm text-ink-dim">
            {applications.length}件
            {applications.some((a) => a.status === "new") && (
              <span className="ml-2 text-warn">
                (未対応 {applications.filter((a) => a.status === "new").length}件)
              </span>
            )}
          </p>
        </Link>
      </div>
    </div>
  );
}
