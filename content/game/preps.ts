import type { Citation } from "@/lib/types";
import { ISLAND_PREPS, ISLAND_PREP_FOR_CASE } from "./island-preps";
import { PLANET_PREPS, PLANET_PREP_FOR_CASE } from "./planet-preps";

/** Příprava před nástrahou: pojmy, proces, podobné situace, laické vysvětlení a čísla z Česka. */
export type Stat = {
  value: string;
  label: string;
  source: { name: string; url: string; date: string };
};

export type Prep = {
  id: string;
  title: string;
  /** Laické vysvětlení – „jak bych to řekl kamarádovi“. */
  plain: string;
  concepts: { term: string; explain: string; cite?: Citation }[];
  process?: { title: string; steps: string[] };
  examples: { title: string; text: string }[];
  stats: Stat[];
  check: { q: string; options: string[]; correct: number; explain: string };
};

const MAPA_ZADLUZENI = {
  name: "Mapa zadlužení (IPŘP, PAQ Research) přes Echo24",
  url: "https://www.echo24.cz/a/HZkUi/zpravy-domov-v-cesku-klesa-zadluzenost-exekuci-je-nejmene-za-posledni-roky",
  date: "20. 7. 2025",
};
const INSOLCENTRUM = {
  name: "InsolCentrum přes Advokátní deník",
  url: "https://advokatnidenik.cz/2026/01/09/v-roce-2025-vzrostl-pocet-insolvenci-ale-osob-vstupujicich-do-oddluzeni-je-malo/",
  date: "9. 1. 2026",
};
const ARBITR = {
  name: "Finanční arbitr – výroční zpráva 2025 (Právní prostor)",
  url: "https://pravniprostor.cz/aktuality/lide-se-loni-vice-obraceli-na-financniho-arbitra-resit-zacal-dvakrat-vic-sporu",
  date: "4. 5. 2026",
};
const CBA = {
  name: "Česká bankovní asociace (ČTK)",
  url: "https://www.ceskenoviny.cz/zpravy/pocet-kybernetickych-utoku-na-klienty-bank-v-cr-letos-stoupl-o-11-na-23000/2669184",
  date: "5. 5. 2025",
};

