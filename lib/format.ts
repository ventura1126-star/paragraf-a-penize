import { LAWS } from "@/content/laws";
import type { Citation } from "@/lib/types";

/** „§ 279 odst. 1 písm. b) OSŘ“ */
export function formatCitation(c: Citation, withLaw = true): string {
  let s = `§ ${c.par}`;
  if (c.odst) s += ` odst. ${c.odst}`;
  if (c.pism) s += ` písm. ${c.pism})`;
  if (withLaw) s += ` ${LAWS[c.law].abbr}`;
  return s;
}

const czk = new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 2 });
export function formatCzk(n: number): string {
  return czk.format(n);
}
