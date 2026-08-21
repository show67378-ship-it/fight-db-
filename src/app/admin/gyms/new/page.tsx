import GymForm from "@/components/admin/GymForm";
import { createGym } from "@/lib/actions";

export default function NewGymPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">ジムを追加</h1>
      <GymForm action={createGym} />
    </div>
  );
}
