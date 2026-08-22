import { getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import GymsBrowser from "@/components/GymsBrowser";

export const dynamic = "force-dynamic";

export default async function GymsPage() {
  const allGyms = await getGyms();
  const gyms = allGyms.filter((g) => g.sports.some((s) => activeSports.includes(s)));
  return <GymsBrowser gyms={gyms} />;
}
