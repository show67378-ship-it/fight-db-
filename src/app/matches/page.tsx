import { activeSports } from "@/lib/taxonomy";
import { getAthlete, getAthletes, getMatches, organizations } from "@/lib/data";
import MatchPreviewCard from "@/components/MatchPreviewCard";
import OrgTag from "@/components/OrgTag";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "勝敗予想 | 格闘.com",
};

export default function MatchesPage() {
  const athleteIds = new Set(getAthletes().map((a) => a.id));
  const matches = getMatches().filter(
    (m) => activeSports.includes(m.sport) && athleteIds.has(m.athleteAId) && athleteIds.has(m.athleteBId)
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Prediction</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">勝敗予想</h1>
      <p className="mt-2 text-ink-dim">開催予定の試合について、どちらが勝つと思うか投票できます。団体ごとに分けて表示しています。</p>

      {organizations.map((org) => {
        const orgMatches = matches.filter((m) => m.organization === org.slug);
        const openMatches = orgMatches.filter((m) => m.status === "open");
        const closedMatches = orgMatches.filter((m) => m.status === "closed");

        return (
          <section key={org.slug} className="mt-14 border-t border-border pt-10 first:mt-10 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-3">
              <OrgTag organization={org.slug} />
              <h2 className="font-head text-xl font-bold text-ink">{org.name}</h2>
            </div>

            <h3 className="font-head mt-6 text-sm font-semibold uppercase tracking-wide text-ink-dim">投票受付中</h3>
            {openMatches.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {openMatches.map((m) => (
                  <MatchPreviewCard
                    key={m.id}
                    match={m}
                    athleteA={getAthlete(m.athleteAId)!}
                    athleteB={getAthlete(m.athleteBId)!}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-dim">現在{org.name}の受付中の予想はありません。</p>
            )}

            {closedMatches.length > 0 && (
              <>
                <h3 className="font-head mt-8 text-sm font-semibold uppercase tracking-wide text-ink-dim">
                  予想結果アーカイブ
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {closedMatches.map((m) => (
                    <MatchPreviewCard
                      key={m.id}
                      match={m}
                      athleteA={getAthlete(m.athleteAId)!}
                      athleteB={getAthlete(m.athleteBId)!}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
