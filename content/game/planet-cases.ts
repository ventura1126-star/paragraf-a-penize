import type { GameCase } from "./types";

/**
 * Planeta investic: společný příběh pro všechny postavy. {N} přiletí do technologického města s úsporami
 * a učí se investovat – od rezervy přes akcie, DIP a krypto až po startupy a bubliny. Platí české zákony (2026).
 * Peněžní dopady jsou ilustrativní.
 */
const INV = { topic: "investice-a-sporeni", lesson: "ochrana-investora" };
const TAXI = { topic: "investice-a-sporeni", lesson: "dane-a-produkty-na-stari" };

export const PLANET_CASES: GameCase[] = [
  {
    id: "nejdriv-rezerva",
    title: "Nejdřív rezerva",
    teaser: "Kam s penězi, které můžete potřebovat zítra?",
    story:
      "{N} přiletěl{a} na Planetu investic se 300 000 Kč úspor. Všude kolem svítí reklamy na akcie a krypto. Bankéřka v Bance Nova se ptá: „Kolik z toho můžete potřebovat do roka?“",
    lesson: INV,
    rounds: [
      {
        prompt: "Rezerva 100 000 Kč na nečekané výdaje. Kam s ní?",
        card: "zob-41e-2",
        options: [
          { text: "Na spořicí účet v bance – je dostupný a vklady jsou pojištěné.", outcome: "correct", verdict: "Rezerva má být hned k dispozici a bez rizika ztráty. Vklady u banky jsou pojištěné do částky odpovídající 100 000 EUR.", wallet: 3000, cites: [{ law: "zob", par: "41e", odst: 2 }] },
          { text: "Do akcií jedné firmy, ať vydělává.", outcome: "wrong", verdict: "Akcie mohou být zrovna v propadu, když rezervu potřebujete. Rezerva do akcií nepatří.", wallet: -25000, cites: [{ law: "zob", par: "41e", odst: 2 }] },
          { text: "Doma pod matraci.", outcome: "partial", verdict: "Dostupná je, ale bez úroku a bez ochrany. Inflace ji pomalu ujídá.", wallet: -4000, cites: [{ law: "zob", par: "41e", odst: 2 }] },
        ],
      },
      {
        prompt: "Zbytek chce {N} investovat přes obchodníka s cennými papíry. Co když obchodník zkrachuje?",
        card: "zpkt-130-9",
        options: [
          { text: "Garanční fond nahradí 90 %, nejvýš 20 000 EUR – ale ne ztrátu z poklesu cen.", outcome: "correct", verdict: "Garanční fond chrání před selháním licencovaného obchodníka, ne před tržním rizikem.", wallet: 0, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Stát vrátí všechno, i ztráty.", outcome: "wrong", verdict: "Ztráty z poklesu cen nikdo nenahrazuje. A i při krachu obchodníka je náhrada omezená.", wallet: 0, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Nic, peníze jsou pryč.", outcome: "partial", verdict: "Ne úplně – u licencovaného obchodníka pomůže Garanční fond (90 %, max. 20 000 EUR). Investice samotné bývají vedené odděleně od majetku obchodníka.", wallet: 0, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
        ],
      },
    ],
  },
  {
    id: "investicni-dotaznik",
    title: "Investiční dotazník",
    teaser: "Proč se obchodník vyptává na vaše peníze?",
    story:
      "V Orbit Trade chtějí, aby {N} vyplnil{a} dlouhý dotazník: co ví o investicích, kolik vydělává a jak by snesl{a} ztrátu 30 %. „Je to nutné?“ ptá se {N}.",
    lesson: INV,
    rounds: [
      {
        prompt: "Jak {N} pozná, že Orbit Trade smí investice vůbec nabízet?",
        card: "zpkt-5-1",
        options: [
          { text: "Ověří si ho v seznamu regulovaných subjektů ČNB.", outcome: "correct", verdict: "Obchodník s cennými papíry musí mít povolení České národní banky. Seznam je veřejný.", wallet: 0, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
          { text: "Podle hezkého webu a recenzí.", outcome: "wrong", verdict: "Web a recenze se dají koupit. Rozhoduje povolení ČNB.", wallet: -20000, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
          { text: "Podle toho, kolik slibují.", outcome: "wrong", verdict: "Čím víc slibují, tím víc zbystřete. Licence se ověřuje u ČNB.", wallet: -20000, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
        ],
      },
      {
        prompt: "Má {N} dotazník vyplnit pravdivě, i když přizná, že o investicích moc neví?",
        card: "zpkt-15h-1",
        options: [
          { text: "Ano – obchodník podle něj musí posoudit, co je pro {A} vhodné.", outcome: "correct", verdict: "Obchodník musí zjistit znalosti, zkušenosti, finanční zázemí a toleranci k riziku. Chrání to hlavně vás.", wallet: 0, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
          { text: "Napsat, že je expert, ať nabídnou zajímavější produkty.", outcome: "wrong", verdict: "Pak vám může být nabídnuto něco, čemu nerozumíte a co neunesete. Lhaní v dotazníku je střelba do vlastní nohy.", wallet: -30000, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
          { text: "Nevyplňovat, je to zbytečná byrokracie.", outcome: "partial", verdict: "Bez dotazníku vám obchodník nemůže radit ani spravovat portfolio. Nejde o byrokracii, ale o vaši ochranu.", wallet: 0, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "prodej-akcii",
    title: "Prodej akcií a daně",
    teaser: "Kdy se z prodeje akcií platí daň?",
    story:
      "Na Burze Nova má {N} akcie, které koupil{a} před lety. Kurz vyrostl a kamarádi radí prodat. Jenže co daně?",
    lesson: TAXI,
    rounds: [
      {
        prompt: "Letos {N} prodal{a} akcie jen za 80 000 Kč (drženy 2 roky). Platí daň?",
        card: "zdp-4-1t",
        options: [
          { text: "Ne – prodeje do 100 000 Kč za rok jsou osvobozené.", outcome: "correct", verdict: "Když úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč, je osvobozený.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "t" }] },
          { text: "Ano, 15 % ze všeho.", outcome: "wrong", verdict: "Pod limitem 100 000 Kč ročně se daň neplatí.", wallet: -12000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "t" }] },
          { text: "Ano, protože neuplynuly 3 roky.", outcome: "partial", verdict: "Časový test nesplněn, ale stačí limit: do 100 000 Kč příjmů ročně je prodej osvobozený i dřív.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "t" }, { law: "zdp", par: "4", odst: 1, pism: "u" }] },
        ],
      },
      {
        prompt: "Jiné akcie drží {N} 4 roky a prodá je za 500 000 Kč. Platí daň ze zisku?",
        card: "zdp-4-1u",
        options: [
          { text: "Ne – drženo déle než 3 roky, takže je to osvobozené.", outcome: "correct", verdict: "Při držbě cenného papíru déle než 3 roky je příjem z prodeje od daně osvobozený.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
          { text: "Ano, nad 100 000 Kč se platí vždy.", outcome: "wrong", verdict: "Limit 100 000 Kč je jen jedna z cest. Časový test 3 let osvobozuje i vyšší částky.", wallet: -45000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
          { text: "Prodat to radši na kamaráda.", outcome: "wrong", verdict: "Přepisování na jiné kvůli dani je obcházení zákona – a tady navíc zbytečné.", wallet: -45000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
        ],
      },
      {
        prompt: "Česká firma vyplatila {D} dividendu 10 000 Kč. Kolik přijde na účet?",
        card: "zdp-36-2a",
        options: [
          { text: "8 500 Kč – sráží se 15 %.", outcome: "correct", verdict: "Z dividend z akcií se v Česku sráží zvláštní daň 15 %, kterou odvede firma.", wallet: 0, cites: [{ law: "zdp", par: "36", odst: 2, pism: "a" }] },
          { text: "10 000 Kč, dividendy se nedaní.", outcome: "wrong", verdict: "Dividendy se daní – u českých akcií se 15 % sráží ještě před výplatou.", wallet: 0, cites: [{ law: "zdp", par: "36", odst: 2, pism: "a" }] },
          { text: "7 900 Kč – sráží se 21 %.", outcome: "wrong", verdict: "21 % platí firma ze zisku. Z dividendy se sráží 15 %.", wallet: 0, cites: [{ law: "zdp", par: "36", odst: 2, pism: "a" }] },
        ],
      },
    ],
  },
  {
    id: "dip-na-stari",
    title: "DIP na stáří",
    teaser: "Investování s daňovou výhodou.",
    story:
      "Ve Fondu Galaxy nabízejí dlouhodobý investiční produkt (DIP): {N} si může každý měsíc investovat do ETF a ušetřit na daních. Má to ale háček.",
    lesson: TAXI,
    rounds: [
      {
        prompt: "{N} pošle do DIP 4 000 Kč měsíčně, tedy 48 000 Kč ročně. Co z toho má?",
        card: "zdp-15-6",
        options: [
          { text: "Může si je odečíst od základu daně – celkem nejvýš 48 000 Kč za rok.", outcome: "correct", verdict: "Příspěvky na produkty spoření na stáří (včetně DIP) jde odečíst, všechny dohromady do 48 000 Kč ročně. Při 15% dani je to úspora až 7 200 Kč.", wallet: 7200, cites: [{ law: "zdp", par: "15", odst: 6 }] },
          { text: "Stát mu přidá 340 Kč měsíčně.", outcome: "partial", verdict: "To je státní příspěvek u doplňkového penzijního spoření. DIP dává odpočet od základu daně.", wallet: 0, cites: [{ law: "zdp", par: "15", odst: 6 }, { law: "zdps", par: "14", odst: 2 }] },
          { text: "Nic, DIP je jen marketing.", outcome: "wrong", verdict: "Daňová výhoda je reálná – odpočet až 48 000 Kč ročně.", wallet: 0, cites: [{ law: "zdp", par: "15", odst: 6 }] },
        ],
      },
      {
        prompt: "Kdy může {N} peníze z DIP vybrat bez ztráty daňové výhody?",
        card: "zdp-15b-1",
        options: [
          { text: "Po 10 letech, nejdřív v roce, kdy mu bude 60.", outcome: "correct", verdict: "Výplata musí být až po 120 měsících od vzniku produktu a nejdříve v roce, kdy poplatníkovi bude 60 let.", wallet: 0, cites: [{ law: "zdp", par: "15b", odst: 1 }] },
          { text: "Kdykoli po roce.", outcome: "wrong", verdict: "DIP je na stáří: 10 let a 60 let věku jsou podmínky daňové podpory.", wallet: 0, cites: [{ law: "zdp", par: "15b", odst: 1 }] },
          { text: "Až v důchodu, nejdřív v 65.", outcome: "partial", verdict: "Hranice je 60 let, ne 65 – a zároveň aspoň 10 let od založení.", wallet: 0, cites: [{ law: "zdp", par: "15b", odst: 1 }] },
        ],
      },
      {
        prompt: "Po pěti letech potřebuje {N} peníze na auto. V DIP má 240 000 Kč. Co udělá?",
        card: "zdp-15b-4",
        options: [
          { text: "Auto zaplatí z rezervy nebo levnějšího auta a DIP nechá do důchodu.", outcome: "correct", verdict: "Správně: při předčasném výběru by se vracela daňová podpora. DIP je na stáří, na auto má sloužit rezerva.", wallet: 0, cites: [{ law: "zdp", par: "15b", odst: 4 }] },
          { text: "Vybere DIP a počítá s tím, že vrátí daňovou podporu.", outcome: "partial", verdict: "Jde to, ale předčasný výběr znamená navrácení daňové podpory – za pět let asi 36 000 Kč.", wallet: -36000, cites: [{ law: "zdp", par: "15b", odst: 4 }] },
          { text: "Vybere DIP, úleva mu přece zůstane.", outcome: "wrong", verdict: "Nezůstane. Při předčasném výběru se daňová podpora vrací – a kdo ji nepřizná, riskuje doměření s penále.", wallet: -43000, cites: [{ law: "zdp", par: "15b", odst: 4 }, { law: "dr", par: "251", odst: 1 }] },
        ],
      },
    ],
  },
  {
    id: "krypto",
    title: "Krypto a daně",
    teaser: "Bitcoin vyrostl. A co finanční úřad?",
    story:
      "V Krypto směnárně svítí grafy. {N} kdysi koupil{a} trochu kryptoměn a teď je chce prodat.",
    lesson: TAXI,
    rounds: [
      {
        prompt: "Letos {N} prodá kryptoměny za 60 000 Kč (drženy rok). Platí daň?",
        card: "zdp-4-1zj",
        options: [
          { text: "Ne – prodeje kryptoaktiv do 100 000 Kč za rok jsou osvobozené.", outcome: "correct", verdict: "Úhrn příjmů z prodeje kryptoaktiv do 100 000 Kč ročně je od daně osvobozený.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zj" }] },
          { text: "Ano, krypto se daní vždy.", outcome: "wrong", verdict: "Dnes platí i pro kryptoaktiva limit 100 000 Kč za rok a časový test 3 let.", wallet: -9000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zj" }] },
          { text: "Krypto úřad nevidí, takže je to jedno.", outcome: "wrong", verdict: "Směnárny a burzy hlásí obchody a stopy na blockchainu nezmizí. Tady je navíc prodej osvobozený legálně.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zj" }] },
        ],
      },
      {
        prompt: "Jiné krypto drží {N} 4 roky a prodá za 400 000 Kč. Daň?",
        card: "zdp-4-1zk",
        options: [
          { text: "Osvobozeno – držba přesáhla 3 roky.", outcome: "correct", verdict: "Příjem z prodeje kryptoaktiva drženého déle než 3 roky je osvobozený (horní limit se týká až příjmů v desítkách milionů).", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zk" }, { law: "zdp", par: "4", odst: 3 }] },
          { text: "15 % z celé částky.", outcome: "wrong", verdict: "Při držbě nad 3 roky se daň neplatí.", wallet: -40000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zk" }] },
          { text: "Osvobozeno jen do 100 000 Kč.", outcome: "partial", verdict: "Limit 100 000 Kč je cesta pro krátkou držbu. Po 3 letech je osvobozený i vyšší příjem.", wallet: -20000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "zk" }] },
        ],
      },
    ],
  },
  {
    id: "startup",
    title: "Podíl ve startupu",
    teaser: "Kamarádova firma hledá investora.",
    story:
      "Ve Startup Hubu shání kamarád z kurzu peníze na aplikaci pro chytré zavlažování. Nabízí {D} 10% podíl ve své s.r.o. za 200 000 Kč.",
    lesson: TAXI,
    rounds: [
      {
        prompt: "Když startup zkrachuje a nechá dluhy, ručí za ně {N} jako společník?",
        card: "zok-132-1",
        options: [
          { text: "Jen do výše svého nesplaceného vkladu – jinak přijde „jen“ o vložené peníze.", outcome: "correct", verdict: "Společník s.r.o. ručí do výše nesplněné vkladové povinnosti. Riziko je ztráta investice, ne dluhy firmy.", wallet: 0, cites: [{ law: "zok", par: "132", odst: 1 }] },
          { text: "Ano, celým majetkem.", outcome: "wrong", verdict: "To platí pro podnikatele fyzickou osobu, ne pro společníka s.r.o.", wallet: 0, cites: [{ law: "zok", par: "132", odst: 1 }] },
          { text: "Ne, startup nemůže zkrachovat.", outcome: "wrong", verdict: "Většina startupů neuspěje. Do startupu dávejte jen peníze, o které můžete přijít.", wallet: -50000, cites: [{ law: "zok", par: "132", odst: 1 }] },
        ],
      },
      {
        prompt: "Startup se povedl. Po 6 letech chce velká firma podíl koupit za 2 miliony. Platí {N} daň?",
        card: "zdp-4-1q",
        options: [
          { text: "Ne – podíl v s.r.o. držený déle než 5 let se prodává bez daně.", outcome: "correct", verdict: "Příjem z prodeje podílu v obchodní korporaci je osvobozený, když doba držby přesáhne 5 let.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "q" }] },
          { text: "Ano, 15 % ze zisku.", outcome: "wrong", verdict: "U podílu v s.r.o. platí časový test 5 let – po něm je prodej osvobozený.", wallet: -60000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "q" }] },
          { text: "Ne, stačí 3 roky jako u akcií.", outcome: "partial", verdict: "Výsledek sedí, důvod ne: u podílu v s.r.o. je časový test 5 let, 3 roky platí pro cenné papíry.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "q" }, { law: "zdp", par: "4", odst: 1, pism: "u" }] },
        ],
      },
    ],
  },
  {
    id: "garance-vynosu",
    title: "30 % měsíčně",
    teaser: "„Garantovaný výnos“ v Crypto Guru Academy.",
    story:
      "Guru v zářivé mikině slibuje: „Náš trading bot vydělává 30 % měsíčně. Garantovaně! Přiveďte kamarády a dostanete bonus.“",
    lesson: INV,
    rounds: [
      {
        prompt: "Co si má {N} ověřit jako první?",
        card: "zpkt-5-1",
        options: [
          { text: "Jestli má firma povolení ČNB – a když ne, odejít.", outcome: "correct", verdict: "Kdo nabízí investiční služby bez povolení ČNB, porušuje zákon. Garantovaný vysoký výnos a bonus za nábor jsou znaky pyramidy.", wallet: 0, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
          { text: "Kolik už vydělali kamarádi.", outcome: "wrong", verdict: "U pyramid první vkladatelé opravdu „vydělají“ – z peněz těch dalších. Pak se systém zhroutí.", wallet: -50000, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
          { text: "Jak rychle jde peníze vybrat.", outcome: "partial", verdict: "Zbystřit je dobře, ale rozhoduje licence ČNB. Výběry fungují jen do chvíle, než pyramida padne.", wallet: -30000, cites: [{ law: "zpkt", par: "5", odst: 1 }] },
        ],
      },
      {
        prompt: "Guru tvrdí: „Jsme pojištěni Garančním fondem.“ Je to pravda?",
        card: "zpkt-130-9",
        options: [
          { text: "Garanční fond kryje jen klienty licencovaných obchodníků, a ne ztráty z investic.", outcome: "correct", verdict: "Bez licence žádná náhrada. A ani licencovaný obchodník neručí za ztrátu z poklesu cen.", wallet: 0, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Ano, do 20 000 EUR.", outcome: "wrong", verdict: "Fond se týká jen licencovaných obchodníků s cennými papíry – ne podvodné „akademie“.", wallet: -40000, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Ano, celý vklad.", outcome: "wrong", verdict: "Ani u licencovaného obchodníka nekryje fond celý vklad – nejvýš 90 % a 20 000 EUR.", wallet: -40000, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
        ],
      },
    ],
  },
  {
    id: "bublina",
    title: "Unicorn Tower: bublina",
    teaser: "IPO, hype a velký propad.",
    boss: true,
    story:
      "V Unicorn Tower se chystá IPO firmy, o které mluví celá planeta. Akcie letí nahoru, influenceři křičí „to the moon“. {N} má v investicích 400 000 Kč a cítí, že teď nebo nikdy.",
    lesson: INV,
    rounds: [
      {
        prompt: "Prodejce v Unicorn Tower chce {D} prodat akcie IPO bez dotazníku: „Na to není čas!“ Co {N} udělá?",
        card: "zpkt-15h-1",
        options: [
          { text: "Trvat na tom, že obchodník musí znát cíle a toleranci k riziku {G} – nebo odejít.", outcome: "correct", verdict: "Při radě nebo správě portfolia musí obchodník zjistit znalosti, zkušenosti, finance a toleranci k riziku. Spěch je varovný signál.", wallet: 0, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
          { text: "Dát všech 400 000 Kč do IPO, dokud je čas.", outcome: "wrong", verdict: "Všechno do jedné akcie v hypu je hazard. Žádná diverzifikace, žádná rezerva.", wallet: -80000, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
          { text: "Dát do IPO malou část, kterou může ztratit.", outcome: "partial", verdict: "Rozumnější, ale obchodník stejně musí posoudit vhodnost. Spěch bez dotazníku je špatné znamení.", wallet: -10000, cites: [{ law: "zpkt", par: "15h", odst: 1 }] },
        ],
      },
      {
        prompt: "Trhy spadly o 30 %. {N} má rozložené ETF koupené před 2,5 lety a v zisku. Prodat hned?",
        card: "zdp-4-1u",
        options: [
          { text: "Ne – dlouhodobě vydržet; za půl roku navíc splní časový test a zisk bude bez daně.", outcome: "correct", verdict: "Panický prodej uzamkne ztrátu. A po 3 letech držby je prodej osvobozený od daně.", wallet: 0, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
          { text: "Prodat všechno, než to spadne víc.", outcome: "wrong", verdict: "Prodej v panice: uzamknutá ztráta a navíc daň ze zisku, protože neuplynuly 3 roky.", wallet: -60000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
          { text: "Prodat a za výdělek koupit krypto.", outcome: "wrong", verdict: "Útěk z jednoho rizika do většího. A z prodeje před 3 lety se platí daň.", wallet: -80000, cites: [{ law: "zdp", par: "4", odst: 1, pism: "u" }] },
        ],
      },
      {
        prompt: "Online platforma, přes kterou {N} kupoval{a} akcie IPO, zkrachovala. Na co má nárok?",
        card: "zpkt-130-9",
        options: [
          { text: "Pokud měla licenci, z Garančního fondu 90 %, nejvýš 20 000 EUR.", outcome: "correct", verdict: "Garanční fond kryje klienty licencovaných obchodníků, když jim obchodník nemůže vydat majetek – do 90 % a 20 000 EUR. Z 40 000 Kč na platformě se vrátí 36 000 Kč.", wallet: -4000, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Na celou částku od státu.", outcome: "wrong", verdict: "Náhrada je omezená a jen u licencovaných obchodníků.", wallet: -40000, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
          { text: "Na nic, nikdy.", outcome: "partial", verdict: "U licencovaného obchodníka existuje Garanční fond. Proto se vyplatí licenci ověřit předem.", wallet: -40000, cites: [{ law: "zpkt", par: "130", odst: 9 }] },
        ],
      },
    ],
  },
];
