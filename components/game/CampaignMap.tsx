"use client";

import { GameLink as Link } from "./GameNav";
import { CASE_BY_ID } from "@/content/game/cases";
import { campaignCaseIds } from "@/content/game/campaigns";
import { campaignFor } from "@/lib/game/city-logic";
import { CARDS } from "@/content/game/cards";
import { fill } from "@/content/game/characters";
import { caseProgress, characterOf, openAll, prepDone, useGame } from "@/lib/game/store";
import { PREP_BY_ID, PREP_FOR_CASE } from "@/content/game/preps";
import { PixelSprite } from "./PixelSprite";
import { buildingForCase } from "@/content/game/city";

/** Cesta příběhem postavy: nástrahy po sobě, na konci boss. */
export function CampaignMap({ part = "all" }: { part?: "all" | "hero" | "trail" }) {
  const g = useGame();
  const ch = characterOf(g);
  const camp = campaignFor(g);
  if (!ch || !camp) return null;

  const ids = campaignCaseIds(camp);
  const done = (id: string) => Boolean(caseProgress(g, id)?.done);
  const allOpen = g.opened[ch.id];
  const unlocked = (i: number) => allOpen || i === 0 || done(ids[i - 1]);
  const doneCount = ids.filter(done).length;
  const campCards = new Set(ids.flatMap((id) => CASE_BY_ID.get(id)?.rounds.map((r) => r.card) ?? []));
  const collected = CARDS.filter((c) => campCards.has(c.id) && g.cards[c.id]?.collected).length;
  const nextIdx = ids.findIndex((id, i) => unlocked(i) && !done(id));

  const hero = (
      <div className={`card campaign-hero avatar-c${ch.color}`}>
        <PixelSprite id={ch.id} scale={5} className="sprite" />
        <div>
          <div className="eyebrow">Příběh postavy {ch.forms.g}</div>
          <h1>{camp.title}</h1>
          <p>{camp.intro}</p>
          <div className="district-meta">
            <span className="tag">{doneCount}/{ids.length} nástrah</span>
            <span className="tag">{collected}/{campCards.size} karet</span>
          </div>
        </div>
      </div>
  );
  if (part === "hero") return hero;

  const trail = (
    <>
      <ol className="trail">
        {ids.map((id, i) => {
          const c = CASE_BY_ID.get(id);
          if (!c) return null;
          const st = caseProgress(g, id);
          const open = unlocked(i);
          const isBoss = id === camp.boss;
          const prep = PREP_BY_ID.get(PREP_FOR_CASE[id] ?? "");
          const needsPrep = open && !st?.done && prep && !prepDone(g, prep.id);
          const cls = `trail-step ${st?.done ? "done" : ""} ${i === nextIdx ? "next" : ""} ${isBoss ? "boss" : ""} ${open ? "" : "locked"}`;
          const body = (
            <>
              <span className="trail-dot" aria-hidden>{st?.done ? "✓" : isBoss ? "★" : i + 1}</span>
              <span className="case-body">
                <strong>{isBoss ? `Boss: ${c.title}` : c.title}</strong>
                <span className="muted">{open ? fill(c.teaser, ch) : "Zamčeno – nejdřív vyřešte předchozí nástrahu."}</span>
                {needsPrep && <span className="prep-tag">nejdřív příprava: {prep.title}</span>}
              </span>
              {st?.done ? (
                <span className="tag tag-done">{st.correct}/{st.total} správně</span>
              ) : i === nextIdx ? (
                <span className="btn-primary">Hrát</span>
              ) : null}
            </>
          );
          return (
            <li key={id} className={cls}>
              {open ? (
                <Link href={buildingForCase(id) ? `/hra/budova/${buildingForCase(id)!.id}` : `/hra/pripad/${id}`} className="card trail-card">{body}</Link>
              ) : (
                <div className="card trail-card">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      {!allOpen && doneCount < ids.length && (
        <p className="muted small">
          Řešíte něco konkrétního hned teď?{" "}
          <button type="button" className="linklike" onClick={openAll}>Odemknout všechny nástrahy</button>
        </p>
      )}
    </>
  );
  if (part === "trail") return trail;
  return (
    <>
      {hero}
      {trail}
    </>
  );
}
