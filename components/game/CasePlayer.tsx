"use client";

import Link from "next/link";
import { useState } from "react";
import type { GameCase, Outcome } from "@/content/game/types";
import { CARD_BY_ID } from "@/content/game/cards";
import { characterOf, recordCase, recordRound, useGame, useHydrated } from "@/lib/game/store";
import { buildingForCase } from "@/content/game/city";
import type { Letter } from "@/lib/game/store";
import { monthLabel } from "./Mailbox";
import { personalizeCase } from "@/lib/game/personalize";
import { NeedCharacter } from "./NeedCharacter";
import { PrepScreen } from "./PrepScreen";
import { PREP_BY_ID, PREP_FOR_CASE } from "@/content/game/preps";
import { prepDone, recordPrep } from "@/lib/game/store";
import { formatCzk } from "@/lib/format";
import { RoundPlayer } from "./RoundPlayer";
import { CardFace } from "./ParagraphCard";

type Result = { outcome: Outcome; xp: number; wallet: number; card: string };

export function CasePlayer({ gameCase: raw }: { gameCase: GameCase }) {
  const g = useGame();
  const hydrated = useHydrated();
  const ch = characterOf(g);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [scheduled, setScheduled] = useState<Letter[]>([]);
  const [run, setRun] = useState(0);
  /** null = rozhodne se podle toho, zda je příprava hotová; true = hráč si ji otevřel znovu. */
  const [showPrep, setShowPrep] = useState<boolean | null>(null);
  const total = raw.rounds.length;
  const finished = results.length === total;

  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (!ch) return <NeedCharacter />;
  const prep = PREP_BY_ID.get(PREP_FOR_CASE[raw.id] ?? "");
  const prepVisible = prep && (showPrep ?? !prepDone(g, prep.id)) && results.length === 0 && idx === 0;
  if (prep && prepVisible) {
    return (
      <PrepScreen
        prep={prep}
        continueLabel="Mám to, jdu na nástrahu →"
        onContinue={(correct) => {
          recordPrep(prep.id, correct);
          setShowPrep(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }
  const gameCase = personalizeCase(raw, ch);
  const building = buildingForCase(raw.id);

  if (finished) {
    const correct = results.filter((r) => r.outcome === "correct").length;
    const xp = results.reduce((s, r) => s + r.xp, 0);
    const wallet = results.reduce((s, r) => s + r.wallet, 0);
    return (
      <div className="card case-summary">
        <div className="eyebrow">Případ uzavřen</div>
        <h2>
          {correct} z {total} rozhodnutí správně
        </h2>
        <div className="summary-stats">
          <div><strong>+{xp}</strong><span>XP</span></div>
          <div><strong className={wallet < 0 ? "neg" : undefined}>{wallet === 0 ? "0 Kč" : `${wallet > 0 ? "+" : "−"}${formatCzk(Math.abs(wallet))}`}</strong><span>peněženka</span></div>
        </div>
        <p className="muted">Uplynul měsíc – je {monthLabel(g.month)}. Dluhová zátěž: {g.load} / 100.</p>
        {scheduled.map((l) => (
          <div key={l.id} className="note note-warn" role="note">
            <span className="note-label">Následky</span>
            Za {Math.max(1, l.month - g.month) === 1 ? "měsíc" : `${l.month - g.month} měsíce`} přijde do schránky: {l.subject} ({l.sender}). Důvod: {l.reason}.
          </div>
        ))}
        <div className="summary-cards">
          {results.map((r, i) => {
            const card = CARD_BY_ID.get(r.card);
            return card ? (
              <div key={i} className={r.outcome === "correct" ? "" : "card-missed"}>
                <CardFace card={card} size="sm" />
                <div className="muted small">{r.outcome === "correct" ? "v albu" : "k opakování"}</div>
              </div>
            ) : null;
          })}
        </div>
        <div className="summary-actions">
          <Link href="/hra" className="btn-primary">Zpět do města →</Link>
          {building && <Link href={`/hra/budova/${building.id}`} className="btn-secondary">Zpět do budovy</Link>}
          <button type="button" className="btn-secondary" onClick={() => { setIdx(0); setResults([]); setScheduled([]); setRun((n) => n + 1); }}>
            Hrát znovu
          </button>
          <Link href={`/tema/${gameCase.lesson.topic}/${gameCase.lesson.lesson}`} className="btn-secondary">Přečíst lekci</Link>
        </div>
      </div>
    );
  }

  const round = gameCase.rounds[idx];
  return (
    <>
      {idx === 0 && results.length === 0 && (
        <>
          <div className="case-story card">{gameCase.story}</div>
          {prep && (
            <p className="muted small">
              Potřebujete si připomenout základy?{" "}
              <button type="button" className="linklike" onClick={() => setShowPrep(true)}>
                Příprava: {prep.title}
              </button>
            </p>
          )}
        </>
      )}
      <div className="case-progress">
        {gameCase.rounds.map((_, i) => (
          <span key={i} className={i < results.length ? `dot dot-${results[i].outcome}` : i === idx ? "dot dot-now" : "dot"} />
        ))}
        <span className="muted small">Rozhodnutí {idx + 1} z {total}</span>
      </div>
      <RoundPlayer
        key={`${run}-${idx}`}
        round={round}
        showWallet
        continueLabel={idx + 1 < total ? "Pokračovat" : "Uzavřít případ"}
        onContinue={(opt) => {
          const xp = recordRound({ cardId: round.card, outcome: opt.outcome, wallet: opt.wallet, boss: gameCase.boss });
          const next = [...results, { outcome: opt.outcome, xp, wallet: opt.wallet, card: round.card }];
          setResults(next);
          if (next.length === total) setScheduled(recordCase(gameCase.id, next.filter((r) => r.outcome === "correct").length, total));
          else setIdx(idx + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}
