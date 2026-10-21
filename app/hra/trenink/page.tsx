import type { Metadata } from "next";
import { Training } from "@/components/game/Training";
import { HelpBanner } from "@/components/game/HelpBanner";

export const metadata: Metadata = { title: "Trénink" };

export default function TrainingPage() {
  return (
    <div className="narrow">
      <h1>Trénink</h1>
      <p className="lead">Karty, které je dnes čas zopakovat. Krátké, rychlé, bez trestů.</p>
      <Training />
      <HelpBanner />
    </div>
  );
}
