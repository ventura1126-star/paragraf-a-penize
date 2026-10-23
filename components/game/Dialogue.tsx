"use client";

import { useEffect, useRef, useState } from "react";
import type { Dialogue as D } from "@/content/game/dialogues";
import type { Character } from "@/content/game/characters";
import { fill } from "@/content/game/characters";
import type { Citation } from "@/lib/types";
import { CitationChip } from "@/components/CitationChip";
import { PixelSprite } from "./PixelSprite";
import { sentences } from "@/lib/text";

type Line = { who: "npc" | "you"; text: string; cite?: Citation };

/** Krátký rozhovor s člověkem v budově: postava se ptá, NPC odpovídá (s oporou v zákoně). */
export function Dialogue({ d, ch, hook, onDone }: { d: D; ch: Character; hook: boolean; onDone: () => void }) {
  const f = (t: string) => fill(t, ch);
  /** NPC mluví po větách: každá věta = jedna bublina. */
  const npcLines = (t: string, cite?: Citation): Line[] => {
    const parts = sentences(f(t));
    return parts.map((text, i) => ({ who: "npc" as const, text, cite: i === parts.length - 1 ? cite : undefined }));
  };
  const [log, setLog] = useState<Line[]>([]);
  const [queue, setQueue] = useState<Line[]>(() => [...npcLines(d.hello), ...(hook && d.hook ? npcLines(d.hook) : [])]);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  const questions = d.ask.slice(0, 2);

  // bubliny naskakují postupně
  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => {
      setLog((l) => [...l, queue[0]]);
      setQueue((q) => q.slice(1));
    }, log.length === 0 ? 150 : 550);
    return () => clearTimeout(t);
  }, [queue, log.length]);
  useEffect(() => {
    if (log.length > 2) endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [log.length]);

  const ask = (i: number) => {
    const qa = questions[i];
    setAsked((s) => new Set(s).add(i));
    setLog((l) => [...l, { who: "you", text: f(qa.q) }]);
    setQueue((q) => [...q, ...npcLines(qa.a, qa.cite)]);
  };
  const talking = queue.length > 0;

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
        {talking && <div className="dl-line dl-npc"><div className="dl-bubble dl-typing">…</div></div>}
        <div ref={endRef} />
      </div>
      <div className="dialogue-choices">
        {questions.map((qa, i) =>
          asked.has(i) ? null : (
            <button key={i} type="button" className="dl-choice" disabled={talking} onClick={() => ask(i)}>
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
