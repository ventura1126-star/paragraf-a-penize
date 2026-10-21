"use client";

import Link from "next/link";
import { CHARACTERS } from "@/content/game/characters";
import { characterOf, useGame, useHydrated } from "@/lib/game/store";
import { Avatar } from "./Avatar";

/** Na mapě: výzva k výběru postavy, dokud žádná není zvolena. */
export function CharacterPrompt() {
  const g = useGame();
  const hydrated = useHydrated();
  if (!hydrated || characterOf(g)) return null;
  return (
    <Link href="/hra/postava" className="card char-prompt">
      <span className="char-prompt-avatars">
        {CHARACTERS.map((c) => (
          <Avatar key={c.id} ch={c} size={40} />
        ))}
      </span>
      <span>
        <strong>Začněte výběrem postavy</strong>
        <span className="muted small">Absolvent, samoživitelka, seniorka, živnostník nebo otec po rozvodu.</span>
      </span>
      <span className="btn-primary">Vybrat</span>
    </Link>
  );
}
