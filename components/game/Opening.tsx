"use client";

import { useEffect, useMemo, useState } from "react";
import { PixelSprite } from "./PixelSprite";

const LOGO_MS = 3800;
const CRAWL_MS = 42000;

/**
 * Úvod hry: logo studia Ventura Games a titulky ve stylu vesmírné ságy.
 * Dá se kdykoli přeskočit (klepnutím, Enter, Esc nebo mezerníkem).
 */
export function Opening({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "crawl">("logo");

  useEffect(() => {
    const t = setTimeout(() => (phase === "logo" ? setPhase("crawl") : onDone()), phase === "logo" ? LOGO_MS : CRAWL_MS);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", "Escape", " "].includes(e.key)) {
        e.preventDefault();
        if (phase === "logo") setPhase("crawl");
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
        <div className="op-logo" onClick={() => setPhase("crawl")}>
          <div className="op-mascot">
            <PixelSprite id="ventura" scale={9} title="Maskot Ventura Games" />
          </div>
          <div className="op-studio">
            <span className="op-v">VENTURA</span> <span className="op-g">GAMES</span>
          </div>
          <div className="op-presents">uvádí</div>
        </div>
      ) : (
        <div className="op-crawl-wrap" onClick={onDone}>
          <p className="op-before">Nedávno, v jednom nedalekém městě…</p>
          <div className="op-title" aria-hidden>
            PARAGRAF
            <small>a</small>
            PENÍZE
          </div>
          <div className="op-perspective">
            <div className="op-crawl">
              <p className="op-episode">EPIZODA I</p>
              <p className="op-episode-name">NEZNALOST NEOMLOUVÁ</p>
              <p>
                Je doba půjček na jedno kliknutí. Splátky s „nulou procent“ číhají na každém rohu a drobné písmo ve
                smlouvách je menší než kdy dřív.
              </p>
              <p>
                Ulice Města dluhů ovládli vymahači, podomní prodejci a nebankovní lichváři. Kdo nezná své lhůty, přichází o
                mzdu, o úspory i o klid.
              </p>
              <p>
                Zákon přitom chrání každého, kdo ho zná. Jenže neznalost zákona neomlouvá – a promlčení za vás nikdo
                nenamítne.
              </p>
              <p>
                Daleko za mořem prý leží Daňový ráj. Říká se, že tam se daně neplatí. Ti, kdo se odtud vrátili, vědí své…
              </p>
              <p>
                Teď je řada na vás. Vyberte si hrdinu, vyzbrojte se paragrafy a projděte městem, kde se každé rozhodnutí
                počítá v korunách…
              </p>
            </div>
          </div>
        </div>
      )}

      <button type="button" className="op-skip" onClick={phase === "logo" ? () => setPhase("crawl") : onDone}>
        Přeskočit ▶
      </button>
    </div>
  );
}
