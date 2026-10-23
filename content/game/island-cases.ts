import type { GameCase } from "./types";

/**
 * Daňový ráj: příběh pro všechny postavy po dokončení Města dluhů. {N} rozjíždí na ostrově půjčovnu
 * paddleboardů – od živnostenského listu přes DPH až po vlastní s.r.o. Platí české zákony (2026).
 * Peněžní dopady jsou ilustrativní.
 */
const TAX = "dane";
const L1 = { topic: TAX, lesson: "priznani-slevy-odpocty" };
const L2 = { topic: TAX, lesson: "lhuty-a-sankce" };

export const ISLAND_CASES: GameCase[] = [
  {
    id: "zivnostensky-list",
    title: "Živnostenský list",
    teaser: "Půjčovna paddleboardů potřebuje papíry.",
    story:
      "{N} dorazil{a} na ostrov s nápadem: půjčovat turistům paddleboardy. Prkna jsou objednaná, pláž vybraná. Chybí jen to nejdůležitější – oprávnění podnikat.",
    lesson: L1,
    rounds: [
      {
        prompt: "Od kdy smí {N} prkna legálně půjčovat, když ohlásí volnou živnost?",
        card: "zz-10-1",
        options: [
          { text: "Hned dnem ohlášení živnosti.", outcome: "correct", verdict: "U ohlašovací živnosti vzniká oprávnění dnem ohlášení. Výpis ze živnostenského rejstříku přijde potom.", wallet: 0, cites: [{ law: "zz", par: "10", odst: 1 }] },
          { text: "Až za měsíc, po schválení úřadem.", outcome: "partial", verdict: "Na schválení se u ohlašovací živnosti nečeká – oprávnění vzniká už dnem ohlášení. {N} by zbytečně ztratil{a} začátek sezóny.", wallet: -8000, cites: [{ law: "zz", par: "10", odst: 1 }] },
          { text: "Hned teď, papíry počkají.", outcome: "wrong", verdict: "Podnikat bez živnostenského oprávnění je neoprávněné podnikání. Nejdřív ohlášení, pak půjčovna.", wallet: -15000, cites: [{ law: "zz", par: "10", odst: 1 }] },
        ],
      },
      {
        prompt: "Úřednice se ptá: „Chcete rovnou vyřídit i sociálku a pojištění?“ Co {N} odpoví?",
        card: "zz-45a-1",
        options: [
          { text: "Ano – na živnostenském úřadě oznámím i zahájení činnosti a přihlásím se k důchodovému pojištění.", outcome: "correct", verdict: "Živnostenský úřad funguje jako jednotné registrační místo. Jedna návštěva místo tří.", wallet: 0, cites: [{ law: "zz", par: "45a", odst: 1 }] },
          { text: "Ne, to se dělá jen osobně na každém úřadě zvlášť.", outcome: "partial", verdict: "Jde to, ale zbytečně. Oznámení pro sociální pojištění i přihlášku lze podat přímo s ohlášením živnosti.", wallet: -500, cites: [{ law: "zz", par: "45a", odst: 1 }] },
          { text: "Pojištění se OSVČ netýká.", outcome: "wrong", verdict: "Týká – OSVČ platí sociální i zdravotní pojištění. Kdo zahájení činnosti neoznámí, riskuje pokuty a dlužné pojistné.", wallet: -6000, cites: [{ law: "zz", par: "45a", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "pausalni-vydaje",
    title: "Paušál, nebo účtenky?",
    teaser: "První rok: 600 000 Kč příjmů a krabice účtenek.",
    story:
      "První sezóna vyšla: {N} vybral{a} na půjčovném 600 000 Kč. Skutečné výdaje dělaly asi 200 000 Kč, ale půlka účtenek se rozmočila v laguně.",
    lesson: L1,
    rounds: [
      {
        prompt: "Kolik výdajů může {N} uplatnit bez dokládání účtenek?",
        card: "zdp-7-7",
        options: [
          { text: "60 % z příjmů, tedy 360 000 Kč – je to živnost.", outcome: "correct", verdict: "Půjčovna je živnost, ne řemeslo: paušál 60 %. Výdaje 360 000 Kč jsou navíc víc než skutečných 200 000 Kč.", wallet: 18000, cites: [{ law: "zdp", par: "7", odst: 7, pism: "b" }] },
          { text: "80 % z příjmů – živnost je živnost.", outcome: "wrong", verdict: "80 % platí jen pro řemeslné živnosti a zemědělství. Půjčovna má 60 % a přiznání s 80 % by úřad doměřil.", wallet: -12000, cites: [{ law: "zdp", par: "7", odst: 7, pism: "a" }] },
          { text: "Jen doložené účtenky, asi 100 000 Kč.", outcome: "partial", verdict: "Smí, ale proč? Paušál 60 % dává 360 000 Kč výdajů bez jediné účtenky.", wallet: -9000, cites: [{ law: "zdp", par: "7", odst: 7, pism: "b" }] },
        ],
      },
      {
        prompt: "Musí {N} vůbec podávat daňové přiznání?",
        card: "zdp-38g-1",
        options: [
          { text: "Ano, roční příjmy přesáhly 50 000 Kč.", outcome: "correct", verdict: "Přiznání podává každý, komu zdanitelné příjmy za rok přesáhly 50 000 Kč.", wallet: 0, cites: [{ law: "zdp", par: "38g", odst: 1 }] },
          { text: "Ne, na ostrově se přiznání nepodává.", outcome: "wrong", verdict: "Daňový ráj je jen jméno ostrova. Daňová povinnost platí dál – a pozdní přiznání znamená pokutu.", wallet: -6000, cites: [{ law: "zdp", par: "38g", odst: 1 }, { law: "dr", par: "250", odst: 1 }] },
          { text: "Jen když zisk přesáhne milion.", outcome: "wrong", verdict: "Hranice je 50 000 Kč příjmů za rok, ne milion zisku.", wallet: -6000, cites: [{ law: "zdp", par: "38g", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "zalohy-na-pojisteni",
    title: "Zálohy na pojištění",
    teaser: "Kolik si z výdělku vezme sociálka a pojišťovna?",
    story:
      "Rok skončil líp, než {N} čekal{a}: 1 000 000 Kč příjmů, s paušálem 60 % daňový základ 400 000 Kč. Pak přišel e-mail ze správy sociálního zabezpečení a od zdravotní pojišťovny: přehledy za rok a nové zálohy.",
    lesson: L1,
    rounds: [
      {
        prompt: "Daňový základ ze živnosti je 400 000 Kč. Z čeho a kolik se platí na sociální pojištění?",
        card: "zpsz-5b-1",
        options: [
          { text: "Z 55 % základu, tedy 220 000 Kč, sazbou 29,2 %.", outcome: "correct", verdict: "Vyměřovací základ je 55 % daňového základu a sazba 29,2 % – zhruba 64 200 Kč za rok. Nikdy ale méně, než kolik vychází ze zákonného minima.", wallet: 0, cites: [{ law: "zpsz", par: "5b", odst: 1 }, { law: "zpsz", par: "7", odst: 1, pism: "e" }, { law: "zpsz", par: "14", odst: 5 }] },
          { text: "Z celého 1 000 000 Kč příjmů.", outcome: "wrong", verdict: "Pojistné se nepočítá z příjmů, ale z části daňového základu (zisku): u důchodového pojištění 55 %.", wallet: -15000, cites: [{ law: "zpsz", par: "5b", odst: 1 }] },
          { text: "Pevně 15 % ze zisku.", outcome: "wrong", verdict: "15 % je sazba daně z příjmů. Pojistné OSVČ má sazbu 29,2 % z 55 % základu.", wallet: -5000, cites: [{ law: "zpsz", par: "7", odst: 1, pism: "e" }] },
        ],
      },
      {
        prompt: "Kamarád radí: „Když vykážeš skoro nulový zisk, zdravotní neplatíš.“ Má pravdu?",
        card: "zpvzp-3a-2",
        options: [
          { text: "Ne – při nízkém zisku se platí aspoň z minimálního vyměřovacího základu.", outcome: "correct", verdict: "Zdravotní pojištění OSVČ je 13,5 % z 50 % základu, ale nejméně z minimálního vyměřovacího základu.", wallet: 0, cites: [{ law: "zpvzp", par: "3a", odst: 2 }, { law: "zpvzp", par: "2", odst: 1 }] },
          { text: "Ano, bez zisku žádné pojistné.", outcome: "wrong", verdict: "Minimum se platí i při nulovém zisku (výjimky jsou úzké, třeba když OSVČ zároveň platí pojistné jako zaměstnanec). Dlužné pojistné pak roste o penále.", wallet: -9000, cites: [{ law: "zpvzp", par: "3a", odst: 2 }] },
          { text: "Ano, stačí se odhlásit u pojišťovny.", outcome: "wrong", verdict: "Zdravotní pojištění je povinné. Odhlásit se z něj nejde, dokud {N} na ostrově podniká jako česká OSVČ.", wallet: -9000, cites: [{ law: "zpvzp", par: "3a", odst: 2 }] },
        ],
      },
    ],
  },
  {
    id: "pausalni-dan",
    title: "Paušální daň",
    teaser: "Jedna platba měsíčně místo tří přehledů?",
    story:
      "Daňový poradce pod palmou nabízí řešení: „Paušální režim. Platíte jednu částku měsíčně a máte klid.“ {N} si přes zimu přivydělává i jako recepční v hotelu na částečný úvazek.",
    lesson: L1,
    rounds: [
      {
        prompt: "Může {N} vstoupit do paušálního režimu, když má i práci v hotelu?",
        card: "zdp-2a-1",
        options: [
          { text: "Ne – paušální režim nejde kombinovat s příjmy ze zaměstnání.", outcome: "correct", verdict: "Podmínkou je, že poplatník nemá příjmy ze závislé činnosti (kromě těch zdaněných srážkou), není plátce DPH a další.", wallet: 0, cites: [{ law: "zdp", par: "2a", odst: 1, pism: "c" }] },
          { text: "Ano, úvazek nehraje roli.", outcome: "wrong", verdict: "Hraje. S příjmy ze zaměstnání do paušálního režimu vstoupit nelze – úřad by daň stanovil běžně a doměřil.", wallet: -10000, cites: [{ law: "zdp", par: "2a", odst: 1, pism: "c" }] },
          { text: "Ano, pokud je úvazek menší než polovina.", outcome: "wrong", verdict: "Zákon velikost úvazku neřeší – rozhoduje, že příjmy ze závislé činnosti vůbec jsou.", wallet: -10000, cites: [{ law: "zdp", par: "2a", odst: 1, pism: "c" }] },
        ],
      },
      {
        prompt: "O rok později už {N} v hotelu nepracuje a do paušálu vstoupil{a}. Sezóna ale vyšla nad čekání a příjmy přerostly zvolené pásmo. Co teď?",
        card: "zdp-7a-1",
        options: [
          { text: "Oznámit úřadu jinou výši paušální daně podle vyššího pásma.", outcome: "correct", verdict: "Když příjmy přesáhnou zvolené pásmo, ale ne vyšší, stačí oznámit paušální daň odpovídající vyššímu pásmu.", wallet: -4000, cites: [{ law: "zdp", par: "7a", odst: 1, pism: "a" }] },
          { text: "Nic, paušál platí, ať vydělám kolik chci.", outcome: "wrong", verdict: "Paušální daň platí jen v mezích rozhodných příjmů pásma. Jinak se daň stanoví běžně – s přiznáním a dalšími povinnostmi.", wallet: -12000, cites: [{ law: "zdp", par: "7a", odst: 1 }] },
          { text: "Rozdělit příjmy na kamaráda.", outcome: "wrong", verdict: "Převádět vlastní příjmy na jiného je zkrácení daně, ne optimalizace.", wallet: -25000, cites: [{ law: "zdp", par: "7a", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "dph-obrat",
    title: "Dva miliony obratu",
    teaser: "Půjčovna roste. Přichází DPH.",
    story:
      "Druhá sezóna: {N} přikoupil{a} dvacet prken a otevřel{a} pobočku u přístavu. V září účetní hlásí: „Obrat za letošek je 2 100 000 Kč.“",
    lesson: L1,
    rounds: [
      {
        prompt: "Od kdy je {N} plátcem DPH?",
        card: "zdph-6-1",
        options: [
          { text: "Od 1. ledna příštího roku.", outcome: "correct", verdict: "Při obratu přes 2 000 000 Kč za rok se osoba stává plátcem od prvního dne následujícího roku.", wallet: 0, cites: [{ law: "zdph", par: "6", odst: 1 }] },
          { text: "Zpětně od začátku roku.", outcome: "wrong", verdict: "Zpětně ne. Plátcem je od 1. ledna dalšího roku – nebo dřív, jen kdyby obrat přerostl 2 536 500 Kč.", wallet: -20000, cites: [{ law: "zdph", par: "6", odst: 1 }] },
          { text: "Nikdy, malé firmy DPH neplatí.", outcome: "wrong", verdict: "Hranice malého podniku je právě 2 000 000 Kč obratu. Kdo ji překročí, stává se plátcem.", wallet: -30000, cites: [{ law: "zdph", par: "6", odst: 1 }] },
        ],
      },
      {
        prompt: "Do kdy musí {N} podat přihlášku k registraci k DPH?",
        card: "zdph-94-1",
        options: [
          { text: "Do 10 pracovních dnů od překročení obratu.", outcome: "correct", verdict: "Přihlášku je třeba podat do 10 pracovních dnů ode dne, kdy obrat hranici překročil.", wallet: 0, cites: [{ law: "zdph", par: "94", odst: 1 }] },
          { text: "Do konce roku, stačí s přiznáním.", outcome: "wrong", verdict: "Lhůta je jen 10 pracovních dnů. Pozdní registrace = daň, kterou plátce neodvedl, plus sankce.", wallet: -15000, cites: [{ law: "zdph", par: "94", odst: 1 }] },
          { text: "Úřad se ozve sám.", outcome: "wrong", verdict: "Registrace je povinnost podnikatele, ne úřadu.", wallet: -15000, cites: [{ law: "zdph", par: "94", odst: 1 }] },
        ],
      },
      {
        prompt: "Jiný podnikatel z ostrova má obrat 2 600 000 Kč už v říjnu. Kdy se stane plátcem on?",
        card: "zdph-6-2",
        options: [
          { text: "Hned den po překročení 2 536 500 Kč.", outcome: "correct", verdict: "Nad 2 536 500 Kč v roce je osoba plátcem už ode dne následujícího – nečeká se na leden.", wallet: 0, cites: [{ law: "zdph", par: "6", odst: 2, pism: "b" }] },
          { text: "Také od 1. ledna.", outcome: "partial", verdict: "To platí jen pro obrat mezi 2 000 000 a 2 536 500 Kč. Nad tím je plátcem hned následujícím dnem.", wallet: -5000, cites: [{ law: "zdph", par: "6", odst: 2, pism: "b" }] },
          { text: "Až po kontrole finančního úřadu.", outcome: "wrong", verdict: "Plátcovství vzniká ze zákona, ne kontrolou.", wallet: -10000, cites: [{ law: "zdph", par: "6", odst: 2, pism: "b" }] },
        ],
      },
    ],
  },
  {
    id: "faktura-s-dph",
    title: "První faktura s DPH",
    teaser: "Hotel si objednal prkna pro hosty na celé léto.",
    story:
      "Leden, {N} je plátce DPH. Hotel Kokos si objednal pronájem deseti prken na celé léto za 100 000 Kč bez daně. Zároveň {N} koupil{a} nový motorový člun na odvoz prken za 250 000 Kč + DPH.",
    lesson: L1,
    rounds: [
      {
        prompt: "Jakou sazbu DPH dá {N} na fakturu za pronájem prken?",
        card: "zdph-47-1",
        options: [
          { text: "Základní 21 % – pronájem sportovního vybavení není na seznamu snížené sazby.", outcome: "correct", verdict: "Základní sazba je pravidlem. Snížená 12 % se použije jen na zboží a služby výslovně uvedené v přílohách zákona.", wallet: 0, cites: [{ law: "zdph", par: "47", odst: 1 }, { law: "zdph", par: "47", odst: 4 }] },
          { text: "Sníženou 12 %, je to přece turistika.", outcome: "wrong", verdict: "„Turistika“ sama o sobě sníženou sazbu nezakládá. Rozhodují přílohy zákona – a doměřený rozdíl by {N} zaplatil{a} ze svého.", wallet: -9000, cites: [{ law: "zdph", par: "47", odst: 4 }] },
          { text: "Žádnou, hotel si DPH stejně odečte.", outcome: "wrong", verdict: "To, že si odběratel může DPH odečíst, neznamená, že ji dodavatel nemusí účtovat.", wallet: -21000, cites: [{ law: "zdph", par: "47", odst: 1 }] },
        ],
      },
      {
        prompt: "Pronájem začal 1. června. Do kdy musí být faktura (daňový doklad) vystavená?",
        card: "zdph-28-8",
        options: [
          { text: "Do 15 dnů ode dne, kdy vznikla povinnost přiznat daň.", outcome: "correct", verdict: "Plátce musí daňový doklad vystavit do 15 dnů – chybějící doklad zdržuje i odpočet u odběratele.", wallet: 0, cites: [{ law: "zdph", par: "28", odst: 8 }] },
          { text: "Kdykoli do konce roku.", outcome: "wrong", verdict: "Lhůta je 15 dnů. Pozdní doklad je porušení povinnosti plátce.", wallet: -3000, cites: [{ law: "zdph", par: "28", odst: 8 }] },
          { text: "Až když hotel zaplatí.", outcome: "partial", verdict: "Povinnost přiznat daň nevzniká až platbou. Doklad se vystavuje do 15 dnů od vzniku povinnosti přiznat daň.", wallet: -3000, cites: [{ law: "zdph", par: "28", odst: 8 }] },
        ],
      },
      {
        prompt: "A co DPH 52 500 Kč z faktury za člun?",
        card: "zdph-72-1",
        options: [
          { text: "Odečíst si ji – člun slouží podnikání.", outcome: "correct", verdict: "Plátce má nárok na odpočet daně u nákupů, které použije pro svou ekonomickou činnost.", wallet: 52500, cites: [{ law: "zdph", par: "72", odst: 1 }] },
          { text: "Nic, je to náklad jako každý jiný.", outcome: "partial", verdict: "Je to náklad, ale DPH z něj si plátce může odečíst. {N} by zbytečně ztratil{a} 52 500 Kč.", wallet: 0, cites: [{ law: "zdph", par: "72", odst: 1 }] },
          { text: "Odečíst si ji, i když člun jezdí jen na výlety s rodinou.", outcome: "wrong", verdict: "Nárok na odpočet je jen u plnění použitých pro ekonomickou činnost. Soukromý člun by úřad doměřil i s penále.", wallet: -10500, cites: [{ law: "zdph", par: "72", odst: 1 }, { law: "dr", par: "251", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "kontrolni-hlaseni",
    title: "Kontrolní hlášení",
    teaser: "Ještě jeden formulář, na který se zapomíná.",
    story:
      "Účetní odjela na dovolenou na sousední ostrov. {N} přiznání k DPH zvládl{a}, ale v e-mailu z úřadu stojí: „Chybí vám kontrolní hlášení.“",
    lesson: L2,
    rounds: [
      {
        prompt: "Do kdy podává kontrolní hlášení {N} jako fyzická osoba?",
        card: "zdph-101e-2",
        options: [
          { text: "Ve stejné lhůtě jako přiznání k DPH.", outcome: "correct", verdict: "Plátce – fyzická osoba podává kontrolní hlášení ve lhůtě pro podání daňového přiznání. Firmy ho podávají měsíčně do 25 dnů.", wallet: 0, cites: [{ law: "zdph", par: "101e", odst: 2 }] },
          { text: "Jednou ročně s daní z příjmů.", outcome: "wrong", verdict: "Kontrolní hlášení patří k DPH, ne k dani z příjmů. Podává se se stejnou lhůtou jako přiznání k DPH.", wallet: -10000, cites: [{ law: "zdph", par: "101e", odst: 2 }] },
          { text: "Vždy do 25 dnů po konci měsíce.", outcome: "partial", verdict: "To platí pro právnické osoby. Fyzická osoba ho podává ve lhůtě pro přiznání k DPH.", wallet: 0, cites: [{ law: "zdph", par: "101e", odst: 1 }, { law: "zdph", par: "101e", odst: 2 }] },
        ],
      },
      {
        prompt: "Lhůta už uplynula, výzva zatím nepřišla. Co je nejlevnější?",
        card: "zdph-101h-1",
        options: [
          { text: "Podat ho hned sám – pokuta je 1 000 Kč.", outcome: "correct", verdict: "Kdo kontrolní hlášení podá dodatečně sám, bez výzvy, platí 1 000 Kč. Po výzvě je to 10 000 Kč a víc.", wallet: -1000, cites: [{ law: "zdph", par: "101h", odst: 1, pism: "a" }] },
          { text: "Počkat na výzvu úřadu.", outcome: "wrong", verdict: "Po výzvě v náhradní lhůtě je pokuta 10 000 Kč – desetkrát víc.", wallet: -10000, cites: [{ law: "zdph", par: "101h", odst: 1, pism: "b" }] },
          { text: "Nepodat ho vůbec, přiznání stačí.", outcome: "wrong", verdict: "Kdo hlášení nepodá ani na výzvu, riskuje pokutu až 50 000 Kč.", wallet: -30000, cites: [{ law: "zdph", par: "101h", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "zalozeni-sro",
    title: "Vlastní s.r.o.",
    teaser: "Půjčovna se mění ve firmu.",
    story:
      "Paddle Paradise má šest zaměstnanců a dvě pobočky. Daňový poradce doporučuje převést podnikání do s.r.o. Zakládat ji bude {N} {sam}, bez dalších společníků.",
    lesson: L1,
    rounds: [
      {
        prompt: "Kolik musí {N} minimálně vložit do základního kapitálu?",
        card: "zok-142-1",
        options: [
          { text: "Stačí 1 Kč, pokud smlouva neurčí víc.", outcome: "correct", verdict: "Minimální vklad do s.r.o. je 1 Kč. Rozumný kapitál se ale hodí – firma musí platit své dluhy.", wallet: 0, cites: [{ law: "zok", par: "142", odst: 1 }] },
          { text: "200 000 Kč.", outcome: "partial", verdict: "Tolik se vyžadovalo dřív. Dnes je minimum 1 Kč – vklad může být vyšší, ale nemusí.", wallet: -2000, cites: [{ law: "zok", par: "142", odst: 1 }] },
          { text: "Nic, s.r.o. žádný kapitál nemá.", outcome: "wrong", verdict: "Každý společník má vkladovou povinnost – nejméně 1 Kč.", wallet: -2000, cites: [{ law: "zok", par: "142", odst: 1 }] },
        ],
      },
      {
        prompt: "Jak se firma s jedním zakladatelem zakládá?",
        card: "zok-8-2",
        options: [
          { text: "Zakladatelskou listinou ve formě veřejné listiny – u notáře.", outcome: "correct", verdict: "Jediný zakladatel zakládá s.r.o. zakladatelskou listinou, která musí být veřejnou listinou (notářským zápisem).", wallet: -6000, cites: [{ law: "zok", par: "8", odst: 2 }] },
          { text: "Stačí formulář na internetu, bez notáře.", outcome: "wrong", verdict: "Kapitálová společnost vyžaduje veřejnou listinu. Bez ní firma do rejstříku nevznikne.", wallet: -3000, cites: [{ law: "zok", par: "8", odst: 1 }, { law: "zok", par: "8", odst: 2 }] },
          { text: "Ústní dohodou se sebou samým.", outcome: "wrong", verdict: "Firma vzniká zápisem do obchodního rejstříku na základě veřejné listiny, ne dohodou.", wallet: -3000, cites: [{ law: "zok", par: "8", odst: 2 }] },
        ],
      },
      {
        prompt: "Kdyby se firmě nedařilo, ručí {N} za její dluhy celým svým majetkem?",
        card: "zok-132-1",
        options: [
          { text: "Ne, jen do výše nesplaceného vkladu.", outcome: "correct", verdict: "Společníci ručí za dluhy s.r.o. jen do výše, v jaké nesplnili vkladovou povinnost. Pozor ale na osobní záruky, které po nich chce banka.", wallet: 0, cites: [{ law: "zok", par: "132", odst: 1 }] },
          { text: "Ano, vždy celým majetkem.", outcome: "wrong", verdict: "To je rozdíl mezi OSVČ a s.r.o. OSVČ ručí celým majetkem, společník s.r.o. jen do nesplaceného vkladu.", wallet: 0, cites: [{ law: "zok", par: "132", odst: 1 }] },
          { text: "Ne, nikdy a za nic.", outcome: "partial", verdict: "Skoro. Ručení do výše nesplaceného vkladu zůstává – a jednatel může odpovídat za škodu, když firmu řídí nepečlivě.", wallet: 0, cites: [{ law: "zok", par: "132", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "zisk-firmy",
    title: "Zisk a dividenda",
    teaser: "Firma vydělala. Jak se k penězům dostat?",
    story:
      "První rok s.r.o.: zisk před zdaněním 1 000 000 Kč. {N} by si rád{a} vyplatil{a} co nejvíc a koupil{a} si dům u pláže.",
    lesson: L1,
    rounds: [
      {
        prompt: "Kolik zaplatí firma na dani z příjmů?",
        card: "zdp-21-1",
        options: [
          { text: "21 %, tedy 210 000 Kč.", outcome: "correct", verdict: "Sazba daně z příjmů právnických osob je 21 %. Firmě zbude 790 000 Kč.", wallet: 0, cites: [{ law: "zdp", par: "21", odst: 1 }] },
          { text: "15 % jako fyzická osoba.", outcome: "wrong", verdict: "15 % je sazba pro fyzické osoby. Firma platí 21 %.", wallet: -60000, cites: [{ law: "zdp", par: "21", odst: 1 }] },
          { text: "Nic, firma na ostrově je offshore.", outcome: "wrong", verdict: "Česká s.r.o. je český daňový poplatník, ať sídlí její půjčovna kdekoli.", wallet: -210000, cites: [{ law: "zdp", par: "21", odst: 1 }] },
        ],
      },
      {
        prompt: "Z čistého zisku si {N} chce vyplatit podíl na zisku 500 000 Kč. Jaká daň se z něj sráží?",
        card: "zdp-36-2",
        options: [
          { text: "Srážková daň 15 % – firma pošle úřadu 75 000 Kč.", outcome: "correct", verdict: "Z podílu na zisku ze s.r.o. se sráží zvláštní daň 15 %. {N} dostane 425 000 Kč a do přiznání to už nedává.", wallet: 425000, cites: [{ law: "zdp", par: "36", odst: 2, pism: "b" }] },
          { text: "Žádná, zisk už jednou zdaněn byl.", outcome: "wrong", verdict: "Zdanění je dvojí: firma platí 21 % ze zisku, společník 15 % z vyplaceného podílu.", wallet: 400000, cites: [{ law: "zdp", par: "36", odst: 2, pism: "b" }] },
          { text: "Daň 21 % podruhé.", outcome: "wrong", verdict: "Podíl na zisku se daní zvláštní sazbou 15 %, ne 21 %.", wallet: 395000, cites: [{ law: "zdp", par: "36", odst: 2, pism: "b" }] },
        ],
      },
      {
        prompt: "Účetní upozorňuje, že firma má ze minulosti velkou ztrátu a vlastní kapitál je pod základním kapitálem. Smí zisk rozdělit?",
        card: "zok-40-1",
        options: [
          { text: "Ne, dokud by vlastní kapitál klesl pod základní kapitál a nedělitelné fondy.", outcome: "correct", verdict: "Kapitálová společnost nesmí rozdělit zisk, pokud by se tím vlastní kapitál dostal pod tuto hranici. Nejdřív se musí pokrýt ztráta.", wallet: 0, cites: [{ law: "zok", par: "40", odst: 1 }] },
          { text: "Ano, zisk je zisk.", outcome: "wrong", verdict: "Taková výplata je v rozporu se zákonem a jednatel za ni může odpovídat.", wallet: -425000, cites: [{ law: "zok", par: "40", odst: 1 }] },
          { text: "Ano, když to jednatel podepíše.", outcome: "wrong", verdict: "Podpis jednatele zákonné omezení nepřebije.", wallet: -425000, cites: [{ law: "zok", par: "40", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "danova-kontrola",
    title: "Offshore a daňová kontrola",
    teaser: "„Převeďte firmu na ostrov a daně zmizí.“",
    boss: true,
    story:
      "Do půjčovny přišel muž v bílém obleku z Offshore Paradise Ltd.: „Založíme vám firmu na jiném ostrově, zisk tam pošleme přes faktury za ‚poradenství‘ a v Česku nezaplatíte nic.“ O měsíc později přichází dopis: zahájení daňové kontroly.",
    lesson: L2,
    rounds: [
      {
        prompt: "{N} žije a podniká v Česku. Zmizí daně, když zisk pošle do firmy v daňovém ráji?",
        card: "zdp-2-2",
        options: [
          { text: "Ne – daňový rezident ČR daní příjmy z Česka i ze zahraničí.", outcome: "correct", verdict: "Rezident ČR má daňovou povinnost ze všech příjmů. Fiktivní faktury za „poradenství“ by úřad neuznal jako výdaj.", wallet: 0, cites: [{ law: "zdp", par: "2", odst: 2 }] },
          { text: "Ano, ostrov má nulovou daň.", outcome: "wrong", verdict: "Na rezidentství rozhoduje bydliště a pobyt, ne adresa firmy. A uměle přesunutý zisk je daňový únik.", wallet: -250000, cites: [{ law: "zdp", par: "2", odst: 2 }] },
          { text: "Ano, pokud firma vede účty v eurech.", outcome: "wrong", verdict: "Měna na daňovém rezidentství nic nemění.", wallet: -250000, cites: [{ law: "zdp", par: "2", odst: 2 }] },
        ],
      },
      {
        prompt: "Kontrola se týká daně za rok, kdy {N} začínal{a}. Jak daleko zpátky může úřad daň doměřit?",
        card: "dr-148-1",
        options: [
          { text: "Základní lhůta jsou 3 roky od konce lhůty pro řádné přiznání – a kontrola ji prodlužuje.", outcome: "correct", verdict: "Daň nelze stanovit po uplynutí 3 let. Zahájení kontroly ale lhůtu prodlužuje, takže se papíry vyplatí archivovat.", wallet: 0, cites: [{ law: "dr", par: "148", odst: 1 }] },
          { text: "Jen za letošní rok.", outcome: "wrong", verdict: "Úřad může doměřit daň i za starší roky – základní lhůta jsou 3 roky a může se prodloužit.", wallet: -20000, cites: [{ law: "dr", par: "148", odst: 1 }] },
          { text: "Neomezeně.", outcome: "partial", verdict: "Ne neomezeně – lhůta pro stanovení daně je 3 roky a i s prodlužováním končí nejpozději po 10 letech.", wallet: 0, cites: [{ law: "dr", par: "148", odst: 1 }, { law: "dr", par: "148", odst: 5 }] },
        ],
      },
      {
        prompt: "Kontrola našla chybu: v prvním roce {N} odečetl{a} DPH ze soukromého člunu. Úřad doměří 10 500 Kč. Co k tomu?",
        card: "dr-251-1",
        options: [
          { text: "Penále 20 % z doměřené daně, tedy 2 100 Kč – a příště to opravit dodatečným přiznáním dřív.", outcome: "correct", verdict: "Při doměření daně se platí penále 20 %. Kdo chybu sám opraví dodatečným přiznáním, penále neplatí.", wallet: -12600, cites: [{ law: "dr", par: "251", odst: 1, pism: "a" }, { law: "dr", par: "251", odst: 4 }] },
          { text: "Jen samotnou daň, žádnou sankci.", outcome: "wrong", verdict: "Doměřená daň nese penále 20 %. Bez penále se obejde jen ten, kdo chybu opraví sám před kontrolou.", wallet: -12600, cites: [{ law: "dr", par: "251", odst: 1, pism: "a" }] },
          { text: "Nic, kontrolu stačí ignorovat.", outcome: "wrong", verdict: "Ignorovat kontrolu znamená, že úřad stanoví daň bez vás – podle pomůcek a obvykle výš.", wallet: -40000, cites: [{ law: "dr", par: "85", odst: 1 }] },
        ],
      },
    ],
  },
];
