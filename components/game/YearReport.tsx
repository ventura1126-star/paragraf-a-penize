"use client";

import { CARDS } from "@/content/game/cards";
import { characterOf, useGame } from "@/lib/game/store";
import { storyFinished } from "@/lib/game/city-logic";
import { formatCzk } from "@/lib/format";

/** Vysvědčení po poraženém bossovi. */
export function YearReport() {
  const g = useGame();
  const ch = characterOf(g);
  if (!ch || !storyFinished(g)) return null;
  const cards = CARDS.filter((c) => g.cards[c.id]?.collected).length;
  return (
    <div className="card year-report">
      <div className="eyebrow">Příběh dokončen · {g.month - 1} měsíců</div>
      <h2>Vysvědčení postavy {ch.forms.g}</h2>
      <div className="summary-stats">
        <div><strong>{formatCzk(g.wallet)}</strong><span>peněženka (start {formatCzk(ch.wallet)})</span></div>
        <div><strong>{g.load} / 100</strong><span>dluhová zátěž</span></div>
        <div><strong>{cards}</strong><span>karet paragrafů</span></div>
      </div>
      <p className="muted">
        Ve skutečnosti by se tytéž chyby počítaly v letech, ne v měsících – a některé (exekuce, insolvence) by zůstaly v
        registrech. Zkuste příběh jiné postavy, nebo si zopakujte karty v tréninku.
      </p>
    </div>
  );
}
