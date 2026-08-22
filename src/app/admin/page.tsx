import Link from "next/link";
import { getAthletes, getDreamMatches, getGyms, getListingRequests, getMatches, getTrialApplications } from "@/lib/data";
import { logout } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [gyms, athletes, applications, listingRequests, dreamMatches, matches] = await Promise.all([
    getGyms(),
    getAthletes(),
    getTrialApplications(),
    getListingRequests(),
    getDreamMatches(),
    getMatches(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="font-head mt-3 text-3xl font-bold text-ink">管理画面</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim hover:text-ink"
          >
            ログアウト
          </button>
        </form>
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
          href="/admin/matches"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">勝敗予想管理</p>
          <p className="mt-1 tabular text-sm text-ink-dim">{matches.length}件</p>
        </Link>
        <Link
          href="/admin/dream-matches"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">次に観たい試合管理</p>
          <p className="mt-1 tabular text-sm text-ink-dim">{dreamMatches.length}件</p>
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
        <Link
          href="/admin/listing-requests"
          className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent"
        >
          <p className="font-head text-lg font-bold text-ink">ジム掲載依頼一覧</p>
          <p className="mt-1 tabular text-sm text-ink-dim">
            {listingRequests.length}件
            {listingRequests.some((r) => r.status === "new") && (
              <span className="ml-2 text-warn">
                (未対応 {listingRequests.filter((r) => r.status === "new").length}件)
              </span>
            )}
          </p>
        </Link>
      </div>
    </div>
  );
}
