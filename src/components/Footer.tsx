import Link from "next/link";
import { visibleSports } from "@/lib/taxonomy";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="font-head text-lg font-bold text-ink">
              格闘<span className="text-accent">.com</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink-dim">
              MMAの勝敗予想とドリームマッチ投票で楽しむ、参加型格闘技プラットフォーム(開発中)。
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
                競技
              </span>
              {visibleSports.map((s) => (
                <Link key={s.slug} href={`/${s.slug}`} className="text-ink-dim hover:text-ink">
                  {s.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
                サイト
              </span>
              <Link href="/matches" className="font-semibold text-accent hover:opacity-80">
                勝敗予想
              </Link>
              <Link href="/dream-matches" className="text-ink-dim hover:text-ink">
                次に観たい試合
              </Link>
              <Link href="/gyms" className="text-ink-dim hover:text-ink">
                ジムを探す
              </Link>
              <Link href="/athletes" className="text-ink-dim hover:text-ink">
                選手を知る
              </Link>
              <Link href="/events" className="text-ink-dim hover:text-ink">
                MMA大会情報
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
                会社情報
              </span>
              <Link href="/company" className="text-ink-dim hover:text-ink">
                会社概要
              </Link>
              <Link href="/company/message" className="text-ink-dim hover:text-ink">
                格闘.com代表挨拶
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-ink-dim">
          © 2026 格闘.com — MVP開発中のプレビューです。 ・{" "}
          <Link href="/admin" className="hover:text-ink">
            管理画面
          </Link>
        </p>
      </div>
    </footer>
  );
}
