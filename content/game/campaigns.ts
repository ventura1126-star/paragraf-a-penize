/** Příběh na míru každé postavě: pořadí nástrah a závěrečný boss. */
export type Campaign = {
  character: string;
  title: string;
  intro: string;
  chapters: string[];
  boss: string;
};

export const CAMPAIGNS: Campaign[] = [
  {
    character: "ondrej",
    title: "První rok na vlastní noze",
    intro: "První výplata, první byt, první smlouvy. Nástrahy číhají v obchodě, v e-shopu i v aplikaci na půjčky.",
    chapters: ["telefon-na-splatky", "rozmyslel-si-uver", "tarif-se-zavazkem", "sluchatka-z-eshopu", "rychla-pujcka", "dopis-po-peti-letech"],
    boss: "oddluzeni",
  },
  {
    character: "jana",
    title: "Rozpočet na hraně",
    intro: "Dvě děti, jeden příjem. Stačí, aby nedorazilo výživné nebo se rozbila pračka, a rozpočet se sesype.",
    chapters: ["vyzivne-nechodi", "pracka-se-rozbila", "prodleni-90-dni", "stiznost-u-arbitra", "zablokovany-ucet", "vyplatni-paska"],
    boss: "oddluzeni",
  },
  {
    character: "marie",
    title: "Důvěřivá sousedka",
    intro: "Úspory na stáří přitahují obchodníky u dveří, prodejní zájezdy i „poradce“ po telefonu. A vnuk potřebuje ručitele.",
    chapters: ["podomni-prodej", "predvadeci-akce", "investice-po-telefonu", "falesny-bankar", "vyplatni-paska"],
    boss: "rucitel-za-vnuka",
  },
  {
    character: "radek",
    title: "Živnost v krizi",
    intro: "Daně, odběratelé, kteří neplatí, a exekuce, které přijdou, když dojdou zakázky.",
    chapters: ["danove-priznani", "pozde-podane-priznani", "dodatecne-priznani", "neplatici-odberatel", "platebni-rozkaz", "vyrozumeni-o-exekuci"],
    boss: "oddluzeni-zivnostnika",
  },
  {
    character: "petr",
    title: "Život po rozvodu",
    intro: "Prodej společného bytu, výživné na dvě děti a dluhy, o kterých za manželství nevěděl.",
    chapters: ["hypoteka-po-rozvodu", "zmena-vyzivneho", "vyplatni-paska", "zablokovany-ucet", "platebni-rozkaz"],
    boss: "rozvod-a-dluhy",
  },
];

export const CAMPAIGN_BY_CHARACTER = new Map(CAMPAIGNS.map((c) => [c.character, c]));

/** Daňový ráj: společný příběh všech postav po dokončení Města dluhů (od živnosti po vlastní firmu). */
export const ISLAND_CAMPAIGN: Campaign = {
  character: "*",
  title: "Daňový ráj",
  intro: "Pláže, palmy a půjčovna paddleboardů. Od živnostenského listu přes DPH až po vlastní s.r.o. – a daně, které platí i v ráji.",
  chapters: ["zivnostensky-list", "pausalni-vydaje", "zalohy-na-pojisteni", "pausalni-dan", "dph-obrat", "faktura-s-dph", "kontrolni-hlaseni", "zalozeni-sro", "zisk-firmy"],
  boss: "danova-kontrola",
};

export function campaignCaseIds(c: Campaign): string[] {
  return [...c.chapters, c.boss];
}
