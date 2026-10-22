"use client";

import { useState } from "react";
import type { Prep } from "@/content/game/preps";
import { CitationChip } from "@/components/CitationChip";

/** Příprava před nástrahou: laické vysvětlení, pojmy, proces, podobné situace, čísla a rychlá kontrolní otázka. */
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
  const ok = pick === prep.check.correct;

  return (
    <div className="prep">
      <div className="eyebrow">Příprava na téma</div>
      <h2 className="prep-title">{prep.title}</h2>

      <div className="prep-plain card">
        <div className="prep-label">Lidsky řečeno</div>
        <p>{prep.plain}</p>
      </div>

      <section>
        <h3>Základní pojmy</h3>
        <dl className="prep-concepts">
          {prep.concepts.map((c) => (
            <div key={c.term} className="card">
              <dt>{c.term}</dt>
              <dd>
                {c.explain} {c.cite && <CitationChip cite={c.cite} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {prep.process && (
        <section>
          <h3>{prep.process.title}</h3>
          <ol className="steps">
            {prep.process.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {prep.stats.length > 0 && (
        <section>
          <h3>V číslech</h3>
          <div className="prep-stats">
            {prep.stats.map((s, i) => (
              <figure key={i} className="card prep-stat">
                <div className="prep-stat-value">{s.value}</div>
                <figcaption>
                  {s.label}
                  <span className="prep-source">
                    Zdroj:{" "}
                    <a href={s.source.url} target="_blank" rel="noopener noreferrer">
                      {s.source.name}
                    </a>
                    , {s.source.date}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3>Podobné situace</h3>
        <div className="prep-examples">
          {prep.examples.map((e) => (
            <div key={e.title} className="card">
              <strong>{e.title}</strong>
              <p>{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card prep-check">
        <h3>Rychlá kontrola</h3>
        <p>{prep.check.q}</p>
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
        {pick === null && <p className="muted small">Odpovězte na otázku a můžete pokračovat.</p>}
      </section>
    </div>
  );
}
