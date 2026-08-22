import { notFound } from "next/navigation";
import Link from "next/link";
import { getAthletes, getGym } from "@/lib/data";
import SportTag from "@/components/SportTag";
import Avatar from "@/components/Avatar";
import GymMap from "@/components/GymMap";
import TrialApplicationForm from "@/components/TrialApplicationForm";

export const dynamic = "force-dynamic";

export default async function GymDetailPage({
  params,
  searchParams,
}: PageProps<"/gyms/[id]">) {
  const { id } = await params;
  const { applied } = await searchParams;
  const gym = await getGym(id);
  if (!gym) notFound();

  const allAthletes = await getAthletes();
  const belongingAthletes = allAthletes.filter((a) => a.gymId === gym.id);
  const mapQuery = [gym.name, gym.prefecture, gym.city, gym.address].filter(Boolean).join(" ");

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex flex-wrap gap-1.5">
        {gym.sports.map((s) => (
          <SportTag key={s} sport={s} />
        ))}
      </div>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">{gym.name}</h1>
      <p className="mt-1 text-ink-dim">{gym.address ?? `${gym.prefecture}${gym.city}`}</p>
      {gym.websiteUrl && (
        <a
          href={gym.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-accent hover:underline"
        >
          ジム公式HP →
        </a>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-head text-lg font-bold text-ink">ジム紹介</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">{gym.description}</p>

          {gym.instructors && gym.instructors.length > 0 && (
            <div className="mt-8">
              <h2 className="font-head text-lg font-bold text-ink">主な指導者</h2>
              <ul className="mt-3 space-y-2">
                {gym.instructors.map((ins) => (
                  <li key={ins.name} className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-head font-semibold text-ink">{ins.name}</span>
                    {ins.title && <span className="ml-2 text-ink-dim">{ins.title}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {belongingAthletes.length > 0 && (
            <div className="mt-8">
              <h2 className="font-head text-lg font-bold text-ink">所属選手</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {belongingAthletes.map((a) => (
                  <Link
                    key={a.id}
                    href={`/athletes/${a.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition hover:border-accent"
                  >
                    <Avatar name={a.name} sport={a.sport} size={40} />
                    <span className="font-head text-sm font-semibold text-ink">{a.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-head text-lg font-bold text-ink">地図</h2>
            <div className="mt-3">
              <GymMap query={mapQuery} />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-5">
          <p className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">体験情報</p>
          <p className="mt-2 text-sm font-medium text-ink">{gym.trialInfo}</p>
          <dl className="mt-4 space-y-2 text-sm">
            {gym.phone && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-dim">電話</dt>
                <dd className="tabular text-ink">{gym.phone}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-ink-dim">所在地</dt>
              <dd className="text-right text-ink">
                {gym.prefecture}{gym.city}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-border pt-5">
            <p className="font-head mb-3 text-xs font-semibold uppercase tracking-wide text-ink-dim">
              体験申込
            </p>
            <TrialApplicationForm gymId={gym.id} applied={applied === "1"} />
          </div>

          {gym.websiteUrl && (
            <p className="mt-4 text-[11px] text-ink-dim">
              ジム公式HP:{" "}
              <a href={gym.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                {gym.websiteUrl}
              </a>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
