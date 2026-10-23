import type { Prep } from "./preps";

/** Přípravy Daňového ráje. Čísla jsou ze zákonů (žádné statistiky), proto místo „V číslech“ postup nebo příklad. */
export const ISLAND_PREPS: Prep[] = [
  {
    id: "podnikani",
    title: "Jak začít podnikat",
    plain:
      "Na volnou živnost nepotřebujete žádnou školu – stačí být svéprávný a bezúhonný. Podnikat smíte už dnem ohlášení. A na živnostenském úřadě vyřídíte rovnou i sociálku.",
    concepts: [
      { term: "Ohlašovací živnost", explain: "Živnost, kterou jen ohlásíte – oprávnění vzniká dnem ohlášení.", cite: { law: "zz", par: "10", odst: 1 } },
      { term: "Volná živnost", explain: "Nevyžaduje odbornou způsobilost (třeba půjčovna nebo prodej).", cite: { law: "zz", par: "25", odst: 1 } },
      { term: "Jednotné registrační místo", explain: "Živnostenský úřad přijme i oznámení pro sociální pojištění a přihlášku k důchodovému pojištění.", cite: { law: "zz", par: "45a", odst: 1 } },
    ],
    process: {
      title: "Postup",
      steps: ["Ohlásit volnou živnost na živnostenském úřadě.", "Na místě oznámit zahájení činnosti pro sociální pojištění.", "Do 8 dnů oznámit zahájení zdravotní pojišťovně.", "Vést přehled příjmů a výdajů od prvního dne."],
    },
    examples: [{ title: "Kokosový stánek", text: "Prodej kokosů je volná živnost. Řemeslná (s praxí) by byla třeba výroba nábytku." }],
    stats: [],
    check: {
      q: "Od kdy smíte podnikat v ohlašovací živnosti?",
      options: ["Dnem ohlášení", "Až po doručení výpisu", "Po roce praxe"],
      correct: 0,
      explain: "Živnostenské oprávnění u ohlašovacích živností vzniká dnem ohlášení.",
    },
  },
  {
    id: "dane-osvc",
    title: "Daně a pojištění OSVČ",
    plain:
      "OSVČ platí tři věci: daň z příjmů, sociální a zdravotní pojištění. Výdaje můžete dokládat účtenkami, nebo uplatnit paušál procentem z příjmů. Kdo nemá zaměstnání a není plátce DPH, může všechno zaplatit jednou paušální daní.",
    concepts: [
      { term: "Výdajový paušál", explain: "80 % u řemesel, 60 % u ostatních živností, 40 % a 30 % u jiných příjmů – bez účtenek.", cite: { law: "zdp", par: "7", odst: 7 } },
      { term: "Sociální pojištění", explain: "Z 55 % daňového základu sazbou 29,2 %, aspoň ze zákonného minima.", cite: { law: "zpsz", par: "5b", odst: 1 } },
      { term: "Zdravotní pojištění", explain: "13,5 % z 50 % daňového základu, aspoň z minimálního vyměřovacího základu.", cite: { law: "zpvzp", par: "3a", odst: 2 } },
    ],
    process: {
      title: "Rok OSVČ",
      steps: ["Celý rok platit zálohy na pojištění.", "Po skončení roku podat daňové přiznání.", "Do měsíce poslat přehledy sociálce a pojišťovně.", "Doplatit rozdíl a nastavit nové zálohy."],
    },
    examples: [{ title: "Paušál 60 %", text: "Příjmy 500 000 Kč, paušál 60 % = výdaje 300 000 Kč. Daňový základ je 200 000 Kč." }],
    stats: [],
    check: {
      q: "Z jaké části daňového základu se počítá sociální pojištění OSVČ?",
      options: ["Z 30 %", "Z 55 %", "Ze 100 %"],
      correct: 1,
      explain: "Od roku 2024 je vyměřovacím základem nejméně 55 % daňového základu.",
    },
  },
  {
    id: "dph",
    title: "DPH v kostce",
    plain:
      "DPH je daň, kterou přičtete k ceně, vyberete od zákazníka a pošlete státu. DPH z vašich nákupů si zase odečtete. Plátcem se stanete, když obrat za rok přeleze 2 miliony korun.",
    concepts: [
      { term: "Obrat", explain: "Součet příjmů z podnikání. Nad 2 000 000 Kč za rok vzniká plátcovství.", cite: { law: "zdph", par: "6", odst: 1 } },
      { term: "Sazby", explain: "Základní 21 %, snížená 12 % jen na položky z příloh zákona.", cite: { law: "zdph", par: "47", odst: 1 } },
      { term: "Odpočet", explain: "Plátce si odečte DPH z nákupů pro své podnikání.", cite: { law: "zdph", par: "72", odst: 1 } },
    ],
    process: {
      title: "Plátcem DPH",
      steps: ["Hlídat obrat za kalendářní rok.", "Při překročení 2 mil. Kč podat přihlášku do 10 pracovních dnů.", "Vystavovat daňové doklady do 15 dnů.", "Podávat přiznání k DPH a kontrolní hlášení."],
    },
    examples: [{ title: "Faktura 100 000 Kč", text: "Bez DPH 100 000 Kč, DPH 21 % = 21 000 Kč, celkem 121 000 Kč. 21 000 Kč odvedete státu." }],
    stats: [],
    check: {
      q: "Jaká je základní sazba DPH?",
      options: ["12 %", "15 %", "21 %"],
      correct: 2,
      explain: "Základní sazba DPH je 21 %, snížená 12 %.",
    },
  },
  {
    id: "firma",
    title: "Vlastní s.r.o.",
    plain:
      "S.r.o. je samostatná osoba: má vlastní majetek, dluhy i daně. Založit ji jde s vkladem 1 Kč u notáře. Zisk firmy se daní 21 % a když si ho vyplatíte, sráží se ještě 15 %.",
    concepts: [
      { term: "Základní kapitál", explain: "Součet vkladů společníků – minimum je 1 Kč.", cite: { law: "zok", par: "142", odst: 1 } },
      { term: "Ručení", explain: "Společníci ručí jen do výše nesplacených vkladů.", cite: { law: "zok", par: "132", odst: 1 } },
      { term: "Dvojí zdanění", explain: "Firma platí 21 % ze zisku, společník 15 % z vyplaceného podílu.", cite: { law: "zdp", par: "21", odst: 1 } },
    ],
    process: {
      title: "Založení",
      steps: ["Sepsat zakladatelskou listinu u notáře.", "Splatit vklad.", "Zapsat firmu do obchodního rejstříku.", "Registrovat firmu k daním."],
    },
    examples: [{ title: "Zisk 1 milion", text: "Daň 21 % = 210 000 Kč. Z 790 000 Kč vyplacených společníkovi se sráží 15 % = 118 500 Kč." }],
    stats: [],
    check: {
      q: "Jaký je minimální vklad do s.r.o.?",
      options: ["1 Kč", "20 000 Kč", "200 000 Kč"],
      correct: 0,
      explain: "Minimální výše vkladu je 1 Kč, pokud společenská smlouva neurčí víc.",
    },
  },
  {
    id: "kontrola",
    title: "Daňová kontrola a ráje",
    plain:
      "Daňový rezident Česka platí daně ze všech příjmů, i ze zahraničních. Firma na exotickém ostrově to sama nezmění. Finanční úřad může daň doměřit zpětně a připočte penále – kdo chybu opraví sám dřív, penále nezaplatí.",
    concepts: [
      { term: "Daňový rezident", explain: "Kdo má v Česku bydliště nebo se tu obvykle zdržuje – daní celosvětové příjmy.", cite: { law: "zdp", par: "2", odst: 2 } },
      { term: "Lhůta pro stanovení daně", explain: "3 roky, kontrola ji prodlužuje, nejvýš na 10 let.", cite: { law: "dr", par: "148", odst: 1 } },
      { term: "Penále", explain: "20 % z doměřené daně; při dodatečném přiznání z vlastní iniciativy se neplatí.", cite: { law: "dr", par: "251", odst: 1 } },
    ],
    examples: [{ title: "Faktury za „poradenství“", text: "Platby offshore firmě bez skutečné služby úřad neuzná jako výdaj a daň doměří." }],
    stats: [],
    check: {
      q: "Z jakých příjmů platí daň daňový rezident ČR?",
      options: ["Jen z českých", "Z českých i zahraničních", "Jen ze zahraničních"],
      correct: 1,
      explain: "Daňová povinnost rezidenta se vztahuje na příjmy z Česka i ze zahraničí.",
    },
  },
];

export const ISLAND_PREP_FOR_CASE: Record<string, string> = {
  "zivnostensky-list": "podnikani",
  "pausalni-vydaje": "dane-osvc",
  "zalohy-na-pojisteni": "dane-osvc",
  "pausalni-dan": "dane-osvc",
  "dph-obrat": "dph",
  "faktura-s-dph": "dph",
  "kontrolni-hlaseni": "dph",
  "zalozeni-sro": "firma",
  "zisk-firmy": "firma",
  "danova-kontrola": "kontrola",
};
