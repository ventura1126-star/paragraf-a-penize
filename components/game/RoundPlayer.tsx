"use client";

import { useState } from "react";
import type { Option, Round } from "@/content/game/types";
import { CARD_BY_ID } from "@/content/game/cards";
import { Citations } from "@/components/CitationChip";
import { formatCzk } from "@/lib/format";
import { CardBack, CardFace } from "./ParagraphCard";
import { firstSentence, restSentences } from "@/lib/text";

const OUTCOME_LABEL = { correct: "Správně", partial: "Napůl", wrong: "Takhle ne" } as const;

/** Stabilní zamíchání možností podle textu kola – správná odpověď není vždy první, ale pořadí se mezi návštěvami nemění. */
export function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
  const options = shuffled(round.options, round.card + round.prompt);
  const opt = picked === null ? null : options[picked];
  const card = CARD_BY_ID.get(round.card);
  const correct = round.options.find((o) => o.outcome === "correct");

  return (
    <div className="round">
      <h2 className="round-prompt">{round.prompt}</h2>
      <div className="round-options">
        {options.map((o, i) => {
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
              <span className={`wallet-delta big ${opt.wallet < 0 ? "neg" : "pos"}`}>
                {opt.wallet > 0 ? "+" : "−"}
                {formatCzk(Math.abs(opt.wallet))}
              </span>
            )}
          </div>
          <p className="verdict-line">{firstSentence(opt.verdict)}</p>
          {opt.outcome !== "correct" && correct && (
            <p className="verdict-correct">
              <span className="muted">Správně je:</span> {correct.text}
            </p>
          )}

          {card && (
            <div className="reward-compact">
              <CardFace card={card} size="sm" />
              <span className="reward-title">
                {opt.outcome === "correct" ? "Karta do alba!" : "Karta půjde zítra k opakování"}
              </span>
            </div>
          )}

          <details className="why">
            <summary>Proč?</summary>
            {restSentences(opt.verdict) && <p>{restSentences(opt.verdict)}</p>}
            {opt.outcome !== "correct" && correct && <p className="muted">{correct.verdict.replace(/^Správně\.\s*/, "")}</p>}
            <Citations cites={opt.outcome === "correct" ? opt.cites : [...opt.cites, ...(correct?.cites ?? [])].filter((c, i, a) => a.findIndex((x) => x.law === c.law && x.par === c.par && x.odst === c.odst) === i)} label="Rozhoduje" />
            {card && <CardBack card={card} />}
            {showWallet && <p className="muted small">Částky v peněžence jsou ilustrativní a patří postavě, ne vám.</p>}
          </details>

          <button type="button" className="btn-primary" onClick={() => onContinue(opt)}>
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}
