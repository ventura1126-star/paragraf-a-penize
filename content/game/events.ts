import type { Citation } from "@/lib/types";

/**
 * Náhodné události ve schránce: krátké situace z běžného života s rozhodnutím a dopadem.
 * Texty obsahují zástupné značky postavy ({N}, {a}, …). Částky jsou ilustrativní.
 */
export type EventChoice = {
  label: string;
  result: string;
  wallet: number;
  load: number;
  cite?: Citation;
};

export type MailEvent = {
  id: string;
  sender: string;
  subject: string;
  text: string;
  /** Bez voleb = jen oznámení, dopad se připíše po přečtení. */
  choices: EventChoice[];
  /** Peněžní dopad oznámení bez voleb. */
  notice?: number;
};

export const EVENTS: MailEvent[] = [
  {
    id: "preschvalena-pujcka",
    sender: "Rychlé peníze",
    subject: "Předschválená půjčka 30 000 Kč!",
    text: "„Vážený kliente, máte u nás předschválenou půjčku 30 000 Kč. Stačí jeden podpis, peníze máte do hodiny.“",
    choices: [
      {
        label: "Zahodit",
        result: "„Předschválená“ nabídka nic neznamená. Než někdo skutečně půjčí, musí důkladně posoudit, jestli úvěr zvládnete splácet.",
        wallet: 0,
        load: -3,
        cite: { law: "zsu", par: "86", odst: 1 },
      },
      {
        label: "Podepsat",
        result: "Peníze přišly, ale k nim i splátky s vysokou RPSN. Půjčka bez skutečné potřeby je nejrychlejší cesta k dalším dluhům.",
        wallet: 30000,
        load: 18,
        cite: { law: "zsu", par: "3", odst: 2, pism: "b" },
      },
    ],
  },
  {
    id: "preplatek-energie",
    sender: "Dodavatel energií",
    subject: "Roční vyúčtování: přeplatek",
    text: "Za uplynulý rok jste na zálohách zaplatil{a} víc, než jste spotřeboval{a}. Přeplatek 1 850 Kč vám vracíme na účet.",
    choices: [],
    notice: 1850,
  },
  {
    id: "nedoplatek-energie",
    sender: "Dodavatel energií",
    subject: "Roční vyúčtování: nedoplatek 3 400 Kč",
    text: "Spotřeba byla vyšší než zálohy. Nedoplatek 3 400 Kč je splatný do 15 dnů.",
    choices: [
      {
        label: "Zaplatit hned",
        result: "Zaplaceno včas – žádné upomínky ani úroky z prodlení.",
        wallet: -3400,
        load: -2,
      },
      {
        label: "Odložit na později",
        result: "Po splatnosti běží úrok z prodlení a přicházejí upomínky. Nezaplacené vyúčtování může skončit u soudu a v exekuci – s mnohem vyššími náklady.",
        wallet: 0,
        load: 10,
        cite: { law: "oz", par: "1970" },
      },
    ],
  },
  {
    id: "vyhra-podvod",
    sender: "neznámý odesílatel",
    subject: "Gratulujeme! Vyhrál{a} jste nový telefon",
    text: "„Jste náš miliontý návštěvník! Telefon vám pošleme, stačí zaplatit poštovné 99 Kč kartou na odkazu níže.“",
    choices: [
      {
        label: "Smazat",
        result: "Správně. Skutečná výhra po vás nechce platbu kartou. Údaje z karty patří k bezpečnostním prvkům, které musíte chránit.",
        wallet: 0,
        load: -2,
        cite: { law: "zps", par: "165", pism: "a" },
      },
      {
        label: "Zaplatit poštovné",
        result: "Podvodná stránka si strhla mnohem víc než 99 Kč. Zadat kartu na takové stránce může banka posoudit jako hrubou nedbalost – a pak ztrátu nesete celou.",
        wallet: -4900,
        load: 8,
        cite: { law: "zps", par: "182", odst: 1, pism: "b" },
      },
    ],
  },
  {
    id: "cizi-platba",
    sender: "Banka",
    subject: "Platba kartou 2 990 Kč",
    text: "Na výpisu je platba 2 990 Kč v e-shopu, kde jste nic nekupoval{a}. Karta je přitom u vás.",
    choices: [
      {
        label: "Hned nahlásit bance",
        result: "U neautorizované platby musí banka uvést účet do původního stavu nejpozději do konce následujícího pracovního dne po oznámení.",
        wallet: 0,
        load: -2,
        cite: { law: "zps", par: "181", odst: 1 },
      },
      {
        label: "Počkat na další výpis",
        result: "Zneužití platebního prostředku je třeba oznámit bez zbytečného odkladu. Čekáním riskujete další platby i spor o to, kdo ztrátu ponese.",
        wallet: -2990,
        load: 6,
        cite: { law: "zps", par: "165", pism: "b" },
      },
    ],
  },
  {
    id: "pojisteni-nabidka",
    sender: "Finanční poradce",
    subject: "Investiční životní pojištění – podpis dnes",
    text: "„Mám pro vás produkt, který vám zajistí stáří. Podepíšeme to rovnou, jen 1 500 Kč měsíčně na 30 let.“",
    choices: [
      {
        label: "Odmítnout",
        result: "Dlouhodobý závazek na 30 let si zaslouží čas a srovnání. Podpis „dnes“ je varovný signál.",
        wallet: 0,
        load: -2,
      },
      {
        label: "Podepsat",
        result: "Podepsáno. Dobrá zpráva: do dvou měsíců od uzavření lze pojištění vypovědět s osmidenní výpovědní dobou.",
        wallet: -3000,
        load: 6,
        cite: { law: "oz", par: "2805", pism: "a" },
      },
    ],
  },
  {
    id: "energie-telefonem",
    sender: "Zprostředkovatel energií",
    subject: "Ušetříte 30 % – stačí souhlas do telefonu",
    text: "Volá „energetický poradce“: když řeknete do telefonu „souhlasím“, převede vás k levnějšímu dodavateli.",
    choices: [
      {
        label: "Odmítnout a ověřit si nabídku",
        result: "Rozumné. Srovnejte ceny sami a nikomu nedávejte plnou moc ani doklady.",
        wallet: 0,
        load: -2,
      },
      {
        label: "Souhlasit",
        result: "Nová smlouva je dražší, než slibovali. Od smlouvy uzavřené na dálku lze ale do 14 dnů odstoupit bez udání důvodu.",
        wallet: -1500,
        load: 5,
        cite: { law: "oz", par: "1829", odst: 1 },
      },
    ],
  },
  {
    id: "odmena-v-praci",
    sender: "Zaměstnavatel",
    subject: "Mimořádná odměna",
    text: "Za dobrou práci vám zaměstnavatel přidal k výplatě jednorázovou odměnu 4 000 Kč.",
    choices: [],
    notice: 4000,
  },
  {
    id: "rozbite-auto",
    sender: "Autoservis",
    subject: "Oprava auta: 8 500 Kč",
    text: "Auto neprošlo technickou. Oprava stojí 8 500 Kč a bez auta se {N} nedostane do práce.",
    choices: [
      {
        label: "Zaplatit z úspor",
        result: "Rezerva na nečekané výdaje je přesně na tohle. Bez ní by přišla na řadu půjčka.",
        wallet: -8500,
        load: 0,
      },
      {
        label: "Vzít si na to rychlou půjčku",
        result: "Oprava je hotová, ale splácí se i s úroky a poplatky. Srovnávejte nabídky podle RPSN a celkové částky.",
        wallet: 0,
        load: 12,
        cite: { law: "zsu", par: "3", odst: 2, pism: "b" },
      },
    ],
  },
  {
    id: "upominka-agentura",
    sender: "Inkasní agentura",
    subject: "Upomínka – „poslední výzva před soudem“",
    text: "Agentura vymáhá 900 Kč za údajně nezaplacenou fakturu, kterou nepoznáváte, a k tomu „náklady vymáhání“ 2 500 Kč.",
    choices: [
      {
        label: "Vyžádat si doklady k dluhu",
        result: "Než cokoli zaplatíte nebo podepíšete, chtějte smlouvu a fakturu. Pozor: písemné uznání dluhu spustí novou desetiletou lhůtu.",
        wallet: 0,
        load: -2,
        cite: { law: "oz", par: "639" },
      },
      {
        label: "Zaplatit všechno, ať je klid",
        result: "Zaplatil{a} jste i „náklady vymáhání“, na které agentura nemusela mít nárok. Peníze zaplacené na neexistující dluh se vymáhají zpět těžko.",
        wallet: -3400,
        load: 3,
      },
    ],
  },
];

export const EVENT_BY_ID = new Map(EVENTS.map((e) => [e.id, e]));
