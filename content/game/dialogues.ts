import type { Citation } from "@/lib/types";

/** Člověk, se kterým postava v budově mluví. Vzhled = pixelová postava (tvar + barvy). */
export type Npc = {
  name: string;
  role: string;
  /** Tvar postavy ze sprites.ts. */
  shape: "ondrej" | "jana" | "marie" | "radek" | "petr";
  palette: Record<string, string>;
};

export type QA = { q: string; a: string; cite?: Citation };

export type Dialogue = {
  npc: Npc;
  /** Úvodní věta. */
  hello: string;
  /** Když tu čeká nástraha z příběhu. */
  hook?: string;
  /** Otázky, které se dají položit (každá jednou). */
  ask: QA[];
};

const P = {
  suit: { t: "#2d3440", T: "#1f252e", p: "#22262d" },
  office: { t: "#5c7a99", T: "#46607a", p: "#2f3540" },
  bright: { t: "#d94b6a", T: "#a83852", p: "#2f2f3a" },
  green: { t: "#3d8c58", T: "#2a633e", p: "#2f3540" },
};

export const DIALOGUES: Record<string, Dialogue> = {
  elektro: {
    npc: { name: "Kevin", role: "prodejce elektroniky", shape: "ondrej", palette: { h: "#1f1d22", t: "#e0b33a", T: "#b38a22", p: "#2b2f36" } },
    hello: "Čau! Hledáš nový mobil? Máme teď akci, nula procent a rovnou si ho odneseš.",
    hook: "Tenhle model ti můžu dát na splátky hned teď. Jen podepíšeš tady… a tady.",
    ask: [
      { q: "Kolik to bude stát dohromady?", a: "No… splátky jsou nízký, ne? Celkovou částku máš ve smlouvě. A RPSN taky, někde dole.", cite: { law: "zsu", par: "3", odst: 2, pism: "b" } },
      { q: "Můžu si to ještě rozmyslet?", a: "Jasně, od úvěru můžeš do 14 dnů odstoupit. Ale proč bys to dělal{a}, je to výhodný!", cite: { law: "zsu", par: "118", odst: 1 } },
    ],
  },
  operator: {
    npc: { name: "Lucie", role: "operátorka na pobočce", shape: "jana", palette: { h: "#c0392b", ...P.bright } },
    hello: "Dobrý den, vítejte! Chcete prodloužit tarif, nebo něco nového?",
    hook: "Mám pro vás skvělou nabídku – jen se upíšete na trochu delší dobu.",
    ask: [
      { q: "Jak dlouho smí trvat závazek?", a: "U spotřebitele nejvýš 24 měsíců, delší doba určitá se počítá jako smlouva na dobu neurčitou.", cite: { law: "zek", par: "63b", odst: 1 } },
      { q: "Co když chci odejít dřív?", a: "Po třech měsících od uzavření vám za předčasné ukončení nic neúčtujeme – kromě dotovaného telefonu, pokud si ho necháte.", cite: { law: "zek", par: "63b", odst: 8 } },
    ],
  },
  eshop: {
    npc: { name: "Pan Dvořák", role: "výdejní okénko", shape: "radek", palette: { h: "#5a5650", c: "#2e86c1", t: "#d8d2c4", T: "#b8b1a2", p: "#2f5d8a" } },
    hello: "Dobrý den, číslo zásilky? …Tady to je, podepište převzetí.",
    hook: "Nesedí? To se stává. Vrátit to můžete, papíry máte v balíku.",
    ask: [
      { q: "Do kdy můžu zboží vrátit?", a: "Bez udání důvodu do 14 dnů ode dne, kdy jste zásilku převzal{a}. Dneska je den nula.", cite: { law: "oz", par: "1829", odst: 2 } },
      { q: "Platil{a} jsem na splátky. Co s nimi?", a: "Když vrátíte zboží koupené na vázaný úvěr, zanikne i ten úvěr. Dejte vědět poskytovateli.", cite: { law: "zsu", par: "119", odst: 1 } },
    ],
  },
  spotrebice: {
    npc: { name: "Pan Horák", role: "vedoucí prodejny", shape: "petr", palette: { h: "#8a8a8a", S: "#7a6a5a", ...P.suit } },
    hello: "Dobrý den. Reklamace? Tak to bude určitě špatným používáním…",
    hook: "Pračku vám můžeme poslat do servisu, ale nic neslibuju.",
    ask: [
      { q: "Kdo musí dokazovat, odkud je vada?", a: "…No, když se vada objeví do roka od převzetí, musíme prokázat my, že jste ji způsobil{a} vy.", cite: { law: "oz", par: "2161", odst: 5 } },
      { q: "Jak dlouho můžete reklamaci vyřizovat?", a: "Nejvýš 30 dní, pokud se nedohodneme na delší lhůtě.", cite: { law: "zos", par: "19", odst: 3 } },
    ],
  },
  banka: {
    npc: { name: "Ing. Malá", role: "bankovní poradkyně", shape: "jana", palette: { h: "#3a2416", ...P.office } },
    hello: "Dobrý den, posaďte se. Jak vám můžu pomoct?",
    hook: "Máme tu k vám jednu záležitost, kterou bychom měli probrat.",
    ask: [
      { q: "Co když nestíhám splácet?", a: "Ozvěte se nám co nejdřív – často jde dohodnout odklad. Po 90 dnech prodlení smíme účtovat jen úrok ve výši repo sazby ČNB plus 8 procentních bodů.", cite: { law: "zsu", par: "122", odst: 4 } },
      { q: "Volá mi „bezpečnostní oddělení“ vaší banky…", a: "Nikdy po vás nebudeme chtít převod na „bezpečný účet“ ani kód z SMS. Zavěste a zavolejte nám na číslo z karty.", cite: { law: "zps", par: "165", pism: "a" } },
    ],
  },
  nebankovka: {
    npc: { name: "Rony", role: "„finanční poradce“", shape: "radek", palette: { h: "#1f1d22", c: "#1f1d22", t: "#c0392b", T: "#8f2a20", p: "#1f1d22" } },
    hello: "Čau, kámo! Potřebuješ love? Do deseti minut je máš na účtu, žádný otázky.",
    hook: "Tak co, kolik ti mám poslat? Podpis a jedeš.",
    ask: [
      { q: "Neptáte se, kolik vydělávám?", a: "To je zbytečný papírování… (Poskytovatel přitom musí úvěruschopnost důkladně posoudit, jinak je smlouva neplatná.)", cite: { law: "zsu", par: "87", odst: 1 } },
      { q: "Kolik je pokuta, když se zpozdím?", a: "Jen procento denně, to nic není! (Zákonný strop je 0,1 % denně.)", cite: { law: "zsu", par: "122", odst: 2 } },
    ],
  },
  investice: {
    npc: { name: "Mgr. Šťastný", role: "„investiční specialista“", shape: "petr", palette: { h: "#c9a227", S: "#c98d66", t: "#f4f1e8", T: "#d8d2c4", w: "#c9a227", a: "#c9a227", p: "#f4f1e8" } },
    hello: "Vítejte! Garantujeme vám 15 % ročně. Bez rizika, ale nabídka platí jen dnes.",
    hook: "Stačí převést peníze na náš účet a za rok jste o patnáct procent bohatší.",
    ask: [
      { q: "Máte licenci ČNB?", a: "Licence je jen byrokracie… (Ověřte firmu v seznamu regulovaných subjektů ČNB. Garanční fond chrání jen klienty licencovaných obchodníků.)", cite: { law: "zpkt", par: "130", odst: 9 } },
      { q: "Co když o peníze přijdu?", a: "To se nestane. (Tržní ztrátu nekryje nikdo a vklady jsou pojištěné jen v bance – do 100 000 EUR.)", cite: { law: "zob", par: "41e", odst: 2 } },
    ],
  },
  arbitr: {
    npc: { name: "JUDr. Novotná", role: "kancelář finančního arbitra", shape: "marie", palette: { h: "#6b4a2b", ...P.office, w: "#e8e0d0", g: "#333333", a: "#00000000" } },
    hello: "Dobrý den. Řešíme spory spotřebitelů s bankami, věřiteli, pojišťovnami a investičními firmami.",
    hook: "Máte s někým spor? Pojďme se podívat, jestli je to pro nás.",
    ask: [
      { q: "Co potřebuju k návrhu?", a: "Doklad, že jste instituci nejdřív neúspěšně vyzval{a} k nápravě – třeba zamítnutou reklamaci.", cite: { law: "zfa", par: "10", odst: 1, pism: "b" } },
      { q: "Kolik to stojí?", a: "Řízení se nezpoplatňuje, každý nese jen své náklady. Advokáta nepotřebujete.", cite: { law: "zfa", par: "18", odst: 1 } },
    ],
  },
  soud: {
    npc: { name: "Paní Kučerová", role: "podatelna okresního soudu", shape: "marie", palette: { h: "#8a8a8a", ...P.suit, w: "#e8e0d0", g: "#333333", a: "#00000000" } },
    hello: "Dobrý den, podatelna. Co nesete?",
    hook: "Máme tu na vaše jméno jednu věc. Posaďte se, vysvětlím vám to.",
    ask: [
      { q: "Jak dlouho se dá vymáhat rozsudek?", a: "Právo přiznané rozhodnutím se promlčuje za deset let od doby, kdy se mělo plnit.", cite: { law: "oz", par: "640" } },
      { q: "Musím promlčení nějak oznámit?", a: "Ano. Soud k promlčení přihlédne, jen když ho dlužník sám namítne.", cite: { law: "oz", par: "610", odst: 1 } },
    ],
  },
  exekutor: {
    npc: { name: "Mgr. Beneš", role: "soudní exekutor", shape: "petr", palette: { h: "#1f1d22", S: "#4a3a2e", ...P.suit } },
    hello: "Dobrý den. Exekutorský úřad. Jste tu kvůli vyrozumění?",
    hook: "Proti vám vedeme exekuci. Lhůta z výzvy už běží – a vyplatí se ji stihnout.",
    ask: [
      { q: "Jak to vyřešit co nejlevněji?", a: "Zaplaťte dluh i zálohu do 30 dnů od doručení vyrozumění. Pak exekuci skončíme se sníženými náklady.", cite: { law: "er", par: "46", odst: 6 } },
      { q: "Co mi zůstane z výplaty?", a: "Vždy nezabavitelná částka. Ze zbytku jde na běžné dluhy třetina, na výživné nebo daně dvě třetiny.", cite: { law: "osr", par: "279", odst: 1 } },
    ],
  },
  fu: {
    npc: { name: "Paní Dvořáková", role: "úřednice finančního úřadu", shape: "marie", palette: { h: "#a35a3c", ...P.office, w: "#e8e0d0", g: "#333333", a: "#00000000" } },
    hello: "Dobrý den, finanční úřad, podatelna. S čím jdete?",
    hook: "Daňové přiznání? Výborně, pojďme se na to podívat spolu.",
    ask: [
      { q: "Do kdy musím přiznání podat?", a: "Základně do 3 měsíců po skončení roku. Elektronicky máte o měsíc víc, s daňovým poradcem až 6 měsíců.", cite: { law: "dr", par: "136", odst: 2 } },
      { q: "Spletl{a} jsem se v přiznání. Co teď?", a: "Podejte dodatečné přiznání {sam}. Z takto přiznané daně penále nevzniká – zaplatíte jen úrok z prodlení.", cite: { law: "dr", par: "251", odst: 4 } },
      { q: "Co když přiznání podám pozdě?", a: "Pokuta je 0,05 % daně za den, nejvýš 5 %. Když by vyšla pod 1 000 Kč, nepředepisujeme ji.", cite: { law: "dr", par: "250", odst: 3 } },
    ],
  },
  up: {
    npc: { name: "Paní Králová", role: "Úřad práce", shape: "jana", palette: { h: "#6b4a2b", ...P.green } },
    hello: "Dobrý den, Úřad práce. Pomůžu vám s dávkami i s náhradním výživným.",
    hook: "Neplatí druhý rodič výživné? Na to tu máme náhradní výživné.",
    ask: [
      { q: "Kdy mám nárok na náhradní výživné?", a: "Když k vymáhání výživného běží exekuce nebo soudní výkon rozhodnutí. Bez toho to nejde.", cite: { law: "znv", par: "3" } },
      { q: "Kolik to dělá?", a: "Dorovnáme chybějící výživné, nejvýš 3 000 Kč měsíčně na dítě.", cite: { law: "znv", par: "4", odst: 1 } },
    ],
  },
  domov: {
    npc: { name: "Soused Jarda", role: "soused odvedle", shape: "radek", palette: { h: "#5a5650", c: "#3d8c58", t: "#d8d2c4", T: "#b8b1a2", p: "#2f5d8a" } },
    hello: "Nazdar! Zase ti něco přišlo do schránky, viděl jsem pošťáka.",
    hook: "A dneska tu zvonil nějaký obchodník. Prý ještě přijde.",
    ask: [
      { q: "Co když podepíšu něco u dveří?", a: "Od smlouvy podepsané doma, mimo obchod, můžeš do 14 dnů odstoupit. Ale lepší je nepodepisovat nic hned.", cite: { law: "oz", par: "1829", odst: 1 } },
      { q: "Nevyzvedl{a} jsem doporučený dopis…", a: "To nepomůže. Po deseti dnech od uložení na poště se bere jako doručený – a lhůty běží.", cite: { law: "osr", par: "49", odst: 4 } },
    ],
  },
  kulturak: {
    npc: { name: "Moderátor Pepa", role: "prodejní akce", shape: "ondrej", palette: { h: "#c9a227", t: "#8e44ad", T: "#6c3483", w: "#f4f4f4", p: "#1f1d22" } },
    hello: "Vítáme vás na našem zájezdu! Oběd je zdarma a máme pro vás úžasné dárky!",
    hook: "A teď to nejlepší – léčivá deka za zvýhodněnou cenu. Jen zálohu, prosím!",
    ask: [
      { q: "Můžu zaplatit zálohu?", a: "To je zakázané! (Na předváděcí akci nesmí prodejce přijmout platbu ani zálohu – ani 7 dní po smlouvě.)", cite: { law: "zos", par: "20b", odst: 1 } },
      { q: "A když to podepíšu?", a: "(Smlouvu z prodejního zájezdu lze do 14 dnů zrušit bez udání důvodu – je to smlouva mimo obchodní prostory.)", cite: { law: "oz", par: "1828", odst: 2, pism: "b" } },
    ],
  },
  byt: {
    npc: { name: "Realitní makléřka Eva", role: "prodej bytu", shape: "jana", palette: { h: "#c9a227", ...P.bright } },
    hello: "Dobrý den, byt je nafocený, kupce máme. Zbývá vyřešit hypotéku.",
    hook: "Banka posílá vyčíslení předčasného splacení. Podívejte se na ten poplatek.",
    ask: [
      { q: "Smí banka chtít poplatek za předčasné splacení?", a: "U hypotéky starší 24 měsíců ne, když se prodává zastavená nemovitost nebo vypořádává společné jmění.", cite: { law: "zsu", par: "117", odst: 3, pism: "f" } },
      { q: "Do kdy musíme vypořádat společné jmění?", a: "Do tří let od rozvodu. Pak platí zákonné rozdělení – dluhy a pohledávky napůl.", cite: { law: "oz", par: "741" } },
    ],
  },
  dilna: {
    npc: { name: "Účetní Ivana", role: "účetní na volné noze", shape: "jana", palette: { h: "#1f1d22", ...P.green } },
    hello: "Ahoj, nesu ti výpisy. Některé faktury pořád nejsou zaplacené.",
    hook: "Tenhle odběratel ti dluží už dva roky. Měl bys s tím něco dělat.",
    ask: [
      { q: "Kdy mi pohledávka promlčí?", a: "Obecně za tři roky od doby, kdy šla poprvé uplatnit. Nech to být moc dlouho a o peníze přijdeš.", cite: { law: "oz", par: "629", odst: 1 } },
      { q: "Můžu chtít víc než dlužnou částku?", a: "Úrok z prodlení ti náleží ze zákona. Smluvní pokutu jen tehdy, když jste ji sjednali.", cite: { law: "oz", par: "1970" } },
    ],
  },
  poradna: {
    npc: { name: "Mgr. Svobodová", role: "dluhová poradkyně", shape: "marie", palette: { h: "#6b4a2b", ...P.green, w: "#e8e0d0", g: "#333333", a: "#00000000" } },
    hello: "Dobrý den, posaďte se. Tady se nikdo nesoudí – projdeme spolu, co dlužíte, a najdeme cestu ven.",
    hook: "Mám pro vás případ, na kterém si můžete vyzkoušet, co už umíte.",
    ask: [
      { q: "Kdy je oddlužení dobré řešení?", a: "Když máte víc věřitelů a dluhy, které nezvládnete splácet. Oddlužení dnes trvá zpravidla 3 roky.", cite: { law: "iz", par: "412a", odst: 1 } },
      { q: "Kdo mi sepíše návrh?", a: "Advokát, notář, exekutor, insolvenční správce – nebo akreditovaná poradna jako my, zdarma.", cite: { law: "iz", par: "390a", odst: 1 } },
    ],
  },

  // --- Daňový ráj
  "o-zu": {
    npc: { name: "paní Marisol", role: "živnostenský úřad", shape: "jana", palette: { h: "#2b1d14", s: "#c98d66", t: "#1fa3b8", T: "#167b8a", a: "#f4f4f4", p: "#2a2a35" } },
    hello: "Bienvenidos! Tady začíná každé podnikání. Formulář je jeden, úřadů je víc – ale vyřídíte je u mě.",
    hook: "Máte nápad na podnikání? Pojďme ho ohlásit.",
    ask: [
      { q: "Potřebuju na půjčovnu nějakou školu?", a: "Ne. Půjčovna je volná živnost – stačí svéprávnost a bezúhonnost.", cite: { law: "zz", par: "25", odst: 1 } },
      { q: "Co když se mi změní adresa?", a: "Změny nahlaste živnostenskému úřadu do 15 dnů.", cite: { law: "zz", par: "49", odst: 1 } },
    ],
  },
  "o-fu": {
    npc: { name: "pan Esteban", role: "správce daně", shape: "petr", palette: { h: "#2b1d14", s: "#b5784f", S: "#6b4a2b", t: "#f4f4f4", T: "#d8d2c4", w: "#2a4a7a", a: "#2a4a7a", p: "#2a4a7a" } },
    hello: "Daňový ráj je jen jméno ostrova. Přiznání se podává i tady.",
    hook: "Máte tu něco k vyřízení – vaše daně.",
    ask: [
      { q: "Do kdy podám přiznání?", a: "Na papíře do 3 měsíců po konci roku, elektronicky do 4 měsíců.", cite: { law: "dr", par: "136", odst: 2 } },
      { q: "Musím ho vůbec podávat?", a: "Ano, když vaše roční zdanitelné příjmy přesáhly 50 000 Kč.", cite: { law: "zdp", par: "38g", odst: 1 } },
    ],
  },
  "o-cssz": {
    npc: { name: "paní Inés", role: "sociální zabezpečení", shape: "marie", palette: { h: "#5a3a1e", s: "#c98d66", t: "#a98fd6", T: "#7a62a8", w: "#f4f4f4", p: "#3a3a52", a: "#3a3a52" } },
    hello: "Důchod se počítá i z podnikání. Proto se tu platí zálohy.",
    hook: "Váš přehled o příjmech a výdajích čeká.",
    ask: [
      { q: "Z čeho se moje pojistné počítá?", a: "Z 55 % daňového základu, sazba je 29,2 %.", cite: { law: "zpsz", par: "5b", odst: 1 } },
      { q: "Platí to i první rok?", a: "Začínající OSVČ mají tři roky nižší minimum – 25 % průměrné mzdy místo 35 %.", cite: { law: "zpsz", par: "14", odst: 5 } },
    ],
  },
  "o-poradce": {
    npc: { name: "pan Ricardo", role: "daňový poradce", shape: "radek", palette: { c: "#f2c94c", h: "#2b1d14", s: "#c98d66", S: "#8a5a3a", t: "#2d3440", T: "#1f252e", p: "#22262d" } },
    hello: "Daňová optimalizace? Ano. Daňové úniky? Ty dělá soused v bílém obleku.",
    hook: "Spočítáme, jestli se vám vyplatí paušální režim.",
    ask: [
      { q: "Kdo nesmí do paušálního režimu?", a: "Plátce DPH a ten, kdo má zároveň příjmy ze zaměstnání.", cite: { law: "zdp", par: "2a", odst: 1 } },
      { q: "Co je výhodnější, paušál, nebo účtenky?", a: "Záleží na skutečných výdajích. Když jsou nižší než paušál, berte paušál.", cite: { law: "zdp", par: "7", odst: 7 } },
    ],
  },
  "o-ucetni": {
    npc: { name: "Valentina", role: "účetní", shape: "jana", palette: { h: "#9b2d5a", s: "#e8b48f", t: "#4fb7b3", T: "#2f8784", a: "#f2c94c", p: "#2a2a35" } },
    hello: "Obrat si hlídám za vás. A letos se blíží dva miliony.",
    hook: "Musíme probrat DPH.",
    ask: [
      { q: "Co se počítá do obratu?", a: "Příjmy za plnění, která děláte v rámci podnikání. Hranice je 2 000 000 Kč za kalendářní rok.", cite: { law: "zdph", par: "6", odst: 1 } },
      { q: "Kolik času mám na registraci?", a: "10 pracovních dnů od překročení obratu.", cite: { law: "zdph", par: "94", odst: 1 } },
    ],
  },
  "o-pujcovna": {
    npc: { name: "Diego", role: "váš zaměstnanec", shape: "ondrej", palette: { h: "#1f1d22", s: "#b5784f", t: "#f08a5d", T: "#c26a42", w: "#f4f4f4", p: "#2f5d8a" } },
    hello: "Šéfe, hotel chce prkna na celé léto. A přišla faktura za nový člun.",
    hook: "Faktury nám neuplavou. Teda doufám.",
    ask: [
      { q: "Co musí být na faktuře?", a: "Mimo jiné obě DIČ, evidenční číslo, datum, základ daně a sazba.", cite: { law: "zdph", par: "29", odst: 1 } },
      { q: "Do kdy ji musím vystavit?", a: "Do 15 dnů ode dne, kdy vznikla povinnost přiznat daň.", cite: { law: "zdph", par: "28", odst: 8 } },
    ],
  },
  "o-notar": {
    npc: { name: "JUDr. Alvarez", role: "notářka", shape: "marie", palette: { h: "#1f1d22", s: "#e8b48f", t: "#1f1d22", T: "#111111", w: "#f4f4f4", p: "#1f1d22", a: "#1f1d22" } },
    hello: "S.r.o. se nezakládá podáním ruky. Zakládá se veřejnou listinou – u mě.",
    hook: "Připravila jsem návrh zakladatelské listiny.",
    ask: [
      { q: "Kolik musím vložit?", a: "Minimum je 1 Kč. Rozumný kapitál ale firmě pomůže platit první účty.", cite: { law: "zok", par: "142", odst: 1 } },
      { q: "Ručím pak celým majetkem?", a: "Ne, společník ručí jen do výše nesplaceného vkladu.", cite: { law: "zok", par: "132", odst: 1 } },
    ],
  },
  "o-kancelar": {
    npc: { name: "Valentina", role: "účetní firmy", shape: "jana", palette: { h: "#9b2d5a", s: "#e8b48f", t: "#4fb7b3", T: "#2f8784", a: "#f2c94c", p: "#2a2a35" } },
    hello: "Účetní závěrka je hotová. Firma vydělala.",
    hook: "Probereme, kolik si můžete vyplatit.",
    ask: [
      { q: "Kolik zaplatí firma?", a: "21 % ze zisku.", cite: { law: "zdp", par: "21", odst: 1 } },
      { q: "A já z dividendy?", a: "Sráží se 15 %, víc už neřešíte.", cite: { law: "zdp", par: "36", odst: 2, pism: "b" } },
    ],
  },
  "o-offshore": {
    npc: { name: "Mr. White", role: "Offshore Paradise Ltd.", shape: "petr", palette: { h: "#f4f4f4", s: "#f0c8a8", S: "#e8e0d0", t: "#f4f4f4", T: "#d8d2c4", w: "#f4f4f4", a: "#d4a017", p: "#f4f4f4" } },
    hello: "Daně jsou pro chudé. Pro vás máme strukturu.",
    hook: "Stačí převést zisk přes naše faktury za „poradenství“.",
    ask: [
      { q: "Je to legální?", a: "Samozřejmě! Teda… na tomhle ostrově. (Rezident Česka ale daní příjmy z celého světa.)", cite: { law: "zdp", par: "2", odst: 2 } },
      { q: "Co když přijde kontrola?", a: "Ta nepřijde. (Přijde. A doměřená daň nese penále 20 %.)", cite: { law: "dr", par: "251", odst: 1 } },
    ],
  },
  "o-bar": {
    npc: { name: "Rafa", role: "barman", shape: "radek", palette: { c: "#3fae4f", h: "#2b1d14", s: "#b5784f", S: "#8a5a3a", t: "#f2c94c", T: "#c9a227", p: "#2f5d8a" } },
    hello: "Piña colada? Na pláži se nejlíp přemýšlí o podnikání.",
    ask: [
      { q: "Kolik odvádíš státu ty?", a: "Daň, pojištění a od letoška i DPH – bar překročil dva miliony obratu.", cite: { law: "zdph", par: "6", odst: 1 } },
      { q: "Platí se tu DPH i na drinky?", a: "Ano. Pokud zákon nestanoví sníženou sazbu, platí základních 21 %.", cite: { law: "zdph", par: "47", odst: 1 } },
    ],
  },
  "o-poradna": {
    npc: { name: "Ana", role: "daňová poradkyně zdarma", shape: "jana", palette: { h: "#2b1d14", s: "#c98d66", t: "#3d8c58", T: "#2a633e", a: "#f4f4f4", p: "#2f3540" } },
    hello: "Bojíte se, že jste v přiznání něco spletli? Oprava je vždycky levnější než kontrola.",
    ask: [
      { q: "Jak opravím chybu v přiznání?", a: "Dodatečným přiznáním. Když ho podáte sami, penále neplatíte.", cite: { law: "dr", par: "251", odst: 4 } },
      { q: "Jak dlouho mám schovávat papíry?", a: "Daň lze stanovit zpravidla do 3 let, s prodloužením až 10 let. Archivujte raději déle.", cite: { law: "dr", par: "148", odst: 1 } },
    ],
  },
};
