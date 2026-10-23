"use client";

import { useState } from "react";
import type { StreetNpc } from "@/content/game/street";
import { characterOf, recordAdvice, streetQuestionIndex, useGame, useHydrated } from "@/lib/game/store";
import { CitationChip } from "@/components/CitationChip";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { GameLink } from "./GameNav";
import { shuffled } from "./RoundPlayer";

/** Člověk na ulici se ptá na radu – jedna otázka na jeden rozhovor. */
export function StreetAdvice({ person }: { person: StreetNpc }) {
  const g = useGame();
  const hydrated = useHydrated();
  const ch = characterOf(g);
  // otázka se určí při otevření rozhovoru a během něj se nemění
  const [qi] = useState(() => streetQuestionIndex(g, person.id, person.questions.length));
  const [pick, setPick] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (!ch) return <NeedCharacter />;
  const q = qi >= 0 ? person.questions[qi] : undefined;
  const ok = q && pick === q.correct;

  return (
    <div className="dialogue card">
      <div className="dialogue-npc">
        <span className="dialogue-portrait">
          <PixelSprite id={person.npc.shape} palette={person.npc.palette} variant="bust" scale={5} />
        </span>
        <div>
          <strong>{person.npc.name}</strong>
          <div className="muted small">{person.npc.role}</div>
        </div>
      </div>
      <div className="dialogue-log" aria-live="polite">
        {!q ? (
          <div className="dl-line dl-npc">
            <div className="dl-bubble">Díky za minule! Už vím, co dělat. Kdyby něco, poradím to dál.</div>
          </div>
        ) : (
          <>
            <div className="dl-line dl-npc">
              <div className="dl-bubble">{q.ask}</div>
            </div>
            {pick !== null && (
              <>
                <div className="dl-line dl-you">
                  <span className="dl-you-face">
                    <PixelSprite id={ch.id} variant="bust" scale={2.5} />
                  </span>
                  <div className="dl-bubble">„{q.options[pick]}“</div>
                </div>
                <div className="dl-line dl-npc">
                  <div className={`dl-bubble ${ok ? "adv-good" : "adv-bad"}`}>
                    <strong>{ok ? "Díky, to mi pomohlo!" : "Hm… Jinde mi ale řekli něco jiného."}</strong> {q.why}{" "}
                    {q.cite && <CitationChip cite={q.cite} />}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="dialogue-choices">
        {q && pick === null &&
          shuffled(q.options.map((o, i) => ({ o, i })), person.id + q.ask).map(({ o, i }) => (
            <button key={i} type="button" className="dl-choice" onClick={() => { setPick(i); setXp(recordAdvice(person.id, qi, i === q.correct)); }}>
              „{o}“
            </button>
          ))}
        {(pick !== null || !q) && (
          <>
            {pick !== null && (
              <p className="small adv-result">
                {ok ? (xp ? <strong className="adv-xp">+{xp} XP</strong> : `Tohle už jste radil${ch.feminine ? "a" : ""} dřív.`) : "Bez XP – příště se vás zeptá znovu."}
              </p>
            )}
            <GameLink href="/hra" className="btn-primary">Zpět do města →</GameLink>
          </>
        )}
      </div>
    </div>
  );
}
