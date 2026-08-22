import { getAthletes, getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import AthletesBrowser from "@/components/AthletesBrowser";

export const dynamic = "force-dynamic";

export default async function AthletesPage() {
  const [allAthletes, gyms] = await Promise.all([getAthletes(), getGyms()]);
  const athletes = allAthletes.filter((a) => activeSports.includes(a.sport));
  return <AthletesBrowser athletes={athletes} gyms={gyms} />;
}
