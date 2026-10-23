import type { GameCase } from "./types";

/**
 * Nástrahy na míru jednotlivým postavám. Zástupné značky ({N}, {a}…) viz characters.ts.
 * Peněžní dopady jsou ilustrativní.
 */
export const STORY_CASES: GameCase[] = [
  // ===== Ondřej =====
  {
    id: "telefon-na-splatky",
    title: "Telefon za „0 %“",
    teaser: "Nový mobil na 24 splátek bez úroku.",
    story:
      "{N} chce nový telefon za 24 000 Kč. Prodejce nabízí „0 % úrok, 24 splátek po 1 100 Kč“. Na papíře je drobným písmem poplatek za vedení úvěru.",
    lesson: { topic: "uvery-a-dluhy", lesson: "pred-podpisem" },
    rounds: [
      {
        prompt: "Kolik telefon na splátky stojí navíc a podle čeho nabídky porovnat?",
        card: "zsu-3-2",
        options: [
          {
            text: "Nic navíc – úrok je přece 0 %.",
            outcome: "wrong",
            verdict: "24 × 1 100 Kč = 26 400 Kč, tedy 2 400 Kč navíc na poplatcích. Nulový úrok neznamená nulové náklady.",
            wallet: -2400,
            cites: [{ law: "zsu", par: "3", odst: 2, pism: "b" }],
          },
          {
            text: "2 400 Kč navíc. Porovnám RPSN a celkovou částku k zaplacení s jinými nabídkami.",
            outcome: "correct",
            verdict:
              "RPSN zahrnuje úroky i poplatky jako roční procento z výše úvěru. Proto se dá srovnávat – na rozdíl od samotné úrokové sazby.",
            wallet: 0,
            cites: [{ law: "zsu", par: "3", odst: 2, pism: "b" }],
          },
          {
            text: "Když je úrok 0 %, je i RPSN 0 %.",
            outcome: "wrong",
            verdict: "RPSN počítá s celkovými náklady úvěru včetně poplatků. Při poplatku za vedení úvěru je vyšší než nula.",
            wallet: -2400,
            cites: [{ law: "zsu", par: "3", odst: 2, pism: "b" }],
          },
        ],
      },
      {
        prompt: "Prodejce chce k úvěru „pro jistotu“ podepsat i směnku. Co {N} udělá?",
        card: "zsu-112-1",
        options: [
          {
            text: "Podepíše, je to jen formalita.",
            outcome: "wrong",
            verdict: "Směnka se u spotřebitelského úvěru použít nesmí. Dříve umožňovala obejít ochranu spotřebitele ve směnečném řízení.",
            wallet: -5000,
            cites: [{ law: "zsu", par: "112", odst: 1 }],
          },
          {
            text: "Odmítne – směnka je u spotřebitelského úvěru zakázaná.",
            outcome: "correct",
            verdict: "Ke splacení ani zajištění spotřebitelského úvěru nelze použít směnku ani šek. Kdo ji chce, porušuje zákon.",
            wallet: 0,
            cites: [{ law: "zsu", par: "112", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "rozmyslel-si-uver",
    title: "Rozmyšlený úvěr",
    teaser: "Týden po podpisu je jinde levněji.",
    story:
      "Týden po podpisu {N} zjistí, že banka nabízí půjčku s výrazně nižší RPSN. Telefon si chce nechat, úvěr od prodejce ne.",
    lesson: { topic: "uvery-a-dluhy", lesson: "pred-podpisem" },
    rounds: [
      {
        prompt: "Může od úvěru odstoupit?",
        card: "zsu-118-1",
        options: [
          {
            text: "Ano, do 14 dnů od uzavření, bez udání důvodu a písemně.",
            outcome: "correct",
            verdict: "U úvěru jiného než na bydlení lze odstoupit do 14 dnů bez důvodu a bez sankce. Odstoupení musí být písemné.",
            wallet: 0,
            cites: [{ law: "zsu", par: "118", odst: 1 }, { law: "zsu", par: "118", odst: 2 }],
          },
          {
            text: "Ne, podepsáno je podepsáno.",
            outcome: "wrong",
            verdict: "Zákon dává spotřebiteli 14 dnů na rozmyšlenou. Kdo ji nevyužije, zaplatí dražší úvěr celý.",
            wallet: -2400,
            cites: [{ law: "zsu", par: "118", odst: 1 }],
          },
          {
            text: "Ano, ale zaplatí pokutu 10 % z úvěru.",
            outcome: "partial",
            verdict: "Odstoupit lze, ale bez jakékoli sankce.",
            wallet: 0,
            cites: [{ law: "zsu", par: "118", odst: 1 }],
          },
        ],
      },
      {
        prompt: "{N} odstoupil{a}. Co musí poskytovateli zaplatit?",
        card: "zsu-118-4",
        options: [
          {
            text: "Do 30 dnů jistinu a úrok za dobu, kdy peníze měl{a}.",
            outcome: "correct",
            verdict:
              "Úvěr se ruší od počátku. Spotřebitel do 30 dnů od odeslání odstoupení vrátí jistinu a úrok za dobu čerpání – nic dalšího poskytovatel chtít nesmí.",
            wallet: 0,
            cites: [{ law: "zsu", par: "118", odst: 3 }, { law: "zsu", par: "118", odst: 4 }],
          },
          {
            text: "Nic, smlouva se ruší od počátku.",
            outcome: "partial",
            verdict: "Ruší se, ale peníze, které úvěr pokryl, je třeba vrátit – jistinu a úrok za dobu čerpání.",
            wallet: 0,
            cites: [{ law: "zsu", par: "118", odst: 4 }],
          },
          {
            text: "Jistinu a poplatek za zpracování smlouvy.",
            outcome: "wrong",
            verdict: "Poskytovatel nemá právo na žádné jiné plnění než jistinu a úrok za dobu čerpání.",
            wallet: -800,
            cites: [{ law: "zsu", par: "118", odst: 3 }],
          },
        ],
      },
    ],
  },
  {
    id: "tarif-se-zavazkem",
    title: "Tarif se závazkem",
    teaser: "Smlouva na dva roky a levnější konkurence.",
    story:
      "{N} před pěti měsíci podepsal{a} mobilní tarif na 24 měsíců za 600 Kč měsíčně, bez dotovaného telefonu. Teď našel{a} o polovinu levnější.",
    lesson: { topic: "spotrebitel-a-smlouvy", lesson: "nakup-a-reklamace" },
    rounds: [
      {
        prompt: "Kolik zaplatí za předčasnou výpověď?",
        card: "zek-63b-8",
        options: [
          {
            text: "Nic – po třech měsících od uzavření úhradu chtít nelze.",
            outcome: "correct",
            verdict:
              "Operátor smí úhradu za předčasné ukončení požadovat jen tehdy, skončí-li smlouva do 3 měsíců od uzavření. Výjimkou je dotovaný telefon, který si zákazník ponechá.",
            wallet: 0,
            cites: [{ law: "zek", par: "63b", odst: 8 }, { law: "zek", par: "63b", odst: 7 }],
          },
          {
            text: "Dvacetinu zbývajících paušálů, tedy 570 Kč.",
            outcome: "partial",
            verdict: "Tento strop platí jen při ukončení do 3 měsíců od uzavření. Po pěti měsících se neplatí nic.",
            wallet: -570,
            cites: [{ law: "zek", par: "63b", odst: 8 }],
          },
          {
            text: "Všechny zbývající paušály, 11 400 Kč.",
            outcome: "wrong",
            verdict: "Takovou úhradu zákon nedovoluje. Do 3 měsíců nanejvýš dvacetinu, potom nic.",
            wallet: -11400,
            cites: [{ law: "zek", par: "63b", odst: 8 }],
          },
        ],
      },
      {
        prompt: "Nový operátor nabízí ještě nižší cenu, když se {N} upíše na 36 měsíců. Co z toho plyne?",
        card: "zek-63b-1",
        options: [
          {
            text: "Doba určitá nad 24 měsíců není dovolena – taková smlouva se považuje za uzavřenou na dobu neurčitou.",
            outcome: "correct",
            verdict: "Smlouva se spotřebitelem na dobu určitou nesmí přesáhnout 24 měsíců, jinak se považuje za smlouvu na dobu neurčitou.",
            wallet: 0,
            cites: [{ law: "zek", par: "63b", odst: 1 }],
          },
          {
            text: "Bude vázán{a} 3 roky, jak podepsal{a}.",
            outcome: "wrong",
            verdict: "Zákon závazek u spotřebitele omezuje na 24 měsíců.",
            wallet: 0,
            cites: [{ law: "zek", par: "63b", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "sluchatka-z-eshopu",
    title: "Sluchátka na odloženou platbu",
    teaser: "Nákup z e-shopu na splátky, který nesedí.",
    story:
      "{N} si v e-shopu objednal{a} sluchátka za 4 000 Kč a zaplatil{a} je „odloženou platbou na splátky“ přes partnera e-shopu. Balík už převzal{a}, ale sluchátka nesedí.",
    lesson: { topic: "spotrebitel-a-smlouvy", lesson: "nakup-a-reklamace" },
    rounds: [
      {
        prompt: "Do kdy může od nákupu odstoupit bez udání důvodu?",
        card: "oz-1829-2",
        options: [
          {
            text: "Do 14 dnů od převzetí zásilky.",
            outcome: "correct",
            verdict: "U koupě zboží na dálku končí lhůta 14 dnů ode dne převzetí zboží.",
            wallet: 0,
            cites: [{ law: "oz", par: "1829", odst: 2 }],
          },
          {
            text: "Do 14 dnů od objednávky.",
            outcome: "partial",
            verdict: "U zboží běží lhůta až od převzetí, ne od objednávky. Máte víc času, než si myslíte.",
            wallet: 0,
            cites: [{ law: "oz", par: "1829", odst: 2 }],
          },
          {
            text: "Do 30 dnů, jako u reklamace.",
            outcome: "wrong",
            verdict: "30 dnů je lhůta pro vyřízení reklamace. Odstoupit bez důvodu lze do 14 dnů od převzetí.",
            wallet: -4000,
            cites: [{ law: "oz", par: "1829", odst: 2 }, { law: "zos", par: "19", odst: 3 }],
          },
        ],
      },
      {
        prompt: "{N} sluchátka vrátil{a}. Co se splátkami?",
        card: "zsu-119-1",
        options: [
          {
            text: "Vázaný úvěr zaniká – bez sankcí. Stačí informovat poskytovatele.",
            outcome: "correct",
            verdict:
              "Odstoupí-li spotřebitel od koupě hrazené vázaným úvěrem, úvěr zaniká. Spotřebitel o tom poskytovatele informuje, sankce jsou vyloučené.",
            wallet: 0,
            cites: [{ law: "zsu", par: "119", odst: 1 }, { law: "zsu", par: "2", odst: 3 }],
          },
          {
            text: "Splátky musí doplatit, úvěr je samostatná smlouva.",
            outcome: "wrong",
            verdict: "Úvěr vázaný na konkrétní nákup s odstoupením od koupě zaniká.",
            wallet: -4000,
            cites: [{ law: "zsu", par: "119", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "rychla-pujcka",
    title: "Půjčka do 10 minut",
    teaser: "Na nájem chybí, aplikace půjčí hned.",
    story:
      "Na konci měsíce {D} chybí na nájem. Aplikace nabízí 15 000 Kč „do 10 minut, bez dokládání příjmů“. Peníze přišly hned, splácet ale {N} nestíhá.",
    lesson: { topic: "uvery-a-dluhy", lesson: "pred-podpisem" },
    rounds: [
      {
        prompt: "Poskytovatel se na příjmy ani jiné dluhy vůbec neptal. Co z toho plyne?",
        card: "zsu-87-1",
        options: [
          {
            text: "Smlouva je neplatná; {N} vrací jen jistinu, v době přiměřené svým možnostem.",
            outcome: "correct",
            verdict:
              "Bez důkladného posouzení úvěruschopnosti je smlouva neplatná a soud k tomu přihlédne i bez návrhu. Úroky a poplatky se neplatí.",
            wallet: 0,
            cites: [{ law: "zsu", par: "86", odst: 1 }, { law: "zsu", par: "87", odst: 1 }],
          },
          {
            text: "Dluží všechno včetně poplatků – podepsal{a} to.",
            outcome: "wrong",
            verdict: "Neplatná smlouva nezakládá nárok na úroky ani poplatky.",
            wallet: -9000,
            cites: [{ law: "zsu", par: "87", odst: 1 }],
          },
          {
            text: "Nemusí vracet vůbec nic.",
            outcome: "wrong",
            verdict: "Jistinu, kterou dostal{a}, vrátit musí – jen ne úroky a poplatky.",
            wallet: 0,
            cites: [{ law: "zsu", par: "87", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Ve smlouvě je smluvní pokuta 1 % denně z dlužné částky. Kolik smí věřitel chtít?",
        card: "zsu-122-2",
        options: [
          {
            text: "Nejvýše 0,1 % denně.",
            outcome: "correct",
            verdict: "Smluvní pokuta z prodlení u spotřebitelského úvěru nesmí přesáhnout 0,1 % denně z dlužné částky.",
            wallet: 0,
            cites: [{ law: "zsu", par: "122", odst: 2 }],
          },
          {
            text: "1 % denně, tak to stojí ve smlouvě.",
            outcome: "wrong",
            verdict: "Zákonný strop je 0,1 % denně. Ujednání nad něj neobstojí.",
            wallet: -4500,
            cites: [{ law: "zsu", par: "122", odst: 2 }],
          },
          {
            text: "Nic – pokuty jsou u půjček zakázané.",
            outcome: "partial",
            verdict: "Smluvní pokutu sjednat lze, jen má zákonný strop.",
            wallet: 0,
            cites: [{ law: "zsu", par: "122", odst: 1 }],
          },
        ],
      },
    ],
  },

  // ===== Jana =====
  {
    id: "vyzivne-nechodi",
    title: "Výživné nechodí",
    teaser: "Půl roku bez peněz od otce dětí.",
    story:
      "Otec dětí má podle rozsudku platit 3 000 Kč měsíčně na každé ze dvou dětí. Už půl roku neposlal nic a {N} sotva vychází.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "exekuce" },
    rounds: [
      {
        prompt: "Jak se {N} k výživnému dostane?",
        card: "er-37-4",
        options: [
          {
            text: "Podá exekuční návrh k soudnímu exekutorovi.",
            outcome: "correct",
            verdict: "Pro výživné na nezletilé dítě může oprávněný podat exekuční návrh. Výživné je navíc přednostní pohledávka – ze mzdy se sráží dvě třetiny.",
            wallet: 0,
            cites: [{ law: "er", par: "37", odst: 4, pism: "a" }, { law: "osr", par: "279", odst: 2 }],
          },
          {
            text: "Počká, až se otec sám ozve.",
            outcome: "wrong",
            verdict: "Čekáním dluh roste a nic se nevymáhá. Rozsudek je exekuční titul – dá se vymáhat.",
            wallet: -6000,
            cites: [{ law: "er", par: "37", odst: 4, pism: "a" }],
          },
          {
            text: "Rovnou požádá stát o náhradní výživné, exekuci řešit nemusí.",
            outcome: "partial",
            verdict: "Náhradní výživné je možné, ale podmínkou je, že k vymožení výživného probíhá exekuce.",
            wallet: 0,
            cites: [{ law: "znv", par: "3" }],
          },
        ],
      },
      {
        prompt: "Exekuce běží, ale peníze pořád nechodí. Co dál?",
        card: "znv-3",
        options: [
          {
            text: "Požádá Úřad práce o náhradní výživné.",
            outcome: "correct",
            verdict: "Dítě má nárok na náhradní výživné, pokud k vymožení výživného probíhá exekuce. Rozhoduje Úřad práce.",
            wallet: 0,
            cites: [{ law: "znv", par: "3" }, { law: "znv", par: "5" }],
          },
          {
            text: "Požádá o zastavení exekuce, nemá smysl.",
            outcome: "wrong",
            verdict: "Zastavením exekuce by děti přišly i o podmínku pro náhradní výživné.",
            wallet: -6000,
            cites: [{ law: "znv", par: "3" }],
          },
        ],
      },
      {
        prompt: "Kolik může náhradní výživné činit?",
        card: "znv-4-1",
        options: [
          {
            text: "Chybějící částku, nejvýše 3 000 Kč měsíčně na dítě.",
            outcome: "correct",
            verdict: "Náhradní výživné je rozdíl mezi výživným z rozsudku a tím, co skutečně přišlo, nejvýše 3 000 Kč měsíčně. U dvou dětí tedy až 6 000 Kč.",
            wallet: 6000,
            cites: [{ law: "znv", par: "4", odst: 1 }],
          },
          {
            text: "Celé dlužné výživné za půl roku najednou.",
            outcome: "wrong",
            verdict: "Náhradní výživné se stanovuje po měsících a je omezeno na 3 000 Kč měsíčně.",
            wallet: 0,
            cites: [{ law: "znv", par: "4", odst: 1 }, { law: "znv", par: "4", odst: 2 }],
          },
          {
            text: "Paušálně 1 000 Kč na rodinu.",
            outcome: "wrong",
            verdict: "Výše odpovídá chybějícímu výživnému dítěte, až do 3 000 Kč měsíčně.",
            wallet: 0,
            cites: [{ law: "znv", par: "4", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "pracka-se-rozbila",
    title: "Rozbitá pračka",
    teaser: "Po deseti měsících přestala ždímat.",
    story: "Pračka za 9 000 Kč přestala po deseti měsících ždímat. Prodejce tvrdí, že ji {N} přetěžoval{a}.",
    lesson: { topic: "spotrebitel-a-smlouvy", lesson: "nakup-a-reklamace" },
    rounds: [
      {
        prompt: "Kdo musí dokazovat, odkud se vada vzala?",
        card: "oz-2161-5",
        options: [
          {
            text: "Prodejce – vada se projevila do roka od převzetí.",
            outcome: "correct",
            verdict: "Projeví-li se vada do jednoho roku od převzetí, má se za to, že tu byla už při převzetí. Opak musí prokázat prodejce.",
            wallet: 0,
            cites: [{ law: "oz", par: "2161", odst: 5 }, { law: "oz", par: "2165", odst: 1 }],
          },
          {
            text: "{N} – musí doložit, že pračku nepřetěžoval{a}.",
            outcome: "wrong",
            verdict: "V prvním roce je důkazní břemeno na prodejci.",
            wallet: -9000,
            cites: [{ law: "oz", par: "2161", odst: 5 }],
          },
        ],
      },
      {
        prompt: "Reklamaci uplatnil{a} před 35 dny, o prodloužení se nedohodli a prodejce mlčí.",
        card: "zos-19-3",
        options: [
          {
            text: "Může od smlouvy odstoupit nebo chtít přiměřenou slevu.",
            outcome: "correct",
            verdict: "Reklamace musí být vyřízena do 30 dnů. Po marném uplynutí může spotřebitel odstoupit nebo požadovat slevu.",
            wallet: 0,
            cites: [{ law: "zos", par: "19", odst: 3 }, { law: "zos", par: "19", odst: 4 }],
          },
          {
            text: "Musí čekat, dokud prodejce nerozhodne.",
            outcome: "wrong",
            verdict: "Lhůta je 30 dnů. Po ní jsou na tahu práva spotřebitele.",
            wallet: -9000,
            cites: [{ law: "zos", par: "19", odst: 3 }],
          },
        ],
      },
    ],
  },
  {
    id: "prodleni-90-dni",
    title: "Čtyři měsíce pozadu",
    teaser: "Úroky běží dál, jako by se nic nedělo.",
    story:
      "{N} je se splátkami půjčky čtyři měsíce pozadu. Věřitel dál účtuje smluvní úrok 39 % ročně a k tomu poplatky za upomínky.",
    lesson: { topic: "uvery-a-dluhy", lesson: "prodleni-a-sankce" },
    rounds: [
      {
        prompt: "Smí věřitel po 90 dnech prodlení dál účtovat 39 % ročně?",
        card: "zsu-122-4",
        options: [
          {
            text: "Ne – po 90 dnech jen úrok ve výši repo sazby ČNB + 8 procentních bodů.",
            outcome: "correct",
            verdict: "Při prodlení delším než 90 dnů vzniká věřiteli právo jen na úrok ve výši repo sazby ČNB zvýšené o 8 p. b., nebyl-li sjednán nižší.",
            wallet: 0,
            cites: [{ law: "zsu", par: "122", odst: 4 }],
          },
          {
            text: "Ano, tak je to ve smlouvě.",
            outcome: "wrong",
            verdict: "Zákon smluvní úrok po 90 dnech prodlení omezuje bez ohledu na smlouvu.",
            wallet: -4000,
            cites: [{ law: "zsu", par: "122", odst: 4 }],
          },
          {
            text: "Ano, ale jen polovinu.",
            outcome: "wrong",
            verdict: "Žádná „polovina“ – strop je repo sazba ČNB + 8 p. b.",
            wallet: -2000,
            cites: [{ law: "zsu", par: "122", odst: 4 }],
          },
        ],
      },
      {
        prompt: "Věřitel na stížnost nereaguje. Kde se {N} může bránit zdarma?",
        card: "zfa-1-1",
        options: [
          {
            text: "U finančního arbitra.",
            outcome: "correct",
            verdict: "Spory spotřebitele s věřitelem ze spotřebitelského úvěru rozhoduje bezplatně finanční arbitr.",
            wallet: 0,
            cites: [{ law: "zfa", par: "1", odst: 1, pism: "c" }],
          },
          {
            text: "Jedině u soudu se zálohou na advokáta.",
            outcome: "partial",
            verdict: "Soud možný je, ale u spotřebitelského úvěru existuje bezplatná cesta – finanční arbitr.",
            wallet: -3000,
            cites: [{ law: "zfa", par: "1", odst: 1, pism: "c" }],
          },
        ],
      },
    ],
  },

  // ===== Marie =====
  {
    id: "podomni-prodej",
    title: "Obchodník u dveří",
    teaser: "„Výhodná“ smlouva na energie podepsaná na prahu.",
    story:
      "U dveří zazvonil obchodník s „výhodnou“ smlouvou na dodávku energií. {N} podepsala, druhý den jí to přišlo divné.",
    lesson: { topic: "spotrebitel-a-smlouvy", lesson: "nakup-a-reklamace" },
    rounds: [
      {
        prompt: "Může od smlouvy odstoupit?",
        card: "oz-1829-1",
        options: [
          {
            text: "Ano, do 14 dnů bez udání důvodu.",
            outcome: "correct",
            verdict: "Smlouva uzavřená mimo obchodní prostory (u dveří) lze do 14 dnů bez udání důvodu odstoupit.",
            wallet: 0,
            cites: [{ law: "oz", par: "1829", odst: 1 }],
          },
          {
            text: "Ne, podpis je podpis.",
            outcome: "wrong",
            verdict: "U smluv z podomního prodeje dává zákon 14 dnů na rozmyšlenou.",
            wallet: -6000,
            cites: [{ law: "oz", par: "1829", odst: 1 }],
          },
          {
            text: "Jen pokud zaplatí storno poplatek.",
            outcome: "partial",
            verdict: "Odstoupit lze bez udání důvodu ve lhůtě 14 dnů.",
            wallet: -1500,
            cites: [{ law: "oz", par: "1829", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "predvadeci-akce",
    title: "Zájezd s obědem zdarma",
    teaser: "Deka za 25 000 Kč a záloha hned.",
    story:
      "{N} jela na zájezd s obědem zdarma. Na místě předváděli „léčivou“ deku za 25 000 Kč a chtěli zálohu 5 000 Kč hned na místě.",
    lesson: { topic: "spotrebitel-a-smlouvy", lesson: "nakup-a-reklamace" },
    rounds: [
      {
        prompt: "Smí prodejce na akci vybrat zálohu?",
        card: "zos-20b-1",
        options: [
          {
            text: "Ne – během akce ani 7 dní po uzavření smlouvy nesmí přijmout žádné peníze.",
            outcome: "correct",
            verdict: "Prodávající na organizované akci nesmí během akce ani 7 dnů od uzavření smlouvy požadovat ani přijmout cenu ani zálohu.",
            wallet: 0,
            cites: [{ law: "zos", par: "20b", odst: 1 }],
          },
          {
            text: "Ano, záloha je běžná.",
            outcome: "wrong",
            verdict: "Na organizované akci je přijetí platby i zálohy zakázané.",
            wallet: -5000,
            cites: [{ law: "zos", par: "20b", odst: 1 }],
          },
          {
            text: "Ano, když vydá doklad.",
            outcome: "wrong",
            verdict: "Doklad nic nemění – zákaz platí pro jakoukoli platbu.",
            wallet: -5000,
            cites: [{ law: "zos", par: "20b", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Smlouvu {N} na zájezdu podepsala. Doma si to rozmyslí. Platí pro ni 14denní lhůta?",
        card: "oz-1828-2",
        options: [
          {
            text: "Ano – smlouva z prodejního výletu je smlouvou mimo obchodní prostory.",
            outcome: "correct",
            verdict: "Smlouva uzavřená během výletu organizovaného za účelem prodeje se považuje za smlouvu mimo obchodní prostory. Lze odstoupit do 14 dnů.",
            wallet: 0,
            cites: [{ law: "oz", par: "1828", odst: 2, pism: "b" }, { law: "oz", par: "1829", odst: 1 }],
          },
          {
            text: "Ne, akce se konala v hotelu, ne u ní doma.",
            outcome: "wrong",
            verdict: "Nerozhoduje místo, ale to, že šlo o prodejní výlet organizovaný podnikatelem.",
            wallet: -25000,
            cites: [{ law: "oz", par: "1828", odst: 2, pism: "b" }],
          },
        ],
      },
    ],
  },
  {
    id: "investice-po-telefonu",
    title: "Investice po telefonu",
    teaser: "„Garantovaných“ 15 % ročně.",
    story:
      "Volá „investiční poradce“: garantovaný výnos 15 % ročně, stačí poslat 50 000 Kč na účet firmy ještě dnes, nabídka prý brzy skončí.",
    lesson: { topic: "investice-a-sporeni", lesson: "ochrana-investora" },
    rounds: [
      {
        prompt: "Co má {N} udělat, než cokoli pošle?",
        card: "zpkt-130-9",
        options: [
          {
            text: "Ověřit firmu v seznamu regulovaných subjektů ČNB – a vědět, že ochrana má své meze.",
            outcome: "correct",
            verdict:
              "Garanční fond vyplácí náhradu, jen když licencovaný obchodník s cennými papíry nevydá klientský majetek: 90 %, nejvýše 20 000 EUR. Ztrátu z podvodu nelicencované firmy ani tržní ztrátu nekryje.",
            wallet: 0,
            cites: [{ law: "zpkt", par: "130", odst: 9 }],
          },
          {
            text: "Poslat – výnos je přece garantovaný ve smlouvě.",
            outcome: "wrong",
            verdict: "„Garance“ od neznámé firmy nic nezaručuje. Peníze u podvodníka nekryje žádný fond.",
            wallet: -50000,
            cites: [{ law: "zpkt", par: "130", odst: 9 }],
          },
          {
            text: "Poslat jen polovinu na zkoušku.",
            outcome: "wrong",
            verdict: "I polovina u podvodné firmy je ztracená. Nejdřív ověření, pak rozhodnutí.",
            wallet: -25000,
            cites: [{ law: "zpkt", par: "130", odst: 9 }],
          },
        ],
      },
    ],
  },
  {
    id: "rucitel-za-vnuka",
    title: "Ručení za vnuka",
    teaser: "Banka píše babičce.",
    boss: true,
    story:
      "Před dvěma lety {N} podepsala vnukovi ručení za úvěr 100 000 Kč. Vnuk přestal splácet a banka teď píše jí.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "exekuce" },
    rounds: [
      {
        prompt: "Banka chce po {D} celý dluh hned, aniž by vnuka k placení vůbec vyzvala. Smí?",
        card: "oz-2021-1",
        options: [
          {
            text: "Ne – nejdřív musí dlužníka písemně vyzvat a dát mu přiměřenou lhůtu.",
            outcome: "correct",
            verdict:
              "Na ručiteli lze plnění požadovat, když dlužník nesplnil v přiměřené lhůtě po písemné výzvě. Výzva odpadá, jen pokud ji nelze uskutečnit nebo je nepochybné, že dlužník nezaplatí.",
            wallet: 0,
            cites: [{ law: "oz", par: "2021", odst: 1 }],
          },
          {
            text: "Ano, ručitel platí vždycky první.",
            outcome: "wrong",
            verdict: "Ručitel je až druhý v řadě – po marné písemné výzvě dlužníkovi.",
            wallet: -100000,
            cites: [{ law: "oz", par: "2021", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Část dluhu jsou staré poplatky, které už jsou promlčené. Může to {N} namítnout?",
        card: "oz-2023-1",
        options: [
          {
            text: "Ano, ručitel může uplatnit všechny námitky, které má dlužník.",
            outcome: "correct",
            verdict: "Ručitel se může bránit vším, čím by se bránil dlužník – včetně námitky promlčení.",
            wallet: 0,
            cites: [{ law: "oz", par: "2023", odst: 1 }, { law: "oz", par: "610", odst: 1 }],
          },
          {
            text: "Ne, to může namítnout jen vnuk.",
            outcome: "wrong",
            verdict: "Námitky dlužníka může uplatnit i ručitel.",
            wallet: -15000,
            cites: [{ law: "oz", par: "2023", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Banka nakonec získá rozsudek a exekutor vydá exekuční příkaz ke srážkám z důchodu 21 000 Kč. Kolik {D} srazí pro tento dluh?",
        card: "osr-299-1",
        options: [
          {
            text: "2 299 Kč – stejná pravidla jako u mzdy.",
            outcome: "correct",
            verdict:
              "Na důchod se použijí pravidla srážek ze mzdy: nezabavitelná částka 14 102 Kč, ze zbytku 6 897 Kč jedna třetina = 2 299 Kč.",
            wallet: -2299,
            cites: [{ law: "osr", par: "299", odst: 1, pism: "d" }, { law: "osr", par: "279", odst: 1 }],
          },
          {
            text: "7 000 Kč – třetina celého důchodu.",
            outcome: "wrong",
            verdict: "Třetina se počítá až ze zbytku po odečtení nezabavitelné částky.",
            wallet: -7000,
            cites: [{ law: "osr", par: "279", odst: 1 }, { law: "nv595", par: "1", odst: 1 }],
          },
          {
            text: "Nic – z důchodu se nesráží.",
            outcome: "wrong",
            verdict: "Důchody výslovně patří mezi příjmy, ze kterých se sráží.",
            wallet: 0,
            cites: [{ law: "osr", par: "299", odst: 1, pism: "d" }],
          },
        ],
      },
      {
        prompt: "Vnuk teď chce, aby {N} ručila i za další půjčku – stačí prý bance zavolat. Je to tak?",
        card: "oz-2018-2",
        options: [
          {
            text: "Ne, ručitelské prohlášení musí být písemné – a odmítnout ho je v pořádku.",
            outcome: "correct",
            verdict: "Ručení vzniká jen písemným prohlášením. Telefonát ručení nezaloží – a podpis lze odmítnout.",
            wallet: 0,
            cites: [{ law: "oz", par: "2018", odst: 1 }, { law: "oz", par: "2018", odst: 2 }],
          },
          {
            text: "Ano, telefonický souhlas stačí.",
            outcome: "wrong",
            verdict: "Zákon pro ručitelské prohlášení vyžaduje písemnou formu.",
            wallet: 0,
            cites: [{ law: "oz", par: "2018", odst: 2 }],
          },
        ],
      },
    ],
  },

  // ===== Radek =====
  {
    id: "danove-priznani",
    title: "Daňové přiznání",
    teaser: "Kolik času má živnostník na přiznání?",
    story: "{N} podává přiznání k dani z příjmů za rok 2025 sám, elektronicky přes portál finanční správy, bez daňového poradce.",
    lesson: { topic: "dane", lesson: "lhuty-a-sankce" },
    rounds: [
      {
        prompt: "Kolik má po skončení roku času?",
        card: "dr-136-2",
        options: [
          {
            text: "4 měsíce, protože podává elektronicky.",
            outcome: "correct",
            verdict: "Základní lhůta jsou 3 měsíce; při elektronickém podání se prodlužuje na 4 měsíce, s daňovým poradcem na 6.",
            wallet: 0,
            cites: [{ law: "dr", par: "136", odst: 1 }, { law: "dr", par: "136", odst: 2 }],
          },
          {
            text: "3 měsíce, jako každý.",
            outcome: "partial",
            verdict: "3 měsíce platí pro papírové podání. Elektronicky má o měsíc víc.",
            wallet: 0,
            cites: [{ law: "dr", par: "136", odst: 1 }],
          },
          {
            text: "6 měsíců.",
            outcome: "wrong",
            verdict: "6 měsíců platí jen s daňovým poradcem nebo při povinném auditu. Pozdní přiznání může stát pokutu.",
            wallet: -2000,
            cites: [{ law: "dr", par: "136", odst: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: "dodatecne-priznani",
    title: "Zapomenutá faktura",
    teaser: "60 000 Kč, které chybí v přiznání.",
    story: "Po podání přiznání {N} zjistí, že zapomněl{a} zahrnout fakturu na 60 000 Kč. Úřad zatím nic neví.",
    lesson: { topic: "dane", lesson: "lhuty-a-sankce" },
    rounds: [
      {
        prompt: "Co je nejlevnější řešení?",
        card: "dr-251-4",
        options: [
          {
            text: "Sám podat dodatečné přiznání a daň doplatit.",
            outcome: "correct",
            verdict: "Z daně dodatečně přiznané v dodatečném přiznání penále nevzniká. Zaplatí se jen úrok z prodlení.",
            wallet: -1000,
            cites: [{ law: "dr", par: "251", odst: 4 }, { law: "dr", par: "252", odst: 2 }],
          },
          {
            text: "Počkat, třeba na to nepřijdou.",
            outcome: "wrong",
            verdict: "Úřad má na doměření zásadně 3 roky. Doměří-li daň sám, přibude penále 20 % z doměřené daně.",
            wallet: -3000,
            cites: [{ law: "dr", par: "148", odst: 1 }, { law: "dr", par: "251", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "neplatici-odberatel",
    title: "Neplatící odběratel",
    teaser: "80 000 Kč za zakázku, splatné před dvěma lety.",
    story: "Odběratel dluží {D} 80 000 Kč za zakázku, která byla splatná před dvěma lety. Pořád slibuje, že zaplatí.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "promlceni" },
    rounds: [
      {
        prompt: "Kolik času má {N}, než pohledávka promlčí?",
        card: "oz-629-1",
        options: [
          {
            text: "Zpravidla 3 roky od doby, kdy šla poprvé uplatnit – zbývá asi rok. Je čas jednat.",
            outcome: "correct",
            verdict: "Obecná promlčecí lhůta je tři roky a běží ode dne, kdy právo mohlo být uplatněno poprvé (po splatnosti).",
            wallet: 0,
            cites: [{ law: "oz", par: "629", odst: 1 }, { law: "oz", par: "619", odst: 1 }],
          },
          {
            text: "10 let, je to faktura.",
            outcome: "wrong",
            verdict: "10 let platí po uznání dluhu nebo po rozsudku. Nežalovaná faktura se promlčuje za 3 roky.",
            wallet: -80000,
            cites: [{ law: "oz", par: "629", odst: 1 }, { law: "oz", par: "639" }],
          },
          {
            text: "Mezi podnikateli se nepromlčuje.",
            outcome: "wrong",
            verdict: "Promlčení se týká i podnikatelů. Po promlčení by dlužník mohl vznést námitku.",
            wallet: -80000,
            cites: [{ law: "oz", par: "609" }],
          },
        ],
      },
      {
        prompt: "Může {N} chtít víc než 80 000 Kč?",
        card: "oz-1970",
        options: [
          {
            text: "Ano, úrok z prodlení ve výši podle nařízení vlády.",
            outcome: "correct",
            verdict: "Při prodlení s peněžitým dluhem může věřitel, který sám řádně plnil, chtít úrok z prodlení. Výši stanoví nařízení vlády.",
            wallet: 6000,
            cites: [{ law: "oz", par: "1970" }],
          },
          {
            text: "Ne, jen samotnou částku.",
            outcome: "partial",
            verdict: "Úrok z prodlení náleží ze zákona i bez ujednání.",
            wallet: 0,
            cites: [{ law: "oz", par: "1970" }],
          },
          {
            text: "Ano, libovolnou pokutu za pozdní platbu.",
            outcome: "wrong",
            verdict: "Smluvní pokutu lze chtít jen tehdy, byla-li sjednána.",
            wallet: 0,
            cites: [{ law: "oz", par: "2048", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Odběratel napíše e-mail: „Dlužím Vám 80 000 Kč za zakázku, zaplatím do konce roku.“ Co to pro {A} znamená?",
        card: "oz-639",
        options: [
          {
            text: "Je to uznání dluhu – promlčecí lhůta je teď 10 let.",
            outcome: "correct",
            verdict: "Písemné uznání dluhu co do důvodu i výše zakládá novou desetiletou promlčecí lhůtu (počítanou od určeného dne splnění).",
            wallet: 0,
            cites: [{ law: "oz", par: "2053" }, { law: "oz", par: "639" }],
          },
          {
            text: "Nic, e-mail se nepočítá.",
            outcome: "partial",
            verdict: "Písemná forma je zachována i elektronicky, lze-li zachytit obsah a určit, kdo jedná. Rozhoduje, že dluh uznává co do důvodu i výše.",
            wallet: 0,
            cites: [{ law: "oz", par: "562", odst: 1 }, { law: "oz", par: "2053" }],
          },
        ],
      },
    ],
  },
  {
    id: "oddluzeni-zivnostnika",
    title: "Oddlužení živnostníka",
    teaser: "Když se dluhy z podnikání nedají splatit.",
    boss: true,
    story:
      "Dva velcí odběratelé zkrachovali a {N} nesplácí podnikatelský úvěr, dodavatele ani pojistné. Exekucí je pět, dluhy jsou přes rok po splatnosti.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "oddluzeni" },
    rounds: [
      {
        prompt: "Je {N} podle zákona v úpadku?",
        card: "iz-3-1",
        options: [
          {
            text: "Ano: více věřitelů, dluhy přes 30 dnů po splatnosti a neschopnost je platit.",
            outcome: "correct",
            verdict: "Všechny tři podmínky úpadku jsou splněny současně.",
            wallet: 0,
            cites: [{ law: "iz", par: "3", odst: 1 }],
          },
          {
            text: "Ne, dokud má živnostenský list.",
            outcome: "wrong",
            verdict: "Úpadek nezávisí na živnosti, ale na schopnosti platit splatné dluhy.",
            wallet: 0,
            cites: [{ law: "iz", par: "3", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Brání dluhy z podnikání oddlužení?",
        card: "iz-389-2",
        options: [
          {
            text: "Ne, pokud věřitel včas a odůvodněně nevysloví nesouhlas (u zajištěných věřitelů nevadí vůbec).",
            outcome: "correct",
            verdict:
              "Dluh z podnikání nebrání oddlužení, souhlasí-li s tím věřitel. Má se za to, že souhlasí, pokud nejpozději s přihláškou nesdělí odůvodněný nesouhlas.",
            wallet: 0,
            cites: [{ law: "iz", par: "389", odst: 1 }, { law: "iz", par: "389", odst: 2 }],
          },
          {
            text: "Ano, podnikatel se oddlužit nemůže.",
            outcome: "wrong",
            verdict: "Oddlužení je dostupné každé fyzické osobě; dluhy z podnikání mají jen zvláštní pravidla.",
            wallet: 0,
            cites: [{ law: "iz", par: "389", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Jak dlouho bude oddlužení standardně trvat?",
        card: "iz-412a-1",
        options: [
          {
            text: "3 roky",
            outcome: "correct",
            verdict: "Od novely č. 252/2024 Sb. trvá oddlužení 3 roky – i pro podnikatele.",
            wallet: 0,
            cites: [{ law: "iz", par: "412a", odst: 1 }],
          },
          {
            text: "5 let",
            outcome: "partial",
            verdict: "Pět let platí jen pro opakované oddlužení.",
            wallet: 0,
            cites: [{ law: "iz", par: "412a", odst: 3 }],
          },
        ],
      },
      {
        prompt: "Které dluhy oddlužení nesmaže?",
        card: "iz-416-1",
        options: [
          {
            text: "Mimo jiné zákonné výživné, škody způsobené úmyslně a tresty za úmyslné trestné činy.",
            outcome: "correct",
            verdict: "Osvobození se nedotýká mj. výživného, náhrady škody z úmyslného porušení povinnosti a sankcí za úmyslný trestný čin.",
            wallet: 0,
            cites: [{ law: "iz", par: "416", odst: 1 }],
          },
          {
            text: "Žádné – osvobození se týká všech dluhů.",
            outcome: "wrong",
            verdict: "Zákon zná výjimky z osvobození.",
            wallet: 0,
            cites: [{ law: "iz", par: "416", odst: 1 }],
          },
        ],
      },
    ],
  },

  // ===== Petr =====
  {
    id: "hypoteka-po-rozvodu",
    title: "Hypotéka po rozvodu",
    teaser: "Byt se prodá, banka chce poplatek.",
    story:
      "{N} a bývalá manželka vypořádávají společné jmění: společný byt prodají a hypotéku z roku 2021 splatí. Banka jim za předčasné splacení účtuje poplatek 1 %, tedy 30 000 Kč.",
    lesson: { topic: "uvery-a-dluhy", lesson: "pred-podpisem" },
    rounds: [
      {
        prompt: "Má banka na poplatek nárok?",
        card: "zsu-117-3",
        options: [
          {
            text: "Ne – po 24 měsících od uzavření nesmí náhradu chtít při vypořádání SJM ani při prodeji zastavené nemovitosti.",
            outcome: "correct",
            verdict:
              "Po 24 měsících od uzavření nesmí banka při vypořádání společného jmění chtít žádný poplatek. Totéž platí při prodeji zastavené nemovitosti.",
            wallet: 0,
            cites: [{ law: "zsu", par: "117", odst: 3, pism: "e" }, { law: "zsu", par: "117", odst: 3, pism: "f" }],
          },
          {
            text: "Ano, 1 % je zákonný strop.",
            outcome: "wrong",
            verdict: "Strop 1 % se týká jiných případů. Při vypořádání SJM po 24 měsících náhrada nenáleží vůbec.",
            wallet: -30000,
            cites: [{ law: "zsu", par: "117", odst: 3, pism: "f" }, { law: "zsu", par: "117", odst: 4 }],
          },
          {
            text: "Ano, ale jen 0,25 % za každý rok do konce fixace.",
            outcome: "partial",
            verdict: "To je strop pro jiné situace předčasného splacení hypotéky. Tady se nesmí účtovat nic.",
            wallet: -15000,
            cites: [{ law: "zsu", par: "117", odst: 4 }, { law: "zsu", par: "117", odst: 3, pism: "f" }],
          },
        ],
      },
    ],
  },
  {
    id: "rozvod-a-dluhy",
    title: "Rozvod a společné dluhy",
    teaser: "Půjčky bývalé manželky.",
    boss: true,
    story:
      "Za manželství si bývalá manželka bez vědomí {G} vzala půjčku 150 000 Kč na dovolenou s kamarádkami. Teď jsou rozvedení, společné jmění není vypořádané a věřitel píše oběma.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "exekuce" },
    rounds: [
      {
        prompt: "Patří taková půjčka do společného jmění?",
        card: "oz-710",
        options: [
          {
            text: "Ne – převzala ji jen ona, bez jeho souhlasu, a nešlo o běžné potřeby rodiny.",
            outcome: "correct",
            verdict: "Dluh převzatý jen jedním manželem bez souhlasu druhého, který nesloužil k obstarávání běžných potřeb rodiny, není součástí společného jmění.",
            wallet: 0,
            cites: [{ law: "oz", par: "710", pism: "b" }],
          },
          {
            text: "Ano, všechno z manželství je napůl.",
            outcome: "wrong",
            verdict: "Zákon z dluhů ve společném jmění vylučuje mimo jiné dluhy jednoho manžela bez souhlasu druhého nad běžné potřeby.",
            wallet: -75000,
            cites: [{ law: "oz", par: "710" }],
          },
        ],
      },
      {
        prompt: "Věřitel přesto chce exekucí postihnout společné úspory, které ještě nejsou vypořádané. Může?",
        card: "oz-731",
        options: [
          {
            text: "Ano – na dluh jednoho manžela může věřitel postihnout i společné jmění.",
            outcome: "correct",
            verdict:
              "Vznikl-li dluh jen jednoho z manželů za trvání společného jmění, může se věřitel uspokojit i z toho, co je ve společném jmění. Dokud není vypořádáno, použijí se tato pravidla přiměřeně.",
            wallet: -20000,
            cites: [{ law: "oz", par: "731" }, { law: "oz", par: "736" }],
          },
          {
            text: "Ne, dluh není ve společném jmění, takže na něj sáhnout nesmí.",
            outcome: "wrong",
            verdict: "Jde o dvě různé otázky. I dluh mimo společné jmění lze vymáhat ze společného majetku – ochranu dává jen včasný nesouhlas.",
            wallet: -40000,
            cites: [{ law: "oz", par: "731" }, { law: "oz", par: "732" }],
          },
        ],
      },
      {
        prompt: "{N} se dozví o další půjčce, kterou bývalá žena podepsala těsně před rozvodem. Co udělat hned?",
        card: "oz-732",
        options: [
          {
            text: "Bez zbytečného odkladu oznámit věřiteli nesouhlas.",
            outcome: "correct",
            verdict: "Kdo nesouhlas projeví vůči věřiteli bez zbytečného odkladu, omezí postih společného jmění na podíl dlužníka.",
            wallet: 0,
            cites: [{ law: "oz", par: "732" }],
          },
          {
            text: "Počkat, až přijde exekuce.",
            outcome: "wrong",
            verdict: "Nesouhlas musí přijít bez zbytečného odkladu poté, co se o dluhu dozvěděl. Později už nechrání.",
            wallet: -40000,
            cites: [{ law: "oz", par: "732" }],
          },
        ],
      },
      {
        prompt: "Od rozvodu uplynuly 3,5 roku a společné jmění nikdo nevypořádal. Jak jsou rozdělené dluhy a pohledávky?",
        card: "oz-741",
        options: [
          {
            text: "Ze zákona patří oběma společně, každému stejným dílem.",
            outcome: "correct",
            verdict: "Bez vypořádání do tří let platí zákonná domněnka: pohledávky a dluhy náleží oběma společně, podíly jsou stejné.",
            wallet: 0,
            cites: [{ law: "oz", par: "741" }],
          },
          {
            text: "Každý má jen ty, které sám podepsal.",
            outcome: "wrong",
            verdict: "Po třech letech bez vypořádání zákon rozhoduje za manžele: dluhy a pohledávky napůl.",
            wallet: -30000,
            cites: [{ law: "oz", par: "741" }],
          },
        ],
      },
    ],
  },

  // ===== Nové nástrahy: arbitr, falešný bankéř, změna výživného =====
  {
    id: "stiznost-u-arbitra",
    title: "Spor s věřitelem",
    teaser: "Věřitel si účtuje, na co nemá nárok.",
    story:
      "Věřitel {D} naúčtoval poplatek, na který podle zákona nemá nárok. {N} to reklamoval{a}, ale věřitel odpověděl, že poplatek „je ve smlouvě“ a trvá na něm.",
    lesson: { topic: "uvery-a-dluhy", lesson: "prodleni-a-sankce" },
    rounds: [
      {
        prompt: "{N} chce spor řešit u finančního arbitra. Co musí mít v ruce?",
        card: "zfa-10-1",
        options: [
          {
            text: "Doklad, že věřitele nejdřív neúspěšně vyzval{a} k nápravě – třeba tu zamítnutou reklamaci.",
            outcome: "correct",
            verdict: "Návrh musí obsahovat doklad o tom, že instituce byla neúspěšně vyzvána k nápravě. Zamítnutá písemná reklamace to splňuje.",
            wallet: 0,
            cites: [{ law: "zfa", par: "10", odst: 1, pism: "b" }],
          },
          {
            text: "Nic, k arbitrovi se jde rovnou.",
            outcome: "partial",
            verdict: "Bez dokladu o neúspěšné výzvě k nápravě má návrh vadu a arbitr vyzve k jejímu odstranění.",
            wallet: 0,
            cites: [{ law: "zfa", par: "10", odst: 1, pism: "b" }, { law: "zfa", par: "10", odst: 3 }],
          },
          {
            text: "Nejdřív žalobu u soudu, arbitr až potom.",
            outcome: "wrong",
            verdict: "Probíhá-li v téže věci řízení u soudu, je návrh k arbitrovi nepřípustný. Je to buď–anebo.",
            wallet: -3000,
            cites: [{ law: "zfa", par: "9", pism: "b" }],
          },
        ],
      },
      {
        prompt: "Kolik řízení u arbitra stojí?",
        card: "zfa-18-1",
        options: [
          {
            text: "Nezpoplatňuje se; každý nese jen své náklady (třeba poštovné).",
            outcome: "correct",
            verdict: "Každý účastník nese své náklady sám a řízení se nezpoplatňuje. Advokát není povinný.",
            wallet: 0,
            cites: [{ law: "zfa", par: "18", odst: 1 }],
          },
          {
            text: "Soudní poplatek 1 000 Kč.",
            outcome: "wrong",
            verdict: "Žádný poplatek se neplatí – to je hlavní výhoda arbitra proti soudu.",
            wallet: -1000,
            cites: [{ law: "zfa", par: "18", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Arbitr dá {D} za pravdu. Co to znamená pro věřitele?",
        card: "zfa-17a",
        options: [
          {
            text: "Vrátí poplatek a navíc zaplatí státu sankci – 10 % z částky, nejméně 15 000 Kč.",
            outcome: "correct",
            verdict: "V nálezu, kterým arbitr vyhoví, uloží instituci i sankci 10 % z přisouzené částky, nejméně 15 000 Kč. Proto se instituce často raději dohodnou.",
            wallet: 2000,
            cites: [{ law: "zfa", par: "17a" }],
          },
          {
            text: "Nic, nález arbitra je jen doporučení.",
            outcome: "wrong",
            verdict: "Nález arbitra je závazný. Instituce musí plnit, a když prohraje, platí navíc sankci.",
            wallet: 0,
            cites: [{ law: "zfa", par: "17a" }],
          },
        ],
      },
    ],
  },
  {
    id: "falesny-bankar",
    title: "Falešný bankéř",
    teaser: "„Váš účet je ohrožen, převeďte peníze.“",
    story:
      "Volá „bezpečnostní oddělení banky“. Na účtu {G} je prý podezřelá platba, a aby peníze nezmizely, má je hned převést na „bezpečný účet“ a potvrdit kód z SMS.",
    lesson: { topic: "investice-a-sporeni", lesson: "ochrana-investora" },
    rounds: [
      {
        prompt: "Co má {N} udělat?",
        card: "zps-165",
        options: [
          {
            text: "Zavěsit a zavolat bance na číslo z karty nebo z webu. Žádný kód nikomu nesdělovat.",
            outcome: "correct",
            verdict:
              "Uživatel musí chránit své bezpečnostní prvky – PIN, hesla, kódy. Banka nikdy nechce převod na „bezpečný účet“.",
            wallet: 0,
            cites: [{ law: "zps", par: "165", pism: "a" }],
          },
          {
            text: "Peníze převést – banka je pak stejně vrátí.",
            outcome: "wrong",
            verdict:
              "Platbu, kterou {N} {sam} zadá a potvrdí, banka zpravidla považuje za autorizovanou. Povinnost vrátit peníze se týká neautorizovaných plateb.",
            wallet: -60000,
            cites: [{ law: "zps", par: "181", odst: 1 }, { law: "zps", par: "165", pism: "a" }],
          },
          {
            text: "Nic nepřevádět, jen nadiktovat kód z SMS.",
            outcome: "wrong",
            verdict:
              "Sdělení kódu je porušení povinnosti chránit bezpečnostní prvky. Při hrubé nedbalosti nese plátce ztrátu v plném rozsahu.",
            wallet: -60000,
            cites: [{ law: "zps", par: "182", odst: 1, pism: "b" }, { law: "zps", par: "165", pism: "a" }],
          },
        ],
      },
      {
        prompt: "Jiný den {D} ukradnou kabelku s kartou. Než kartu zablokuje, někdo s ní zaplatí 6 000 Kč. Kolik ztratí?",
        card: "zps-182-1",
        options: [
          {
            text: "Nejvýš částku odpovídající 50 EUR – pokud nejednal{a} podvodně ani hrubě nedbale.",
            outcome: "correct",
            verdict: "Při zneužití ztraceného nebo odcizeného platebního prostředku nese plátce ztrátu do částky odpovídající 50 EUR. Po oznámení ztráty už nic.",
            wallet: -1250,
            cites: [{ law: "zps", par: "182", odst: 1, pism: "a" }, { law: "zps", par: "182", odst: 3 }],
          },
          {
            text: "Celých 6 000 Kč.",
            outcome: "wrong",
            verdict: "Celou ztrátu nese plátce jen při podvodu nebo hrubé nedbalosti (třeba PIN napsaný na kartě).",
            wallet: -6000,
            cites: [{ law: "zps", par: "182", odst: 1 }],
          },
        ],
      },
      {
        prompt: "{N} nahlásí bance neautorizovanou platbu. Do kdy ji banka musí vrátit?",
        card: "zps-181-1",
        options: [
          {
            text: "Nejpozději do konce následujícího pracovního dne.",
            outcome: "correct",
            verdict: "U neautorizované platby musí banka účet uvést do původního stavu nejpozději do konce následujícího pracovního dne po oznámení.",
            wallet: 4750,
            cites: [{ law: "zps", par: "181", odst: 1 }],
          },
          {
            text: "Do 30 dnů, po prošetření.",
            outcome: "wrong",
            verdict: "Zákon dává bance jen do konce následujícího pracovního dne (výjimkou je důvodné podezření z podvodu plátce, které musí oznámit ČNB).",
            wallet: 0,
            cites: [{ law: "zps", par: "181", odst: 1 }, { law: "zps", par: "181", odst: 3 }],
          },
        ],
      },
    ],
  },
  {
    id: "zmena-vyzivneho",
    title: "Výživné po ztrátě práce",
    teaser: "Příjem klesl, výživné zůstalo.",
    story:
      "{N} přišel o práci a jeho příjem klesl o třetinu. Výživné na dvě děti ale pořád platí podle rozsudku z doby, kdy vydělával víc.",
    lesson: { topic: "pohledavky-exekuce-insolvence", lesson: "exekuce" },
    rounds: [
      {
        prompt: "Může si {N} výživné sám snížit, dokud nenajde práci?",
        card: "oz-923-1",
        options: [
          {
            text: "Ne. Buď se rodiče dohodnou, nebo rozhodne soud. Do té doby platí rozsudek.",
            outcome: "correct",
            verdict: "Změní-li se poměry a rodiče se nedohodnou, rozhodne o výživném soud. Snížit si ho sám nelze – nedoplatek by se vymáhal jako přednostní pohledávka.",
            wallet: 0,
            cites: [{ law: "oz", par: "923", odst: 1 }, { law: "osr", par: "279", odst: 2 }],
          },
          {
            text: "Ano, prostě pošle méně.",
            outcome: "wrong",
            verdict: "Rozsudek platí, dokud ho nezmění soud nebo dohoda. Rozdíl je dluh – a výživné se ze mzdy sráží ze dvou třetin.",
            wallet: -12000,
            cites: [{ law: "oz", par: "923", odst: 1 }, { law: "osr", par: "279", odst: 2 }],
          },
        ],
      },
      {
        prompt: "Soud nakonec výživné sníží i zpětně. Musí bývalá žena vrátit, co děti mezitím spotřebovaly?",
        card: "oz-923-2",
        options: [
          {
            text: "Ne – spotřebované výživné se nevrací, přiměřeně se sníží budoucí platby.",
            outcome: "correct",
            verdict: "Při zpětném snížení výživného pro nezletilé dítě se spotřebované výživné nevrací; o přeplatek se přiměřeně sníží dávky splatné v budoucnu.",
            wallet: 3000,
            cites: [{ law: "oz", par: "923", odst: 2 }],
          },
          {
            text: "Ano, celý přeplatek najednou.",
            outcome: "wrong",
            verdict: "Zákon vrácení spotřebovaného výživného vylučuje.",
            wallet: 0,
            cites: [{ law: "oz", par: "923", odst: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: "pozde-podane-priznani",
    title: "Přiznání po termínu",
    teaser: "Zakázky měly přednost, přiznání počkalo.",
    story:
      "Kvůli zakázkám {N} podal{a} daňové přiznání o 20 dní později, než měl{a}. Daň vyšla 40 000 Kč a zaplatil{a} ji hned.",
    lesson: { topic: "dane", lesson: "lhuty-a-sankce" },
    rounds: [
      {
        prompt: "Kolik zaplatí na pokutě za opožděné přiznání?",
        card: "dr-250-3",
        options: [
          {
            text: "Nic – pokuta by vyšla jen na stovky korun a pod 1 000 Kč se nepředepisuje.",
            outcome: "correct",
            verdict:
              "Pokuta je 0,05 % daně za den prodlení: za 20 dní zhruba 1 % ze 40 000 Kč, tedy kolem 400 Kč. Pokuta pod 1 000 Kč se nepředepíše.",
            wallet: 0,
            cites: [{ law: "dr", par: "250", odst: 1, pism: "a" }, { law: "dr", par: "250", odst: 3 }],
          },
          {
            text: "2 000 Kč – pokuta je vždy 5 % daně.",
            outcome: "wrong",
            verdict: "5 % je strop, ne pevná sazba. Počítá se 0,05 % za každý den prodlení.",
            wallet: -2000,
            cites: [{ law: "dr", par: "250", odst: 1, pism: "a" }],
          },
          {
            text: "400 Kč, které přijdou platebním výměrem.",
            outcome: "partial",
            verdict: "Výpočet sedí, ale pokuta pod 1 000 Kč se vůbec nepředepíše – platit se nic nebude.",
            wallet: 0,
            cites: [{ law: "dr", par: "250", odst: 3 }],
          },
        ],
      },
      {
        prompt: "Příští rok se {N} zpozdí o čtyři měsíce a daň vyjde 100 000 Kč. Jaká pokuta hrozí?",
        card: "dr-250-1",
        options: [
          {
            text: "5 000 Kč – za tolik dní by to bylo přes 5 %, ale víc než 5 % daně pokuta být nemůže.",
            outcome: "correct",
            verdict: "Za každý den prodlení 0,05 % daně, nejvýše však 5 % stanovené daně. U 100 000 Kč je strop 5 000 Kč.",
            wallet: -5000,
            cites: [{ law: "dr", par: "250", odst: 1, pism: "a" }],
          },
          {
            text: "6 000 Kč – 0,05 % za každý ze zhruba 120 dnů.",
            outcome: "partial",
            verdict: "Výpočet by tak vyšel, jenže zákon pokutu omezuje na 5 % daně, tedy 5 000 Kč.",
            wallet: -6000,
            cites: [{ law: "dr", par: "250", odst: 1, pism: "a" }],
          },
          {
            text: "Nic, daň byla nakonec zaplacená.",
            outcome: "wrong",
            verdict: "Pokuta se váže k pozdnímu podání přiznání, ne k zaplacení daně. Zaplacení ji neruší.",
            wallet: -5000,
            cites: [{ law: "dr", par: "250", odst: 1 }],
          },
        ],
      },
    ],
  },
];
