"use client";

import Link from "next/link";
import { buildingForCase, MONTH_NAMES } from "@/content/game/city";
import { characterOf, deliveredLetters, resolveEvent, useGame } from "@/lib/game/store";
import { EVENT_BY_ID } from "@/content/game/events";
import { fill } from "@/content/game/characters";
import { CitationChip } from "@/components/CitationChip";

export function monthLabel(m: number): string {
  return `${MONTH_NAMES[(m - 1) % 12]}${m > 12 ? ` (${Math.ceil(m / 12)}. rok)` : ""}`;
}

/** Schránka: dopisy, které přišly kvůli dřívějším rozhodnutím. */
export function Mailbox({ compact = false }: { compact?: boolean }) {
  const g = useGame();
  const ch = characterOf(g);
  const f = (t: string) => (ch ? fill(t, ch) : t);
  const letters = deliveredLetters(g).slice().reverse();
  const waiting = g.letters.filter((l) => l.month > g.month && !l.read).length;

  if (!letters.length) {
    return (
      <p className="muted">
        Schránka je prázdná.{waiting ? " Něco je ale na cestě – rozhodnutí mají následky." : " Zatím nic nepřišlo."}
      </p>
    );
  }
  return (
    <ul className="mailbox">
      {letters.map((l) => {
        const ev = l.eventId ? EVENT_BY_ID.get(l.eventId) : undefined;
        if (ev) {
          const picked = l.choice !== undefined ? ev.choices[l.choice] : undefined;
          return (
            <li key={l.id} className={`card letter letter-event ${l.read ? "read" : ""}`}>
              <div className="letter-head">
                <strong>{l.sender}</strong>
                <span className="muted small">{monthLabel(l.month)}</span>
              </div>
              <div className="letter-subject">{f(ev.subject)}</div>
              <p className="letter-text">{f(ev.text)}</p>
              {!l.read ? (
                <div className="letter-choices">
                  {ev.choices.length === 0 ? (
                    <button type="button" className="btn-primary" onClick={() => resolveEvent(l.id, null)}>Vzít na vědomí</button>
                  ) : (
                    ev.choices.map((c, i) => (
                      <button key={i} type="button" className={i === 0 ? "btn-primary" : "btn-secondary"} onClick={() => resolveEvent(l.id, i)}>
                        {c.label}
                      </button>
                    ))
                  )}
                </div>
              ) : picked ? (
                <div className="letter-result">
                  <strong>Vybral{ch?.feminine ? "a" : ""} jste: {picked.label}.</strong> {f(picked.result)} {picked.cite && <CitationChip cite={picked.cite} />}
                  <div className="muted small">
                    {picked.wallet !== 0 && `Peněženka ${picked.wallet > 0 ? "+" : ""}${new Intl.NumberFormat("cs-CZ").format(picked.wallet)} Kč · `}
                    Zátěž {picked.load > 0 ? "+" : ""}{picked.load}
                  </div>
                </div>
              ) : (
                <span className="tag tag-done">
                  {ev.notice ? `připsáno ${new Intl.NumberFormat("cs-CZ").format(ev.notice)} Kč` : "přečteno"}
                </span>
              )}
            </li>
          );
        }
        const b = buildingForCase(l.caseId);
        return (
          <li key={l.id} className={`card letter ${l.read ? "read" : ""}`}>
            <div className="letter-head">
              <strong>{l.sender}</strong>
              <span className="muted small">{monthLabel(l.month)}</span>
            </div>
            <div>{l.subject}</div>
            {!compact && <div className="muted small">Proč přišel: {l.reason}.</div>}
            {l.read ? (
              <span className="tag tag-done">vyřešeno</span>
            ) : (
              <Link href={`/hra/pripad/${l.caseId}`} className="btn-primary">
                Otevřít dopis{b ? ` · ${b.name}` : ""}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
