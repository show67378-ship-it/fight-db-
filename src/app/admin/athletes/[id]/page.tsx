import { notFound } from "next/navigation";
import AthleteForm from "@/components/admin/AthleteForm";
import { getAthlete } from "@/lib/data";
import { deleteAthlete, updateAthlete } from "@/lib/actions";
import { idCandidates } from "@/lib/resolveParamId";

export const dynamic = "force-dynamic";

export default async function EditAthletePage({ params }: PageProps<"/admin/athletes/[id]">) {
  const { id: rawId } = await params;
  // 動的セグメントがURLエンコードされたまま渡るか、デコード済みで渡るかは環境によって
  // 異なるため、日本語id等は両方のパターンで検索する(idCandidates参照)。
  let id = rawId;
  let athlete: Awaited<ReturnType<typeof getAthlete>>;
  for (const candidate of idCandidates(rawId)) {
    athlete = await getAthlete(candidate);
    if (athlete) {
      id = candidate;
      break;
    }
  }
  if (!athlete) notFound();

  const boundUpdate = updateAthlete.bind(null, id);
  const boundDelete = deleteAthlete.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">選手を編集</h1>
      <AthleteForm athlete={athlete} action={boundUpdate} />

      <form action={boundDelete} className="mt-8 border-t border-border pt-6">
        <button
          type="submit"
          className="font-head text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
        >
          この選手を削除する
        </button>
      </form>
    </div>
  );
}
