import type { Citation } from "@/lib/types";

/**
 * Vysoká škola finanční: krátké přednášky o tématech ze světa financí.
 * Každá vyřešená nástraha otevře další přednášku. Částky v příkladech jsou ilustrativní.
 * Paragrafy a čísla ze zákonů jsou ověřené proti znění na zakonyprolidi.cz.
 */
export type TeacherId = "gros" | "vynosova";

export const TEACHERS: Record<TeacherId, { name: string; title: string }> = {
  gros: { name: "prof. Ing. Antonín Groš", title: "katedra osobních financí" },
  vynosova: { name: "doc. Ing. Klára Výnosová", title: "katedra investic" },
};

export type LectureStep = {
  /** Co učitel řekne (jedna až dvě krátké věty). */
  say: string;
  /** Co napíše na tabuli (1–3 řádky). */
  board?: string[];
  cite?: Citation;
};

export type Lecture = {
  id: string;
  title: string;
  teacher: TeacherId;
  steps: LectureStep[];
  quiz: { q: string; options: string[]; correct: number; explain: string }[];
};

export const LECTURES: Lecture[] = [
  {
    id: "rozpocet",
    title: "Rozpočet a rezerva",
    teacher: "gros",
    steps: [
      { say: "Dobrý den, posaďte se. Dnes začneme tím nejnudnějším, co vám ale ušetří nejvíc peněz.", board: ["Přednáška 1", "ROZPOČET A REZERVA"] },
      { say: "Rozpočet je jen přehled: kolik přijde a kolik odejde. Kdo ho nemá, zjistí to až na konci měsíce.", board: ["PŘÍJMY − VÝDAJE = ?"] },
      { say: "Pomůže jednoduché pravidlo: zhruba polovina na nutné výdaje, necelá třetina na přání a pětina na spoření a dluhy.", board: ["50 % nutné", "30 % přání", "20 % spoření a dluhy"] },
      { say: "Je to orientační pravidlo, ne zákon. Důležité je, aby spoření vůbec nějaké bylo." },
      { say: "Rezerva je polštář na rozbité auto nebo výpadek příjmu. Často se doporučuje mít stranou tři až šest měsíčních výdajů.", board: ["REZERVA", "3–6 × měsíční výdaje"] },
      { say: "Bez rezervy se z každé nečekané platby stane půjčka. A půjčka na opravu stojí víc než oprava sama." },
    ],
    quiz: [
      {
        q: "K čemu slouží finanční rezerva?",
        options: ["Na nečekané výdaje a výpadek příjmu", "Na dovolenou a nákupy ve slevách", "Na splácení půjček předem"],
        correct: 0,
        explain: "Rezerva je pojistka proti nečekaným výdajům, aby se z nich nestala půjčka.",
      },
      {
        q: "Kolik se běžně doporučuje mít v rezervě?",
        options: ["Jednu výplatu", "Tři až šest měsíčních výdajů", "Celý roční příjem"],
        correct: 1,
        explain: "Orientačně tři až šest měsíčních výdajů – podle jistoty příjmu a počtu lidí v domácnosti.",
      },
    ],
  },
  {
    id: "rpsn",
    title: "Úrok, RPSN a kolik doopravdy zaplatíte",
    teacher: "gros",
    steps: [
      { say: "Reklama vám ukáže úrok. Zákon chce, abyste viděli RPSN.", board: ["ÚROK ≠ RPSN"] },
      { say: "Zápůjční úroková sazba je jen cena za samotné půjčené peníze.", board: ["úrok = cena peněz"], cite: { law: "zsu", par: "3", odst: 2, pism: "f" } },
      { say: "RPSN zahrnuje všechny náklady: úroky, poplatky, provize i povinné pojištění. Vyjadřuje je jako roční procento.", board: ["RPSN = všechny náklady", "jako % za rok"], cite: { law: "zsu", par: "3", odst: 2, pism: "b" } },
      { say: "Úvěr s nízkým úrokem a vysokými poplatky tak může mít RPSN mnohem vyšší než konkurence.", cite: { law: "zsu", par: "3", odst: 2, pism: "d" } },
      { say: "A nejpoctivější číslo ze všech? Celková částka, kterou zaplatíte. Půjčka plus všechny náklady.", board: ["CELKEM ZAPLATÍTE", "= půjčka + náklady"], cite: { law: "zsu", par: "3", odst: 2, pism: "c" } },
      { say: "Srovnávejte tedy dvě čísla: RPSN a celkovou částku. Měsíční splátka sama o sobě klame." },
    ],
    quiz: [
      {
        q: "Co obsahuje RPSN navíc oproti úrokové sazbě?",
        options: ["Nic, je to totéž", "Poplatky, provize a další náklady úvěru", "Jen inflaci"],
        correct: 1,
        explain: "RPSN zahrnuje celkové náklady úvěru – úroky i poplatky – vyjádřené jako roční procento.",
      },
      {
        q: "Podle čeho nejlépe srovnáte dvě půjčky?",
        options: ["Podle výše měsíční splátky", "Podle RPSN a celkové částky k zaplacení", "Podle délky splácení"],
        correct: 1,
        explain: "Nízká splátka často jen znamená delší splácení. Rozhoduje RPSN a celková částka.",
      },
    ],
  },
  {
    id: "uveruschopnost",
    title: "Úvěruschopnost: proč se banka ptá",
    teacher: "gros",
    steps: [
      { say: "Říká vám někdo „půjčíme bez otázek“? Pak porušuje zákon.", board: ["BEZ OTÁZEK = ČERVENÁ VLAJKA"] },
      { say: "Poskytovatel musí před uzavřením smlouvy důkladně posoudit, jestli úvěr zvládnete splácet.", board: ["posouzení", "úvěruschopnosti"], cite: { law: "zsu", par: "86", odst: 1 } },
      { say: "Porovná vaše příjmy a výdaje, majetek, dluhy a to, jak jste splácel{a} dosud.", board: ["příjmy − výdaje", "dluhy, historie"], cite: { law: "zsu", par: "86", odst: 2 } },
      { say: "K tomu slouží i databáze dlužníků. Proto se pozdní splátky jinde vrací jako bumerang." },
      { say: "Když poskytovatel úvěruschopnost neposoudí a stejně půjčí, je smlouva neplatná. Vracíte jen jistinu, a to v době přiměřené vašim možnostem.", board: ["NEPLATNÁ SMLOUVA", "vracíte jen jistinu"], cite: { law: "zsu", par: "87", odst: 1 } },
      { say: "Pravdivé údaje v žádosti jsou tedy ochrana i pro vás. Úvěr, který neutáhnete, nepotřebujete." },
    ],
    quiz: [
      {
        q: "Co musí poskytovatel udělat před poskytnutím spotřebitelského úvěru?",
        options: ["Nic, stačí podpis", "Důkladně posoudit úvěruschopnost", "Ověřit jen totožnost"],
        correct: 1,
        explain: "Zákon ukládá důkladné posouzení schopnosti splácet (§ 86 zákona o spotřebitelském úvěru).",
      },
      {
        q: "Co hrozí poskytovateli, který půjčí přes důvodné pochybnosti o splácení?",
        options: ["Smlouva je neplatná a vrací se jen jistina", "Nic, riziko nese dlužník", "Jen pokuta, smlouva platí"],
        correct: 0,
        explain: "Smlouva je neplatná a spotřebitel vrací jistinu v době přiměřené svým možnostem.",
      },
    ],
  },
  {
    id: "urok-z-uroku",
    title: "Úrok z úroku a tichý zloděj inflace",
    teacher: "vynosova",
    steps: [
      { say: "Dobrý den. Já vás naučím, jak peníze rostou – a jak potichu mizí.", board: ["Přednáška 4", "ČAS × PENÍZE"] },
      { say: "Složené úročení znamená, že úroky se připisují a příště se úročí i ony.", board: ["10 000 Kč × 1,05¹⁰", "≈ 16 289 Kč"] },
      { say: "Rychlý odhad: číslo 72 vydělte úrokem v procentech. Vyjde, za kolik let se peníze zhruba zdvojnásobí.", board: ["PRAVIDLO 72", "72 / 6 % ≈ 12 let"] },
      { say: "Pozor, funguje to i obráceně. Dluh s vysokým úrokem roste stejně rychle – jen proti vám." },
      { say: "Inflace je růst cen. Peníze na účtu bez úroku pak každý rok koupí méně.", board: ["inflace 3 % ročně", "100 000 Kč za 10 let", "≈ 74 400 Kč dnešních"] },
      { say: "Proto dlouhodobé úspory nenechávejte jen ležet. Krátkodobou rezervu ano, tu potřebujete mít hned po ruce." },
    ],
    quiz: [
      {
        q: "Úrok 6 % ročně. Za kolik let se peníze zhruba zdvojnásobí?",
        options: ["Asi za 6 let", "Asi za 12 let", "Asi za 72 let"],
        correct: 1,
        explain: "Pravidlo 72: 72 / 6 = 12 let. Je to jen odhad, ale velmi užitečný.",
      },
      {
        q: "Co dělá inflace s penězi, které leží bez úroku?",
        options: ["Nic, částka zůstává stejná", "Snižuje, kolik za ně koupíte", "Zvyšuje jejich hodnotu"],
        correct: 1,
        explain: "Číslo na účtu se nemění, ale ceny rostou – kupní síla peněz klesá.",
      },
    ],
  },
  {
    id: "pojisteni-vkladu",
    title: "Jsou peníze v bance v bezpečí?",
    teacher: "gros",
    steps: [
      { say: "Co se stane s vašimi penězi, když banka zkrachuje? Dobrá zpráva: vklady jsou pojištěné.", board: ["POJIŠTĚNÍ VKLADŮ"] },
      { say: "Náhrada se vyplácí až do výše odpovídající 100 000 eurům na jednoho člověka u jedné banky.", board: ["max. 100 000 EUR", "na osobu a banku"], cite: { law: "zob", par: "41e", odst: 2 } },
      { say: "Limit platí pro banku, ne pro účet. Tři účty u jedné banky se sčítají.", cite: { law: "zob", par: "41e", odst: 1 } },
      { say: "Kdo má víc, může peníze rozdělit mezi různé banky." },
      { say: "Investice u obchodníka s cennými papíry chrání jiný fond a slabší: 90 % majetku, nejvýš 20 000 eur.", board: ["Garanční fond", "90 %, max. 20 000 EUR"], cite: { law: "zpkt", par: "130", odst: 9 } },
      { say: "A pozor: žádný fond vám nenahradí ztrátu z toho, že investice klesla. Chrání jen před krachem zprostředkovatele." },
    ],
    quiz: [
      {
        q: "Do jaké výše jsou pojištěné vklady jednoho člověka u jedné banky?",
        options: ["Do 100 000 Kč", "Do částky odpovídající 100 000 EUR", "Bez omezení"],
        correct: 1,
        explain: "Limit náhrady odpovídá 100 000 EUR na oprávněnou osobu u jedné banky (§ 41e zákona o bankách).",
      },
      {
        q: "Nahradí Garanční fond ztrátu, když akcie spadnou?",
        options: ["Ano, do 20 000 EUR", "Ne, chrání jen před selháním obchodníka", "Ano, celou ztrátu"],
        correct: 1,
        explain: "Fond platí, jen když obchodník nemůže vydat majetek kvůli své finanční situaci – ne za pokles trhu.",
      },
    ],
  },
  {
    id: "investice",
    title: "Riziko, výnos a vejce v košíku",
    teacher: "vynosova",
    steps: [
      { say: "Zapamatujte si jednu větu: vyšší výnos znamená vyšší riziko. Vždy.", board: ["VÝNOS ↑ = RIZIKO ↑"] },
      { say: "Kdo slibuje vysoký výnos „garantovaně“, buď lže, nebo neví, co prodává.", board: ["15 % GARANTOVANĚ", "= podvod"] },
      { say: "Diverzifikace znamená nedávat všechna vejce do jednoho košíku. Rozložte peníze mezi mnoho firem, oborů a zemí.", board: ["1 firma → velké riziko", "1 000 firem → menší"] },
      { say: "Pomáhá i čas. Na krátkou dobu jsou akcie jako horská dráha, na desítky let se výkyvy vyrovnávají." },
      { say: "Peníze, které budete potřebovat do pár let, do akcií nepatří.", board: ["krátce: rezerva", "dlouho: investice"] },
      { say: "A hlídejte poplatky. Dvě procenta ročně vypadají nevinně, ale za třicet let spolknou velký kus výnosu." },
    ],
    quiz: [
      {
        q: "Co znamená diverzifikace?",
        options: ["Vsadit vše na nejlepší akcii", "Rozložit peníze mezi mnoho různých investic", "Často nakupovat a prodávat"],
        correct: 1,
        explain: "Rozložení snižuje dopad toho, když se jedné investici nedaří.",
      },
      {
        q: "Nabídka „15 % ročně garantovaně“. Co to nejspíš je?",
        options: ["Výhodná příležitost", "Varovný signál podvodu", "Běžný spořicí účet"],
        correct: 1,
        explain: "Vysoký výnos bez rizika neexistuje. Garance vysokého výnosu je typický znak podvodu.",
      },
    ],
  },
  {
    id: "penze",
    title: "Penzijní spoření a peníze od státu",
    teacher: "vynosova",
    steps: [
      { say: "Stát vám přidá peníze, když si spoříte na stáří. Ukážu vám kolik.", board: ["DOPLŇKOVÉ PENZIJNÍ", "SPOŘENÍ"] },
      { say: "Státní příspěvek dostanete, když měsíčně pošlete aspoň 500 korun.", board: ["min. 500 Kč/měs."], cite: { law: "zdps", par: "14", odst: 1 } },
      { say: "Od 500 do 1 699 korun je příspěvek 20 % z vaší částky. Od 1 700 korun je to pevných 340 korun měsíčně.", board: ["500–1 699 Kč → 20 %", "1 700 Kč+ → 340 Kč"], cite: { law: "zdps", par: "14", odst: 2 } },
      { say: "Co pošlete nad 1 700 korun měsíčně, si můžete odečíst od základu daně.", cite: { law: "zdp", par: "15", odst: 7 } },
      { say: "Všechny produkty spoření na stáří dohromady nejvýš 48 000 korun za rok.", board: ["odpočet max.", "48 000 Kč ročně"], cite: { law: "zdp", par: "15", odst: 6 } },
      { say: "Sem patří i dlouhodobý investiční produkt nebo soukromé životní pojištění.", cite: { law: "zdp", par: "15a", odst: 1 } },
      { say: "Pozor na předčasný výběr. Pak se daňová úleva vrací." },
    ],
    quiz: [
      {
        q: "Kolik je nejvyšší měsíční státní příspěvek na doplňkové penzijní spoření?",
        options: ["170 Kč", "340 Kč", "1 700 Kč"],
        correct: 1,
        explain: "Při příspěvku 1 700 Kč a více měsíčně stát přidá 340 Kč (§ 14 zákona o doplňkovém penzijním spoření).",
      },
      {
        q: "Kolik lze ročně nejvýš odečíst od základu daně za produkty spoření na stáří?",
        options: ["24 000 Kč", "48 000 Kč", "Bez limitu"],
        correct: 1,
        explain: "Úhrnem nejvýše 48 000 Kč za rok (§ 15 odst. 6 zákona o daních z příjmů).",
      },
    ],
  },
  {
    id: "dan-z-prijmu",
    title: "Hrubá, čistá a co si bere stát",
    teacher: "gros",
    steps: [
      { say: "Na výplatní pásce jsou dvě čísla. Hrubá mzda je to, na čem jste se dohodl{a}. Čistá je to, co přijde na účet.", board: ["HRUBÁ − pojistné − daň", "= ČISTÁ"] },
      { say: "Daň z příjmů je 15 %. Jen z části příjmů nad 36násobek průměrné mzdy je 23 %.", board: ["15 %", "23 % nad 36× prům. mzdy"], cite: { law: "zdp", par: "16", odst: 1 } },
      { say: "Spočítaná daň se pak snižuje o slevy. Základní sleva na poplatníka je 30 840 korun ročně.", board: ["sleva na poplatníka", "30 840 Kč / rok"], cite: { law: "zdp", par: "35ba", odst: 1, pism: "a" } },
      { say: "Proto se vyplatí podepsat u zaměstnavatele prohlášení k dani. Jinak se sleva neuplatní každý měsíc." },
      { say: "Kdo má víc příjmů nebo nárok na odpočty, podává daňové přiznání. Občas tím získá peníze zpátky." },
    ],
    quiz: [
      {
        q: "Jaká je základní sazba daně z příjmů fyzických osob?",
        options: ["10 %", "15 %", "23 % ze všeho"],
        correct: 1,
        explain: "15 %, a 23 % jen z části základu daně nad 36násobek průměrné mzdy.",
      },
      {
        q: "O kolik se ročně snižuje daň díky základní slevě na poplatníka?",
        options: ["30 840 Kč", "3 084 Kč", "48 000 Kč"],
        correct: 0,
        explain: "Základní sleva na poplatníka je 30 840 Kč za rok (§ 35ba zákona o daních z příjmů).",
      },
    ],
  },
];

export const LECTURE_BY_ID = new Map(LECTURES.map((l) => [l.id, l]));
