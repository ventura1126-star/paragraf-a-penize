"use client";

import { useEffect } from "react";
import { HOME_IDS, SCHOOL_IDS, buildingForCase, worldBuildings } from "@/content/game/city";
import { CASE_BY_ID } from "@/content/game/cases";
import { WORLD_STORY, campaignCaseIds } from "@/content/game/campaigns";
import { fill } from "@/content/game/characters";
import { campaignFor } from "@/lib/game/city-logic";
import { characterOf, markWorldSeen, useGame } from "@/lib/game/store";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { useGameNav } from "./GameNav";

const WORLD_NAME = { mesto: "Město dluhů", ostrov: "Daňový ráj", planeta: "Planeta investic" } as const;
const WORLD_TAG = {
  mesto: "Zákony a povinnosti",
  ostrov: "Daně v podnikání",
  planeta: "Investice",
} as const;

/** Okno při prvním vstupu do světa: příběh postavy, kapitoly a kde co je. */
export function WorldIntro() {
  const g = useGame();
  const nav = useGameNav();
  const ch = characterOf(g);
  const world = g.world;
  // jednou viděno = příště se už samo neukáže
  useEffect(() => {
    if (ch) markWorldSeen(world);
  }, [ch, world]);
  if (!ch) return <NeedCharacter />;
  const camp = campaignFor(g);
  const ids = camp ? campaignCaseIds(camp) : [];
  const story = world === "mesto" ? camp?.intro : WORLD_STORY[world][ch.id];
  const buildings = worldBuildings(world);
  const school = buildings.find((b) => SCHOOL_IDS.has(b.id))?.name;
  const home = buildings.find((b) => HOME_IDS.has(b.id))?.name;

  return (
    <div className={`world-intro wi-${world}`}>
      <div className="wi-head">
        <PixelSprite id={ch.id} scale={5} />
        <div>
          <div className="wi-tag">{WORLD_TAG[world]}</div>
          <h2>{camp?.title ?? WORLD_NAME[world]}</h2>
          <p className="wi-story">{story && fill(story, ch)}</p>
        </div>
      </div>

      <h3>Co {ch.feminine ? "ji" : "ho"} tu čeká</h3>
      <ol className="wi-chapters">
        {ids.map((id, i) => {
          const c = CASE_BY_ID.get(id);
          const b = buildingForCase(id);
          if (!c) return null;
          return (
            <li key={id} className={c.boss ? "boss" : i === 0 ? "first" : undefined}>
              <strong>{c.boss ? `Boss: ${c.title}` : c.title}</strong>
              <span className="muted small">{b?.name}</span>
            </li>
          );
        })}
      </ol>

      <ul className="wi-tips">
        <li>Kapitola stojí ⚡⚡ a za měsíc jde jedna; po každé druhé přijde měsíc volna.</li>
        {school && <li>Ve škole <strong>{school}</strong> se přednášky otevírají s každou vyřešenou kapitolou.</li>}
        {home && <li>V budově <strong>{home}</strong> se vyspíte do dalšího měsíce a čte se tu pošta.</li>}
        <li>Lidé s otazníkem na ulici chtějí poradit – za dobrou radu jsou XP.</li>
      </ul>

      <button type="button" className="btn-primary wi-go" onClick={() => nav?.go("/hra")}>
        Jdeme na to ▶
      </button>
    </div>
  );
}
