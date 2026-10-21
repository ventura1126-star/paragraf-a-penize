"use client";

import Link from "next/link";
import { CASES, DISTRICTS } from "@/content/game/cases";
import { CARDS } from "@/content/game/cards";
import { useGame } from "@/lib/game/store";

export function DistrictMap() {
  const g = useGame();
  const done = CASES.filter((c) => g.cases[c.id]?.done).length;
  const collected = CARDS.filter((c) => g.cards[c.id]?.collected).length;

  return (
    <div className="district-grid">
      {DISTRICTS.map((d) =>
        d.playable ? (
          <Link key={d.id} href={`/hra/ctvrt/${d.id}`} className="card district playable">
            <div className="eyebrow">Hratelné</div>
            <h3>{d.name}</h3>
            <p className="muted">{d.blurb}</p>
            <div className="district-meta">
              <span className="tag">{done}/{CASES.length} případů</span>
              <span className="tag">{collected}/{CARDS.length} karet</span>
            </div>
          </Link>
        ) : (
          <div key={d.id} className="card district">
            <div className="eyebrow">Připravujeme</div>
            <h3>{d.name}</h3>
            <p className="muted">{d.blurb}</p>
            <Link href={`/tema/${d.topic}`} className="small">Zatím jako lekce →</Link>
          </div>
        ),
      )}
    </div>
  );
}
