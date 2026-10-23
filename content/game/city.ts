/**
 * Město dluhů: pohled shora (inspirace GTA 1). Svět 54 × 35 dlaždic, pevnina x 2–51, y 2–32, kolem voda.
 * Silnice jsou dvoupruhové pásy, podél nich chodníky; budovy stojí v blocích a mají dveře na chodníku.
 */
export const TILE = 32;
export const WORLD_W = 54;
export const WORLD_H = 35;
export const LAND = { x0: 2, y0: 2, x1: 51, y1: 32 };
/** Řádky a sloupce silnic (každý pás má dva pruhy). */
export const ROAD_ROWS = [11, 12, 22, 23];
export const ROAD_COLS = [13, 14, 26, 27, 39, 40];

export type District = "obchod" | "finance" | "urady" | "bydleni" | "namesti";
export type BuildingKind = "risk" | "normal" | "office" | "safe";

export type Building = {
  id: string;
  name: string;
  district: District;
  kind: BuildingKind;
  /** Levý horní roh a rozměr (dlaždice). */
  x: number;
  y: number;
  w: number;
  h: number;
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

const COL: Record<string, number> = { X1A: 3, X1B: 8, X2A: 16, X2B: 21, X3A: 29, X3B: 34, X4A: 42, X4B: 47 };

/** Pozice v bloku: sloupec bloku X1–X4, místo A/B, řádek bloku Y1 (nahoře) nebo Y3 (dole). */
function slot(col: string, row: "Y1" | "Y3") {
  const x = COL[col];
  return row === "Y1"
    ? { x, y: 5, w: 4, h: 5, door: { x: x + 1, y: 10 } }
    : { x, y: 25, w: 4, h: 5, door: { x: x + 1, y: 24 } };
}

export const BUILDINGS: Building[] = [
  // Obchodní třída (vlevo nahoře)
  { id: "elektro", name: "Elektro na splátky", district: "obchod", kind: "risk", ...slot("X1A", "Y1"), cases: ["telefon-na-splatky", "rozmyslel-si-uver"], prep: "uver", greeting: "„Nový telefon? Bez akontace, nula procent, podpis a jdete!“" },
  { id: "operator", name: "Operátor", district: "obchod", kind: "normal", ...slot("X1B", "Y1"), cases: ["tarif-se-zavazkem"], prep: "tarify", greeting: "„Máme pro vás tarif na dva roky, ještě levnější na tři!“" },
  { id: "eshop", name: "Výdejna e-shopu", district: "obchod", kind: "normal", ...slot("X2A", "Y1"), cases: ["sluchatka-z-eshopu"], prep: "nakup-na-dalku", greeting: "„Balík na jméno? Tady podepište převzetí.“" },
  { id: "spotrebice", name: "Prodejna spotřebičů", district: "obchod", kind: "normal", ...slot("X2B", "Y1"), cases: ["pracka-se-rozbila"], prep: "reklamace", greeting: "„Reklamace? To bude určitě vaše chyba…“" },
  // Finanční centrum (vpravo nahoře)
  { id: "banka", name: "Banka", district: "finance", kind: "normal", ...slot("X3A", "Y1"), cases: ["prodleni-90-dni", "falesny-bankar", "rucitel-za-vnuka"], prep: "prodleni", greeting: "„Dobrý den, máme tu k vám pár nezaplacených splátek.“" },
  { id: "nebankovka", name: "Rychlé peníze", district: "finance", kind: "risk", ...slot("X3B", "Y1"), cases: ["rychla-pujcka"], prep: "uver", greeting: "„Peníze do deseti minut, bez otázek. Kolik potřebujete?“" },
  { id: "investice", name: "Investiční kancelář", district: "finance", kind: "risk", ...slot("X4A", "Y1"), cases: ["investice-po-telefonu"], prep: "investice", greeting: "„Patnáct procent ročně, garantovaně. Ale musíte se rozhodnout dnes.“" },
  { id: "arbitr", name: "Finanční arbitr", district: "finance", kind: "safe", ...slot("X4B", "Y1"), cases: ["stiznost-u-arbitra"], prep: "prodleni", greeting: "„Máte spor s bankou, věřitelem nebo pojišťovnou? Řízení je bezplatné.“" },
  // Úřední čtvrť (vlevo dole)
  { id: "soud", name: "Soud", district: "urady", kind: "office", ...slot("X1A", "Y3"), cases: ["platebni-rozkaz", "zmena-vyzivneho", "rozvod-a-dluhy"], prep: "promlceni", greeting: "„Podatelna je vpravo. Máte s sebou rozhodnutí?“" },
  { id: "exekutor", name: "Exekutorský úřad", district: "urady", kind: "office", ...slot("X1B", "Y3"), cases: ["vyrozumeni-o-exekuci", "zablokovany-ucet"], prep: "exekuce", greeting: "„Vedeme proti vám exekuci. Lhůta už běží.“" },
  { id: "fu", name: "Finanční úřad", district: "urady", kind: "office", ...slot("X2A", "Y3"), cases: ["danove-priznani", "pozde-podane-priznani", "dodatecne-priznani"], prep: "dane", greeting: "„Přiznání můžete podat i elektronicky – máte pak o měsíc víc.“" },
  { id: "up", name: "Úřad práce", district: "urady", kind: "safe", ...slot("X2B", "Y3"), cases: ["vyzivne-nechodi"], prep: "vyzivne", greeting: "„S čím vám můžeme pomoct? Dávky, náhradní výživné…“" },
  // Bydlení (vpravo dole)
  { id: "domov", name: "Domov a schránka", district: "bydleni", kind: "normal", ...slot("X3A", "Y3"), cases: ["dopis-po-peti-letech", "podomni-prodej", "vyplatni-paska"], prep: "promlceni", greeting: "Doma. Ve schránce bývá pošta – a u dveří občas zazvoní obchodník." },
  { id: "kulturak", name: "Kulturní dům", district: "bydleni", kind: "risk", ...slot("X3B", "Y3"), cases: ["predvadeci-akce"], prep: "podomni", greeting: "„Vítejte na zájezdu! Oběd je zdarma, prezentace potrvá jen chvilku.“" },
  { id: "byt", name: "Byt s hypotékou", district: "bydleni", kind: "normal", ...slot("X4A", "Y3"), cases: ["hypoteka-po-rozvodu"], prep: "rozvod", greeting: "Společný byt. Po rozvodu se bude prodávat." },
  { id: "dilna", name: "Dílna živnostníka", district: "bydleni", kind: "normal", ...slot("X4B", "Y3"), cases: ["neplatici-odberatel", "oddluzeni-zivnostnika"], prep: "dane", greeting: "Dílna, faktury a telefon, který zvoní jen kvůli upomínkám." },
  // Náměstí
  { id: "poradna", name: "Dluhová poradna", district: "namesti", kind: "safe", x: 16, y: 14, w: 9, h: 5, door: { x: 20, y: 13 }, cases: ["oddluzeni", "dedictvi-v-oddluzeni"], greeting: "„Posaďte se. Projdeme spolu, co dlužíte, a najdeme cestu ven. Zdarma.“" },
];

export const BUILDING_BY_ID = new Map(BUILDINGS.map((b) => [b.id, b]));

export function buildingForCase(caseId: string): Building | undefined {
  return BUILDINGS.find((b) => b.cases.includes(caseId));
}

/** Postava začíná před domovem (dlaždice). */
export const SPAWN = { x: 30, y: 24 };

/** Dekorace bloků (neprůchozí je jen kašna). */
export type Decor = { kind: "parking" | "park" | "gas" | "grass"; x: number; y: number; w: number; h: number };
export const DECOR: Decor[] = [
  { kind: "parking", x: 3, y: 14, w: 9, h: 7 },
  { kind: "park", x: 29, y: 14, w: 9, h: 7 },
  { kind: "gas", x: 42, y: 14, w: 9, h: 7 },
];
export const FOUNTAIN = { x: 32, y: 16, w: 3, h: 3 };

export function isLand(x: number, y: number): boolean {
  return x >= LAND.x0 && x <= LAND.x1 && y >= LAND.y0 && y <= LAND.y1;
}
export function isRoad(x: number, y: number): boolean {
  return isLand(x, y) && (ROAD_ROWS.includes(y) || ROAD_COLS.includes(x));
}
export function isSidewalk(x: number, y: number): boolean {
  if (!isLand(x, y) || isRoad(x, y)) return false;
  if (x === LAND.x0 || x === LAND.x1 || y === LAND.y0 || y === LAND.y1) return true;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (isRoad(x + dx, y + dy)) return true;
  return false;
}
export function buildingAt(x: number, y: number): Building | undefined {
  return BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
}
function inRect(x: number, y: number, r: { x: number; y: number; w: number; h: number }) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

/** Průchozí dlaždice: pevnina mimo budovy a kašnu. */
export function isWalkable(x: number, y: number): boolean {
  return isLand(x, y) && !buildingAt(x, y) && !inRect(x, y, FOUNTAIN);
}

/** Nejkratší cesta po průchozích dlaždicích (BFS). Vrací dlaždice bez startu. */
export function findPath(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number }[] {
  const key = (p: { x: number; y: number }) => p.y * WORLD_W + p.x;
  const prev = new Map<number, number>([[key(from), -1]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.x === to.x && cur.y === to.y) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { x: cur.x + dx, y: cur.y + dy };
      if (isWalkable(n.x, n.y) && !prev.has(key(n))) {
        prev.set(key(n), key(cur));
        queue.push(n);
      }
    }
  }
  if (!prev.has(key(to))) return [];
  const path: { x: number; y: number }[] = [];
  let k = key(to);
  while (k !== key(from) && k !== -1) {
    path.unshift({ x: k % WORLD_W, y: Math.floor(k / WORLD_W) });
    k = prev.get(k)!;
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
  { fromCase: "predvadeci-akce", delay: 2, caseId: "prodleni-90-dni", sender: "Splátková společnost", subject: "Upomínka – deka na splátky", reason: "nákup na předváděcí akci" },
  { fromCase: "hypoteka-po-rozvodu", delay: 2, caseId: "stiznost-u-arbitra", sender: "Banka", subject: "Zamítnutí reklamace poplatku", reason: "zaplacený poplatek za předčasné splacení" },
  { fromCase: "zmena-vyzivneho", delay: 2, caseId: "vyrozumeni-o-exekuci", sender: "Exekutorský úřad", subject: "Exekuce na dlužné výživné", reason: "svévolně snížené výživné" },
  { fromCase: "neplatici-odberatel", delay: 3, caseId: "stiznost-u-arbitra", sender: "Banka", subject: "Poplatek za nepovolený debet", reason: "výpadek příjmů od odběratele" },
  { fromCase: "telefon-na-splatky", delay: 3, caseId: "prodleni-90-dni", sender: "Banka", subject: "Upomínka – splátky po splatnosti", reason: "drahý úvěr na telefon" },
];

/** Výchozí dluhová zátěž postav (0–100) – odpovídá jejich výchozí situaci. */
export const START_LOAD: Record<string, number> = { ondrej: 10, jana: 40, marie: 15, radek: 35, petr: 45 };

export const MONTH_NAMES = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

/** Hledanost jako v GTA: dluhová zátěž → 0–5 hvězdiček. Od 3 hvězdiček honí postavu exekutor. */
export function wantedLevel(load: number): number {
  return Math.min(5, Math.floor(load / 20));
}
export const EXECUTOR_FROM = 3;

/**
 * Závod s lhůtou: když je nástraha na řadě (nebo přijde dopis), běží ve městě odpočet herních dnů.
 * Doběhnout ke dveřím cílové budovy včas = lhůta zachována. Délky lhůt odpovídají zákonu.
 */
export type Race = {
  caseId: string;
  building: string;
  days: number;
  label: string;
  /** Co hrozí při propadnutí (ilustrativní). */
  failWallet: number;
  failLoad: number;
  failText: string;
  /** Kolik reálných sekund trvá jeden herní den (vyrovnává různě daleké cíle). */
  pace: number;
};

export const RACES: Race[] = [
  { caseId: "rozmyslel-si-uver", building: "elektro", days: 14, label: "Odstoupení od úvěru (14 dní)", failWallet: -2400, failLoad: 6, failText: "Lhůta 14 dnů na odstoupení propadla – drahý úvěr zůstává.", pace: 1.0 },
  { caseId: "sluchatka-z-eshopu", building: "eshop", days: 14, label: "Vrácení zboží z e-shopu (14 dní)", failWallet: -4000, failLoad: 4, failText: "Po 14 dnech od převzetí už zboží bez udání důvodu vrátit nejde.", pace: 0.75 },
  { caseId: "podomni-prodej", building: "poradna", days: 14, label: "Odstoupení od podomní smlouvy (14 dní) – vzor dá poradna", failWallet: -6000, failLoad: 6, failText: "Lhůta 14 dnů propadla – dražší smlouva na energie platí.", pace: 0.6 },
  { caseId: "vyrozumeni-o-exekuci", building: "exekutor", days: 30, label: "Výzva ke splnění (30 dní)", failWallet: -6000, failLoad: 10, failText: "30 dnů z výzvy uplynulo – exekutor provádí exekuci a náklady rostou.", pace: 0.3 },
  { caseId: "danove-priznani", building: "fu", days: 30, label: "Daňové přiznání (poslední měsíc lhůty)", failWallet: -2000, failLoad: 6, failText: "Přiznání po lhůtě – hrozí pokuta za opožděné tvrzení.", pace: 0.2 },
];
export const RACE_BY_CASE = new Map(RACES.map((r) => [r.caseId, r]));
