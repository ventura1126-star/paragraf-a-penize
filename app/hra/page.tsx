import type { Metadata } from "next";
import { CampaignMap } from "@/components/game/CampaignMap";
import { CityCanvas } from "@/components/game/CityCanvas";
import { YearReport } from "@/components/game/YearReport";
import { ResetButton } from "@/components/game/ResetButton";
import { GameStart } from "@/components/game/GameStart";

export const metadata: Metadata = {
  title: "Hra",
  description: "Řešte případy z praxe – o výsledku rozhoduje paragraf. Sbírejte karty zákonů a trénujte lhůty.",
};

export default function GameHome() {
  return (
    <GameStart>
      <CampaignMap part="hero" />
      <YearReport />
      <CityCanvas />
      <details className="city-list">
        <summary>Příběh v bodech</summary>
        <CampaignMap part="trail" />
      </details>
      <div className="game-howto card">
        <h2>Jak se hraje</h2>
        <ol className="steps">
          <li><strong>Chůze:</strong> klepněte na budovu nebo choďte šipkami. Vykřičník = tady na vás něco čeká.</li>
          <li><strong>Budova:</strong> uvnitř je příprava na téma a nástraha s rozhodnutím.</li>
          <li><strong>Verdikt:</strong> rozhoduje paragraf. Uvidíte dopad na peněženku a dluhovou zátěž.</li>
          <li><strong>Důsledky:</strong> každá nástraha posune čas o měsíc. Špatné rozhodnutí může poslat dopis do schránky.</li>
          <li><strong>Lhůty:</strong> když běží LHŮTA, doběhněte do budovy včas – propadlá lhůta stojí peníze.</li>
          <li><strong>Hledanost ★:</strong> čím větší dluhová zátěž, tím víc hvězd. Od 3 hvězd vás honí exekutor.</li>
          <li><strong>Pomoc:</strong> Dluhová poradna na náměstí je úkryt před exekutorem a snižuje zátěž.</li>
        </ol>
      </div>
      <ResetButton />
    </GameStart>
  );
}