const BASE_PREPS: Prep[] = [
  {
    id: "uver",
    title: "Úvěr: co podepisujete",
    plain:
      "Úvěr není jen „půjčka peněz“, ale balík úroků a poplatků. Zákon spotřebitele chrání: poskytovatel musí ověřit, že úvěr zvládnete splácet, máte 14 dní na rozmyšlenou a směnka je zakázaná. Srovnávat se dá jen podle RPSN a celkové částky, kterou zaplatíte.",
    concepts: [
      { term: "Jistina", explain: "Částka, kterou si opravdu půjčíte. Všechno navíc jsou náklady úvěru." },
      { term: "RPSN", explain: "Roční procentní sazba nákladů – úroky i poplatky přepočtené na rok. Úrok 0 % neznamená RPSN 0 %.", cite: { law: "zsu", par: "3", odst: 2, pism: "b" } },
      { term: "Úvěruschopnost", explain: "Poskytovatel musí důkladně prověřit příjmy, výdaje a dluhy. Bez toho je smlouva neplatná.", cite: { law: "zsu", par: "86", odst: 1 } },
      { term: "Odstoupení", explain: "Do 14 dnů od podpisu bez udání důvodu a bez sankce (u úvěrů, které nejsou na bydlení).", cite: { law: "zsu", par: "118", odst: 1 } },
      { term: "Zákaz směnky", explain: "Spotřebitelský úvěr nejde zajistit ani splácet směnkou či šekem.", cite: { law: "zsu", par: "112", odst: 1 } },
    ],
    process: {
      title: "Než podepíšete",
      steps: [
        "Zjistěte celkovou částku, kterou zaplatíte, a RPSN.",
        "Porovnejte aspoň dvě nabídky podle RPSN, ne podle splátky.",
        "Ptá-li se poskytovatel jen na občanku, je to varovný signál.",
        "Po podpisu máte 14 dní – pokud najdete lepší nabídku, můžete odstoupit.",
      ],
    },
    examples: [
      { title: "„Bez navýšení“", text: "Lednička za 12 000 Kč na 10 splátek po 1 200 Kč je opravdu bez navýšení. Pokud by se k tomu platilo 49 Kč měsíčně za „vedení účtu“, už to bez navýšení není." },
      { title: "Půjčka na občanku", text: "Když nikdo nezjišťuje, jestli půjčku zvládnete, nese riziko poskytovatel: smlouva je neplatná a vracíte jen jistinu." },
    ],
    stats: [
      { value: "12 050", label: "nových sporů řešil finanční arbitr v roce 2025 – dvakrát víc než rok předtím; nejčastěji šlo o to, zda věřitel řádně posoudil úvěruschopnost", source: ARBITR },
    ],
    check: {
      q: "Úrok je 0 %, ale platíte poplatek za vedení úvěru. Jaká je RPSN?",
      options: ["0 %", "Vyšší než 0 %", "Nedá se určit"],
      correct: 1,
      explain: "RPSN zahrnuje všechny náklady úvěru včetně poplatků, proto je vyšší než nula.",
    },
  },
  {
    id: "nakup-na-dalku",
    title: "Nákup v e-shopu a odložené platby",
    plain:
      "Co koupíte přes internet, můžete do 14 dnů vrátit i bez důvodu – lhůta běží od převzetí balíku. Když nákup platíte „odloženou platbou“ nebo na splátky přes partnera e-shopu, je to úvěr. Vrácením zboží ale zaniká i on.",
    concepts: [
      { term: "Smlouva na dálku", explain: "Uzavřená bez osobního setkání – e-shop, telefon, e-mail.", cite: { law: "oz", par: "1829", odst: 1 } },
      { term: "14 dní od převzetí", explain: "U zboží začíná lhůta až dnem, kdy balík převezmete (u více zásilek posledním kusem).", cite: { law: "oz", par: "1829", odst: 2 } },
      { term: "Odložená platba", explain: "Zaplatíte později nebo na třetiny. Podle zákona jde o spotřebitelský úvěr.", cite: { law: "zsu", par: "2", odst: 1 } },
      { term: "Vázaný úvěr", explain: "Úvěr na konkrétní nákup. Vrácením zboží zaniká, bez sankcí.", cite: { law: "zsu", par: "119", odst: 1 } },
    ],
    examples: [
      { title: "Bunda z e-shopu", text: "Objednáno 1. 3., doručeno 6. 3. Na vrácení bez důvodu máte 14 dní od 6. 3., ne od objednávky." },
      { title: "Na třetiny", text: "Telefon na tři splátky přes partnera e-shopu: když ho do 14 dnů vrátíte, splátky padají spolu s nákupem." },
    ],
    stats: [
      { value: "55 %", label: "Čechů zná odložené platby; uživatelů služby Skip Pay přibylo mezi lety 2024 a 2025 zhruba 28 %", source: { name: "Seznam Zprávy (PayU, Skip Pay)", url: "https://www.seznamzpravy.cz/clanek/ekonomika-finance-osobni-susicka-na-trikrat-nebo-az-za-mesic-jak-cesi-vyuzivaji-odlozene-platby-303375", date: "10. 4. 2026" } },
    ],
    check: {
      q: "Balík jste objednali v pondělí a převzali v pátek. Odkdy běží 14 dní na vrácení?",
      options: ["Od pondělí", "Od pátku (převzetí)", "Od zaplacení"],
      correct: 1,
      explain: "U koupě zboží na dálku se lhůta počítá od převzetí.",
    },
  },
  {
    id: "tarify",
    title: "Tarify a smlouvy s operátory",
    plain:
      "Smlouvy s operátory mají přísná pravidla ve prospěch zákazníka: závazek může trvat nejvýš 24 měsíců a po prvních třech měsících se smlouva dá ukončit bez pokuty. Platit se může jen za dotovaný telefon, který si necháte.",
    concepts: [
      { term: "Doba určitá", explain: "Smlouva na pevně danou dobu. U spotřebitele nejvýše 24 měsíců.", cite: { law: "zek", par: "63b", odst: 1 } },
      { term: "Úhrada při výpovědi", explain: "Jen při ukončení do 3 měsíců od uzavření a nejvýše 1/20 zbývajících paušálů.", cite: { law: "zek", par: "63b", odst: 8 } },
      { term: "Dotované zařízení", explain: "Telefon za zvýhodněnou cenu. Při odchodu doplatíte nejvýš jeho poměrnou část.", cite: { law: "zek", par: "63b", odst: 7 } },
    ],
    examples: [
      { title: "Po roce u operátora", text: "Tarif na 24 měsíců, po 12 měsících odcházíte bez dotovaného telefonu: za předčasné ukončení se neplatí nic." },
      { title: "Hned po podpisu", text: "Po měsíci zjistíte, že tarif nevyhovuje. Zbývá 23 paušálů po 500 Kč – zaplatit můžete nejvýš 1/20, tedy 575 Kč." },
    ],
    stats: [],
    check: {
      q: "Jak dlouho smí nejvýš trvat smlouva s operátorem na dobu určitou?",
      options: ["12 měsíců", "24 měsíců", "36 měsíců"],
      correct: 1,
      explain: "Doba určitá u spotřebitele nesmí přesáhnout 24 měsíců.",
    },
  },
  {
    id: "prodleni",
    title: "Když se nestíhá splácet",
    plain:
      "Za zpoždění se platí – ale ne cokoli. U spotřebitelských úvěrů má smluvní pokuta strop, po 90 dnech prodlení smí věřitel účtovat jen zákonný úrok a spory se dají řešit zdarma u finančního arbitra.",
    concepts: [
      { term: "Prodlení", explain: "Stav, kdy nezaplatíte včas. Věřitel pak může chtít úrok z prodlení.", cite: { law: "oz", par: "1970" } },
      { term: "Smluvní pokuta", explain: "Nejvýš 0,1 % denně z dlužné částky; souhrn všech pokut nejvýš polovina úvěru (max. 200 000 Kč).", cite: { law: "zsu", par: "122", odst: 2 } },
      { term: "Po 90 dnech", explain: "Věřitel smí chtít jen úrok ve výši repo sazby ČNB + 8 p. b.", cite: { law: "zsu", par: "122", odst: 4 } },
      { term: "Finanční arbitr", explain: "Bezplatné řešení sporů s bankami, věřiteli a pojišťovnami (životní pojištění).", cite: { law: "zfa", par: "1", odst: 1 } },
    ],
    process: {
      title: "Když splátky nestíháte",
      steps: [
        "Ozvěte se věřiteli dřív, než splátku zmeškáte – často jde dohodnout odklad.",
        "Neberte novou půjčku na splacení staré.",
        "Zkontrolujte, co vám věřitel účtuje – pokuty i úroky mají zákonné stropy.",
        "Zajděte do bezplatné dluhové poradny.",
      ],
    },
    examples: [
      { title: "Pokuta za každý den", text: "Dlužíte 10 000 Kč. Pokuta 0,1 % denně dělá nejvýš 10 Kč za den, ne 100 Kč." },
    ],
    stats: [
      { value: "12 050", label: "nových řízení zahájil finanční arbitr v roce 2025 (v roce 2024: 5 683)", source: ARBITR },
    ],
    check: {
      q: "Jste se splátkou 4 měsíce pozadu. Smí věřitel dál účtovat smluvní úrok 35 % ročně?",
      options: ["Ano, je ve smlouvě", "Ne, jen repo sazbu ČNB + 8 p. b.", "Ne, žádný úrok"],
      correct: 1,
      explain: "Po 90 dnech prodlení zákon smluvní úrok nahrazuje úrokem ve výši repo sazby + 8 p. b.",
    },
  },
  {
    id: "promlceni",
    title: "Promlčení dluhů",
    plain:
      "Dluh se časem „unaví“: po třech letech bez žaloby ho soud nepřizná – ale jen když se dlužník ozve s námitkou promlčení. Pozor na podpis: písemné uznání dluhu spustí novou lhůtu na deset let. A po rozsudku má věřitel na vymáhání deset let.",
    concepts: [
      { term: "Promlčecí lhůta", explain: "Obecně 3 roky od doby, kdy šlo dluh poprvé vymáhat.", cite: { law: "oz", par: "629", odst: 1 } },
      { term: "Námitka promlčení", explain: "Soud k promlčení přihlédne, jen když ho dlužník sám namítne.", cite: { law: "oz", par: "610", odst: 1 } },
      { term: "Uznání dluhu", explain: "Písemné „ano, dlužím X Kč za Y“. Lhůta se prodlouží na 10 let.", cite: { law: "oz", par: "639" } },
      { term: "Rozsudek", explain: "Právo přiznané soudem se promlčuje za 10 let.", cite: { law: "oz", par: "640" } },
    ],
    process: {
      title: "Přišel starý dluh",
      steps: [
        "Zjistěte, kdy byl dluh splatný a jestli o něm rozhodl soud.",
        "Nic nepodepisujte – ani „potvrzení“ nebo splátkový kalendář.",
        "Přijde-li žaloba, vzneste v ní námitku promlčení.",
      ],
    },
    examples: [
      { title: "Faktura za mobil", text: "Nezaplaceno 2020, žádná žaloba. V roce 2026 je dluh promlčený – soud ho nepřizná, pokud to dlužník namítne." },
      { title: "Platební rozkaz", text: "Soud rozhodl v roce 2019. Exekuce v roce 2026 je včas – lhůta po rozsudku je 10 let." },
    ],
    stats: [],
    check: {
      q: "Soud dostane žalobu na promlčený dluh a dlužník mlčí. Co se stane?",
      options: ["Soud žalobu zamítne sám", "Soud může žalobě vyhovět", "Řízení se zastaví"],
      correct: 1,
      explain: "K promlčení soud přihlédne jen na námitku dlužníka.",
    },
  },
  {
    id: "exekuce",
    title: "Jak funguje exekuce",
    plain:
      "Exekuce je nucené vymáhání dluhu, o kterém už rozhodl soud (nebo jiný orgán). Vede ji soudní exekutor. Nejlevnější je zaplatit do 30 dnů od vyrozumění – pak se platí jen snížené náklady. Na účtu i ve výplatě vám zákon nechává část peněz.",
    concepts: [
      { term: "Exekuční titul", explain: "Rozsudek, platební rozkaz nebo jiné vykonatelné rozhodnutí, podle kterého se vymáhá." },
      { term: "Výzva ke splnění", explain: "Součást vyrozumění: zaplatíte-li do 30 dnů dluh i zálohu, exekuce skončí levně.", cite: { law: "er", par: "46", odst: 6 } },
      { term: "Návrh na zastavení", explain: "Obrana, když exekuce probíhat nemá (např. dluh je zaplacený). Do 15 dnů od zjištění důvodu.", cite: { law: "er", par: "55", odst: 1 } },
      { term: "Chráněná částka na účtu", explain: "Ze zablokovaného účtu lze jednou za řízení vybrat až trojnásobek životního minima.", cite: { law: "osr", par: "304b", odst: 1 } },
    ],
    process: {
      title: "Průběh exekuce",
      steps: [
        "Věřitel získá rozsudek nebo platební rozkaz.",
        "Podá exekuční návrh; exekutor zahájí exekuci.",
        "Přijde vyrozumění s výzvou ke splnění – 30 dnů na levnější konec.",
        "Pak exekutor provádí exekuci: srážky ze mzdy, účet, movité věci.",
        "Nevymůže-li se 6 let nic (a není postižena nemovitost), exekutor exekuci zpravidla zastaví.",
      ],
    },
    examples: [
      { title: "8 000 Kč za internet", text: "Zaplatíte dluh i zálohu do 30 dnů a exekuce skončí. Bez toho rostou náklady s každým úkonem exekutora." },
    ],
    stats: [
      { value: "606 000", label: "lidí bylo v exekuci na konci června 2025 (6,6 % lidí nad 15 let)", source: MAPA_ZADLUZENI },
      { value: "3,1 mil.", label: "exekučních řízení na ně připadalo; tři čtvrtiny lidí v exekuci mají aspoň dvě", source: MAPA_ZADLUZENI },
    ],
    check: {
      q: "Do kdy zaplatit, aby exekuce skončila se sníženými náklady?",
      options: ["Do 15 dnů od zahájení", "Do 30 dnů od doručení vyrozumění", "Kdykoli před dražbou"],
      correct: 1,
      explain: "Výzva ke splnění dává 30 dnů od doručení vyrozumění.",
    },
  },
  {
    id: "srazky",
    title: "Srážky ze mzdy a důchodu",
    plain:
      "Při exekuci vám zaměstnavatel (nebo plátce důchodu) posílá část příjmu exekutorovi. Vždy vám ale zůstane nezabavitelná částka – v roce 2026 zhruba 14 100 Kč plus čtvrtina na každé dítě. Z toho, co zbude, jde na běžné dluhy třetina, na výživné nebo daně až dvě třetiny.",
    concepts: [
      { term: "Čistá mzda", explain: "Mzda po odečtení daně a pojistného – z ní se srážky počítají.", cite: { law: "osr", par: "277", odst: 1 } },
      { term: "Nezabavitelná částka", explain: "Od 2026: 85 % součtu životního minima, normativního nájemného a energetického paušálu.", cite: { law: "nv595", par: "1", odst: 1 } },
      { term: "Třetiny", explain: "Ze zbytku se sráží 1/3, pro přednostní pohledávky 2/3.", cite: { law: "osr", par: "279", odst: 1 } },
      { term: "Přednostní pohledávky", explain: "Výživné, daně, pojistné, náhrada újmy na zdraví…", cite: { law: "osr", par: "279", odst: 2 } },
      { term: "Důchod", explain: "Srážky z důchodu se řídí stejnými pravidly.", cite: { law: "osr", par: "299", odst: 1, pism: "d" } },
    ],
    process: {
      title: "Výpočet krok za krokem",
      steps: [
        "Čistá mzda minus nezabavitelná částka = zbytek.",
        "Zbytek zaokrouhlit dolů na číslo dělitelné třemi.",
        "Běžný dluh: srazí se třetina. Přednostní: dvě třetiny.",
      ],
    },
    examples: [
      { title: "30 000 Kč, jedno dítě", text: "Nezabavitelná částka 17 627 Kč, zbytek 12 372 Kč → srážka 4 124 Kč, zůstane 25 876 Kč." },
    ],
    stats: [
      { value: "912 455 Kč", label: "byla v červnu 2025 průměrná vymáhaná částka na jednoho člověka v exekuci", source: MAPA_ZADLUZENI },
    ],
    check: {
      q: "Kolik ze zbytku mzdy se srazí pro běžný dluh u banky?",
      options: ["Třetina", "Polovina", "Dvě třetiny"],
      correct: 0,
      explain: "Pro běžné pohledávky třetina, pro přednostní dvě třetiny.",
    },
  },
  {
    id: "oddluzeni",
    title: "Oddlužení (osobní bankrot)",
    plain:
      "Kdo má víc dluhů, než kdy zvládne splatit, může požádat soud o oddlužení. Tři roky platí, kolik zvládne, a pak mu soud zbytek dluhů odpustí. Návrh zdarma sepíše akreditovaná poradna. Některé dluhy – třeba výživné – ale nezmizí.",
    concepts: [
      { term: "Úpadek", explain: "Víc věřitelů, dluhy přes 30 dnů po splatnosti a neschopnost je platit.", cite: { law: "iz", par: "3", odst: 1 } },
      { term: "Akreditovaná osoba", explain: "Nezisková poradna s povolením ministerstva; návrh sepíše často zdarma.", cite: { law: "iz", par: "390a", odst: 1 } },
      { term: "Splátkový kalendář", explain: "Měsíčně odevzdáváte tolik, kolik by šlo srazit pro přednostní pohledávky.", cite: { law: "iz", par: "398", odst: 3 } },
      { term: "Osvobození", explain: "Po 3 letech řádného plnění soud odpustí zbytek dluhů.", cite: { law: "iz", par: "412a", odst: 1 } },
    ],
    process: {
      title: "Cesta oddlužením",
      steps: [
        "Bezplatná dluhová poradna posoudí, jestli je oddlužení vhodné.",
        "Akreditovaná osoba sepíše a podá návrh.",
        "Po zahájení insolvenčního řízení už exekuce nelze provádět; soud rozhodne o úpadku a povolí oddlužení.",
        "Tři roky splátek a povinností (práce, hlášení změn, mimořádné příjmy).",
        "Osvobození od zbytku dluhů.",
      ],
    },
    examples: [
      { title: "Dluhová spirála", text: "Pět exekucí a příjem těsně nad nezabavitelnou částkou: oddlužení zastaví růst dluhů a dává jasný konec." },
    ],
    stats: [
      { value: "22 770", label: "lidem soudy v roce 2025 povolily oddlužení (meziročně +13 %)", source: INSOLCENTRUM },
      { value: "90 950", label: "lidí se aktuálně oddlužuje", source: INSOLCENTRUM },
    ],
    check: {
      q: "Jak dlouho trvá standardní oddlužení?",
      options: ["1 rok", "3 roky", "10 let"],
      correct: 1,
      explain: "Od 1. 10. 2024 trvá oddlužení zpravidla 3 roky.",
    },
  },
  {
    id: "vyzivne",
    title: "Výživné a náhradní výživné",
    plain:
      "Výživné na děti určuje soud a druhý rodič ho musí platit. Když neplatí, dá se vymáhat exekucí – a výživné má přednost před ostatními dluhy. Pokud ani exekuce nepomůže, přispěje dětem stát náhradním výživným, nejvýš 3 000 Kč měsíčně na dítě.",
    concepts: [
      { term: "Exekuce na výživné", explain: "Pro výživné na nezletilé dítě lze podat exekuční návrh.", cite: { law: "er", par: "37", odst: 4, pism: "a" } },
      { term: "Přednostní pohledávka", explain: "Výživné se sráží ze dvou třetin zbytku mzdy.", cite: { law: "osr", par: "279", odst: 2 } },
      { term: "Náhradní výživné", explain: "Dávka Úřadu práce, když výživné nechodí a probíhá exekuce.", cite: { law: "znv", par: "3" } },
      { term: "Výše a délka", explain: "Nejvýš 3 000 Kč měsíčně, nejvýš 72 výplat.", cite: { law: "znv", par: "14", odst: 3 } },
    ],
    process: {
      title: "Když výživné nechodí",
      steps: [
        "Mějte rozsudek o výživném (exekuční titul).",
        "Podejte exekuční návrh k soudnímu exekutorovi.",
        "Když výživné ani tak nechodí, požádejte Úřad práce o náhradní výživné.",
        "Stát pak dluh vymáhá po neplatiči sám.",
      ],
    },
    examples: [
      { title: "Částečné placení", text: "Rozsudek 3 000 Kč, otec posílá 1 000 Kč. Náhradní výživné může dorovnat zbylých 2 000 Kč." },
    ],
    stats: [
      { value: "1 805 Kč", label: "byla průměrná výše náhradního výživného v prvním roce (úřady vyplatily 107,8 mil. Kč)", source: { name: "MPSV (ČTK)", url: "https://www.ceskenoviny.cz/zpravy/mpsv-urady-prace-vyplatily-na-nahradnim-vyzivnem-za-prvni-rok-107-8-mil-kc/2227058", date: "1. 7. 2022" } },
    ],
    check: {
      q: "Co je podmínkou náhradního výživného?",
      options: ["Žádost do měsíce od rozvodu", "Probíhající exekuce na výživné", "Příjem pod životním minimem"],
      correct: 1,
      explain: "Nárok vzniká, pokud k vymožení výživného probíhá exekuce nebo soudní výkon rozhodnutí.",
    },
  },
  {
    id: "reklamace",
    title: "Reklamace",
    plain:
      "Na vady zboží máte dva roky. V prvním roce zákon předpokládá, že vada tu byla od začátku – dokazovat musí prodejce. Reklamace musí být vyřízená do 30 dnů; když není, můžete odstoupit od smlouvy nebo chtít slevu.",
    concepts: [
      { term: "Vada", explain: "Věc neodpovídá popisu, nemá obvyklé vlastnosti nebo nefunguje.", cite: { law: "oz", par: "2161", odst: 1 } },
      { term: "Dva roky", explain: "Vadu lze vytknout, projeví-li se do dvou let od převzetí.", cite: { law: "oz", par: "2165", odst: 1 } },
      { term: "Domněnka prvního roku", explain: "Vada do roka = vada už při převzetí, pokud prodejce neprokáže opak.", cite: { law: "oz", par: "2161", odst: 5 } },
      { term: "30 dnů", explain: "Lhůta pro vyřízení reklamace včetně opravy.", cite: { law: "zos", par: "19", odst: 3 } },
    ],
    examples: [
      { title: "Boty po 8 měsících", text: "Odlepila se podrážka. Prodejce musí dokázat, že jste je poškodili vy – ne vy, že ne." },
    ],
    stats: [],
    check: {
      q: "Vada se objeví po 14 měsících. Kdo dokazuje, že tam byla od začátku?",
      options: ["Prodejce", "Kupující", "Vždy znalec"],
      correct: 1,
      explain: "Domněnka platí jen v prvním roce. Po něm musí kupující doložit, že jde o vadu, za kterou prodejce odpovídá.",
    },
  },
  {
    id: "podomni",
    title: "Podomní prodej a předváděcí akce",
    plain:
      "Obchodníci u dveří a na „zájezdech s obědem zdarma“ spoléhají na tlak a spěch. Zákon proto dává 14 dní na odstoupení od smlouvy uzavřené mimo obchodní prostory a na předváděcích akcích zakazuje brát peníze i zálohy.",
    concepts: [
      { term: "Mimo obchodní prostory", explain: "U vás doma, na ulici nebo na prodejním výletu.", cite: { law: "oz", par: "1828", odst: 2 } },
      { term: "14 dní", explain: "Od takové smlouvy lze odstoupit bez udání důvodu.", cite: { law: "oz", par: "1829", odst: 1 } },
      { term: "Zákaz plateb na akci", explain: "Během akce ani 7 dní po smlouvě nesmí prodejce přijmout peníze ani zálohu.", cite: { law: "zos", par: "20b", odst: 1 } },
    ],
    process: {
      title: "Když zazvoní prodejce",
      steps: [
        "Nic nepodepisujte hned – vezměte si papíry domů.",
        "Nikdy nedávejte doklady energií ani plnou moc.",
        "Podepsali jste? Do 14 dnů písemně odstupte.",
      ],
    },
    examples: [
      { title: "Hrnce za 30 000 Kč", text: "Na akci chtějí „jen zálohu 3 000 Kč“. To je zakázané – a smlouvu stejně můžete do 14 dnů zrušit." },
    ],
    stats: [],
    check: {
      q: "Smí prodejce na předváděcí akci vybrat zálohu?",
      options: ["Ano, s dokladem", "Ne", "Jen do 1 000 Kč"],
      correct: 1,
      explain: "Platba ani záloha se během akce a 7 dní po smlouvě přijmout nesmí.",
    },
  },
  {
    id: "investice",
    title: "Investiční nabídky a podvody",
    plain:
      "Kdo slibuje „garantovaný“ vysoký výnos a spěchá, je skoro jistě podvodník. Legální obchodníci mají licenci ČNB. Ani u nich ale nikdo nekryje tržní ztráty – Garanční fond pomáhá jen tehdy, když licencovaná firma nevydá peníze klientů.",
    concepts: [
      { term: "Licence ČNB", explain: "Ověřte firmu v seznamu regulovaných subjektů na webu ČNB." },
      { term: "Garanční fond", explain: "90 % nevydaného majetku, nejvýš 20 000 EUR – jen u licencovaných obchodníků.", cite: { law: "zpkt", par: "130", odst: 9 } },
      { term: "Pojištění vkladů", explain: "Vklady v bance do 100 000 EUR na osobu a banku.", cite: { law: "zob", par: "41e", odst: 2 } },
    ],
    process: {
      title: "Než něco pošlete",
      steps: [
        "Zavěste a zavolejte zpět na oficiální číslo banky či firmy.",
        "Ověřte licenci v seznamu ČNB.",
        "Nikdy neposílejte peníze na „bezpečný účet“ a neinstalujte aplikace pro vzdálený přístup.",
      ],
    },
    examples: [
      { title: "Falešný bankéř", text: "Volá „bezpečnostní oddělení banky“: účet je prý ohrožen a máte peníze převést. Žádná banka to po klientech nechce." },
    ],
    stats: [
      { value: "23 000", label: "kybernetických útoků na klienty bank za 1. čtvrtletí 2025, škoda 365 mil. Kč; nejčastěji falešní bankéři a policisté a falešné investice", source: CBA },
    ],
    check: {
      q: "Firma bez licence vám zpronevěří investici. Pomůže Garanční fond?",
      options: ["Ano, do 20 000 EUR", "Ne", "Ano, celou částku"],
      correct: 1,
      explain: "Garanční fond chrání klienty licencovaných obchodníků s cennými papíry.",
    },
  },
  {
    id: "ruceni",
    title: "Ručení",
    plain:
      "Ručitel slibuje bance: „Když dlužník nezaplatí, zaplatím já.“ Je to vážný závazek – může vás stát celý dluh. Zákon ručitele aspoň chrání: ručení musí být písemné, banka musí nejdřív vyzvat dlužníka a ručitel se může bránit stejně jako dlužník.",
    concepts: [
      { term: "Ručitel", explain: "Kdo písemně prohlásí, že uspokojí věřitele, když dlužník nezaplatí.", cite: { law: "oz", par: "2018", odst: 1 } },
      { term: "Písemná forma", explain: "Bez písemného prohlášení ručení nevzniká.", cite: { law: "oz", par: "2018", odst: 2 } },
      { term: "Výzva dlužníkovi", explain: "Na ručiteli lze chtít platbu až po marné písemné výzvě dlužníkovi.", cite: { law: "oz", par: "2021", odst: 1 } },
      { term: "Námitky", explain: "Ručitel může použít všechny námitky dlužníka (např. promlčení).", cite: { law: "oz", par: "2023", odst: 1 } },
    ],
    examples: [
      { title: "Ručení za kamaráda", text: "Kamarád přestane splácet auto. Banka ho písemně vyzve, a když nezaplatí, přijde na řadu ručitel – celou částkou." },
    ],
    stats: [],
    check: {
      q: "Stačí k ručení ústní slib po telefonu?",
      options: ["Ano", "Ne, musí být písemný", "Jen u malých částek"],
      correct: 1,
      explain: "Ručitelské prohlášení vyžaduje písemnou formu.",
    },
  },
  {
    id: "dane",
    title: "Daňové přiznání",
    plain:
      "Kdo podniká nebo má vedle zaměstnání jiné příjmy, podává daňové přiznání. Lhůta jsou 3 měsíce po skončení roku, elektronicky 4, s daňovým poradcem 6. Chybu je nejlepší opravit sám dodatečným přiznáním – pak nevznikne penále 20 %.",
    concepts: [
      { term: "Povinnost podat", explain: "Při zdanitelných příjmech nad 50 000 Kč za rok (s výjimkami pro zaměstnance).", cite: { law: "zdp", par: "38g", odst: 1 } },
      { term: "Lhůty", explain: "3 / 4 (elektronicky) / 6 měsíců (poradce).", cite: { law: "dr", par: "136", odst: 2 } },
      { term: "Pokuta za pozdní přiznání", explain: "0,05 % daně za den prodlení, max. 5 %; pod 1 000 Kč se nepředepisuje.", cite: { law: "dr", par: "250", odst: 1 } },
      { term: "Penále", explain: "20 % z daně, kterou doměří úřad.", cite: { law: "dr", par: "251", odst: 1 } },
      { term: "Dodatečné přiznání", explain: "Opravíte-li chybu sami, penále nevzniká.", cite: { law: "dr", par: "251", odst: 4 } },
      { term: "Lhůta pro stanovení daně", explain: "Úřad má na doměření zásadně 3 roky.", cite: { law: "dr", par: "148", odst: 1 } },
    ],
    examples: [
      { title: "Zapomenutá faktura", text: "Daň 9 000 Kč navíc. Sami dodatečně: doplatíte daň a úrok z prodlení. Doměří-li ji úřad: navíc penále 1 800 Kč." },
    ],
    stats: [],
    check: {
      q: "Kolik času máte na přiznání, když ho podáte elektronicky bez poradce?",
      options: ["3 měsíce", "4 měsíce", "6 měsíců"],
      correct: 1,
      explain: "Elektronické podání prodlužuje lhůtu na 4 měsíce po skončení roku.",
    },
  },
  {
    id: "rozvod",
    title: "Rozvod, společné jmění a hypotéka",
    plain:
      "Za manželství je většina majetku i dluhů společná. Výjimkou jsou dluhy, které jeden udělal bez souhlasu druhého nad běžné potřeby rodiny – věřitel ale může i tak sáhnout na společný majetek, pokud se druhý manžel včas neohradí. Po rozvodu je třeba jmění vypořádat do tří let, jinak rozhodne zákon.",
    concepts: [
      { term: "Společné jmění (SJM)", explain: "Majetek a dluhy nabyté za manželství.", cite: { law: "oz", par: "708", odst: 1 } },
      { term: "Dluh jen jednoho", explain: "Bez souhlasu druhého a nad běžné potřeby rodiny do SJM nepatří.", cite: { law: "oz", par: "710" } },
      { term: "Nesouhlas věřiteli", explain: "Kdo se včas ohradí, chrání svou část společného majetku.", cite: { law: "oz", par: "732" } },
      { term: "Tři roky na vypořádání", explain: "Pak platí zákonné rozdělení – dluhy a pohledávky napůl.", cite: { law: "oz", par: "741" } },
      { term: "Hypotéka při vypořádání", explain: "Po 24 měsících od uzavření ji lze při vypořádání SJM splatit bez poplatku.", cite: { law: "zsu", par: "117", odst: 3, pism: "f" } },
    ],
    process: {
      title: "Po rozvodu",
      steps: [
        "Sepište společný majetek i dluhy.",
        "Ohraďte se písemně u věřitelů dluhů, o kterých jste nevěděli.",
        "Vypořádejte SJM dohodou nebo u soudu do 3 let.",
        "Prodáváte-li byt, ověřte, zda banka smí účtovat poplatek za předčasné splacení.",
      ],
    },
    examples: [
      { title: "Kreditka na dovolenou", text: "Manželka si bez vědomí manžela vzala úvěr na luxusní dovolenou. Do SJM nepatří, ale bez jeho včasného nesouhlasu může věřitel postihnout společné úspory." },
    ],
    stats: [
      { value: "41 %", label: "manželství končí rozvodem (úhrnná rozvodovost 2025); rozvodů bylo 21,2 tisíce", source: { name: "ČSÚ – Sňatky a rozvody", url: "https://csu.gov.cz/snatky-rozvody", date: "29. 5. 2026" } },
    ],
    check: {
      q: "Co se stane, když bývalí manželé do 3 let jmění nevypořádají?",
      options: ["Všechno připadne státu", "Dluhy a pohledávky mají napůl ze zákona", "Každý má jen to, co sám podepsal"],
      correct: 1,
      explain: "Po třech letech platí zákonné vypořádání: pohledávky a dluhy náleží oběma stejným dílem.",
    },
  },
];

