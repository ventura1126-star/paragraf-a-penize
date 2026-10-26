"use client";

import { useEffect, useMemo, useState } from "react";
import { PixelSprite } from "./PixelSprite";
import { music } from "@/lib/game/music";

const LOGO_MS = 3800;
const TITLE_MS = 3600;

/**
 * Úvod hry: logo studia Ventura Games, pak název hry a rovnou do hry.
 * Dá se kdykoli přeskočit (klepnutím, Enter, Esc nebo mezerníkem).
 */
export function Opening({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "title">("logo");
  // znělka loga (zazní, pokud prohlížeč už zvuk povolil – např. při opakovaném přehrání intra)
  useEffect(() => {
    music()?.jingle();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => (phase === "logo" ? setPhase("title") : onDone()), phase === "logo" ? LOGO_MS : TITLE_MS);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", "Escape", " "].includes(e.key)) {
        e.preventDefault();
        if (phase === "logo") setPhase("title");
        else onDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onDone]);

  // hvězdy na pozadí (stabilní pro jedno přehrání)
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        x: (i * 73.13) % 100,
        y: (i * 41.77 + (i % 7) * 13) % 100,
        s: i % 9 === 0 ? 2 : 1,
        o: 0.35 + ((i * 17) % 60) / 100,
      })),
    [],
  );

  return (
    <div className="opening" role="dialog" aria-label="Úvod hry">
      <div className="op-stars" aria-hidden>
        {stars.map((st, i) => (
          <span key={i} style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, opacity: st.o }} />
        ))}
      </div>

      {phase === "logo" ? (
        <div className="op-logo" onClick={() => setPhase("title")}>
          <div className="op-mascot">
            <PixelSprite id="ventura" scale={9} title="Maskot Ventura Games" />
          </div>
          <div className="op-studio">
            <span className="op-v">VENTURA</span> <span className="op-g">GAMES</span>
          </div>
          <div className="op-presents">uvádí</div>
        </div>
      ) : (
        <div className="op-game-title" onClick={onDone}>
          <span>MĚSTO</span>
          <span>DLUHŮ</span>
        </div>
      )}

      <button type="button" className="op-skip" onClick={phase === "logo" ? () => setPhase("title") : onDone}>
        Přeskočit ▶
      </button>
    </div>
  );
}
