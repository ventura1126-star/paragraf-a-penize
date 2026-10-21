"use client";

import Link from "next/link";
import { CASES } from "@/content/game/cases";
import { unlockBoss, useGame } from "@/lib/game/store";

const BOSS_AFTER = 4;

export function DistrictCases() {
  const g = useGame();
  const regular = CASES.filter((c) => !c.boss);
  const boss = CASES.filter((c) => c.boss);
  const doneCount = regular.filter((c) => g.cases[c.id]?.done).length;
  const bossOpen = g.bossUnlocked || doneCount >= BOSS_AFTER;

  return (
    <>
      <ol className="case-list">
        {regular.map((c, i) => {
          const st = g.cases[c.id];
          return (
            <li key={c.id}>
              <Link href={`/hra/pripad/${c.id}`} className="card case-tile">
                <span className="case-num">{i + 1}</span>
                <span className="case-body">
                  <strong>{c.title}</strong>
                  <span className="muted">{c.teaser}</span>
                </span>
                <span className={`tag ${st?.done ? "tag-done" : ""}`}>
                  {st?.done ? `${st.correct}/${st.total} správně` : `${c.rounds.length} ${c.rounds.length === 1 ? "rozhodnutí" : "rozhodnutí"}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {boss.map((c) => {
        const st = g.cases[c.id];
        return bossOpen ? (
          <Link key={c.id} href={`/hra/pripad/${c.id}`} className="card case-tile boss">
            <span className="case-num">★</span>
            <span className="case-body">
              <strong>Boss: {c.title}</strong>
              <span className="muted">{c.teaser}</span>
            </span>
            <span className={`tag ${st?.done ? "tag-done" : ""}`}>{st?.done ? `${st.correct}/${st.total} správně` : `${c.rounds.length} rozhodnutí`}</span>
          </Link>
        ) : (
          <div key={c.id} className="card case-tile boss locked">
            <span className="case-num">★</span>
            <span className="case-body">
              <strong>Boss: {c.title}</strong>
              <span className="muted">
                Otevře se po vyřešení {BOSS_AFTER} případů ({doneCount}/{BOSS_AFTER}).
              </span>
            </span>
            <button type="button" className="btn-secondary" onClick={unlockBoss}>
              Odemknout hned
            </button>
          </div>
        );
      })}
    </>
  );
}
