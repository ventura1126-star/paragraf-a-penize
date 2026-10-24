/**
 * Město dluhů: pohled shora (inspirace GTA 1). Svět 60 × 41 dlaždic, pevnina x 2–57, y 2–38, kolem voda.
 * Silnice jsou dvoupruhové pásy, podél nich chodníky; po okraji vede okružní silnice, takže auta jezdí
 * dokola a nikde nekončí ve vodě. Budovy stojí v blocích a mají dveře na chodníku.
 */
export const TILE = 32;
export const WORLD_W = 64;
export const WORLD_H = 45;
export const LAND = { x0: 2, y0: 2, x1: 57, y1: 38 };
/** Řádky a sloupce silnic (každý pás má dva pruhy); první a poslední pás tvoří okružní silnici. */
export const ROAD_ROWS = [3, 4, 14, 15, 25, 26, 36, 37];
export const ROAD_COLS = [3, 4, 16, 17, 29, 30, 42, 43, 55, 56];
/** Silnice končí na okružní silnici (za ní je už jen chodník u vody). */
const ROAD_SPAN = { x0: 3, x1: 56, y0: 3, y1: 37 };
/** Dvojice pruhů: [první, druhý]. Vodorovně: první jede doleva, druhý doprava; svisle: první dolů, druhý nahoru. */
export const ROW_PAIRS: [number, number][] = [[3, 4], [14, 15], [25, 26], [36, 37]];
export const COL_PAIRS: [number, number][] = [[3, 4], [16, 17], [29, 30], [42, 43], [55, 56]];

export type District = "obchod" | "finance" | "urady" | "bydleni" | "namesti" | "promenada" | "zatoka" | "radnice" | "vily" | "laguna" | "tech" | "burza" | "kampus" | "orbit" | "atrium";
/** Město dluhů, ostrov Daňový ráj, nebo Planeta investic (stejné rozložení ulic, jiné budovy a vzhled). */
export type World = "mesto" | "ostrov" | "planeta";
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
  promenada: "Přístavní promenáda",
  zatoka: "Finanční zátoka",
  radnice: "Úřady pod palmami",
  vily: "Vilová čtvrť",
  laguna: "Náměstí u laguny",
  tech: "Tech Boulevard",
  burza: "Finanční čtvrť Nova",
  kampus: "Kampus",
  orbit: "Orbitální čtvrť",
  atrium: "Atrium",
};

const COL: Record<string, number> = { X1A: 6, X1B: 11, X2A: 19, X2B: 24, X3A: 32, X3B: 37, X4A: 45, X4B: 50 };

/** Pozice v bloku: sloupec bloku X1–X4, místo A/B, řádek bloku Y1 (nahoře) nebo Y3 (dole). */
function slot(col: string, row: "Y1" | "Y3") {
  const x = COL[col];
  return row === "Y1"
    ? { x, y: 8, w: 4, h: 5, door: { x: x + 1, y: 13 } }
    : { x, y: 28, w: 4, h: 5, door: { x: x + 1, y: 27 } };
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
  { id: "skola", name: "Vysoká škola finanční", district: "namesti", kind: "normal", x: 45, y: 17, w: 9, h: 5, door: { x: 49, y: 16 }, cases: [], greeting: "Posluchárna. Na tabuli ještě visí vzorec z minulé přednášky." },
  { id: "poradna", name: "Dluhová poradna", district: "namesti", kind: "safe", x: 19, y: 17, w: 9, h: 5, door: { x: 23, y: 16 }, cases: ["oddluzeni", "dedictvi-v-oddluzeni"], greeting: "„Posaďte se. Projdeme spolu, co dlužíte, a najdeme cestu ven. Zdarma.“" },
];

