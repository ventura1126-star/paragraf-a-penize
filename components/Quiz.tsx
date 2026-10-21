"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { CitationChip } from "./CitationChip";

function QuizQuestion({ q, index }: { q: Question; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="quiz-q card">
      <h3>
        {index + 1}. {q.q}
      </h3>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (answered && i === q.correct) cls += " correct";
          else if (answered && i === picked) cls += " wrong";
          return (
            <button key={i} type="button" className={cls} disabled={answered} onClick={() => setPicked(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="quiz-feedback" aria-live="polite">
          <strong>{picked === q.correct ? "Správně." : "Ne úplně."}</strong> {q.explain}{" "}
          {q.cite && <CitationChip cite={q.cite} />}
        </div>
      )}
    </div>
  );
}

export function Quiz({ questions }: { questions: Question[] }) {
  return (
    <div>
      {questions.map((q, i) => (
        <QuizQuestion key={i} q={q} index={i} />
      ))}
    </div>
  );
}
