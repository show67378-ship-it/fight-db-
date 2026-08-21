import { getAthletes, getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import AthletesBrowser from "@/components/AthletesBrowser";

export const dynamic = "force-dynamic";

export default function AthletesPage() {
  const athletes = getAthletes().filter((a) => activeSports.includes(a.sport));
  return <AthletesBrowser athletes={athletes} gyms={getGyms()} />;
}