/** Daňový ráj: budovy stojí na stejných místech jako ve Městě dluhů (klíč = budova ve městě). */
const ISLAND_DEF: Record<string, Omit<Building, "x" | "y" | "w" | "h" | "door">> = {
  elektro: { id: "o-zu", name: "Živnostenský úřad", district: "promenada", kind: "office", cases: ["zivnostensky-list"], prep: "podnikani", greeting: "„Dobrý den pod palmami. Chcete ohlásit živnost? Posaďte se.“" },
  operator: { id: "o-bar", name: "Plážový bar Mango", district: "promenada", kind: "normal", cases: [], greeting: "„Piña colada? Na účet podniku ne – to by byl nepeněžní příjem!“" },
  eshop: { id: "o-cssz", name: "Správa sociálního zabezpečení", district: "promenada", kind: "office", cases: ["zalohy-na-pojisteni"], prep: "dane-osvc", greeting: "„Přehled o příjmech a výdajích máte s sebou?“" },
  spotrebice: { id: "o-trh", name: "Rybí trh", district: "promenada", kind: "normal", cases: [], greeting: "Vůně grilovaných ryb a stánkaři, kteří všichni mají živnostenský list." },
  banka: { id: "o-banka", name: "Banco Palma", district: "zatoka", kind: "normal", cases: [], greeting: "„Podnikatelský účet? Vedeme je i pro OSVČ – a výpisy archivujte, budou se hodit.“" },
  nebankovka: { id: "o-offshore", name: "Offshore Paradise Ltd.", district: "zatoka", kind: "risk", cases: ["danova-kontrola"], prep: "kontrola", greeting: "„Daně? U nás žádné. Podepište tady, tady a tady.“" },
  investice: { id: "o-poradce", name: "Daňový poradce", district: "zatoka", kind: "normal", cases: ["pausalni-dan"], prep: "dane-osvc", greeting: "„Paušál, výdaje, pojistné – spočítáme, co se vám vyplatí. Legálně.“" },
  arbitr: { id: "o-ucetni", name: "Účetní kancelář Palma", district: "zatoka", kind: "normal", cases: ["dph-obrat"], prep: "dph", greeting: "„Hlídáte si obrat? Já ano. A letos to vypadá na DPH.“" },
  soud: { id: "o-notar", name: "Notářství", district: "radnice", kind: "office", cases: ["zalozeni-sro"], prep: "firma", greeting: "„Zakladatelská listina, notářský zápis, rejstřík. Vše na jednom místě.“" },
  exekutor: { id: "o-pujcovna", name: "Paddle Paradise", district: "radnice", kind: "normal", cases: ["faktura-s-dph"], prep: "dph", greeting: "Vaše půjčovna. Prkna, pádla, a na stole hromádka faktur." },
  fu: { id: "o-fu", name: "Finanční úřad", district: "radnice", kind: "office", cases: ["pausalni-vydaje", "kontrolni-hlaseni"], prep: "dane-osvc", greeting: "„I v ráji se podává přiznání. Elektronicky máte o měsíc víc.“" },
  up: { id: "o-celnice", name: "Přístavní celnice", district: "radnice", kind: "office", cases: [], greeting: "„Zboží ze zahraničí? Clo a DPH se platí i v přístavu.“" },
  domov: { id: "o-domov", name: "Bungalov a schránka", district: "vily", kind: "normal", cases: [], greeting: "Bungalov s výhledem na moře. Ve schránce bývá pošta i tady." },
  kulturak: { id: "o-hotel", name: "Hotel Kokos", district: "vily", kind: "normal", cases: [], greeting: "„Vítejte v Kokosu! Náš nejlepší zákazník na paddleboardy.“" },
  byt: { id: "o-kancelar", name: "Kancelář Paddle Paradise s.r.o.", district: "vily", kind: "normal", cases: ["zisk-firmy"], prep: "firma", greeting: "Vaše firma. Účetní závěrka leží na stole." },
  dilna: { id: "o-dilna", name: "Dílna na prkna", district: "vily", kind: "normal", cases: [], greeting: "Tady se lepí prasklá prkna. Řemeslná živnost – paušál 80 %." },
  poradna: { id: "o-poradna", name: "Daňová poradna u laguny", district: "laguna", kind: "safe", cases: [], greeting: "„Bojíte se kontroly? Projdeme spolu vaše přiznání. Zdarma.“" },
  skola: { id: "o-skola", name: "Daňová akademie", district: "laguna", kind: "normal", cases: [], greeting: "Akademie pod palmou. Přednášky jsou stejné jako ve městě – peníze fungují všude stejně." },
};
export const ISLAND_BUILDINGS: Building[] = BUILDINGS.map((b) => ({ ...ISLAND_DEF[b.id], x: b.x, y: b.y, w: b.w, h: b.h, door: b.door }));

