"use client";

import { useMemo, useState } from "react";
import { PARAMS_2026, computeGarnishment, type GarnishmentParams } from "@/lib/garnishment";
import { formatCzk } from "@/lib/format";

function num(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function GarnishmentCalculator() {
  const [mzda, setMzda] = useState("30000");
  const [osoby, setOsoby] = useState("1");
  const [prednostni, setPrednostni] = useState(false);
  const [params, setParams] = useState<GarnishmentParams>(PARAMS_2026);

  const r = useMemo(
    () => computeGarnishment({ cistaMzda: num(mzda), vyzivovaneOsoby: Math.floor(num(osoby)), prednostni }, params),
    [mzda, osoby, prednostni, params],
  );
  const cista = Math.max(0, Math.floor(num(mzda)));
  const keepPct = cista > 0 ? (r.zustane / cista) * 100 : 100;

  return (
    <div className="calc-layout">
      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="mzda">Čistá měsíční mzda (Kč)</label>
          <input id="mzda" type="number" inputMode="numeric" min={0} step={1} value={mzda} onChange={(e) => setMzda(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="osoby">Počet vyživovaných osob</label>
          <input id="osoby" type="number" inputMode="numeric" min={0} max={10} step={1} value={osoby} onChange={(e) => setOsoby(e.target.value)} />
          <span className="muted" style={{ fontSize: "0.82rem" }}>Osoby, kterým platíte výživné. Manžel/partner se zpravidla nezapočítává.</span>
        </div>
        <div className="field">
          <label className="checkbox">
            <input type="checkbox" checked={prednostni} onChange={(e) => setPrednostni(e.target.checked)} />
            Vymáhá se přednostní pohledávka
          </label>
          <span className="muted" style={{ fontSize: "0.82rem" }}>Výživné, daně, pojistné, náhrada újmy na zdraví apod. (§ 279 odst. 2 OSŘ)</span>
        </div>
        <details className="params">
          <summary>Parametry výpočtu (2026)</summary>
          {(
            [
              ["zivotniMinimum", "Životní minimum jednotlivce"],
              ["normativniNajemne", "Normativní nájemné (1 osoba, obec 70 000+)"],
              ["energetickyPausal", "Energetický paušál (1 osoba)"],
            ] as const
          ).map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                id={key}
                type="number"
                min={0}
                value={params[key]}
                onChange={(e) => setParams((p) => ({ ...p, [key]: num(e.target.value) }))}
              />
            </div>
          ))}
        </details>
      </form>

      <div className="card" aria-live="polite">
        <table className="calc-table">
          <tbody>
            <tr>
              <td>Čistá mzda</td>
              <td>{formatCzk(cista)}</td>
            </tr>
            <tr>
              <td>
                Nezabavitelná částka
                <span className="sub">
                  85 % × součet ({formatCzk(r.zakladniCastka)}) + ¼ na každou vyživovanou osobu, zaokrouhleno nahoru
                </span>
              </td>
              <td>− {formatCzk(r.nezabavitelna)}</td>
            </tr>
            <tr>
              <td>
                Zbytek čisté mzdy
                <span className="sub">Hranice pro srážku bez omezení: {formatCzk(r.hranice)}</span>
              </td>
              <td>{formatCzk(r.zbytek)}</td>
            </tr>
            <tr>
              <td>
                Jedna třetina
                <span className="sub">ze zbytku do hranice, zaokrouhleného dolů na částku dělitelnou třemi</span>
              </td>
              <td>{formatCzk(r.tretina)}</td>
            </tr>
            {r.nadHranici > 0 && (
              <tr>
                <td>Část nad hranicí (sráží se celá)</td>
                <td>{formatCzk(r.nadHranici)}</td>
              </tr>
            )}
            <tr>
              <td>
                Srážka celkem
                <span className="sub">{prednostni ? "2/3 – přednostní pohledávka" : "1/3 – běžná pohledávka"}</span>
              </td>
              <td>{formatCzk(r.srazka)}</td>
            </tr>
            <tr className="total">
              <td>Zůstane vám</td>
              <td>{formatCzk(r.zustane)}</td>
            </tr>
          </tbody>
        </table>
        <div className="bar" role="img" aria-label={`Zůstane ${keepPct.toFixed(0)} % čisté mzdy`}>
          <div className="keep" style={{ width: `${keepPct}%` }} />
          <div className="take" style={{ width: `${100 - keepPct}%` }} />
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--ok)" }} />zůstane</span>
          <span><i style={{ background: "var(--bad)" }} />srážka</span>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem", marginBottom: 0 }}>
          Orientační výpočet. Nezohledňuje souběh více srážek, náhradu nákladů plátce mzdy ani zvláštní případy podle § 1
          odst. 2 nařízení vlády č. 595/2006 Sb. Při oddlužení se odvádí stejná částka jako u přednostních pohledávek.
        </p>
      </div>
    </div>
  );
}
