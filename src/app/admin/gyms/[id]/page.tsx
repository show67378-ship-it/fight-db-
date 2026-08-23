import { notFound } from "next/navigation";
import GymForm from "@/components/admin/GymForm";
import { getGym } from "@/lib/data";
import { deleteGym, updateGym } from "@/lib/actions";
import { idCandidates } from "@/lib/resolveParamId";

export const dynamic = "force-dynamic";

export default async function EditGymPage({ params }: PageProps<"/admin/gyms/[id]">) {
  const { id: rawId } = await params;
  // 動的セグメントがURLエンコードされたまま渡るか、デコード済みで渡るかは環境によって
  // 異なるため、日本語id等は両方のパターンで検索する(idCandidates参照)。
  let id = rawId;
  let gym: Awaited<ReturnType<typeof getGym>>;
  for (const candidate of idCandidates(rawId)) {
    gym = await getGym(candidate);
    if (gym) {
      id = candidate;
      break;
    }
  }
  if (!gym) notFound();

  const boundUpdate = updateGym.bind(null, id);
  const boundDelete = deleteGym.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジムを編集</h1>
      <GymForm gym={gym} action={boundUpdate} />

      <form action={boundDelete} className="mt-8 border-t border-border pt-6">
        <button
          type="submit"
          className="font-head text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
        >
          このジムを削除する
        </button>
      </form>
    </div>
  );
}
