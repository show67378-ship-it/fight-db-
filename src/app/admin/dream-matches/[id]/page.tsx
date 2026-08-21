import { notFound } from "next/navigation";
import DreamMatchForm from "@/components/admin/DreamMatchForm";
import { getDreamMatch } from "@/lib/data";
import { deleteDreamMatch, updateDreamMatch } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function EditDreamMatchPage({ params }: PageProps<"/admin/dream-matches/[id]">) {
  const { id } = await params;
  const card = getDreamMatch(id);
  if (!card) notFound();

  const boundUpdate = updateDreamMatch.bind(null, id);
  const boundDelete = deleteDreamMatch.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">対戦カードを編集</h1>
      <DreamMatchForm card={card} action={boundUpdate} />

      <form action={boundDelete} className="mt-8 border-t border-border pt-6">
        <button
          type="submit"
          className="font-head text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
        >
          このカードを削除する
        </button>
      </form>
    </div>
  );
}
