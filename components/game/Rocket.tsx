"use client";

import { useEffect, useState } from "react";
import type { World } from "@/content/game/city";
import { CAMPAIGN_BY_CHARACTER, PLANET_CAMPAIGN, campaignCaseIds } from "@/content/game/campaigns";
import { caseProgress, characterOf, travel, useGame } from "@/lib/game/store";
import { planetFinished, storyFinished } from "@/lib/game/city-logic";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { useGameNav } from "./GameNav";

const PILOT = { h: "#f2c94c", s: "#f1c7a1", t: "#e6ebf2", T: "#b9c0ca", w: "#3a7bd5", p: "#e6ebf2", b: "#3a7bd5" };
const NAMES: Record<World, string> = { mesto: "Město dluhů", ostrov: "Daňový ráj", planeta: "Planeta investic" };

/** Raketová rampa: let na Planetu investic (z města i z ostrova) a zpátky. */
export function RocketScreen() {
  const g = useGame();
  const nav = useGameNav();
  const ch = characterOf(g);
  const [count, setCount] = useState<{ to: World; n: number } | null>(null);

  useEffect(() => {
    if (!count) return;
    if (count.n < 0) {
      travel(count.to, "raketa");
      nav?.go("/hra");
      return;
    }
    const t = setTimeout(() => setCount({ ...count, n: count.n - 1 }), 800);
    return () => clearTimeout(t);
  }, [count, nav]);

  if (!ch) return <NeedCharacter />;
  const onPlanet = g.world === "planeta";
  const ready = onPlanet || storyFinished(g);
  const camp = CAMPAIGN_BY_CHARACTER.get(ch.id);
  const left = camp ? campaignCaseIds(camp).filter((id) => !caseProgress(g, id)?.done).length : 0;

  if (count) {
    return (
      <div className="rocket-launch" aria-live="assertive">
        <div className={`rocket-fly ${count.n <= 0 ? "go" : ""}`} aria-hidden>
          🚀
        </div>
        <div className="rocket-count">{count.n > 0 ? count.n : "START!"}</div>
        <div className="muted small">Kurz: {NAMES[count.to]}</div>
      </div>
    );
  }

  let say: string;
  if (onPlanet) say = planetFinished(g) ? "Investorka i investor jak se patří! Kam poletíme?" : "Zpátky na Zemi? Planeta tu na vás počká.";
  else if (!ready) say = `Na Planetu investic létají jen ti, kdo mají ve Městě dluhů hotovo. Zbývá vám ${left} ${left === 1 ? "nástraha" : left < 5 ? "nástrahy" : "nástrah"}.`;
  else say = `Míříme na Planetu investic. ${PLANET_CAMPAIGN.intro}`;

  return (
    <div className="dialogue card">
      <div className="dialogue-npc">
        <span className="dialogue-portrait">
          <PixelSprite id="jana" palette={PILOT} variant="bust" scale={5} />
        </span>
        <div>
          <strong>pilotka Nova</strong>
          <div className="muted small">raketa Paragraf I</div>
        </div>
      </div>
      <div className="dialogue-log">
        <div className="dl-line dl-npc">
          <div className="dl-bubble">{say}</div>
        </div>
      </div>
      <div className="dialogue-choices">
        {onPlanet ? (
          <>
            <button type="button" className="btn-primary" onClick={() => setCount({ to: "mesto", n: 3 })}>🚀 Letět do Města dluhů</button>
            <button type="button" className="btn-secondary" onClick={() => setCount({ to: "ostrov", n: 3 })}>🚀 Letět do Daňového ráje</button>
          </>
        ) : (
          ready && (
            <button type="button" className="btn-primary" onClick={() => setCount({ to: "planeta", n: 3 })}>
              🚀 Odstartovat na Planetu investic
            </button>
          )
        )}
        <button type="button" className="btn-secondary" onClick={() => nav?.go("/hra")}>
          Zůstat na zemi
        </button>
      </div>
    </div>
  );
}