export const PREPS: Prep[] = [...BASE_PREPS, ...ISLAND_PREPS, ...PLANET_PREPS];
export const PREP_BY_ID = new Map(PREPS.map((p) => [p.id, p]));

/** Které téma přípravy patří k jaké nástraze. */
export const PREP_FOR_CASE: Record<string, string> = {
  "telefon-na-splatky": "uver",
  "rozmyslel-si-uver": "uver",
  "rychla-pujcka": "uver",
  "sluchatka-z-eshopu": "nakup-na-dalku",
  "tarif-se-zavazkem": "tarify",
  "prodleni-90-dni": "prodleni",
  "dopis-po-peti-letech": "promlceni",
  "platebni-rozkaz": "promlceni",
  "neplatici-odberatel": "promlceni",
  "vyrozumeni-o-exekuci": "exekuce",
  "zablokovany-ucet": "exekuce",
  "vyplatni-paska": "srazky",
  "oddluzeni": "oddluzeni",
  "oddluzeni-zivnostnika": "oddluzeni",
  "dedictvi-v-oddluzeni": "oddluzeni",
  "vyzivne-nechodi": "vyzivne",
  "pracka-se-rozbila": "reklamace",
  "podomni-prodej": "podomni",
  "predvadeci-akce": "podomni",
  "investice-po-telefonu": "investice",
  "rucitel-za-vnuka": "ruceni",
  "danove-priznani": "dane",
  "dodatecne-priznani": "dane",
  "hypoteka-po-rozvodu": "rozvod",
  "rozvod-a-dluhy": "rozvod",
  "stiznost-u-arbitra": "prodleni",
  "falesny-bankar": "investice",
  "zmena-vyzivneho": "vyzivne",
  "pozde-podane-priznani": "dane",
  ...ISLAND_PREP_FOR_CASE,
  ...PLANET_PREP_FOR_CASE,
};