/** Planeta investic: moderní technologické město ve stylu Silicon Valley. */
const PLANET_DEF: Record<string, Omit<Building, "x" | "y" | "w" | "h" | "door">> = {
  elektro: { id: "p-burza", name: "Burza Nova", district: "tech", kind: "normal", cases: ["prodej-akcii"], prep: "dane-z-investic", greeting: "Obří obrazovky s kurzy. Zelená, červená, zelená…" },
  operator: { id: "p-kavarna", name: "Kavárna Byte", district: "tech", kind: "normal", cases: [], greeting: "„Flat white a tip na akcii? Káva je dobrá, tipy od baristy neberte.“" },
  eshop: { id: "p-broker", name: "Orbit Trade", district: "tech", kind: "normal", cases: ["investicni-dotaznik"], prep: "ochrana-investora", greeting: "„Licencovaný obchodník s cennými papíry. Začneme dotazníkem.“" },
  spotrebice: { id: "p-gadget", name: "Gadget Store", district: "tech", kind: "normal", cases: [], greeting: "Nejnovější telefon za 40 000 Kč. Nebo 40 000 Kč v ETF?" },
  banka: { id: "p-banka", name: "Banka Nova", district: "burza", kind: "normal", cases: ["nejdriv-rezerva"], prep: "investovani", greeting: "„Rezerva, spořicí účet, investice. V tomhle pořadí.“" },
  nebankovka: { id: "p-guru", name: "Crypto Guru Academy", district: "burza", kind: "risk", cases: ["garance-vynosu"], prep: "ochrana-investora", greeting: "„Lambo za rok! Stačí kurz za 49 990 Kč.“" },
  investice: { id: "p-fond", name: "Fond Galaxy", district: "burza", kind: "normal", cases: ["dip-na-stari"], prep: "dip", greeting: "„Pravidelně, dlouhodobě, s nízkými poplatky. A s DIPem i s daňovou úlevou.“" },
  arbitr: { id: "p-cnb", name: "Dohled ČNB", district: "burza", kind: "safe", cases: [], greeting: "„Kdo nabízí investice, musí mít naše povolení.“" },
  soud: { id: "p-hub", name: "Startup Hub", district: "kampus", kind: "normal", cases: ["startup"], prep: "dane-z-investic", greeting: "Beanbagy, whiteboardy a pitch decky. Každý tu staví příští velkou věc." },
  exekutor: { id: "p-krypto", name: "Krypto směnárna", district: "kampus", kind: "normal", cases: ["krypto"], prep: "dane-z-investic", greeting: "Svítící automat na bitcoiny a graf, který skáče jako na trampolíně." },
  fu: { id: "p-fu", name: "Finanční úřad", district: "kampus", kind: "office", cases: [], greeting: "„I zisky z investic se daní. Ale znáte osvobození?“" },
  up: { id: "p-lab", name: "AI Lab", district: "kampus", kind: "normal", cases: [], greeting: "Robot vám předpoví kurz akcií. (Nepředpoví.)" },
  domov: { id: "p-domov", name: "Smart byt a schránka", district: "orbit", kind: "normal", cases: [], greeting: "Chytrý byt: světla, rolety a schránka na dopisy z reálného světa." },
  kulturak: { id: "p-tower", name: "Unicorn Tower", district: "orbit", kind: "risk", cases: ["bublina"], prep: "investovani", greeting: "Nejvyšší věž planety. Dnes tu startuje IPO, o kterém mluví všichni." },
  byt: { id: "p-coworking", name: "Coworking Orbit", district: "orbit", kind: "normal", cases: [], greeting: "Lidé s notebooky a cold brew. Polovina z nich hledá investora." },
  dilna: { id: "p-dron", name: "Dronoport", district: "orbit", kind: "normal", cases: [], greeting: "Odtud létají drony s nákupy. Zásilky, ne zázraky." },
  poradna: { id: "p-poradna", name: "Nezávislá investiční poradna", district: "atrium", kind: "safe", cases: [], greeting: "„Nic vám neprodám. Jen pomůžu se zorientovat.“" },
  skola: { id: "p-skola", name: "Akademie investic", district: "atrium", kind: "normal", cases: [], greeting: "Přednáškový sál s výhledem na hvězdy." },
};
export const PLANET_BUILDINGS: Building[] = BUILDINGS.map((b) => ({ ...PLANET_DEF[b.id], x: b.x, y: b.y, w: b.w, h: b.h, door: b.door }));

export function worldBuildings(w: World): Building[] {
  return w === "ostrov" ? ISLAND_BUILDINGS : w === "planeta" ? PLANET_BUILDINGS : BUILDINGS;
}
/** Domov se schránkou, poradna a škola mají ve všech světech stejnou roli. */
export const HOME_IDS = new Set(["domov", "o-domov", "p-domov"]);
export const PORADNA_IDS = new Set(["poradna", "o-poradna", "p-poradna"]);
export const SCHOOL_IDS = new Set(["skola", "o-skola", "p-skola"]);

