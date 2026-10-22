/**
 * Město dluhů: mřížka 19 × 11 dlaždic. Chodí se po silnicích (řádky 2, 5, 8 a sloupce 7, 11),
 * budovy mají 3 × 2 dlaždice a dveře na sousední silnici.
 */
export const CITY_W = 19;
export const CITY_H = 11;
export const ROAD_ROWS = [2, 5, 8];
export const ROAD_COLS = [7, 11];

export type District = "obchod" | "finance" | "urady" | "bydleni" | "namesti";
export type BuildingKind = "risk" | "normal" | "office" | "safe";

export type Building = {
  id: string;
  name: string;
  district: District;
  kind: BuildingKind;
  /** Levý horní roh (dlaždice). */
  x: number;
  y: number;
  /** Dveře – dlaždice silnice, na které se do budovy vstupuje. */
  door: { x: number; y: number };
  /** Nástrahy (id případů), které se v budově odehrávají. */
  cases: string[];
  /** Co řekne člověk ve dveřích, když postava vejde. */
  greeting: string;
  /** Téma přípravy, které je tu k dispozici (i bez nástrahy). */
  prep?: string;
};

export const DISTRICT_NAMES: Record<District, string> = {
  obchod: "Obchodní třída",
  finance: "Finanční centrum",
  urady: "Úřední čtvrť",
  bydleni: "Bydlení",
  namesti: "Náměstí",
};

/** Pomocník: budova 3 × 2 v řádku r (0 / 3 / 6 / 9) a sloupci c (0, 4, 12, 16). */
function at(c: number, r: number) {
  // Budovy naproti sobě přes silnici mají dveře posunuté, aby každá měla vlastní dlaždici.
  const door =
    r === 0 ? { x: c + 1, y: 2 } : r === 3 ? { x: c + 2, y: 5 } : r === 6 ? { x: c, y: 5 } : { x: c + 1, y: 8 };
  return { x: c, y: r, door };
}

export const BUILDINGS: Building[] = [
  // Obchodní třída (vlevo nahoře)
  { id: "elektro", name: "Elektro na splátky", district: "obchod", kind: "risk", ...at(0, 0), cases: ["telefon-na-splatky", "rozmyslel-si-uver"], prep: "uver", greeting: "„Nový telefon? Bez akontace, nula procent, podpis a jdete!“" },
  { id: "operator", name: "Operátor", district: "obchod", kind: "normal", ...at(4, 0), cases: ["tarif-se-zavazkem"], prep: "tarify", greeting: "„Máme pro vás tarif na dva roky, ještě levnější na tři!“" },
  { id: "eshop", name: "Výdejna e-shopu", district: "obchod", kind: "normal", ...at(0, 3), cases: ["sluchatka-z-eshopu"], prep: "nakup-na-dalku", greeting: "„Balík na jméno? Tady podepište převzetí.“" },
  { id: "spotrebice", name: "Prodejna spotřebičů", district: "obchod", kind: "normal", ...at(4, 3), cases: ["pracka-se-rozbila"], prep: "reklamace", greeting: "„Reklamace? To bude určitě vaše chyba…“" },
  // Finanční centrum (vpravo nahoře)
  { id: "banka", name: "Banka", district: "finance", kind: "normal", ...at(12, 0), cases: ["prodleni-90-dni", "rucitel-za-vnuka"], prep: "prodleni", greeting: "„Dobrý den, máme tu k vám pár nezaplacených splátek.“" },
  { id: "nebankovka", name: "Rychlé peníze", district: "finance", kind: "risk", ...at(16, 0), cases: ["rychla-pujcka"], prep: "uver", greeting: "„Peníze do deseti minut, bez otázek. Kolik potřebujete?“" },
  { id: "investice", name: "Investiční kancelář", district: "finance", kind: "risk", ...at(12, 3), cases: ["investice-po-telefonu"], prep: "investice", greeting: "„Patnáct procent ročně, garantovaně. Ale musíte se rozhodnout dnes.“" },
  { id: "arbitr", name: "Finanční arbitr", district: "finance", kind: "safe", ...at(16, 3), cases: [], prep: "prodleni", greeting: "„Máte spor s bankou, věřitelem nebo pojišťovnou? Řízení je bezplatné.“" },
  // Úřední čtvrť (vlevo dole)
  { id: "soud", name: "Soud", district: "urady", kind: "office", ...at(0, 6), cases: ["platebni-rozkaz", "rozvod-a-dluhy"], prep: "promlceni", greeting: "„Podatelna je vpravo. Máte s sebou rozhodnutí?“" },
  { id: "exekutor", name: "Exekutorský úřad", district: "urady", kind: "office", ...at(4, 6), cases: ["vyrozumeni-o-exekuci", "zablokovany-ucet"], prep: "exekuce", greeting: "„Vedeme proti vám exekuci. Lhůta už běží.“" },
  { id: "fu", name: "Finanční úřad", district: "urady", kind: "office", ...at(0, 9), cases: ["danove-priznani", "dodatecne-priznani"], prep: "dane", greeting: "„Přiznání můžete podat i elektronicky – máte pak o měsíc víc.“" },
  { id: "up", name: "Úřad práce", district: "urady", kind: "safe", ...at(4, 9), cases: ["vyzivne-nechodi"], prep: "vyzivne", greeting: "„S čím vám můžeme pomoct? Dávky, náhradní výživné…“" },
  // Bydlení (vpravo dole)
  { id: "domov", name: "Domov a schránka", district: "bydleni", kind: "normal", ...at(12, 6), cases: ["dopis-po-peti-letech", "podomni-prodej", "vyplatni-paska"], prep: "promlceni", greeting: "Doma. Ve schránce bývá pošta – a u dveří občas zazvoní obchodník." },
  { id: "kulturak", name: "Kulturní dům", district: "bydleni", kind: "risk", ...at(16, 6), cases: ["predvadeci-akce"], prep: "podomni", greeting: "„Vítejte na zájezdu! Oběd je zdarma, prezentace potrvá jen chvilku.“" },
  { id: "byt", name: "Byt s hypotékou", district: "bydleni", kind: "normal", ...at(12, 9), cases: ["hypoteka-po-rozvodu"], prep: "rozvod", greeting: "Společný byt. Po rozvodu se bude prodávat." },
  { id: "dilna", name: "Dílna živnostníka", district: "bydleni", kind: "normal", ...at(16, 9), cases: ["neplatici-odberatel", "oddluzeni-zivnostnika"], prep: "dane", greeting: "Dílna, faktury a telefon, který zvoní jen kvůli upomínkám." },
  // Náměstí
  { id: "poradna", name: "Dluhová poradna", district: "namesti", kind: "safe", ...at(8, 3), cases: ["oddluzeni", "dedictvi-v-oddluzeni"], greeting: "„Posaďte se. Projdeme spolu, co dlužíte, a najdeme cestu ven. Zdarma.“" },
];

