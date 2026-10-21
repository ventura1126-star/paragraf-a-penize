import Link from "next/link";
import { LAWS } from "@/content/laws";
import { LEGAL_STATE_DATE, TOPICS } from "@/content";

export default function Home() {
  const lessons = TOPICS.flatMap((t) => t.lessons);
  const cites = new Set(
    lessons.flatMap((l) => [...l.sections.flatMap((s) => s.cites), ...l.situations.flatMap((s) => s.cites)]).map((c) => `${c.law}:${c.par}`),
  );

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Finanční gramotnost · právní stav k {LEGAL_STATE_DATE}</div>
        <h1>Peníze podle zákona, ne podle reklamy</h1>
        <p className="lead">
          Každé tvrzení v lekcích je opřené o konkrétní paragraf. Přečtete si srozumitelný výklad, projdete modelové
          situace z praxe a jedním klikem si otevřete přesné znění zákona.
        </p>
        <div className="stats">
          <div className="stat"><strong>{TOPICS.length}</strong><span>oblastí</span></div>
          <div className="stat"><strong>{lessons.length}</strong><span>lekcí</span></div>
          <div className="stat"><strong>{cites.size}</strong><span>citovaných ustanovení</span></div>
          <div className="stat"><strong>{Object.keys(LAWS).length}</strong><span>předpisů</span></div>
        </div>
      </section>

      <Link href="/hra" className="card game-cta">
        <div>
          <div className="eyebrow">Novinka · hra</div>
          <h3>Město paragrafů: Dlužnická čtvrť</h3>
          <p className="muted">Vyberte si jednu z pěti postav, rozhodujte za ni, sbírejte karty paragrafů a trénujte lhůty. O výsledku rozhoduje zákon.</p>
        </div>
        <span className="btn-primary">Hrát</span>
      </Link>

      <h2 id="temata">Témata</h2>
      <div className="grid">
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/tema/${t.slug}`} className="card topic-card">
            <div className="eyebrow">{t.short} · {t.lessons.length} lekce</div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <div className="laws">
              {t.laws.map((l) => (
                <span key={l} className="tag">{LAWS[l].abbr}</span>
              ))}
            </div>
          </Link>
        ))}
        <Link href="/kalkulacka" className="card topic-card">
          <div className="eyebrow">Nástroj</div>
          <h3>Kalkulačka srážek ze mzdy 2026</h3>
          <p>Kolik vám při exekuci smí zaměstnavatel srazit a kolik vám zůstane – výpočet krok za krokem podle § 279 OSŘ.</p>
          <div className="laws"><span className="tag">OSŘ</span><span className="tag">NV 595/2006</span></div>
        </Link>
      </div>
    </>
  );
}
