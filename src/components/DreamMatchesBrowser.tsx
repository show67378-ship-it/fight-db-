"use client";

import { useMemo, useState } from "react";
import { organizations } from "@/lib/taxonomy";
import type { Athlete, Comment, DreamMatchCard, OrganizationSlug } from "@/lib/types";
import Avatar from "@/components/Avatar";
import SportTag from "@/components/SportTag";
import OrgTag from "@/components/OrgTag";
import Comments from "@/components/Comments";

let nextId = 1;

export default function DreamMatchesBrowser({
  athletes,
  dreamMatches: initialDreamMatches,
  commentsByCard,
  commentStatus,
}: {
  athletes: Athlete[];
  dreamMatches: DreamMatchCard[];
  commentsByCard: Record<string, Comment[]>;
  commentStatus?: string;
}) {
  const [cards, setCards] = useState<DreamMatchCard[]>(initialDreamMatches);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const [newOrg, setNewOrg] = useState<OrganizationSlug>("rizin");
  const orgAthletes = useMemo(
    () => athletes.filter((a) => a.organizations.includes(newOrg)),
    [athletes, newOrg]
  );
  const [athleteAId, setAthleteAId] = useState(orgAthletes[0]?.id ?? "");
  const [athleteBId, setAthleteBId] = useState(orgAthletes[1]?.id ?? "");

  const getAthlete = (id: string) => athletes.find((a) => a.id === id)!;

  function vote(cardId: string) {
    if (votedIds.has(cardId)) return;
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, votes: c.votes + 1 } : c)));
    setVotedIds((prev) => new Set(prev).add(cardId));
  }

  function createCard() {
    if (!athleteAId || !athleteBId || athleteAId === athleteBId) return;
    const a = athletes.find((x) => x.id === athleteAId)!;
    const newCard: DreamMatchCard = {
      id: `dream-new-${nextId++}`,
      sport: a.sport,
      organization: newOrg,
      athleteAId,
      athleteBId,
      votes: 1,
    };
    setCards((prev) => [newCard, ...prev]);
    setVotedIds((prev) => new Set(prev).add(newCard.id));
  }

  function onOrgChange(o: OrganizationSlug) {
    setNewOrg(o);
    const list = athletes.filter((a) => a.organizations.includes(o));
    setAthleteAId(list[0]?.id ?? "");
    setAthleteBId(list[1]?.id ?? "");
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Dream Match</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">次に観たい試合ランキング</h1>
      <p className="mt-2 text-ink-dim">
        現在はRIZIN・BREAKINGDOWN所属選手のみが対象です。団体ごとにランキングを分けて表示しています。
      </p>

      {commentStatus === "flagged" && (
        <p className="mt-3 rounded-sm border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          不適切な内容と判定されたため、コメントは公開されませんでした。
        </p>
      )}
      {commentStatus === "posted" && (
        <p className="mt-3 rounded-sm border border-good/30 bg-good-soft px-4 py-3 text-sm text-good">
          コメントを投稿しました。
        </p>
      )}

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <p className="font-head text-xs font-semibold uppercase tracking-wide text-ink-dim">
          対戦カードを作成する
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={newOrg}
            onChange={(e) => onOrgChange(e.target.value as OrganizationSlug)}
            className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {organizations.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
          <select
            value={athleteAId}
            onChange={(e) => setAthleteAId(e.target.value)}
            className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {orgAthletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <span className="font-head text-sm text-ink-dim">VS</span>
          <select
            value={athleteBId}
            onChange={(e) => setAthleteBId(e.target.value)}
            className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {orgAthletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            onClick={createCard}
            disabled={athleteAId === athleteBId}
            className="font-head rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink transition hover:opacity-90 disabled:opacity-40"
          >
            作成して投票
          </button>
        </div>
      </div>

      {organizations.map((org) => {
        const ranked = cards
          .filter((c) => c.organization === org.slug)
          .sort((a, b) => b.votes - a.votes);

        return (
          <section key={org.slug} className="mt-12 border-t border-border pt-8 first:mt-10 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-3">
              <OrgTag organization={org.slug} />
              <h2 className="font-head text-lg font-bold text-ink">{org.name}のランキング</h2>
            </div>

            {ranked.length > 0 ? (
              <div className="mt-4 space-y-3">
                {ranked.map((card, i) => {
                  const a = getAthlete(card.athleteAId);
                  const b = getAthlete(card.athleteBId);
                  const voted = votedIds.has(card.id);
                  const cardComments = commentsByCard[card.id] ?? [];
                  return (
                    <div key={card.id} className="rounded-lg border border-border bg-surface p-4">
                      <div className="flex items-center gap-4">
                        <span className="font-head w-8 text-2xl font-bold text-accent">{i + 1}</span>
                        <Avatar name={a.name} sport={card.sport} size={40} />
                        <div className="flex-1">
                          <span className="font-head text-sm font-medium text-ink">
                            {a.name} <span className="text-ink-dim">vs</span> {b.name}
                          </span>
                          <div className="mt-1">
                            <SportTag sport={card.sport} />
                          </div>
                        </div>
                        <Avatar name={b.name} sport={card.sport} size={40} />
                        <span className="tabular w-20 text-right text-sm font-semibold text-ink">
                          {card.votes.toLocaleString("ja-JP")}票
                        </span>
                        <button
                          onClick={() => vote(card.id)}
                          disabled={voted}
                          className={`font-head rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                            voted
                              ? "border-border text-ink-dim opacity-50"
                              : "border-accent text-accent hover:bg-accent hover:text-accent-ink"
                          }`}
                        >
                          {voted ? "投票済み" : "投票"}
                        </button>
                      </div>
                      <details className="group mt-3">
                        <summary className="font-head cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-ink-dim transition hover:text-ink">
                          コメント ({cardComments.length})
                        </summary>
                        <Comments
                          targetType="dreamMatch"
                          targetId={card.id}
                          comments={cardComments}
                          hideHeading
                          className="mt-3"
                        />
                      </details>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink-dim">まだ{org.name}の対戦カードがありません。上のフォームから作成できます。</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
