/** Registr předpisů, na které obsah odkazuje. */
export const LAWS = {
  oz: { abbr: "OZ", name: "Občanský zákoník", year: 2012, num: 89 },
  osr: { abbr: "OSŘ", name: "Občanský soudní řád", year: 1963, num: 99 },
  er: { abbr: "EŘ", name: "Exekuční řád", year: 2001, num: 120 },
  iz: { abbr: "IZ", name: "Insolvenční zákon", year: 2006, num: 182 },
  zsu: { abbr: "ZSÚ", name: "Zákon o spotřebitelském úvěru", year: 2016, num: 257 },
  zdp: { abbr: "ZDP", name: "Zákon o daních z příjmů", year: 1992, num: 586 },
  dr: { abbr: "DŘ", name: "Daňový řád", year: 2009, num: 280 },
  zpkt: { abbr: "ZPKT", name: "Zákon o podnikání na kapitálovém trhu", year: 2004, num: 256 },
  zdps: { abbr: "ZDPS", name: "Zákon o doplňkovém penzijním spoření", year: 2011, num: 427 },
  zob: { abbr: "ZoB", name: "Zákon o bankách", year: 1992, num: 21 },
  zfa: { abbr: "ZFA", name: "Zákon o finančním arbitrovi", year: 2002, num: 229 },
  zos: { abbr: "ZOS", name: "Zákon o ochraně spotřebitele", year: 1992, num: 634 },
  nv595: { abbr: "NV 595/2006", name: "Nařízení vlády o nezabavitelných částkách", year: 2006, num: 595 },
} as const;

export type LawId = keyof typeof LAWS;

export function lawNumber(id: LawId): string {
  const l = LAWS[id];
  return `${l.num}/${l.year} Sb.`;
}

/** Odkaz na aktuální znění na zakonyprolidi.cz, volitelně přímo na paragraf/odstavec. */
export function lawUrl(id: LawId, par?: string, odst?: number): string {
  const l = LAWS[id];
  const base = `https://www.zakonyprolidi.cz/cs/${l.year}-${l.num}`;
  if (!par) return base;
  return `${base}#p${par}${odst ? `-${odst}` : ""}`;
}

/** Oficiální e-Sbírka (právně závazné znění). */
export function eSbirkaUrl(id: LawId): string {
  const l = LAWS[id];
  return `https://www.e-sbirka.cz/sb/${l.year}/${l.num}`;
}
