import Link from "next/link";
import { syncDatabaseSchema } from "@/lib/db-sync";

export const dynamic = "force-dynamic";

export default async function DbSyncPage({ searchParams }: PageProps<"/admin/db-sync">) {
  const { done } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-2xl font-bold text-ink">データベース修復</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-dim">
        コードが前提としている列・テーブルが本番データベースにまだ無い場合に追加します。
        既にある場合は何もしないので、迷ったら押しても安全です。
      </p>

      {done === "1" && (
        <p className="mt-4 rounded-lg border border-good/30 bg-good-soft px-4 py-3 text-sm text-good">
          完了しました。<Link href="/admin" className="underline">管理トップ</Link>に戻って表示を確認してください。
        </p>
      )}

      <form action={syncDatabaseSchema} className="mt-6">
        <button
          type="submit"
          className="font-head w-full rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          データベースを修復する
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-dim">
        <Link href="/admin" className="text-accent hover:underline">
          管理トップへ戻る
        </Link>
      </p>
    </div>
  );
}
