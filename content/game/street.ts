import type { Citation } from "@/lib/types";
import type { Npc } from "./dialogues";

/**
 * Lidé na ulici: stojí na chodníku a ptají se postavy na radu. Každý rozhovor = jedna otázka;
 * další otázku má člověk připravenou, až mu na tu první poradíte správně.
 * Odpovědi se opírají o paragrafy z karet a přednášek (ověřeno proti zněním zákonů).
 */
export type StreetQuestion = {
  /** Situace a otázka, jak je člověk řekne (1–2 věty). */
  ask: string;
  /** Možné rady (první v poli nemusí být správná, v rozhovoru se míchají). */
  options: string[];
  correct: number;
  /** Proč je správná rada správná – jedna věta. */
  why: string;
  cite?: Citation;
};

export type StreetNpc = {
  id: string;
  npc: Npc;
  /** Kde stojí (dlaždice chodníku). */
  at: { x: number; y: number };
  questions: StreetQuestion[];
};

export const STREET: StreetNpc[] = [
  {
    id: "student",
    npc: { name: "Tomáš", role: "student", shape: "ondrej", palette: { h: "#c98a3a", t: "#4a7bd1", T: "#365ea3", p: "#2b2f36" } },
    at: { x: 9, y: 13 },
    questions: [
      {
        ask: "Koupil jsem včera telefon na splátky a už toho lituju. Dá se to ještě vzít zpátky?",
        options: ["Ne, podpis je podpis.", "Ano, od úvěru můžeš do 14 dnů odstoupit bez udání důvodu.", "Jen když je telefon vadný."],
        correct: 1,
        why: "Od spotřebitelského úvěru lze odstoupit do 14 dnů bez důvodu a bez sankce.",
        cite: { law: "zsu", par: "118", odst: 1 },
      },
      {
        ask: "A když od té půjčky odstoupím, co přesně musím vrátit?",
        options: ["Půjčené peníze a úrok za dny, kdy jsem je měl – do 30 dnů.", "Všechny splátky za celé dva roky.", "Pokutu za odstoupení."],
        correct: 0,
        why: "Vrací se jistina a úrok za dobu čerpání, nejpozději do 30 dnů – nic víc.",
        cite: { law: "zsu", par: "118", odst: 4 },
      },
    ],
  },
  {
    id: "babicka",
    npc: { name: "paní Věra", role: "důchodkyně", shape: "marie", palette: { h: "#e2e2e2", t: "#7a9a5a", T: "#5c7a42", p: "#4a4a52" } },
    at: { x: 22, y: 13 },
    questions: [
      {
        ask: "Byla jsem na zájezdu s obědem zdarma a podepsala tam smlouvu na hrnce za 30 tisíc. Prý to už nejde zrušit…",
        options: ["Musíte zaplatit, smlouva platí.", "Od smlouvy z prodejní akce můžete do 14 dnů odstoupit.", "Zrušit to může jen soud."],
        correct: 1,
        why: "Smlouva z prodejního zájezdu je smlouva mimo obchodní prostory a lze od ní do 14 dnů odstoupit.",
        cite: { law: "oz", par: "1829", odst: 1 },
      },
      {
        ask: "Ten prodejce na akci chtěl rovnou zálohu. Měla jsem mu ji dát?",
        options: ["Ano, záloha je běžná.", "Ne, na předváděcí akci nesmí prodejce přijmout peníze ani zálohu.", "Jen do tisíce korun."],
        correct: 1,
        why: "Na předváděcí akci a ještě 7 dní po ní prodejce nesmí přijmout žádnou platbu.",
        cite: { law: "zos", par: "20b", odst: 1 },
      },
    ],
  },
  {
    id: "mlady-otec",
    npc: { name: "Lukáš", role: "táta na rodičovské", shape: "radek", palette: { c: "#3d8c58", h: "#2b1d14", t: "#d8d2c4", p: "#3b4a6b" } },
    at: { x: 35, y: 16 },
    questions: [
      {
        ask: "Srovnávám dvě půjčky. Jedna má úrok 9 %, druhá 11 %. Ta první je levnější, ne?",
        options: ["Ano, rozhoduje úrok.", "Nemusí. Srovnávej RPSN a celkovou částku, kterou zaplatíš.", "Rozhoduje délka splácení."],
        correct: 1,
        why: "RPSN zahrnuje úroky i poplatky – jen podle ní a celkové částky jde úvěry férově srovnat.",
        cite: { law: "zsu", par: "3", odst: 2, pism: "b" },
      },
      {
        ask: "Nebankovka po mně chce k půjčce podepsat i směnku. Je to normální?",
        options: ["Ano, kvůli jistotě.", "Ne, spotřebitelský úvěr nesmí být zajištěný směnkou.", "Jen u půjček nad 100 tisíc."],
        correct: 1,
        why: "Spotřebitelský úvěr nelze splácet ani zajistit směnkou či šekem.",
        cite: { law: "zsu", par: "112", odst: 1 },
      },
    ],
  },
  {
    id: "remeslnik",
    npc: { name: "pan Jarda", role: "instalatér", shape: "petr", palette: { h: "#5a5650", t: "#c0392b", T: "#922b21", w: "#e8eef5", a: "#e8eef5", p: "#2f5d8a" } },
    at: { x: 47, y: 24 },
    questions: [
      {
        ask: "Daňové přiznání jsem vždycky podával na papíře. Kolik mám času, když ho pošlu elektronicky?",
        options: ["Stejně jako na papíře – 3 měsíce po konci roku.", "O měsíc víc – 4 měsíce po konci roku.", "Až do konce roku."],
        correct: 1,
        why: "Elektronické přiznání má lhůtu o měsíc delší: 4 měsíce místo 3.",
        cite: { law: "dr", par: "136", odst: 2 },
      },
      {
        ask: "Zjistil jsem, že jsem v loňském přiznání udělal chybu. Co teď?",
        options: ["Nic, nikdo si toho nevšimne.", "Podat dodatečné přiznání – kdo chybu opraví sám, neplatí penále.", "Počkat na kontrolu z úřadu."],
        correct: 1,
        why: "Při dodatečném přiznání podaném z vlastní iniciativy se penále 20 % neplatí.",
        cite: { law: "dr", par: "251", odst: 4 },
      },
    ],
  },
  {
    id: "maminka",
    npc: { name: "Petra", role: "maminka dvou dětí", shape: "jana", palette: { h: "#6b3a1e", t: "#3a8fb0", T: "#2a6c86", a: "#f4f4f4", p: "#3a3a52" } },
    at: { x: 10, y: 24 },
    questions: [
      {
        ask: "Bývalý muž půl roku neplatí výživné na děti. Je nějaká pomoc, než to vymůžu?",
        options: ["Ne, musím čekat na soud.", "Náhradní výživné od státu – když už běží exekuce.", "Půjčka od sociálky."],
        correct: 1,
        why: "Stát vyplácí náhradní výživné, když výživné nechodí a proti povinnému se vede exekuce.",
        cite: { law: "znv", par: "3" },
      },
      {
        ask: "A kolik to náhradní výživné může být?",
        options: ["Celé výživné bez omezení.", "Nejvýš 3 000 Kč měsíčně na dítě.", "Pevně 1 000 Kč."],
        correct: 1,
        why: "Náhradní výživné dorovná chybějící částku, nejvýše 3 000 Kč měsíčně na dítě.",
        cite: { law: "znv", par: "4", odst: 1 },
      },
    ],
  },
  {
    id: "podnikatelka",
    npc: { name: "Zdena", role: "kadeřnice", shape: "jana", palette: { h: "#9b2d5a", t: "#1f1d22", T: "#111111", a: "#ffd447", p: "#2a2a35" } },
    at: { x: 27, y: 27 },
    questions: [
      {
        ask: "Přišlo mi vyrozumění o exekuci na 8 tisíc. Dá se to ještě nějak zlevnit?",
        options: ["Ne, náklady už jsou dané.", "Zaplatit dluh i zálohu do 30 dnů – exekuce skončí s nižšími náklady.", "Počkat, až exekutor zavolá."],
        correct: 1,
        why: "Kdo do 30 dnů od doručení vyrozumění zaplatí dluh a zálohu, ukončí exekuci se sníženými náklady.",
        cite: { law: "er", par: "46", odst: 6 },
      },
      {
        ask: "Exekutor mi zablokoval účet. Nemám ani na nájem. Můžu z něj něco vybrat?",
        options: ["Ne, účet je zmrazený celý.", "Ano, chráněnou částku – trojnásobek životního minima.", "Jen s povolením soudu."],
        correct: 1,
        why: "Ze zablokovaného účtu lze vybrat chráněnou částku ve výši trojnásobku životního minima jednotlivce.",
        cite: { law: "osr", par: "304b", odst: 1 },
      },
    ],
  },
  {
    id: "dedecek",
    npc: { name: "pan Karel", role: "důchodce", shape: "petr", palette: { h: "#d9d9d9", s: "#f0c8a8", S: "#cfcfcf", t: "#6b6f4a", T: "#4f5236", w: "#f4f4f4", a: "#6b6f4a", p: "#3b3b42" } },
    at: { x: 40, y: 27 },
    questions: [
      {
        ask: "Volal mi pán z banky, že mi někdo vybírá účet a mám mu nadiktovat kód z SMS. Mám?",
        options: ["Ano, chce mi pomoct.", "Nikdy. Kódy a hesla nikomu nesdělujte, ani „bance“.", "Jen první polovinu kódu."],
        correct: 1,
        why: "Uživatel musí chránit PIN, hesla i kódy z SMS – skutečná banka je po vás nikdy nechce.",
        cite: { law: "zps", par: "165", pism: "a" },
      },
      {
        ask: "Na výpisu mám platbu, kterou jsem neudělal. Kartu mám u sebe. Co mám dělat?",
        options: ["Hned to nahlásit bance – musí platbu vrátit.", "Počkat na další výpis.", "Zablokovat kartu a nic víc."],
        correct: 0,
        why: "Neautorizovanou platbu musí banka vrátit nejpozději do konce následujícího pracovního dne po oznámení.",
        cite: { law: "zps", par: "181", odst: 1 },
      },
    ],
  },
  {
    id: "sousedka",
    npc: { name: "Iveta", role: "prodavačka", shape: "jana", palette: { h: "#e0b33a", t: "#7d4fb3", T: "#5d3a86", a: "#f2c94c", p: "#2f2f3a" } },
    at: { x: 18, y: 20 },
    questions: [
      {
        ask: "Pračka se mi rozbila po osmi měsících. Prodejce tvrdí, že je to moje chyba. Musím mu dokazovat opak?",
        options: ["Ano, důkaz je na mně.", "Ne. Vada, která se objeví do roka, se bere jako vada už při koupi.", "Jen když mám krabici."],
        correct: 1,
        why: "U vady, která se projeví do roka od převzetí, se má za to, že tu byla už při převzetí.",
        cite: { law: "oz", par: "2161", odst: 5 },
      },
      {
        ask: "Reklamaci jsem podala před pěti týdny a pořád nic. Můžu něco dělat?",
        options: ["Musím čekat, jak dlouho bude třeba.", "Ano, po 30 dnech můžu od smlouvy odstoupit nebo chtít přiměřenou slevu.", "Podat novou reklamaci."],
        correct: 1,
        why: "Reklamace se musí vyřídit do 30 dnů; když se to nestane, můžete odstoupit nebo chtít přiměřenou slevu.",
        cite: { law: "zos", par: "19", odst: 4 },
      },
    ],
  },
  {
    id: "investor",
    npc: { name: "Marek", role: "programátor", shape: "ondrej", palette: { h: "#1f1d22", t: "#2d3440", T: "#1f252e", w: "#5fe08a", p: "#22262d" } },
    at: { x: 31, y: 9 },
    questions: [
      {
        ask: "Kamarád mi nabízí investici s výnosem 15 % ročně, garantovaně. Mám do toho jít?",
        options: ["Jasně, garance je garance.", "Ne. Vysoký výnos bez rizika neexistuje – je to varovný signál.", "Jen s polovinou úspor."],
        correct: 1,
        why: "Vyšší výnos vždycky znamená vyšší riziko; „garantovaných 15 %“ je typický znak podvodu.",
      },
      {
        ask: "Mám v jedné bance na účtech 3 miliony. Jsou celé pojištěné?",
        options: ["Ano, každý účet zvlášť.", "Ne, pojištění kryje nejvýš 100 000 EUR na člověka u jedné banky.", "Ano, stát ručí za všechno."],
        correct: 1,
        why: "Náhrada je omezená částkou odpovídající 100 000 EUR na osobu u jedné banky – účty se sčítají.",
        cite: { law: "zob", par: "41e", odst: 2 },
      },
    ],
  },
  {
    id: "ridic",
    npc: { name: "Standa", role: "řidič dodávky", shape: "radek", palette: { c: "#2e86c1", h: "#3a2416", t: "#f1c40f", T: "#c19b0b", p: "#2b2f36" } },
    at: { x: 44, y: 31 },
    questions: [
      {
        ask: "Přišel mi dopis kvůli dluhu z doby před pěti lety. Inkasní agentura chce, abych podepsal uznání dluhu. Mám?",
        options: ["Ano, ať je klid.", "Raději ne – uznáním dluhu začne běžet nová desetiletá lhůta.", "Ano, ale jen e-mailem."],
        correct: 1,
        why: "Písemné uznání dluhu spustí novou promlčecí lhůtu deset let.",
        cite: { law: "oz", par: "639" },
      },
      {
        ask: "A když už je ten dluh promlčený, smaže ho soud sám?",
        options: ["Ano, automaticky.", "Ne. Promlčení musíte u soudu sám namítnout.", "Ne, promlčení neexistuje."],
        correct: 1,
        why: "Soud k promlčení nepřihlíží sám od sebe – dlužník ho musí výslovně namítnout.",
        cite: { law: "oz", par: "610", odst: 1 },
      },
    ],
  },
  {
    id: "studentka",
    npc: { name: "Eliška", role: "studentka", shape: "jana", palette: { h: "#c98a3a", t: "#3d8c58", T: "#2a633e", a: "#f4f4f4", p: "#3b4a6b" } },
    at: { x: 15, y: 31 },
    questions: [
      {
        ask: "Objednala jsem boty z e-shopu, přišly dneska a nesedí. Dá se to vrátit bez důvodu?",
        options: ["Ne, jen kdyby byly vadné.", "Ano, do 14 dnů od převzetí zásilky.", "Ano, ale jen do 3 dnů."],
        correct: 1,
        why: "U zboží z e-shopu běží 14denní lhůta k odstoupení až od převzetí.",
        cite: { law: "oz", par: "1829", odst: 2 },
      },
      {
        ask: "Operátor mi nabízí tarif se závazkem na tři roky, že bude levnější. Jde to vůbec?",
        options: ["Ano, dohoda je dohoda.", "Ne, smlouva na dobu určitou smí trvat nejvýš 24 měsíců.", "Jen u firem."],
        correct: 1,
        why: "Smlouva s operátorem na dobu určitou smí mít závazek nejvýš 24 měsíců.",
        cite: { law: "zek", par: "63b", odst: 1 },
      },
    ],
  },
  {
    id: "manzele",
    npc: { name: "Hanka", role: "účetní", shape: "marie", palette: { h: "#6b4a2b", t: "#b03a7a", T: "#86295c", w: "#f4f4f4", p: "#3a3a52", a: "#3a3a52" } },
    at: { x: 53, y: 16 },
    questions: [
      {
        ask: "Manžel si chce vzít velkou půjčku na auto a mně se to nelíbí. Můžu se nějak chránit?",
        options: ["Nijak, dluhy jsou vždycky společné.", "Ano, hned věřiteli oznámit nesouhlas – pak může sáhnout jen na manželův podíl.", "Jen rozvodem."],
        correct: 1,
        why: "Když nesouhlas oznámíte věřiteli bez zbytečného odkladu, může vymáhat ze společného jmění jen do výše podílu dlužníka.",
        cite: { law: "oz", par: "732" },
      },
      {
        ask: "Šéf mi radí spořit si na penzi. Kolik mi k tomu přidá stát?",
        options: ["Nic, to je jen marketing.", "Při 1 700 Kč měsíčně a víc dostanete státní příspěvek 340 Kč.", "Polovinu vkladu."],
        correct: 1,
        why: "Od příspěvku 1 700 Kč měsíčně činí státní příspěvek na doplňkové penzijní spoření 340 Kč.",
        cite: { law: "zdps", par: "14", odst: 2 },
      },
    ],
  },
];

export const STREET_BY_ID = new Map(STREET.map((s) => [s.id, s]));
