import type { Metadata } from "next";
import { CampaignMap } from "@/components/game/CampaignMap";
import { ResetButton } from "@/components/game/ResetButton";
import { GameStart } from "@/components/game/GameStart";

export const metadata: Metadata = {
  title: "Hra",
  description: "Řešte případy z praxe – o výsledku rozhoduje paragraf. Sbírejte karty zákonů a trénujte lhůty.",
};

export default function GameHome() {
  return (
    <GameStart>
      <CampaignMap />
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
    </GameStart>
  );
}