const ALL_BUILDINGS = [...BUILDINGS, ...ISLAND_BUILDINGS, ...PLANET_BUILDINGS];
export const BUILDING_BY_ID = new Map(ALL_BUILDINGS.map((b) => [b.id, b]));

export function buildingForCase(caseId: string): Building | undefined {
  return ALL_BUILDINGS.find((b) => b.cases.includes(caseId));
}

/** Přístav: molo na východním břehu, na jeho konci kotví loď mezi městem a ostrovem. */
export const PIER = { x0: 58, x1: 60, y: 20 };
export const PIER_END = { x: PIER.x1, y: PIER.y };
export function isPier(x: number, y: number): boolean {
  return y === PIER.y && x >= PIER.x0 && x <= PIER.x1;
}

/** Raketová rampa na jihozápadním pobřeží (naproti přístavu): plošina, na jejímž konci stojí raketa. */
export const PAD = { x0: 8, x1: 12, y0: 39, y1: 41 };
export const PAD_END = { x: 10, y: 41 };
export function isPad(x: number, y: number): boolean {
  return y >= PAD.y0 && y <= PAD.y1 && (y === PAD.y0 ? x === PAD_END.x : x >= PAD.x0 && x <= PAD.x1);
}

/** Postava začíná před domovem (dlaždice). */
export const SPAWN = { x: 33, y: 27 };

/** Dekorace bloků (neprůchozí je jen kašna). */
export type Decor = { kind: "parking" | "park" | "gas" | "grass"; x: number; y: number; w: number; h: number };
export const DECOR: Decor[] = [
  { kind: "parking", x: 6, y: 17, w: 9, h: 7 },
  { kind: "park", x: 32, y: 17, w: 9, h: 7 },
];
export const FOUNTAIN = { x: 35, y: 19, w: 3, h: 3 };

/**
 * Parkoviště s jednosměrnou uličkou: vjezd z jižního pruhu silnice x 16 přes chodník (15, 20),
 * výjezd na západ přes chodník (5, 20) do severního pruhu okružní silnice. Stání po 8 ve dvou řadách.
 * Souřadnice v pixelech.
 */
export const PARKING = {
  entry: { x: 15, y: 20 },
  exit: { x: 5, y: 20 },
  laneX: 16 * TILE + 16,
  exitLaneX: 4 * TILE + 16,
  aisleY: 20 * TILE + 16,
  edgeX: 15 * TILE - 20,
  exitEdgeX: 6 * TILE + 8,
  slots: Array.from({ length: 16 }, (_, i) => ({ x: 6 * TILE + 28 + (i % 8) * 32, y: i < 8 ? 17 * TILE + 38 : 22 * TILE + 26, up: i < 8 })),
};

/** Podzemní garáže budov: vjezd přes chodník u budovy z pruhu, který vede kolem ní. */
export type Garage = { building: string; x: number; y: number; /** budova je nad chodníkem (řada Y1) */ above: boolean };
export const GARAGES: Garage[] = ["operator", "banka", "soud", "byt", "dilna"].map((id) => {
  const b = BUILDINGS.find((bb) => bb.id === id)!;
  const above = b.door.y === b.y + b.h;
  return { building: id, x: b.x + 3, y: b.door.y, above };
});

export function isLand(x: number, y: number): boolean {
  return x >= LAND.x0 && x <= LAND.x1 && y >= LAND.y0 && y <= LAND.y1;
}
export function isRoad(x: number, y: number): boolean {
  if (x < ROAD_SPAN.x0 || x > ROAD_SPAN.x1 || y < ROAD_SPAN.y0 || y > ROAD_SPAN.y1) return false;
  return ROAD_ROWS.includes(y) || ROAD_COLS.includes(x);
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
  if (isPier(x, y) || isPad(x, y)) return true;
  return isLand(x, y) && !buildingAt(x, y) && !inRect(x, y, FOUNTAIN);
}

/** Nejkratší cesta po průchozích dlaždicích (BFS). Vrací dlaždice bez startu. `blocked` = další překážky (lidé na ulici). */
export function findPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  blocked?: (x: number, y: number) => boolean,
): { x: number; y: number }[] {
  const key = (p: { x: number; y: number }) => p.y * WORLD_W + p.x;
  const prev = new Map<number, number>([[key(from), -1]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.x === to.x && cur.y === to.y) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { x: cur.x + dx, y: cur.y + dy };
      if (isWalkable(n.x, n.y) && !blocked?.(n.x, n.y) && !prev.has(key(n))) {
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
