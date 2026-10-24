import type { Citation } from "@/lib/types";
import type { World } from "./city";

/**
 * Školy ve všech světech (Střední škola finanční, Vysoká škola daní, Univerzita investic): krátké přednášky.
 * Každá vyřešená nástraha otevře další přednášku. Částky v příkladech jsou ilustrativní.
 * Paragrafy a čísla ze zákonů jsou ověřené proti znění na zakonyprolidi.cz.
 */
export type TeacherId = "gros" | "vynosova" | "odvodova";

export const TEACHERS: Record<TeacherId, { name: string; title: string }> = {
  gros: { name: "Mgr. Antonín Groš", title: "Střední škola finanční" },
  odvodova: { name: "prof. Ing. Marta Odvodová", title: "Vysoká škola daní" },
  vynosova: { name: "doc. Ing. Klára Výnosová", title: "Univerzita investic" },
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
  /** Škola, ve které se přednáší (město, ostrov, planeta). */
  world: World;
  title: string;
  teacher: TeacherId;
  steps: LectureStep[];
  quiz: { q: string; options: string[]; correct: number; explain: string }[];
};

export const LECTURES: Lecture[] = [
  {
    id: "rozpocet",
    world: "mesto",
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
    world: "mesto",
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
    world: "mesto",
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
    world: "planeta",
    title: "Úrok z úroku a tichý zloděj inflace",
    teacher: "vynosova",
    steps: [
      { say: "Vítejte na Univerzitě investic. Naučím vás, jak peníze rostou – a jak potichu mizí.", board: ["Přednáška 1", "ČAS × PENÍZE"] },
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
    world: "planeta",
    title: "Jsou peníze v bance v bezpečí?",
    teacher: "vynosova",
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
    world: "planeta",
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
    world: "ostrov",
    title: "Penzijní spoření a peníze od státu",
    teacher: "odvodova",
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
    world: "ostrov",
    title: "Hrubá, čistá a co si bere stát",
    teacher: "odvodova",
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
  // --- Střední škola finanční (Město dluhů)
  {
    id: "promlceni",
    world: "mesto",
    title: "Promlčení: kdy dluh „vyprší“",
    teacher: "gros",
    steps: [
      { say: "Většina dluhů se promlčí za tři roky. Potom je věřitel u soudu nevymůže – pokud se bráníte.", board: ["PROMLČENÍ", "zpravidla 3 roky"], cite: { law: "oz", par: "629", odst: 1 } },
      { say: "Soud ale k promlčení nepřihlíží sám. Musíte ho výslovně namítnout.", board: ["NÁMITKA", "jen když ji vznesete"], cite: { law: "oz", par: "610", odst: 1 } },
      { say: "Kdo dluh písemně uzná, spustí novou lhůtu – deset let.", board: ["UZNÁNÍ DLUHU", "= 10 let navíc"], cite: { law: "oz", par: "639" } },
      { say: "Co přizná soud rozsudkem, promlčí se taky až za deset let.", cite: { law: "oz", par: "640" } },
      { say: "Promlčený dluh nezaniká. Kdo ho zaplatí, nemůže chtít peníze zpátky.", cite: { law: "oz", par: "609" } },
    ],
    quiz: [
      { q: "Kdo musí promlčení u soudu namítnout?", options: ["Soud sám", "Dlužník", "Věřitel"], correct: 1, explain: "K promlčení soud přihlédne, jen když ho dlužník namítne." },
      { q: "Co způsobí písemné uznání dluhu?", options: ["Dluh zanikne", "Začne běžet nová desetiletá lhůta", "Nic"], correct: 1, explain: "Uznaný dluh se promlčí za deset let od uznání." },
    ],
  },
  {
    id: "exekuce-zaklady",
    world: "mesto",
    title: "Exekuce: co vám zůstane",
    teacher: "gros",
    steps: [
      { say: "Exekuce začíná vyrozuměním. Kdo do 30 dnů zaplatí dluh i zálohu, skončí s nižšími náklady.", board: ["30 DNÍ", "levnější konec"], cite: { law: "er", par: "46", odst: 6 } },
      { say: "Ze mzdy vám vždy musí zůstat nezabavitelná částka.", board: ["NEZABAVITELNÁ", "ČÁSTKA"], cite: { law: "nv595", par: "1", odst: 1 } },
      { say: "Ze zbytku jde na běžné dluhy jen třetina.", board: ["1/3 běžné dluhy", "2/3 výživné a daně"], cite: { law: "osr", par: "279", odst: 1 } },
      { say: "Na výživné, daně a pojistné se sráží až dvě třetiny.", cite: { law: "osr", par: "279", odst: 2 } },
      { say: "Z obstaveného účtu můžete vybrat chráněnou částku – trojnásobek životního minima.", cite: { law: "osr", par: "304b", odst: 1 } },
    ],
    quiz: [
      { q: "Kolik ze zbytku mzdy jde na běžné dluhy?", options: ["Třetina", "Polovina", "Všechno"], correct: 0, explain: "Na běžné pohledávky se sráží jedna třetina zbytku mzdy." },
      { q: "Co lze vybrat z obstaveného účtu?", options: ["Nic", "Chráněnou částku", "Celý zůstatek"], correct: 1, explain: "Chráněná částka je trojnásobek životního minima jednotlivce." },
    ],
  },
  {
    id: "nakup-mimo-obchod",
    world: "mesto",
    title: "Nákup na dálku a u dveří",
    teacher: "gros",
    steps: [
      { say: "Od smlouvy uzavřené na dálku nebo mimo obchod můžete do 14 dnů odstoupit bez udání důvodu.", board: ["14 DNÍ", "bez udání důvodu"], cite: { law: "oz", par: "1829", odst: 1 } },
      { say: "U zboží z e-shopu běží lhůta až od převzetí zásilky.", cite: { law: "oz", par: "1829", odst: 2 } },
      { say: "Prodejní zájezd s obědem zdarma je taky smlouva mimo obchodní prostory.", board: ["OBĚD ZDARMA", "= mimo obchod"], cite: { law: "oz", par: "1828", odst: 2 } },
      { say: "Na předváděcí akci nesmí prodejce vzít žádné peníze ani zálohu.", cite: { law: "zos", par: "20b", odst: 1 } },
    ],
    quiz: [
      { q: "Od kdy běží 14 dnů u zboží z e-shopu?", options: ["Od objednávky", "Od převzetí", "Od zaplacení"], correct: 1, explain: "U koupě zboží běží lhůta k odstoupení od převzetí." },
      { q: "Smí prodejce na předváděcí akci vybrat zálohu?", options: ["Ano", "Ne", "Jen do 1 000 Kč"], correct: 1, explain: "Na akci ani 7 dní po ní nesmí přijmout žádnou platbu." },
    ],
  },
  {
    id: "reklamace-zaklady",
    world: "mesto",
    title: "Reklamace bez stresu",
    teacher: "gros",
    steps: [
      { say: "Když se vada objeví do roka od převzetí, má se za to, že tu byla už při koupi.", board: ["1 ROK", "dokazuje prodejce"], cite: { law: "oz", par: "2161", odst: 5 } },
      { say: "Prodejce musí reklamaci vyřídit do 30 dnů.", board: ["30 DNÍ"], cite: { law: "zos", par: "19", odst: 3 } },
      { say: "Když to nestihne, můžete odstoupit od smlouvy, nebo chtít přiměřenou slevu.", cite: { law: "zos", par: "19", odst: 4 } },
      { say: "Schovejte si doklad o koupi i potvrzení o reklamaci." },
    ],
    quiz: [
      { q: "Do kdy musí být reklamace vyřízená?", options: ["7 dní", "30 dní", "60 dní"], correct: 1, explain: "Reklamace se musí vyřídit nejpozději do 30 dnů." },
      { q: "Vada se objevila po 8 měsících. Kdo musí dokazovat, odkud je?", options: ["Kupující", "Prodejce", "Nikdo"], correct: 1, explain: "U vady do roka se má za to, že byla už při převzetí." },
    ],
  },

  // --- Vysoká škola daní (Daňový ráj)
  {
    id: "osvc-odvody",
    world: "ostrov",
    title: "OSVČ: paušály a pojistné",
    teacher: "odvodova",
    steps: [
      { say: "Výdaje můžete dokládat, nebo uplatnit paušál procentem z příjmů.", board: ["80 % řemesla", "60 % živnosti", "40 % / 30 %"], cite: { law: "zdp", par: "7", odst: 7 } },
      { say: "Sociální pojištění se počítá z 55 % zisku, sazba je 29,2 %.", board: ["SOCIÁLNÍ", "55 % × 29,2 %"], cite: { law: "zpsz", par: "5b", odst: 1 } },
      { say: "Zdravotní pojištění z 50 % zisku, sazba je 13,5 %.", board: ["ZDRAVOTNÍ", "50 % × 13,5 %"], cite: { law: "zpvzp", par: "3a", odst: 1 } },
      { say: "Pojistné se platí aspoň z minima. Začínající OSVČ mají tři roky nižší minimum.", cite: { law: "zpsz", par: "14", odst: 5 } },
    ],
    quiz: [
      { q: "Jaký výdajový paušál má půjčovna (živnost, ne řemeslo)?", options: ["80 %", "60 %", "40 %"], correct: 1, explain: "Příjmy ze živnosti kromě řemeslné mají paušál 60 %." },
      { q: "Z jaké části zisku se počítá sociální pojištění OSVČ?", options: ["50 %", "55 %", "100 %"], correct: 1, explain: "Od roku 2024 je vyměřovacím základem nejméně 55 % daňového základu." },
    ],
  },
  {
    id: "dph-zaklady",
    world: "ostrov",
    title: "DPH v kostce",
    teacher: "odvodova",
    steps: [
      { say: "Plátcem DPH se stanete, když vám obrat za rok přeleze 2 miliony korun.", board: ["OBRAT > 2 000 000 Kč", "→ plátce od 1. 1."], cite: { law: "zdph", par: "6", odst: 1 } },
      { say: "Nad 2 536 500 Kč jste plátcem hned následující den.", cite: { law: "zdph", par: "6", odst: 2, pism: "b" } },
      { say: "Přihlášku k registraci podáte do 10 pracovních dnů.", board: ["REGISTRACE", "do 10 prac. dnů"], cite: { law: "zdph", par: "94", odst: 1 } },
      { say: "Sazby jsou dvě: základní 21 % a snížená 12 %.", board: ["21 % základní", "12 % snížená"], cite: { law: "zdph", par: "47", odst: 1 } },
      { say: "DPH z nákupů pro podnikání si plátce odečte.", cite: { law: "zdph", par: "72", odst: 1 } },
    ],
    quiz: [
      { q: "Obrat přesáhl 2 miliony v září. Od kdy je podnikatel plátcem?", options: ["Hned", "Od 1. ledna dalšího roku", "Nikdy"], correct: 1, explain: "Mezi 2 000 000 a 2 536 500 Kč je plátcem od začátku dalšího roku." },
      { q: "Jaká je základní sazba DPH?", options: ["12 %", "15 %", "21 %"], correct: 2, explain: "Základní sazba je 21 %, snížená 12 %." },
    ],
  },
  {
    id: "lhuty-sankce",
    world: "ostrov",
    title: "Lhůty a sankce",
    teacher: "odvodova",
    steps: [
      { say: "Přiznání podáte na papíře do 3 měsíců po konci roku, elektronicky do 4, s daňovým poradcem do 6.", board: ["papír 3 měsíce", "elektronicky 4", "s poradcem 6"], cite: { law: "dr", par: "136", odst: 2 } },
      { say: "Za pozdní přiznání je pokuta 0,05 % daně za den, nejvýš 5 % – a až po 5 pracovních dnech zpoždění.", cite: { law: "dr", par: "250", odst: 1 } },
      { say: "Pokuta pod 1 000 Kč se vůbec nepředepíše.", cite: { law: "dr", par: "250", odst: 3 } },
      { say: "Když daň doměří úřad, platí se penále 20 %.", board: ["PENÁLE 20 %"], cite: { law: "dr", par: "251", odst: 1 } },
      { say: "Když chybu opravíte sami dodatečným přiznáním, penále nezaplatíte.", cite: { law: "dr", par: "251", odst: 4 } },
    ],
    quiz: [
      { q: "Do kdy podáte přiznání elektronicky?", options: ["Do 3 měsíců po konci roku", "Do 4 měsíců", "Do 6 měsíců"], correct: 1, explain: "Elektronicky máte o měsíc víc než na papíře." },
      { q: "Kolik je penále, když daň doměří úřad?", options: ["5 %", "20 %", "50 %"], correct: 1, explain: "Při zvýšení daně je penále 20 % z doměřené částky." },
    ],
  },
  {
    id: "sro-dividendy",
    world: "ostrov",
    title: "S.r.o. a dividendy",
    teacher: "odvodova",
    steps: [
      { say: "S.r.o. založíte s vkladem už od 1 koruny.", board: ["VKLAD", "od 1 Kč"], cite: { law: "zok", par: "142", odst: 1 } },
      { say: "Jediný zakladatel podepisuje zakladatelskou listinu jako veřejnou listinu – u notáře.", cite: { law: "zok", par: "8", odst: 2 } },
      { say: "Společník ručí za dluhy firmy jen do výše nesplaceného vkladu.", cite: { law: "zok", par: "132", odst: 1 } },
      { say: "Firma platí ze zisku daň 21 %.", board: ["21 % firma", "15 % dividenda"], cite: { law: "zdp", par: "21", odst: 1 } },
      { say: "Z vyplaceného podílu na zisku se ještě sráží 15 %.", cite: { law: "zdp", par: "36", odst: 2, pism: "b" } },
    ],
    quiz: [
      { q: "Jaký je minimální vklad do s.r.o.?", options: ["1 Kč", "20 000 Kč", "200 000 Kč"], correct: 0, explain: "Minimální výše vkladu je 1 Kč." },
      { q: "Kolik se sráží z podílu na zisku ze s.r.o.?", options: ["15 %", "21 %", "Nic"], correct: 0, explain: "Z podílu na zisku se sráží zvláštní sazba daně 15 %." },
    ],
  },

  // --- Univerzita investic (Planeta investic)
  {
    id: "dane-investic",
    world: "planeta",
    title: "Daně z investic",
    teacher: "vynosova",
    steps: [
      { say: "Cenné papíry držené déle než 3 roky prodáte bez daně.", board: ["ČASOVÝ TEST", "3 roky"], cite: { law: "zdp", par: "4", odst: 1, pism: "u" } },
      { say: "Když za rok prodáte nejvýš za 100 000 Kč, daň neplatíte ani dřív.", board: ["LIMIT", "100 000 Kč / rok"], cite: { law: "zdp", par: "4", odst: 1, pism: "t" } },
      { say: "U kryptoaktiv to funguje podobně: 3 roky držby, nebo prodeje do 100 000 Kč za rok.", cite: { law: "zdp", par: "4", odst: 1, pism: "zk" } },
      { say: "Z dividend z akcií se sráží 15 %.", cite: { law: "zdp", par: "36", odst: 2, pism: "a" } },
    ],
    quiz: [
      { q: "Akcie držené 4 roky prodáte za 500 000 Kč. Daň?", options: ["Žádná", "15 %", "21 %"], correct: 0, explain: "Po 3 letech držby je prodej cenného papíru osvobozený." },
      { q: "Do jaké částky ročně jsou prodeje cenných papírů osvobozené?", options: ["50 000 Kč", "100 000 Kč", "1 000 000 Kč"], correct: 1, explain: "Úhrn příjmů z prodeje do 100 000 Kč za rok je osvobozený." },
    ],
  },
  {
    id: "dip-a-stari",
    world: "planeta",
    title: "DIP a spoření na stáří",
    teacher: "vynosova",
    steps: [
      { say: "Dlouhodobý investiční produkt je investiční účet na stáří s daňovou výhodou.", board: ["DIP"], cite: { law: "zpkt", par: "134g", odst: 1 } },
      { say: "Příspěvky si odečtete od základu daně – se všemi produkty na stáří nejvýš 48 000 Kč ročně.", board: ["ODPOČET", "max. 48 000 Kč / rok"], cite: { law: "zdp", par: "15", odst: 6 } },
      { say: "Vybírat můžete po 10 letech a nejdřív v roce, kdy vám bude 60.", board: ["10 let", "a 60 let věku"], cite: { law: "zdp", par: "15b", odst: 1 } },
      { say: "Kdo vybere dřív, vrací daňovou podporu.", cite: { law: "zdp", par: "15b", odst: 4 } },
    ],
    quiz: [
      { q: "Kolik lze ročně odečíst za produkty spoření na stáří?", options: ["24 000 Kč", "48 000 Kč", "100 000 Kč"], correct: 1, explain: "Úhrnem nejvýše 48 000 Kč za rok." },
      { q: "Kdy můžete z DIP vybrat bez ztráty výhody?", options: ["Po roce", "Po 10 letech a nejdřív v 60", "Kdykoli"], correct: 1, explain: "Po 120 měsících, nejdříve v roce, kdy je vám 60 let." },
    ],
  },
  {
    id: "nenaletet",
    world: "planeta",
    title: "Jak nenaletět",
    teacher: "vynosova",
    steps: [
      { say: "Investice smí nabízet jen ten, kdo má povolení České národní banky. Seznam je veřejný.", board: ["LICENCE ČNB?"], cite: { law: "zpkt", par: "5", odst: 1 } },
      { say: "Poctivý obchodník se ptá na vaše znalosti, finance a toleranci k riziku.", cite: { law: "zpkt", par: "15h", odst: 1 } },
      { say: "Garantovaný vysoký výnos a bonus za přivedené kamarády jsou znaky pyramidy.", board: ["GARANCE + NÁBOR", "= PYRAMIDA"] },
      { say: "Když licencovaný obchodník zkrachuje, pomůže Garanční fond: 90 %, nejvýš 20 000 EUR.", cite: { law: "zpkt", par: "130", odst: 9 } },
    ],
    quiz: [
      { q: "Kde ověříte, že firma smí nabízet investice?", options: ["V seznamu ČNB", "Na Instagramu", "V recenzích"], correct: 0, explain: "Povolení uděluje ČNB a seznam regulovaných subjektů je veřejný." },
      { q: "Nahradí Garanční fond ztrátu z poklesu akcií?", options: ["Ano, celou", "Ne – jen při krachu licencovaného obchodníka", "Ano, polovinu"], correct: 1, explain: "Fond kryje selhání obchodníka, ne tržní riziko." },
    ],
  },
];

export const LECTURE_BY_ID = new Map(LECTURES.map((l) => [l.id, l]));

/** Pořadí přednášek v jednotlivých školách. */
const ORDER: Record<World, string[]> = {
  mesto: ["rozpocet", "rpsn", "uveruschopnost", "promlceni", "exekuce-zaklady", "nakup-mimo-obchod", "reklamace-zaklady"],
  ostrov: ["dan-z-prijmu", "osvc-odvody", "penze", "dph-zaklady", "lhuty-sankce", "sro-dividendy"],
  planeta: ["urok-z-uroku", "investice", "pojisteni-vkladu", "dane-investic", "dip-a-stari", "nenaletet"],
};

/** Rozvrh školy ve světě: Střední škola finanční, Vysoká škola daní, nebo Univerzita investic. */
export function lecturesFor(w: World): Lecture[] {
  return ORDER[w].map((id) => LECTURE_BY_ID.get(id)!);
}
