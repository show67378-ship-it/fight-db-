import { notFound } from "next/navigation";
import AthleteForm from "@/components/admin/AthleteForm";
import { getAthlete } from "@/lib/data";
import { deleteAthlete, updateAthlete } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function EditAthletePage({ params }: PageProps<"/admin/athletes/[id]">) {
  const { id } = await params;
  const athlete = getAthlete(id);
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
