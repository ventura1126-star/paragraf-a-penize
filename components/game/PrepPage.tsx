"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BUILDING_BY_ID } from "@/content/game/city";
import type { Prep } from "@/content/game/preps";
import { characterOf, recordPrep, useGame, useHydrated } from "@/lib/game/store";
import { PrepScreen } from "./PrepScreen";
import { NeedCharacter } from "./NeedCharacter";
import { useGameGo } from "./GameNav";

export function PrepPage({ prep, back: backProp }: { prep: Prep; back?: string }) {
  const g = useGame();
  const hydrated = useHydrated();
  const router = useRouter();
  const go = useGameGo();
  const zpet = useSearchParams().get("zpet");
  const back = backProp ?? (zpet && BUILDING_BY_ID.has(zpet) ? `/hra/budova/${zpet}` : "/hra");
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
