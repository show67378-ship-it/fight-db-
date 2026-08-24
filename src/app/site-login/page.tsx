import { siteLogin } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

export default async function SiteLoginPage({ searchParams }: PageProps<"/site-login">) {
  const { next: rawNext, error } = await searchParams;
  const next = (Array.isArray(rawNext) ? rawNext[0] : rawNext) || "/";
  const hasError = Boolean(error);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">格闘.com</p>
      <h1 className="font-head mt-3 text-2xl font-bold text-ink">パスワードを入力してください</h1>

      {hasError && (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          パスワードが違います。
        </p>
      )}

      <form action={siteLogin} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="font-head w-full rounded-sm bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90"
        >
          入る
        </button>
      </form>
    </div>
  );
}
