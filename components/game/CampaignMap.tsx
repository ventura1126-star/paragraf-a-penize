"use client";

import Link from "next/link";
import { CASE_BY_ID } from "@/content/game/cases";
import { CAMPAIGN_BY_CHARACTER, campaignCaseIds } from "@/content/game/campaigns";
import { CARDS } from "@/content/game/cards";
import { fill } from "@/content/game/characters";
import { caseProgress, characterOf, openAll, useGame } from "@/lib/game/store";
import { PixelSprite } from "./PixelSprite";

/** Cesta příběhem postavy: nástrahy po sobě, na konci boss. */
export function CampaignMap() {
  const g = useGame();
  const ch = characterOf(g);
  const camp = ch ? CAMPAIGN_BY_CHARACTER.get(ch.id) : undefined;
  if (!ch || !camp) return null;

  const ids = campaignCaseIds(camp);
  const done = (id: string) => Boolean(caseProgress(g, id)?.done);
  const allOpen = g.opened[ch.id];
  const unlocked = (i: number) => allOpen || i === 0 || done(ids[i - 1]);
  const doneCount = ids.filter(done).length;
  const campCards = new Set(ids.flatMap((id) => CASE_BY_ID.get(id)?.rounds.map((r) => r.card) ?? []));
  const collected = CARDS.filter((c) => campCards.has(c.id) && g.cards[c.id]?.collected).length;
  const nextIdx = ids.findIndex((id, i) => unlocked(i) && !done(id));

  return (
    <>
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

      <ol className="trail">
        {ids.map((id, i) => {
          const c = CASE_BY_ID.get(id);
          if (!c) return null;
          const st = caseProgress(g, id);
          const open = unlocked(i);
          const isBoss = id === camp.boss;
          const cls = `trail-step ${st?.done ? "done" : ""} ${i === nextIdx ? "next" : ""} ${isBoss ? "boss" : ""} ${open ? "" : "locked"}`;
          const body = (
            <>
              <span className="trail-dot" aria-hidden>{st?.done ? "✓" : isBoss ? "★" : i + 1}</span>
              <span className="case-body">
                <strong>{isBoss ? `Boss: ${c.title}` : c.title}</strong>
                <span className="muted">{open ? fill(c.teaser, ch) : "Zamčeno – nejdřív vyřešte předchozí nástrahu."}</span>
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
                <Link href={`/hra/pripad/${id}`} className="card trail-card">{body}</Link>
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
}
