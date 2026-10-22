"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { characterOf, deliveredLetters, dueCards, levelOf, useGame } from "@/lib/game/store";
import { monthLabel } from "./Mailbox";
import { Avatar } from "./Avatar";
import { formatCzk } from "@/lib/format";

export function GameHeader() {
  const g = useGame();
  const path = usePathname();
  const lvl = levelOf(g.xp);
  const pct = lvl.to ? ((g.xp - lvl.from) / (lvl.to - lvl.from)) * 100 : 100;
  const due = dueCards(g).length;
  const ch = characterOf(g);
  const mail = deliveredLetters(g).filter((l) => !l.read).length;

  const tabs = [
    { href: "/hra", label: "Město" },
    { href: "/hra/schranka", label: mail ? `Schránka (${mail})` : "Schránka" },
    { href: "/hra/trenink", label: due ? `Trénink (${due})` : "Trénink" },
    { href: "/hra/album", label: "Album" },
    { href: "/hra/lhuta", label: "Lhůta běží" },
  ];

  return (
    <div className="game-header card">
      <div className="game-stats">
        {ch ? (
          <Link href="/hra/postava" className="game-char" title="Změnit postavu">
            <Avatar ch={ch} size={44} />
            <span>
              <strong>{ch.forms.n}</strong>
              <span className="muted small">{ch.role} · změnit</span>
            </span>
          </Link>
        ) : (
          <Link href="/hra/postava" className="btn-primary">Vybrat postavu</Link>
        )}
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
        <div className="wallet" title="Ilustrativní peněženka postavy – nejde o vaše peníze.">
          <div className="muted small">{ch ? `Peněženka: ${ch.forms.n}` : "Peněženka postavy"}</div>
          <div className={`wallet-sum ${g.wallet < 0 ? "neg" : ""}`}>{formatCzk(g.wallet)}</div>
        </div>
        {ch && (
          <div className="game-time">
            <div className="muted small">Měsíc {g.month} · {monthLabel(g.month)}</div>
            <div className="loadbar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={g.load} aria-label="Dluhová zátěž">
              <div className={g.load >= 70 ? "high" : g.load >= 40 ? "mid" : ""} style={{ width: `${g.load}%` }} />
            </div>
            <div className="muted small">Dluhová zátěž {g.load} / 100</div>
          </div>
        )}
      </div>
      <nav className="game-tabs" aria-label="Herní navigace">
        {tabs.map((t) => {
          const active = t.href === "/hra" ? path === "/hra" || path.startsWith("/hra/pripad") || path.startsWith("/hra/postava") || path.startsWith("/hra/budova") || path.startsWith("/hra/priprava") : path.startsWith(t.href);
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
