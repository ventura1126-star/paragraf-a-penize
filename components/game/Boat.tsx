"use client";

import { CAMPAIGN_BY_CHARACTER, ISLAND_CAMPAIGN, campaignCaseIds } from "@/content/game/campaigns";
import { caseProgress, characterOf, travel, useGame } from "@/lib/game/store";
import { islandFinished, storyFinished } from "@/lib/game/city-logic";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { useGameNav } from "./GameNav";

const CAPTAIN = { h: "#f4f4f4", s: "#e0b48c", S: "#e8e0d0", t: "#2a4a7a", T: "#1d3559", w: "#f4f4f4", a: "#d4a017", p: "#f4f4f4" };

/** Molo: loď mezi Městem dluhů a ostrovem Daňový ráj. */
export function BoatScreen() {
  const g = useGame();
  const nav = useGameNav();
  const ch = characterOf(g);
  if (!ch) return <NeedCharacter />;
  if (g.world === "planeta") {
    return (
      <div className="dialogue card">
        <div className="dialogue-log">
          <div className="dl-line dl-npc">
            <div className="dl-bubble">Vesmírná vyhlídka. Lodě tady neplují – z planety se létá raketou z rampy na jihozápadě.</div>
          </div>
        </div>
        <div className="dialogue-choices">
          <button type="button" className="btn-primary" onClick={() => nav?.go("/hra")}>Zpět</button>
        </div>
      </div>
    );
  }
  const onIsland = g.world === "ostrov";
  const camp = CAMPAIGN_BY_CHARACTER.get(ch.id);
  const ids = camp ? campaignCaseIds(camp) : [];
  const left = ids.filter((id) => !caseProgress(g, id)?.done).length;
  const ready = onIsland || storyFinished(g);
  const go = () => {
    travel(onIsland ? "mesto" : "ostrov");
    nav?.go("/hra");
  };

  let say: string;
  if (onIsland) say = islandFinished(g) ? "Daně v ráji zvládnuté. Pluje se domů, nebo ještě zůstaneme?" : "Zpátky do města? Ostrov tu na vás počká.";
  else if (!ready) say = `Do Daňového ráje vozím jen ty, kdo mají ve městě hotovo. Zbývá vám ${left} ${left === 1 ? "nástraha" : left < 5 ? "nástrahy" : "nástrah"}.`;
  else say = "Ahoj, námořníku! Na ostrově Daňový ráj si otevřete podnikání – od živnosti po vlastní firmu. Jen pozor: daně se platí i v ráji.";

  return (
    <div className="dialogue card">
      <div className="dialogue-npc">
        <span className="dialogue-portrait">
          <PixelSprite id="petr" palette={CAPTAIN} variant="bust" scale={5} />
        </span>
        <div>
          <strong>kapitán Morgan</strong>
          <div className="muted small">loď Paragraf</div>
        </div>
      </div>
      <div className="dialogue-log">
        <div className="dl-line dl-npc">
          <div className="dl-bubble">{say}</div>
        </div>
        {!onIsland && ready && (
          <div className="dl-line dl-npc">
            <div className="dl-bubble">{ISLAND_CAMPAIGN.intro}</div>
          </div>
        )}
      </div>
      <div className="dialogue-choices">
        {ready && (
          <button type="button" className="btn-primary" onClick={go}>
            {onIsland ? "Plout zpět do Města dluhů ⛵" : "Nastoupit na loď ⛵"}
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => nav?.go("/hra")}>
          Zůstat na břehu
        </button>
      </div>
    </div>
  );
}
