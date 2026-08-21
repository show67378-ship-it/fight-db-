import Link from "next/link";

export const metadata = {
  title: "会社概要 | 格闘.com",
};

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "会社名", value: "株式会社ISHIHARA SHOW" },
  { label: "代表取締役", value: "石原 しょう" },
  { label: "所在地", value: "東京都港区六本木3丁目16番12号 六本木KSビル5F" },
  {
    label: "事業内容",
    value: (
      <>
        PR・マーケティング事業
        <br />
        SNS・動画メディア事業
        <br />
        格闘技プラットフォーム「格闘.com」の運営
      </>
    ),
  },
  { label: "お問い合わせ", value: "info@ishiharashow.jp" },
];

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Company</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">会社概要</h1>
      <p className="mt-2 text-ink-dim">
        「格闘.com」は株式会社ISHIHARA SHOWが運営しています。
      </p>

      <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[140px_1fr] sm:gap-4">
            <dt className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">{r.label}</dt>
            <dd className="text-sm text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-ink-dim">
        代表からのメッセージは<Link href="/company/message" className="text-accent hover:underline">格闘.com代表挨拶</Link>をご覧ください。
      </p>
    </div>
  );
}
