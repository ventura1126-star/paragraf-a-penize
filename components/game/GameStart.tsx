"use client";

import { characterOf, useGame, useHydrated } from "@/lib/game/store";
import { CharacterPicker } from "./CharacterPicker";

/** Hra začíná výběrem postavy: dokud žádná není zvolena, ukáže se místo mapy úvodní obrazovka. */
export function GameStart({ children }: { children: React.ReactNode }) {
  const g = useGame();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (characterOf(g)) return <>{children}</>;
  return (
    <>
      <div className="start-hero">
        <div className="eyebrow">Město paragrafů · nová hra</div>
        <h1>Vyberte si postavu</h1>
        <p className="lead">
          Pět lidí, pět životních situací, ve kterých se dluhy objevují nejčastěji. Za koho budete hrát? Postava mění
          příběhy, příjem ve výpočtech i startovní peněženku. Zákon platí pro všechny stejně.
        </p>
      </div>
      <CharacterPicker />
    </>
  );
}
