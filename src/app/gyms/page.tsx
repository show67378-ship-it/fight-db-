import { getGyms } from "@/lib/data";
import { activeSports } from "@/lib/taxonomy";
import GymsBrowser from "@/components/GymsBrowser";

export const dynamic = "force-dynamic";

export default function GymsPage() {
  const gyms = getGyms().filter((g) => g.sports.some((s) => activeSports.includes(s)));
  return <GymsBrowser gyms={gyms} />;
}
