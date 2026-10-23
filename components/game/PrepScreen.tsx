"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Prep } from "@/content/game/preps";
import { CitationChip } from "@/components/CitationChip";
import { sentences } from "@/lib/text";

/**
 * Příprava jako krátké karty k přetáčení (prstem, šipkami nebo tlačítky):
 * lidsky řečeno → pojmy → postup → číslo → příklad → kontrolní otázka.
 */
export function PrepScreen({
  prep,
  continueLabel,
  onContinue,
}: {
  prep: Prep;
  continueLabel: string;
  onContinue: (correct: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const ok = pick === prep.check.correct;

  const slides: { key: string; label: string; body: ReactNode }[] = [
    {
      key: "plain",
      label: "Lidsky řečeno",
      body: <p className="ps-big">{sentences(prep.plain).slice(0, 2).join(" ")}</p>,
    },
    ...prep.concepts.slice(0, 3).map((c) => ({
      key: `c-${c.term}`,
      label: "Pojem",
      body: (
        <>
          <h3 className="ps-term">{c.term}</h3>
          <p>{c.explain}</p>
          {c.cite && <CitationChip cite={c.cite} />}
        </>
      ),
    })),
    // jedna „bonusová“ karta: číslo z Česka, jinak postup, jinak příklad
    ...(prep.process && !prep.stats.length
      ? [
          {
            key: "process",
            label: prep.process.title,
            body: (
              <ol className="steps ps-steps">
                {prep.process.steps.slice(0, 4).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            ),
          },
        ]
      : []),
    ...prep.stats.slice(0, 1).map((s) => ({
      key: "stat",
      label: "V číslech",
      body: (
        <>
          <div className="prep-stat-value ps-stat">{s.value}</div>
          <p>{s.label}</p>
          <span className="prep-source">
            Zdroj:{" "}
            <a href={s.source.url} target="_blank" rel="noopener noreferrer">
              {s.source.name}
            </a>
            , {s.source.date}
          </span>
        </>
      ),
    })),
    ...(prep.stats.length || prep.process ? [] : prep.examples).slice(0, 1).map((e) => ({
      key: "example",
      label: "Jak to vypadá v životě",
      body: (
        <>
          <h3 className="ps-term">{e.title}</h3>
          <p>{e.text}</p>
        </>
      ),
    })),
    {
      key: "check",
      label: "Rychlá kontrola",
      body: (
        <>
          <p className="ps-q">{prep.check.q}</p>
          <div className="quiz-options">
            {prep.check.options.map((o, i) => {
              let cls = "quiz-option";
              if (pick !== null && i === prep.check.correct) cls += " correct";
              else if (pick === i) cls += " wrong";
              return (
                <button key={i} type="button" className={cls} disabled={pick !== null} onClick={() => setPick(i)}>
                  {o}
                </button>
              );
            })}
          </div>
          {pick !== null && (
            <p className="quiz-feedback" aria-live="polite">
              <strong>{ok ? "Správně." : "Ne úplně."}</strong> {prep.check.explain}
            </p>
          )}
          <button type="button" className="btn-primary" disabled={pick === null} onClick={() => onContinue(ok)}>
            {continueLabel}
          </button>
        </>
      ),
    },
  ];
  const last = slides.length - 1;

  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    const el = trackRef.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
    setIdx(n);
  };

  // index podle posunu (swipe prstem)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="prep-swipe"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(idx + 1);
        if (e.key === "ArrowLeft") go(idx - 1);
      }}
      aria-roledescription="karusel"
      aria-label={`Příprava: ${prep.title}`}
    >
      <div className="ps-head">
        <div>
          <div className="eyebrow">Příprava · {idx + 1} / {slides.length}</div>
          <strong className="ps-title">{prep.title}</strong>
        </div>
        {idx < last && (
          <button type="button" className="linklike small" onClick={() => go(last)}>
            Přeskočit na otázku
          </button>
        )}
      </div>
      <div className="ps-track" ref={trackRef}>
        {slides.map((s, i) => (
          <section key={s.key} className="ps-slide" aria-hidden={i !== idx} aria-label={`${i + 1} z ${slides.length}: ${s.label}`}>
            <div className="card ps-card">
              <div className="ps-label">{s.label}</div>
              {s.body}
            </div>
          </section>
        ))}
      </div>
      <div className="ps-nav">
        <button type="button" className="btn-secondary" disabled={idx === 0} onClick={() => go(idx - 1)} aria-label="Předchozí">
          ←
        </button>
        <div className="ps-dots" aria-hidden>
          {slides.map((s, i) => (
            <button key={s.key} type="button" className={i === idx ? "on" : ""} onClick={() => go(i)} tabIndex={-1} />
          ))}
        </div>
        <button type="button" className="btn-primary" disabled={idx === last} onClick={() => go(idx + 1)} aria-label="Další">
          →
        </button>
      </div>
    </div>
  );
}
