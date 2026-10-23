"use client";

import { useState } from "react";
import { LECTURES, TEACHERS, type Lecture } from "@/content/game/lectures";
import { fill } from "@/content/game/characters";
import { lectureAccess, nextLecture, casesSolved } from "@/lib/game/city-logic";
import { characterOf, recordLecture, useGame, useHydrated } from "@/lib/game/store";
import { CitationChip } from "@/components/CitationChip";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { GameLink } from "./GameNav";
import { shuffled } from "./RoundPlayer";

/** Rozvrh Vysoké školy finanční: každá vyřešená nástraha otevře další přednášku. */
export function SchoolScreen() {
  const g = useGame();
  const ch = characterOf(g);
  if (!ch) return <NeedCharacter />;
  const solved = casesSolved(g);
  const next = nextLecture(g);
  return (
    <>
      <div className="lec-hello">
        <PixelSprite id="gros" variant="bust" scale={4} />
        <div className="dl-bubble">
          {next
            ? `Vítejte na Vysoké škole finanční. Dnes máte na rozvrhu: ${next.title}.`
            : solved === 0
              ? "Vítejte na Vysoké škole finanční. První přednáška se otevře, až ve městě vyřešíte první nástrahu."
              : "Na všech otevřených přednáškách jste byl" + (ch.feminine ? "a" : "") + ". Další se otevře po další vyřešené nástraze."}
        </div>
      </div>
      <ol className="lec-list">
        {LECTURES.map((l, i) => {
          const acc = lectureAccess(g, i);
          const score = g.lectures[`${ch.id}:${l.id}`];
          return (
            <li key={l.id} className={`card lec-item lec-${acc}`}>
              <span className="lec-num">{i + 1}</span>
              <span className="lec-body">
                <strong>{acc === "locked" ? "Zamčeno" : l.title}</strong>
                <span className="muted small">
                  {acc === "locked"
                    ? `Otevře se po ${i + 1}. vyřešené nástraze.`
                    : `${TEACHERS[l.teacher].name}${acc === "done" ? ` · zápočet ${score}/${l.quiz.length}` : ""}`}
                </span>
              </span>
              {acc === "open" && <GameLink href={`/hra/prednaska/${l.id}`} className="btn-primary">Na přednášku</GameLink>}
              {acc === "done" && <GameLink href={`/hra/prednaska/${l.id}`} className="tag tag-done">znovu</GameLink>}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/** Přednáška: učitel mluví u tabule, na konci krátký test o zápočet. */
export function LectureScreen({ lecture }: { lecture: Lecture }) {
  const g = useGame();
  const hydrated = useHydrated();
  const ch = characterOf(g);
  const [step, setStep] = useState(0);
  const [q, setQ] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState<number | null>(null);
  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (!ch) return <NeedCharacter />;
  const f = (t: string) => fill(t, ch);
  const teacher = TEACHERS[lecture.teacher];
  const steps = lecture.steps;
  const inQuiz = step >= steps.length;
  const finished = xp !== null;
  // tabule ukazuje poslední zapsaný obsah
  const board = [...steps.slice(0, Math.min(step, steps.length - 1) + 1)].reverse().find((s) => s.board)?.board ?? [lecture.title];
  const cur = steps[Math.min(step, steps.length - 1)];
  const quiz = lecture.quiz[q];
  const after = nextLecture(g);

  let say: React.ReactNode;
  if (finished) {
    say = correct === lecture.quiz.length ? "Výborně, zápočet máte. Takhle bych to chtěl vidět u všech." : correct > 0 ? "Zápočet uděluji. Ale tu chybu si ještě promyslete." : "Hm. Zápočet dávám za účast, ale přednášku si raději zopakujte.";
  } else if (inQuiz) {
    say = `Otázka ${q + 1} z ${lecture.quiz.length}: ${quiz.q}`;
  } else {
    say = (
      <>
        {f(cur.say)} {cur.cite && <CitationChip cite={cur.cite} />}
      </>
    );
  }

  return (
    <div className="lecture">
      <div className="lec-board" aria-label="Tabule">
        {(finished ? ["ZÁPOČET", `${correct} / ${lecture.quiz.length}`] : inQuiz ? ["TEST", `${q + 1} / ${lecture.quiz.length}`] : board).map((line, i) => (
          <div key={`${step}-${i}`} className={i === 0 ? "lec-chalk lec-chalk-big" : "lec-chalk"}>{line}</div>
        ))}
      </div>
      <div className="lec-stage">
        <div className="lec-teacher">
          <PixelSprite id={lecture.teacher} scale={5} title={teacher.name} />
          <div className="lec-name">
            <strong>{teacher.name}</strong>
            <span className="muted small">{teacher.title}</span>
          </div>
        </div>
        <div className="dl-bubble lec-say" key={`${step}-${q}-${finished}`} aria-live="polite">{say}</div>
      </div>

      {!inQuiz && (
        <div className="lec-nav">
          <div className="ps-dots" aria-hidden>
            {steps.map((_, i) => (
              <button key={i} type="button" className={i === step ? "on" : ""} tabIndex={-1} onClick={() => setStep(i)} />
            ))}
          </div>
          <button type="button" className="btn-primary" autoFocus onClick={() => setStep(step + 1)}>
            {step + 1 < steps.length ? "Dál →" : "Na test o zápočet →"}
          </button>
        </div>
      )}

      {inQuiz && !finished && (
        <div className="lec-quiz">
          <div className="quiz-options">
            {shuffled(quiz.options.map((o, i) => ({ o, i })), lecture.id + quiz.q).map(({ o, i }) => {
              let cls = "quiz-option";
              if (pick !== null && i === quiz.correct) cls += " correct";
              else if (pick === i) cls += " wrong";
              return (
                <button key={i} type="button" className={cls} disabled={pick !== null} onClick={() => { setPick(i); if (i === quiz.correct) setCorrect((c) => c + 1); }}>
                  {o}
                </button>
              );
            })}
          </div>
          {pick !== null && (
            <>
              <p className="quiz-feedback" aria-live="polite">
                <strong>{pick === quiz.correct ? "Správně." : "Ne úplně."}</strong> {quiz.explain}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (q + 1 < lecture.quiz.length) {
                    setQ(q + 1);
                    setPick(null);
                  } else setXp(recordLecture(lecture.id, correct));
                }}
              >
                {q + 1 < lecture.quiz.length ? "Další otázka →" : "Odevzdat test"}
              </button>
            </>
          )}
        </div>
      )}

      {finished && (
        <div className="lec-end">
          {xp ? <div className="lec-xp">+{xp} XP</div> : <p className="muted small">Přednášku jste už absolvoval{ch.feminine ? "a" : ""} – XP se připisují jen poprvé.</p>}
          <div className="summary-actions">
            <GameLink href="/hra" className="btn-primary">Zpět do města →</GameLink>
            {after && <GameLink href={`/hra/prednaska/${after.id}`} className="btn-secondary">Další přednáška: {after.title}</GameLink>}
            <GameLink href="/hra/budova/skola" className="btn-secondary">Rozvrh</GameLink>
          </div>
        </div>
      )}
    </div>
  );
}
