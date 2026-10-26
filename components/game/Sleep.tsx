"use client";

import { useState } from "react";
import { ENERGY_MAX, characterOf, sleep, useGame, type SleepSummary } from "@/lib/game/store";
import { buildingForCase } from "@/content/game/city";
import { isInterlude, nextStoryCase } from "@/lib/game/city-logic";
import { formatCzk } from "@/lib/format";
import { monthLabel } from "./Mailbox";

export function Energy({ value }: { value: number }) {
  return (
    <span className="energy" aria-label={`Energie ${value} z ${ENERGY_MAX}`}>
      {"⚡".repeat(value)}
      <span className="off">{"⚡".repeat(Math.max(0, ENERGY_MAX - value))}</span>
    </span>
  );
}

/** Doma: vyspat se a začít další měsíc (energie, výplata a účty, nová pošta). */
export function SleepBox() {
  const g = useGame();
  const ch = characterOf(g);
  const [summary, setSummary] = useState<SleepSummary | null>(null);
  if (!ch) return null;

  if (summary) {
    const next = nextStoryCase(g);
    const where = next ? buildingForCase(next) : undefined;
    return (
      <section className="card sleep-box sleep-done" aria-live="polite">
        <div className="sleep-title">🌅 Nový měsíc: {monthLabel(summary.month)}</div>
        <ul className="sleep-list">
          <li>
            {summary.incomeKind === "duchod" ? "Důchod" : "Výplata"} <strong>+{formatCzk(summary.income)}</strong>
          </li>
          <li>
            Nájem, jídlo a účty <strong>−{formatCzk(summary.spent)}</strong>
          </li>
          <li>
            Zbylo do peněženky <strong className="sleep-plus">+{formatCzk(summary.surplus)}</strong>
          </li>
          <li>
            Energie doplněná <Energy value={ENERGY_MAX} />
          </li>
          {summary.newLetters.length > 0 && <li>Ve schránce: {summary.newLetters.length === 1 ? "nový dopis" : `${summary.newLetters.length} nové dopisy`} (níže)</li>}
          {where && <li>Příběh pokračuje: <strong>{where.name}</strong></li>}
          {!where && isInterlude(g) && <li>Tento měsíc je <strong>mezihra</strong>: škola, lidé na ulici a schránka. Příběh pokračuje příští měsíc.</li>}
        </ul>
      </section>
    );
  }

  return (
    <section className="card sleep-box">
      <div className="sleep-title">
        {monthLabel(g.month)} · energie <Energy value={g.energy} />
      </div>
      <p className="small muted">
        Vyspáním začne další měsíc: doplní se energie, přijde {ch.income.kind === "duchod" ? "důchod" : "výplata"}, zaplatí se účty
        a dorazí nová pošta.
      </p>
      <button type="button" className="btn-primary" onClick={() => setSummary(sleep())}>
        😴 Jít spát
      </button>
    </section>
  );
}
