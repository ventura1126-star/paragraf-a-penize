import type { Metadata } from "next";
import { GLOSSARY } from "@/content/glossary";
import { CitationChip } from "@/components/CitationChip";

export const metadata: Metadata = { title: "Slovník pojmů" };

export default function GlossaryPage() {
  const entries = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "cs"));
  return (
    <div className="narrow">
      <h1>Slovník pojmů</h1>
      <p className="lead">Právní pojmy, se kterými se v lekcích setkáte, s odkazem na ustanovení, které je definuje.</p>
      <dl className="glossary">
        {entries.map((e) => (
          <div key={e.term} id={encodeURIComponent(e.term)}>
            <dt>{e.term}</dt>
            <dd>
              {e.definition} {e.cite && <CitationChip cite={e.cite} />}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
