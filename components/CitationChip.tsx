"use client";

import { useState } from "react";
import { LAWS, lawNumber, lawUrl } from "@/content/laws";
import { formatCitation } from "@/lib/format";
import type { Citation } from "@/lib/types";

export function CitationChip({ cite }: { cite: Citation }) {
  const [open, setOpen] = useState(false);
  const law = LAWS[cite.law];
  const href = lawUrl(cite.law, cite.par, cite.odst);
  const title = `${law.name} (${lawNumber(cite.law)})`;

  if (!cite.quote) {
    return (
      <span className="cite">
        <a className="cite-chip" href={href} target="_blank" rel="noopener noreferrer" title={`${title} – otevřít znění`}>
          {formatCitation(cite)} ↗
        </a>
      </span>
    );
  }

  return (
    <span className="cite">
      <button type="button" className="cite-chip" aria-expanded={open} onClick={() => setOpen((v) => !v)} title={title}>
        {formatCitation(cite)} {open ? "−" : "+"}
      </button>
      {open && (
        <span className="cite-quote">
          „{cite.quote}“
          <br />
          <a href={href} target="_blank" rel="noopener noreferrer">
            Celé znění: {law.name}, {lawNumber(cite.law)} ↗
          </a>
        </span>
      )}
    </span>
  );
}

export function Citations({ cites, label = "Opora v zákoně" }: { cites: Citation[]; label?: string }) {
  if (!cites.length) return null;
  return (
    <div className="cites">
      <span className="cites-label">{label}:</span>
      {cites.map((c, i) => (
        <CitationChip key={i} cite={c} />
      ))}
    </div>
  );
}
