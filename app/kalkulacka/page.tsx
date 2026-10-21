import type { Metadata } from "next";
import { GarnishmentCalculator } from "@/components/GarnishmentCalculator";
import { Citations } from "@/components/CitationChip";

export const metadata: Metadata = {
  title: "Kalkulačka srážek ze mzdy 2026",
  description: "Výpočet exekučních srážek ze mzdy podle § 279 OSŘ a nařízení vlády č. 595/2006 Sb. ve znění pro rok 2026.",
};

export default function CalculatorPage() {
  return (
    <>
      <div className="narrow">
        <div className="eyebrow">Nástroj</div>
        <h1>Kalkulačka srážek ze mzdy</h1>
        <p className="lead">
          Orientační výpočet srážek při exekuci nebo insolvenci. Vychází z čisté mzdy a parametrů platných od 1. 1. 2026.
        </p>
        <Citations
          cites={[
            { law: "osr", par: "277", odst: 1 },
            { law: "osr", par: "279", odst: 1 },
            { law: "osr", par: "279", odst: 3 },
            { law: "nv595", par: "1" },
            { law: "nv595", par: "2" },
          ]}
        />
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <GarnishmentCalculator />
      </div>
    </>
  );
}
