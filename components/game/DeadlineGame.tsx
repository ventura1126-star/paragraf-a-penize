"use client";

import { useEffect, useState } from "react";
import { generatePuzzle, type DeadlinePuzzle } from "@/lib/game/deadlines";
import { characterOf, recordReview, useGame, useHydrated } from "@/lib/game/store";
import { NeedCharacter } from "./NeedCharacter";
import { scrollGameTop } from "./GameNav";
import { DeadlineQuestion } from "./DeadlineQuestion";

export function DeadlineGame() {
  const g = useGame();
  const hydrated = useHydrated();
  const ch = characterOf(g);
  const [puzzle, setPuzzle] = useState<DeadlinePuzzle | null>(null);
  const [n, setN] = useState(0);
  const [streak, setStreak] = useState(0);

  // Náhodné zadání až na klientu (aby se nelišilo od serverového HTML).
  useEffect(() => {
    if (ch) setPuzzle(generatePuzzle(undefined, ch));
  }, [n, ch]);

  if (hydrated && !ch) return <NeedCharacter />;

  return (
    <>
      <div className="deadline-stats">
        <span className="tag">Vyřešeno celkem: {g.deadlinesSolved}</span>
        <span className="tag">V řadě: {streak}</span>
      </div>
      {puzzle ? (
        <DeadlineQuestion
          key={n}
          puzzle={puzzle}
          continueLabel="Další zadání"
          onContinue={(ok) => {
            recordReview(puzzle.cards, ok, "deadline");
            setStreak((s) => (ok ? s + 1 : 0));
            setN((x) => x + 1);
            scrollGameTop();
          }}
        />
      ) : (
        <p className="muted">Připravuji zadání…</p>
      )}
    </>
  );
}
