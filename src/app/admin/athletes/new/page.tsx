import AthleteForm from "@/components/admin/AthleteForm";
import { createAthlete } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default function NewAthletePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">選手を追加</h1>
      <AthleteForm action={createAthlete} />
    </div>
  );
}
