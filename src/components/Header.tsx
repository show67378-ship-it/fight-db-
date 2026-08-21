import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-head text-xl font-bold tracking-tight text-ink">
            格闘<span className="text-accent">.com</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/matches"
            className="font-head px-3 py-2 text-[13px] font-bold uppercase tracking-wide text-accent transition hover:opacity-80"
          >
            勝敗予想
          </Link>
          <Link
            href="/dream-matches"
            className="font-head px-3 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-dim transition hover:text-ink"
          >
            次に観たい試合
          </Link>
          <Link
            href="/gyms"
            className="font-head px-3 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-dim transition hover:text-ink"
          >
            ジムを探す
          </Link>
          <Link
            href="/athletes"
            className="font-head px-3 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-dim transition hover:text-ink"
          >
            選手を知る
          </Link>
        </nav>

        <Link
          href="/gyms"
          className="font-head rounded-sm bg-accent px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          体験申込
        </Link>
      </div>

      <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-5 py-2 md:hidden">
        <Link href="/matches" className="font-head shrink-0 text-[12px] font-bold uppercase tracking-wide text-accent">
          勝敗予想
        </Link>
        <Link href="/dream-matches" className="font-head shrink-0 text-[12px] font-medium uppercase tracking-wide text-ink-dim">
          次に観たい試合
        </Link>
        <Link href="/gyms" className="font-head shrink-0 text-[12px] font-medium uppercase tracking-wide text-ink-dim">
          ジムを探す
        </Link>
        <Link href="/athletes" className="font-head shrink-0 text-[12px] font-medium uppercase tracking-wide text-ink-dim">
          選手を知る
        </Link>
      </nav>
    </header>
  );
}
