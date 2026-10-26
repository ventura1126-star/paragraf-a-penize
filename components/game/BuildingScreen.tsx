"use client";

import { GameLink as Link } from "./GameNav";
import { useState } from "react";
import { HOME_IDS, PORADNA_IDS, SCHOOL_IDS, type Building } from "@/content/game/city";
import { CASE_BY_ID } from "@/content/game/cases";
import { fill } from "@/content/game/characters";
import { PREP_BY_ID, PREPS } from "@/content/game/preps";
import { caseAccess } from "@/lib/game/city-logic";
import { ENERGY_COST, caseProgress, characterOf, consult, prepDone, useGame, useHydrated } from "@/lib/game/store";
import { SleepBox } from "./Sleep";
import { RoofPreview } from "./RoofPreview";
import { Dialogue } from "./Dialogue";
import { DIALOGUES } from "@/content/game/dialogues";
import { PixelSprite } from "./PixelSprite";
import { NeedCharacter } from "./NeedCharacter";
import { Mailbox } from "./Mailbox";
import { HelpBanner } from "./HelpBanner";
import { SchoolScreen } from "./Lecture";

export function BuildingScreen({ b }: { b: Building }) {
  const g = useGame();
  const hydrated = useHydrated();
  const ch = characterOf(g);
  const [consulted, setConsulted] = useState<boolean | null>(null);
  const [talked, setTalked] = useState(false);
  if (!hydrated) return <p className="muted">Načítám…</p>;
  if (!ch) return <NeedCharacter />;
  if (SCHOOL_IDS.has(b.id)) return <SchoolScreen />;

  const here = b.cases.map((id) => ({ id, c: CASE_BY_ID.get(id)!, acc: caseAccess(g, id) })).filter((x) => x.c);
  const mine = here.filter((x) => x.acc !== "elsewhere");
  const prep = b.prep ? PREP_BY_ID.get(b.prep) : undefined;

  const dlg = DIALOGUES[b.id];
  const hook = mine.some((x) => x.acc === "available");
  // doma se chodí hlavně spát a pro poštu: soused zdrží jen, když tu čeká kapitola příběhu
  if (dlg && !talked && (!HOME_IDS.has(b.id) || hook)) {
    return (
      <>
        <Dialogue d={dlg} ch={ch} hook={hook} onDone={() => setTalked(true)} />
        <div className="summary-actions" style={{ marginTop: "1rem" }}>
          <Link href="/hra" className="btn-secondary">← Odejít zpět do města</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="building-hero card">
        <RoofPreview b={b} />
        <div className="building-talk">
          <PixelSprite id={ch.id} variant="bust" scale={4} className="building-you" />
          <div className="bubble">{fill(b.greeting, ch)}</div>
        </div>
      </div>

      {mine.length > 0 && (
        <section>
          <h2>Nástrahy</h2>
          <ul className="case-list">
            {mine.map(({ id, c, acc }) => {
              const st = caseProgress(g, id);
              return (
                <li key={id} className="card case-tile">
                  <span className="case-body">
                    <strong>{c.boss ? `Boss: ${c.title}` : c.title}</strong>
                    <span className="muted">
                      {acc === "later"
                        ? "Na tohle přijde řada později v příběhu."
                        : acc === "nextMonth"
                          ? "Příběh tu pokračuje později. Mezitím škola a lidé na ulici – pak se doma vyspěte."
                          : fill(c.teaser, ch)}
                    </span>
                  </span>
                  {acc === "available" &&
                    (g.energy >= ENERGY_COST.case ? (
                      <Link href={`/hra/pripad/${id}`} className="btn-primary">Vstoupit ⚡⚡</Link>
                    ) : (
                      <span className="tag">Málo energie – vyspěte se doma</span>
                    ))}
                  {acc === "done" && (
                    <Link href={`/hra/pripad/${id}`} className="tag tag-done">{st?.correct}/{st?.total} · hrát znovu</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {mine.length === 0 && b.kind !== "safe" && !HOME_IDS.has(b.id) && b.cases.length > 0 && (
        <p className="muted">Tahle budova do příběhu vaší postavy nepatří. Ostatní nástrahy tu čekají na jiné postavy.</p>
      )}

      {HOME_IDS.has(b.id) && <SleepBox />}
      {HOME_IDS.has(b.id) && (
        <section>
          <h2>Schránka</h2>
          <Mailbox />
        </section>
      )}

      {PORADNA_IDS.has(b.id) && (
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Konzultace</h2>
          <p>
            Dluhová zátěž vaší postavy: <strong>{g.load} / 100</strong>. Poradkyně projde dluhy a navrhne postup. Jednou za
            herní měsíc sníží zátěž o 10.
          </p>
          {g.consultMonth === g.month ? (
            <p className="muted">{consulted ? "Hotovo – zátěž klesla. " : ""}Tento měsíc už konzultace proběhla.</p>
          ) : (
            <button type="button" className="btn-primary" onClick={() => setConsulted(consult())}>
              Probrat dluhy s poradkyní
            </button>
          )}
          <h3>Všechny přípravy</h3>
          <ul className="prep-index">
            {PREPS.map((p) => (
              <li key={p.id}>
                <Link href={`/hra/priprava/${p.id}?zpet=${b.id}`}>{p.title}</Link>
                {prepDone(g, p.id) && <span className="muted small"> · prošli jste</span>}
              </li>
            ))}
          </ul>
          <p className="small">
            <Link href="/kalkulacka">Kalkulačka srážek ze mzdy</Link>
          </p>
        </section>
      )}

      {prep && b.id !== "poradna" && (
        <p className="muted small">
          Chcete si nejdřív projít základy?{" "}
          <Link href={`/hra/priprava/${prep.id}?zpet=${b.id}`}>Příprava: {prep.title}</Link>
        </p>
      )}

      <div className="summary-actions" style={{ marginTop: "1.5rem" }}>
        <Link href="/hra" className="btn-secondary">← Zpět do města</Link>
      </div>
      {(b.kind === "safe" || b.district === "urady") && <HelpBanner />}
    </>
  );
}
