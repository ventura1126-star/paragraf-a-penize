import type { Metadata } from "next";
import { DistrictMap } from "@/components/game/DistrictMap";
import { ResetButton } from "@/components/game/ResetButton";

export const metadata: Metadata = {
  title: "Hra",
  description: "Řešte případy z praxe – o výsledku rozhoduje paragraf. Sbírejte karty zákonů a trénujte lhůty.",
};

export default function GameHome() {
  return (
    <>
      <h1>Město paragrafů</h1>
      <p className="lead">
        Provázíte Tomáše jeho finančními problémy. Každé rozhodnutí rozsoudí konkrétní paragraf – a vy uvidíte, kolik by
        chyba stála. Správná rozhodnutí přinášejí karty do alba.
      </p>
      <DistrictMap />
      <div className="game-howto card">
        <h2>Jak se hraje</h2>
        <ol className="steps">
          <li><strong>Případ:</strong> situace z reálného života – dopis, smlouva, výplatní páska.</li>
          <li><strong>Rozhodnutí:</strong> vyberete jednu z možností. Paragraf je zatím skrytý.</li>
          <li><strong>Verdikt:</strong> uvidíte důsledek, dopad na peněženku postavy a rozhodující ustanovení.</li>
          <li><strong>Odměna:</strong> XP a karta paragrafu. Chybné karty se vrátí v tréninku za 1, 3 a 7 dní.</li>
        </ol>
      </div>
      <ResetButton />
    </>
  );
}
