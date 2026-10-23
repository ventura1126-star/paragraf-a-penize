"use client";

import { useRouter } from "next/navigation";
import type { Prep } from "@/content/game/preps";
import { characterOf, recordPrep, useGame, useHydrated } from "@/lib/game/store";
import { PrepScreen } from "./PrepScreen";
import { NeedCharacter } from "./NeedCharacter";
import { useGameGo } from "./GameNav";

export function PrepPage({ prep, back }: { prep: Prep; back: string }) {
  const g = useGame();
  const hydrated = useHydrated();
  const router = useRouter();
  const go = useGameGo();
  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (!characterOf(g)) return <NeedCharacter />;
  return (
    <PrepScreen
      prep={prep}
      continueLabel="Hotovo, zpět"
      onContinue={(ok) => {
        recordPrep(prep.id, ok);
        go(back, router.push);
      }}
    />
  );
}
