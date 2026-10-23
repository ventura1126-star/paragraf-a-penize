"use client";

import { useEffect, useRef, useState } from "react";
import type { Dialogue as D } from "@/content/game/dialogues";
import type { Character } from "@/content/game/characters";
import { fill } from "@/content/game/characters";
import type { Citation } from "@/lib/types";
import { CitationChip } from "@/components/CitationChip";
import { PixelSprite } from "./PixelSprite";

type Line = { who: "npc" | "you"; text: string; cite?: Citation };

/** Krátký rozhovor s člověkem v budově: postava se ptá, NPC odpovídá (s oporou v zákoně). */
export function Dialogue({ d, ch, hook, onDone }: { d: D; ch: Character; hook: boolean; onDone: () => void }) {
  const f = (t: string) => fill(t, ch);
  const [log, setLog] = useState<Line[]>(() => [
    { who: "npc", text: f(d.hello) },
    ...(hook && d.hook ? [{ who: "npc" as const, text: f(d.hook) }] : []),
  ]);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (log.length > 2) endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [log.length]);

  const ask = (i: number) => {
    const qa = d.ask[i];
    setAsked((s) => new Set(s).add(i));
    setLog((l) => [...l, { who: "you", text: f(qa.q) }, { who: "npc", text: f(qa.a), cite: qa.cite }]);
  };

  return (
    <div className="dialogue card">
      <div className="dialogue-npc">
        <span className="dialogue-portrait">
          <PixelSprite id={d.npc.shape} palette={d.npc.palette} variant="bust" scale={5} />
        </span>
        <div>
          <strong>{d.npc.name}</strong>
          <div className="muted small">{d.npc.role}</div>
        </div>
      </div>
      <div className="dialogue-log" aria-live="polite">
        {log.map((l, i) => (
          <div key={i} className={`dl-line dl-${l.who}`}>
            {l.who === "you" && (
              <span className="dl-you-face">
                <PixelSprite id={ch.id} variant="bust" scale={2.5} />
              </span>
            )}
            <div className="dl-bubble">
              {l.text} {l.cite && <CitationChip cite={l.cite} />}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="dialogue-choices">
        {d.ask.map((qa, i) =>
          asked.has(i) ? null : (
            <button key={i} type="button" className="dl-choice" onClick={() => ask(i)}>
              „{f(qa.q)}“
            </button>
          ),
        )}
        <button type="button" className="btn-primary" onClick={onDone}>
          {asked.size === 0 ? "Pojďme rovnou k věci →" : "Díky, pojďme k věci →"}
        </button>
      </div>
    </div>
  );
}
