import type { Metadata } from "next";
import { DeadlineGame } from "@/components/game/DeadlineGame";
import { Citations } from "@/components/CitationChip";

export const metadata: Metadata = {
  title: "Lhůta běží",
  description: "Kalendářní hádanky: spočítejte poslední den lhůty v exekuci včetně víkendů, svátků a fikce doručení.",
};

export default function DeadlinePage() {
  return (
    <div className="narrow">
      <h1>Lhůta běží</h1>
      <p className="lead">
        Zmeškaná lhůta bývá nejdražší chyba. Den události se nepočítá, lhůta končící o víkendu nebo svátku se posouvá na
        nejbližší pracovní den a nevyzvednutá obálka se považuje za doručenou 10. den od uložení.
      </p>
      <Citations cites={[{ law: "osr", par: "57", odst: 1 }, { law: "osr", par: "57", odst: 2 }, { law: "osr", par: "49", odst: 4 }]} label="Pravidla" />
      <DeadlineGame />
    </div>
  );
}
