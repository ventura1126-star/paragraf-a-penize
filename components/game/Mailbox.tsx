"use client";

import Link from "next/link";
import { buildingForCase, MONTH_NAMES } from "@/content/game/city";
import { deliveredLetters, useGame } from "@/lib/game/store";

export function monthLabel(m: number): string {
  return `${MONTH_NAMES[(m - 1) % 12]}${m > 12 ? ` (${Math.ceil(m / 12)}. rok)` : ""}`;
}

/** Schránka: dopisy, které přišly kvůli dřívějším rozhodnutím. */
export function Mailbox({ compact = false }: { compact?: boolean }) {
  const g = useGame();
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
