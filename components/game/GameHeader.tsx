"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dueCards, levelOf, useGame } from "@/lib/game/store";
import { formatCzk } from "@/lib/format";

export function GameHeader() {
  const g = useGame();
  const path = usePathname();
  const lvl = levelOf(g.xp);
  const pct = lvl.to ? ((g.xp - lvl.from) / (lvl.to - lvl.from)) * 100 : 100;
  const due = dueCards(g).length;

  const tabs = [
    { href: "/hra", label: "Mapa" },
    { href: "/hra/trenink", label: due ? `Trénink (${due})` : "Trénink" },
    { href: "/hra/album", label: "Album" },
    { href: "/hra/lhuta", label: "Lhůta běží" },
  ];

  return (
    <div className="game-header card">
      <div className="game-stats">
        <div className="game-level">
          <div className="game-level-name">
            {lvl.name} <span className="muted">· úroveň {lvl.index + 1}</span>
          </div>
          <div className="xpbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Postup na další úroveň">
            <div style={{ width: `${pct}%` }} />
          </div>
          <div className="muted small">
            {g.xp} XP{lvl.to ? ` / ${lvl.to} XP do další úrovně` : " · nejvyšší úroveň"}
          </div>
        </div>
        <div className="wallet" title="Ilustrativní peněženka postavy Tomáše – nejde o vaše peníze.">
          <div className="muted small">Peněženka postavy</div>
          <div className={`wallet-sum ${g.wallet < 0 ? "neg" : ""}`}>{formatCzk(g.wallet)}</div>
        </div>
      </div>
      <nav className="game-tabs" aria-label="Herní navigace">
        {tabs.map((t) => {
          const active = t.href === "/hra" ? path === "/hra" || path.startsWith("/hra/ctvrt") || path.startsWith("/hra/pripad") : path.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
