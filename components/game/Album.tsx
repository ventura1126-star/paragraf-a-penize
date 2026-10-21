"use client";

import { useState } from "react";
import { CARDS } from "@/content/game/cards";
import { LAWS } from "@/content/laws";
import { characterOf, useGame } from "@/lib/game/store";
import { CASE_BY_ID } from "@/content/game/cases";
import { CAMPAIGN_BY_CHARACTER, campaignCaseIds } from "@/content/game/campaigns";
import { formatDay } from "@/lib/game/dates";
import { CardBack, CardFace } from "./ParagraphCard";

export function Album() {
  const g = useGame();
  const [open, setOpen] = useState<string | null>(null);
  const ch = characterOf(g);
  const camp = ch ? CAMPAIGN_BY_CHARACTER.get(ch.id) : undefined;
  const campCards = new Set(camp ? campaignCaseIds(camp).flatMap((id) => CASE_BY_ID.get(id)?.rounds.map((r) => r.card) ?? []) : []);
  // Karty příběhu zvolené postavy + všechny už získané (i z jiných příběhů); karty z režimu Lhůta běží vždy.
  const shown = CARDS.filter((c) => campCards.has(c.id) || g.cards[c.id] || c.id === "osr-57-2" || c.id === "osr-49-4");
  const laws = [...new Set(shown.map((c) => c.cite.law))];
  const collected = shown.filter((c) => g.cards[c.id]?.collected).length;
  const selected = CARDS.find((c) => c.id === open);
  const st = selected ? g.cards[selected.id] : undefined;

  return (
    <>
      <p className="lead">
        {collected} z {shown.length} karet{ch ? ` (příběh postavy ${ch.forms.g} a režim Lhůta běží)` : ""}. Kartu získáte správným rozhodnutím v případu nebo v režimu Lhůta běží.
      </p>
      {selected && st?.collected && (
        <div className="card album-detail">
          <CardBack card={selected} />
          <p className="muted small">
            {st.due ? `Další opakování: ${formatDay(st.due)}` : "Zvládnuto – karta se už neopakuje."}
          </p>
          <button type="button" className="btn-secondary" onClick={() => setOpen(null)}>Zavřít</button>
        </div>
      )}
      {laws.map((law) => (
        <section key={law}>
          <h2>{LAWS[law].name}</h2>
          <div className="album-grid">
            {shown.filter((c) => c.cite.law === law).map((c) =>
              g.cards[c.id]?.collected ? (
                <button key={c.id} type="button" className={`album-slot ${open === c.id ? "selected" : ""}`} onClick={() => setOpen(c.id)} aria-label={`Karta ${c.name}`}>
                  <CardFace card={c} />
                  {g.cards[c.id].due === null && <span className="mastered">zvládnuto</span>}
                </button>
              ) : (
                <div key={c.id} className="album-slot empty" aria-label="Nezískaná karta">
                  <div className="pcard pcard-md pcard-empty">
                    <div className="pcard-law">{LAWS[c.cite.law].abbr}</div>
                    <div className="pcard-par">?</div>
                    <div className="pcard-name">{g.cards[c.id] ? "k opakování" : "nezískáno"}</div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </>
  );
}
