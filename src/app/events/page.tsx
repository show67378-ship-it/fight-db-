import { amateurEvents, proEvents, type EventBrand } from "@/lib/events";

export const metadata = {
  title: "MMA大会情報 | 格闘.com",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Events</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">MMA大会情報</h1>
      <p className="mt-2 text-ink-dim">
        国内で開催されているMMA(総合格闘技)の大会・団体を、プロ/アマチュア別にまとめています。
      </p>

      <Section title="プロ" items={proEvents} />
      <Section title="アマチュア" items={amateurEvents} />

      <p className="mt-10 text-xs text-ink-dim">
        ※ 開催状況は変動するため、最新情報は各団体の公式サイトでご確認ください。
      </p>
    </div>
  );
}

function Section({ title, items }: { title: string; items: EventBrand[] }) {
  return (
    <div className="mt-10">
      <h2 className="font-head text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((e) => (
          <div key={e.name} className="rounded-lg border border-border bg-surface p-5">
            <p className="font-head text-base font-semibold text-ink">{e.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{e.description}</p>
            <a
              href={e.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-accent hover:underline break-all"
            >
              {e.sourceUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