export const BUILDING_BY_ID = new Map(BUILDINGS.map((b) => [b.id, b]));

export function buildingForCase(caseId: string): Building | undefined {
  return BUILDINGS.find((b) => b.cases.includes(caseId));
}

/** Postava začíná před domovem. */
export const SPAWN = { x: 12, y: 5 };

export function isWalkable(x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= CITY_W || y >= CITY_H) return false;
  if (ROAD_ROWS.includes(y)) return true;
  if (ROAD_COLS.includes(x) && y >= 2 && y <= 8) return true;
  return false;
}

/** Nejkratší cesta po silnicích (BFS). Vrací dlaždice bez startu. */
export function findPath(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number }[] {
  const key = (p: { x: number; y: number }) => `${p.x},${p.y}`;
  const prev = new Map<string, { x: number; y: number } | null>([[key(from), null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.x === to.x && cur.y === to.y) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { x: cur.x + dx, y: cur.y + dy };
      if (isWalkable(n.x, n.y) && !prev.has(key(n))) {
        prev.set(key(n), cur);
        queue.push(n);
      }
    }
  }
  if (!prev.has(key(to))) return [];
  const path: { x: number; y: number }[] = [];
  let p: { x: number; y: number } | null | undefined = to;
  while (p && !(p.x === from.x && p.y === from.y)) {
    path.unshift(p);
    p = prev.get(key(p));
  }
  return path;
}

/** Důsledky: špatné rozhodnutí naplánuje dopis s další nástrahou. */
export type LetterRule = {
  fromCase: string;
  delay: number;
  caseId: string;
  sender: string;
  subject: string;
  reason: string;
};

export const LETTER_RULES: LetterRule[] = [
  { fromCase: "rychla-pujcka", delay: 2, caseId: "vyrozumeni-o-exekuci", sender: "Exekutorský úřad", subject: "Vyrozumění o zahájení exekuce", reason: "nesplacená rychlá půjčka" },
  { fromCase: "prodleni-90-dni", delay: 2, caseId: "vyrozumeni-o-exekuci", sender: "Exekutorský úřad", subject: "Vyrozumění o zahájení exekuce", reason: "dlouhé prodlení se splátkami" },
  { fromCase: "dopis-po-peti-letech", delay: 3, caseId: "platebni-rozkaz", sender: "Okresní soud", subject: "Platební rozkaz", reason: "nevyřešený starý dluh" },
  { fromCase: "telefon-na-splatky", delay: 3, caseId: "prodleni-90-dni", sender: "Banka", subject: "Upomínka – splátky po splatnosti", reason: "drahý úvěr na telefon" },
];

/** Výchozí dluhová zátěž postav (0–100) – odpovídá jejich výchozí situaci. */
export const START_LOAD: Record<string, number> = { ondrej: 10, jana: 40, marie: 15, radek: 35, petr: 45 };

export const MONTH_NAMES = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
