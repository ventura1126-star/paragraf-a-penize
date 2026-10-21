"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchDoc } from "@/lib/search";

/** Normalizace bez diakritiky a velikosti písmen. */
function norm(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function snippet(text: string, terms: string[]): string {
  const n = norm(text);
  const hits = terms.map((t) => n.indexOf(t)).filter((i) => i >= 0);
  const pos = hits.length ? Math.min(...hits) : 0;
  const start = Math.max(0, pos - 60);
  return (start > 0 ? "…" : "") + text.slice(start, start + 200) + (start + 200 < text.length ? "…" : "");
}

export function Search({ docs }: { docs: SearchDoc[] }) {
  const [q, setQ] = useState("");
  const indexed = useMemo(() => docs.map((d) => ({ d, n: norm(`${d.title} ${d.text}`) })), [docs]);

  const terms = norm(q).replace(/§\s*/g, "§ ").split(/\s+/).filter((t) => t.length > 1 || /\d/.test(t));
  const results =
    terms.length === 0
      ? []
      : indexed
          .map(({ d, n }) => {
            if (!terms.every((t) => n.includes(t))) return null;
            const score = terms.reduce((s, t) => s + (norm(d.title).includes(t) ? 3 : 1), 0);
            return { d, score };
          })
          .filter((x): x is { d: SearchDoc; score: number } => x !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, 30);

  return (
    <>
      <input
        className="search-input"
        type="search"
        autoFocus
        placeholder="Co hledáte?"
        aria-label="Hledaný výraz"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {terms.length > 0 && (
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          {results.length ? `Nalezeno: ${results.length}` : "Nic nenalezeno."}
        </p>
      )}
      <ul className="search-results">
        {results.map(({ d }) => (
          <li key={d.href + d.title} className="card">
            <Link href={d.href}>
              <div className="eyebrow">{d.context}</div>
              <h3>{d.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{snippet(d.text, terms)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
