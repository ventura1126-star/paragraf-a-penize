"use client";

import { useState } from "react";
import type { Option, Round } from "@/content/game/types";
import { CARD_BY_ID } from "@/content/game/cards";
import { Citations } from "@/components/CitationChip";
import { formatCzk } from "@/lib/format";
import { CardBack, CardFace } from "./ParagraphCard";

const OUTCOME_LABEL = { correct: "Správně", partial: "Napůl", wrong: "Takhle ne" } as const;

/** Jedno kolo: rozhodnutí → verdikt → pokračovat. Paragraf se odkryje až po volbě. */
export function RoundPlayer({
  round,
  showWallet,
  continueLabel,
  onContinue,
}: {
  round: Round;
  showWallet: boolean;
  continueLabel: string;
  onContinue: (picked: Option) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const opt = picked === null ? null : round.options[picked];
  const card = CARD_BY_ID.get(round.card);
  const correct = round.options.find((o) => o.outcome === "correct");

  return (
    <div className="round">
      <h2 className="round-prompt">{round.prompt}</h2>
      <div className="round-options">
        {round.options.map((o, i) => {
          let cls = "round-option";
          if (opt) {
            if (o.outcome === "correct") cls += " correct";
            else if (i === picked) cls += o.outcome === "partial" ? " partial" : " wrong";
            else cls += " dim";
          }
          return (
            <button key={i} type="button" className={cls} disabled={opt !== null} onClick={() => setPicked(i)}>
              <span className="round-letter">{String.fromCharCode(65 + i)}</span>
              {o.text}
            </button>
          );
        })}
      </div>

      {opt && (
        <div className={`verdict verdict-${opt.outcome}`} aria-live="polite">
          <div className="verdict-head">
            <strong>{OUTCOME_LABEL[opt.outcome]}</strong>
            {showWallet && opt.wallet !== 0 && (
              <span className={`wallet-delta ${opt.wallet < 0 ? "neg" : "pos"}`}>
                Peněženka {opt.wallet > 0 ? "+" : "−"}
                {formatCzk(Math.abs(opt.wallet))}
              </span>
            )}
          </div>
          <p>{opt.verdict}</p>
          {opt.outcome !== "correct" && correct && (
            <p className="muted">
              <strong>Správná odpověď:</strong> {correct.text} {correct.verdict.replace(/^Správně\.\s*/, "")}
            </p>
          )}
          <Citations cites={opt.outcome === "correct" ? opt.cites : [...opt.cites, ...(correct?.cites ?? [])].filter((c, i, a) => a.findIndex((x) => x.law === c.law && x.par === c.par && x.odst === c.odst) === i)} label="Rozhoduje" />

          {card && (
            <div className="reward">
              <CardFace card={card} size="sm" />
              <div>
                <div className="reward-title">
                  {opt.outcome === "correct" ? "Karta získána" : "Karta jde k opakování (zítra)"}
                </div>
                <CardBack card={card} />
              </div>
            </div>
          )}

          <button type="button" className="btn-primary" onClick={() => onContinue(opt)}>
            {continueLabel}
          </button>
          {showWallet && <p className="muted small">Částky v peněžence jsou ilustrativní a patří postavě, ne vám.</p>}
        </div>
      )}
    </div>
  );
}
