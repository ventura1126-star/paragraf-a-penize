/** Hratelné postavy – pět životních situací, ve kterých se lidé do dluhů dostávají nejčastěji. */
export type Character = {
  id: string;
  /** Pády jména: 1. (nominativ), 2. (genitiv), 3. (dativ), 4. (akuzativ). */
  forms: { n: string; g: string; d: string; a: string };
  feminine: boolean;
  age: number;
  role: string;
  tagline: string;
  /** Proč se tato postava často dostává do problémů. */
  risks: string[];
  income: { kind: "mzda" | "duchod"; net: number; dependents: number; note?: string };
  wallet: number;
  /** Barva avataru (index kategorické palety). */
  color: 1 | 2 | 3 | 4 | 5;
};

export const CHARACTERS: Character[] = [
  {
    id: "ondrej",
    forms: { n: "Ondřej", g: "Ondřeje", d: "Ondřejovi", a: "Ondřeje" },
    feminine: false,
    age: 23,
    role: "Absolvent v první práci",
    tagline: "Poprvé žije sám a podepisuje smlouvy, které nikdo nečte.",
    risks: [
      "nákupy na splátky a „odložené platby“ v e-shopech",
      "mobilní a internetové tarify se závazkem",
      "rychlé půjčky, když nevyjde výplata",
    ],
    income: { kind: "mzda", net: 26000, dependents: 0 },
    wallet: 12000,
    color: 1,
  },
  {
    id: "jana",
    forms: { n: "Jana", g: "Jany", d: "Janě", a: "Janu" },
    feminine: true,
    age: 34,
    role: "Samoživitelka se dvěma dětmi",
    tagline: "Rozpočet vyjde, dokud nepřijde nečekaný výdaj nebo nedorazí výživné.",
    risks: [
      "výpadek výživného od druhého rodiče",
      "nečekané výdaje (opravy, zdraví, škola)",
      "řetězení půjček na splátky jiných půjček",
    ],
    income: { kind: "mzda", net: 27000, dependents: 2 },
    wallet: 18000,
    color: 2,
  },
  {
    id: "marie",
    forms: { n: "Marie", g: "Marie", d: "Marii", a: "Marii" },
    feminine: true,
    age: 71,
    role: "Seniorka na důchodu",
    tagline: "Má úspory a důvěřuje lidem, kteří zazvoní u dveří.",
    risks: [
      "podomní prodej a předváděcí akce",
      "ručení za úvěr vnuka nebo souseda",
      "telefonní podvody a „výhodné“ investice",
    ],
    income: { kind: "duchod", net: 21000, dependents: 0 },
    wallet: 85000,
    color: 3,
  },
  {
    id: "radek",
    forms: { n: "Radek", g: "Radka", d: "Radkovi", a: "Radka" },
    feminine: false,
    age: 41,
    role: "Živnostník s vedlejším úvazkem",
    tagline: "Příjmy kolísají, zálohy a daně se ale platit musí každý měsíc.",
    risks: [
      "nedoplatky na daních a pojistném",
      "neplatící odběratelé a výpadky zakázek",
      "podnikatelské úvěry ručené osobním majetkem",
    ],
    income: { kind: "mzda", net: 19000, dependents: 0, note: "z vedlejšího pracovního poměru" },
    wallet: 40000,
    color: 4,
  },
  {
    id: "petr",
    forms: { n: "Petr", g: "Petra", d: "Petrovi", a: "Petra" },
    feminine: false,
    age: 46,
    role: "Otec po rozvodu",
    tagline: "Po rozvodu mu zůstaly společné dluhy, výživné a polovina hypotéky.",
    risks: [
      "dluhy ze společného jmění manželů",
      "výživné na dvě děti a nové bydlení",
      "výpadek příjmu při ztrátě práce",
    ],
    income: { kind: "mzda", net: 38000, dependents: 2 },
    wallet: 25000,
    color: 5,
  },
];

export const CHARACTER_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

/** Doplní do textu jméno a rodové tvary postavy. */
export function fill(text: string, ch: Character): string {
  return text
    .replaceAll("{N}", ch.forms.n)
    .replaceAll("{G}", ch.forms.g)
    .replaceAll("{D}", ch.forms.d)
    .replaceAll("{A}", ch.forms.a)
    .replaceAll("{a}", ch.feminine ? "a" : "")
    .replaceAll("{sam}", ch.feminine ? "sama" : "sám")
    .replaceAll("{mu}", ch.feminine ? "jí" : "mu")
    .replaceAll("{ho}", ch.feminine ? "ji" : "ho");
}

export function initials(ch: Character): string {
  return ch.forms.n.slice(0, 1);
}
