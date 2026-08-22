import { notFound } from "next/navigation";
import MatchForm from "@/components/admin/MatchForm";
import { getMatch } from "@/lib/data";
import { deleteMatch, updateMatch } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function EditMatchPage({ params }: PageProps<"/admin/matches/[id]">) {
  const { id } = await params;
  const match = await getMatch(id);
  if (!match) notFound();

  const boundUpdate = updateMatch.bind(null, id);
  const boundDelete = deleteMatch.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">勝敗予想を編集</h1>
      <MatchForm match={match} action={boundUpdate} />

      <form action={boundDelete} className="mt-8 border-t border-border pt-6">
        <button
          type="submit"
          className="font-head text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
        >
          この勝敗予想を削除する
        </button>
      </form>
    </div>
  );
}
