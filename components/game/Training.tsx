"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CARD_BY_ID } from "@/content/game/cards";
import { roundForCard } from "@/content/game/cases";
import { generatePuzzle, type DeadlinePuzzle } from "@/lib/game/deadlines";
import { dueCards, readGame, recordReview } from "@/lib/game/store";
import { RoundPlayer } from "./RoundPlayer";
import { DeadlineQuestion } from "./DeadlineQuestion";

type Item = { cardId: string; puzzle?: DeadlinePuzzle };

function toItem(cardId: string): Item {
  if (roundForCard(cardId)) return { cardId };
  return { cardId, puzzle: generatePuzzle(cardId === "osr-49-4" ? "fikce" : undefined) };
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function Training() {
  const [queue, setQueue] = useState<Item[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<"due" | "all">("due");

  useEffect(() => {
    const s = readGame();
    const ids = mode === "due" ? dueCards(s) : shuffle(Object.keys(s.cards)).slice(0, 8);
    setQueue(ids.filter((id) => CARD_BY_ID.has(id)).map(toItem));
    setIdx(0);
    setScore(0);
  }, [mode]);

  if (!queue) return <p className="muted">Načítám…</p>;

  if (queue.length === 0) {
    const anyCards = Object.keys(readGame().cards).length > 0;
    return (
      <div className="card">
        <h2>Dnes není co opakovat</h2>
        <p className="muted">
          Karty, které jste nezodpověděli správně, se vracejí za 1, 3 a 7 dní. Správně zodpovězené karty se
          zkontrolují za týden.
        </p>
        <div className="summary-actions">
          {anyCards && mode === "due" && (
            <button type="button" className="btn-primary" onClick={() => setMode("all")}>Procvičit náhodné karty</button>
          )}
          <Link href="/hra/ctvrt/dluznicka" className="btn-secondary">Hrát případy</Link>
        </div>
      </div>
    );
  }

  if (idx >= queue.length) {
    return (
      <div className="card case-summary">
        <div className="eyebrow">Trénink hotov</div>
        <h2>{score} z {queue.length} správně</h2>
        <p className="muted">Chybné karty se vrátí zítra, správné se posunuly v opakování.</p>
        <div className="summary-actions">
          <Link href="/hra/album" className="btn-primary">Do alba</Link>
          <Link href="/hra" className="btn-secondary">Na mapu</Link>
        </div>
      </div>
    );
  }

  const item = queue[idx];
  const label = idx + 1 < queue.length ? "Další karta" : "Dokončit trénink";
  const next = (ok: boolean) => {
    recordReview([item.cardId], ok, "training");
    if (ok) setScore((s) => s + 1);
    setIdx(idx + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const found = roundForCard(item.cardId);

  return (
    <>
      <div className="case-progress">
        <span className="muted small">Karta {idx + 1} z {queue.length} · {CARD_BY_ID.get(item.cardId)?.name}</span>
      </div>
      {item.puzzle ? (
        <DeadlineQuestion key={idx} puzzle={item.puzzle} continueLabel={label} onContinue={next} />
      ) : found ? (
        <>
          <p className="muted">Z případu „{found.gameCase.title}“: {found.gameCase.story}</p>
          <RoundPlayer key={idx} round={found.gameCase.rounds[found.roundIndex]} showWallet={false} continueLabel={label} onContinue={(o) => next(o.outcome === "correct")} />
        </>
      ) : null}
    </>
  );
}
