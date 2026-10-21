"use client";

import { useState } from "react";
import { CARD_BY_ID } from "@/content/game/cards";
import { Citations } from "@/components/CitationChip";
import type { DeadlinePuzzle } from "@/lib/game/deadlines";
import { formatDay, holidayName, MONTHS, nonWorkReason, parseIso, toIso } from "@/lib/game/dates";
import { CardFace } from "./ParagraphCard";

function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7; // pondělí = 0
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(toIso(new Date(Date.UTC(year, month, d))));
  return cells;
}

export function DeadlineQuestion({
  puzzle,
  continueLabel,
  onContinue,
}: {
  puzzle: DeadlinePuzzle;
  continueLabel: string;
  onContinue: (ok: boolean) => void;
}) {
  const [pick, setPick] = useState<string | null>(null);
  const ok = pick === puzzle.answer;
  const ev = parseIso(puzzle.eventDate);
  const months = [0, 1, 2].map((i) => {
    const d = new Date(Date.UTC(ev.getUTCFullYear(), ev.getUTCMonth() + i, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });
  const lastShown = toIso(new Date(Date.UTC(months[2].y, months[2].m + 1, 0)));

  return (
    <div className="round">
      <div className="eyebrow">{puzzle.title}</div>
      <p>{puzzle.story}</p>
      <h2 className="round-prompt">{puzzle.question}</h2>
      <p className="muted small">Klikněte na den v kalendáři. Svátky jsou podtržené, víkendy šedé.</p>

      <div className="calendars">
        {months.map(({ y, m }) => (
          <div key={`${y}-${m}`} className="cal">
            <div className="cal-title">{MONTHS[m]} {y}</div>
            <div className="cal-grid">
              {["po", "út", "st", "čt", "pá", "so", "ne"].map((w) => (
                <div key={w} className="cal-wd">{w}</div>
              ))}
              {monthGrid(y, m).map((iso, i) => {
                if (!iso) return <div key={i} />;
                const off = nonWorkReason(iso);
                const hol = holidayName(iso);
                let cls = "cal-day";
                if (off) cls += " off";
                if (hol) cls += " hol";
                if (iso === puzzle.eventDate) cls += " event";
                if (pick) {
                  if (iso === puzzle.answer) cls += " answer";
                  else if (iso === pick) cls += " wrongpick";
                }
                const beforeEvent = iso <= puzzle.eventDate;
                return (
                  <button
                    key={iso}
                    type="button"
                    className={cls}
                    disabled={pick !== null || beforeEvent || iso > lastShown}
                    title={hol ?? off ?? undefined}
                    aria-label={`${formatDay(iso)}${hol ? `, ${hol}` : ""}`}
                    onClick={() => setPick(iso)}
                  >
                    {parseIso(iso).getUTCDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="muted small">
        <span className="legend-event" /> den události ({formatDay(puzzle.eventDate)})
      </p>

      {pick && (
        <div className={`verdict verdict-${ok ? "correct" : "wrong"}`} aria-live="polite">
          <div className="verdict-head">
            <strong>{ok ? "Správně" : "Takhle ne"}</strong>
            <span className="muted">
              {ok ? formatDay(puzzle.answer) : `Vybrali jste ${formatDay(pick)}, správně je ${formatDay(puzzle.answer)}.`}
            </span>
          </div>
          <ol className="steps">
            {puzzle.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {!ok && pick < puzzle.answer && (
            <p className="muted small">Kratší termín vám neublíží, ale zbytečně si ubíráte čas. Opačná chyba – pozdní úkon – vás může stát hodně.</p>
          )}
          <Citations cites={puzzle.cites} label="Rozhoduje" />
          <div className="reward-row">
            {puzzle.cards.map((id) => {
              const c = CARD_BY_ID.get(id);
              return c ? <CardFace key={id} card={c} size="sm" /> : null;
            })}
            <span className="muted small">{ok ? "Karty získány nebo posunuty v opakování." : "Karty půjdou zítra k opakování."}</span>
          </div>
          <p className="muted small">Platbu ani podání nenechávejte na poslední den – počítejte s dobou převodu a doručení.</p>
          <button type="button" className="btn-primary" onClick={() => onContinue(ok)}>
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}
