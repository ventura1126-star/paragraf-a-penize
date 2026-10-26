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

/** Planeta investic: společný příběh všech postav – rezerva, akcie, DIP, krypto, startupy a bubliny. */
export const PLANET_CAMPAIGN: Campaign = {
  character: "*",
  title: "Planeta investic",
  intro: "Skleněné věže, drony a burza, která nikdy nespí. Naučte se investovat – a nenaletět.",
  chapters: ["nejdriv-rezerva", "investicni-dotaznik", "prodej-akcii", "dip-na-stari", "krypto", "startup", "garance-vynosu"],
  boss: "bublina",
};

export function campaignCaseIds(c: Campaign): string[] {
  return [...c.chapters, c.boss];
}

/** Co postavu čeká po příjezdu do nového světa (okno při prvním vstupu). */
export const WORLD_STORY: Record<"ostrov" | "planeta", Record<string, string>> = {
  ostrov: {
    ondrej:
      "Ondřej na ostrově zkouší první vlastní byznys: půjčovnu paddleboardů. Nápady má, ale o živnosti, odvodech a DPH neví vůbec nic.",
    jana:
      "Jana si chce k práci přivydělat půjčovnou prken pro turisty – s dětmi je stejně pořád u moře. Jenže kolik si z výdělku vezme stát?",
    marie:
      "Marie v důchodu objevila podnikatelského ducha. Půjčovna paddleboardů? Proč ne. Jen ať jí do toho nikdo nemluví – kromě finančního úřadu.",
    radek:
      "Radek podniká léta, ale na ostrově chce začít pořádně: s přehledem v odvodech, DPH a možná i s vlastní s.r.o.",
    petr:
      "Petr po rozvodu hledá nový začátek. Půjčovna prken na ostrově je jeho plán B – a daně jeho noční můra.",
  },
  planeta: {
    ondrej:
      "Ondřej má první úspory a chce, aby pracovaly. Kamarádi radí krypto, influenceři akcie a guru „30 % měsíčně“. Kdo má pravdu?",
    jana:
      "Jana by ráda dětem jednou pomohla se startem do života. Na Planetě investic zjistí, jak spořit a investovat bez hazardu.",
    marie:
      "Marie má úspory na stáří a chce je ochránit před inflací – i před „poradci“, kteří slibují zázraky a garantované výnosy.",
    radek:
      "Radek chce, aby zisk z podnikání nezahníval na účtu. Akcie, DIP, startup kamaráda… a hlavně nenaletět.",
    petr:
      "Petr skládá finance znovu dohromady. Rezerva, dlouhodobé investice a žádné zbrklé sázky na poslední hype.",
  },
};
