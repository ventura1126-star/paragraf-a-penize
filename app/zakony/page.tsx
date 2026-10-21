import Link from "next/link";
import type { Metadata } from "next";
import { LAWS, eSbirkaUrl, lawNumber, lawUrl, type LawId } from "@/content/laws";
import { TOPICS } from "@/content";

export const metadata: Metadata = {
  title: "Rejstřík zákonů",
  description: "Všechna ustanovení citovaná v lekcích, seřazená podle předpisu.",
};

type Ref = { topic: string; lesson: string; title: string };

function parKey(p: string): [number, string] {
  const m = p.match(/^(\d+)(.*)$/);
  return m ? [Number(m[1]), m[2]] : [0, p];
}

export default function LawsPage() {
  // předpis → paragraf → lekce, ve kterých je citován
  const index = new Map<LawId, Map<string, Map<string, Ref>>>();
  for (const t of TOPICS) {
    for (const l of t.lessons) {
      const cites = [...l.sections.flatMap((s) => s.cites), ...l.situations.flatMap((s) => s.cites)];
      for (const c of cites) {
        const pars = index.get(c.law) ?? new Map();
        const refs = pars.get(c.par) ?? new Map();
        refs.set(`${t.slug}/${l.slug}`, { topic: t.slug, lesson: l.slug, title: l.title });
        pars.set(c.par, refs);
        index.set(c.law, pars);
      }
    }
  }

  const laws = (Object.keys(LAWS) as LawId[]).filter((id) => index.has(id));

  return (
    <div className="narrow">
      <h1>Rejstřík zákonů</h1>
      <p className="lead">Každé ustanovení, o které se lekce opírají, s odkazem na znění a na lekce, kde se vykládá.</p>
      {laws.map((id) => {
        const pars = [...index.get(id)!.entries()].sort((a, b) => {
          const [na, sa] = parKey(a[0]);
          const [nb, sb] = parKey(b[0]);
          return na - nb || sa.localeCompare(sb);
        });
        return (
          <section key={id} className="card law-entry">
            <h3>
              {LAWS[id].name} <span className="tag">{LAWS[id].abbr}</span>
            </h3>
            <div className="muted" style={{ fontSize: "0.88rem" }}>
              č. {lawNumber(id)} ·{" "}
              <a href={lawUrl(id)} target="_blank" rel="noopener noreferrer">aktuální znění ↗</a> ·{" "}
              <a href={eSbirkaUrl(id)} target="_blank" rel="noopener noreferrer">e-Sbírka ↗</a>
            </div>
            <ul className="par-list">
              {pars.map(([par, refs]) => (
                <li key={par}>
                  <a className="par" href={lawUrl(id, par)} target="_blank" rel="noopener noreferrer">§ {par}</a>
                  <span>
                    {[...refs.values()].map((r, i) => (
                      <span key={r.lesson}>
                        {i > 0 && ", "}
                        <Link href={`/tema/${r.topic}/${r.lesson}`}>{r.title}</Link>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
