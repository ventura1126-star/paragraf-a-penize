import type { GameCase } from "./types";
import { STORY_CASES } from "./stories";

const DEBT_TOPIC = "pohledavky-exekuce-insolvence";

/** Obecné případy (sdílené více příběhy). Texty obsahují zástupné značky postavy ({N}, {G}, {D}, {A}, {a}, …) – viz characters.ts. Peněžní dopady jsou ilustrativní. */
const BASE_CASES: GameCase[] = [
  {
    id: "dopis-po-peti-letech",
    title: "Dopis po pěti letech",
    teaser: "Agentura vymáhá starý dluh za mobil.",
    story:
      "{N} před pěti lety nezaplatil{a} 12 000 Kč za mobilní tarif. Operátor nikdy nežaloval. Teď přišel dopis od vymáhací agentury s „výhodným splátkovým kalendářem“ a obálkou na podpis.",
    lesson: { topic: DEBT_TOPIC, lesson: "promlceni" },
    rounds: [
      {
        prompt: "Co má {N} udělat?",
        card: "oz-610-1",
        options: [
          {
            text: "Zaplatit celých 12 000 Kč, ať je klid.",
            outcome: "wrong",
            verdict:
              "Promlčený dluh nezaniká, jen ho věřitel u soudu nevymůže. Když ho {N} zaplatí, peníze už zpátky chtít nemůže.",
            wallet: -12000,
            cites: [{ law: "oz", par: "609" }],
          },
          {
            text: "Podepsat splátkový kalendář.",
            outcome: "wrong",
            verdict:
              "Splátkový kalendář obvykle obsahuje písemné uznání dluhu. Tím by {N} spustil{a} novou promlčecí lhůtu deset let a dluh by znovu šel vymáhat.",
            wallet: -12000,
            cites: [{ law: "oz", par: "2053" }, { law: "oz", par: "639" }],
          },
          {
            text: "Nic nepodepisovat; kdyby přišla žaloba, vznést námitku promlčení.",
            outcome: "correct",
            verdict:
              "Bez žaloby uplynula tříletá promlčecí lhůta. Soud k promlčení přihlédne, jen když ho dlužník namítne – a to je přesně ta správná obrana.",
            wallet: 0,
            cites: [{ law: "oz", par: "629", odst: 1 }, { law: "oz", par: "610", odst: 1 }],
          },
          {
            text: "Ignorovat dopis i případnou žalobu.",
            outcome: "partial",
            verdict:
              "Dopis ignorovat lze, žalobu ne. Bez námitky soud k promlčení nepřihlédne a může věřiteli vyhovět – včetně nákladů řízení.",
            wallet: -15000,
            cites: [{ law: "oz", par: "610", odst: 1 }],
          },
        ],
      },
      {
        prompt:
          "Agentura volá: „Stačí podepsat jen potvrzení, že o dluhu víte. Ke splácení vás to nezavazuje.“ Má to {N} podepsat?",
        card: "oz-639",
        options: [
          {
            text: "Ano, potvrzení přece nic nestojí.",
            outcome: "wrong",
            verdict:
              "Písemné potvrzení dluhu co do důvodu i výše je uznání dluhu. Zakládá domněnku, že dluh trvá, a novou promlčecí lhůtu deset let.",
            wallet: -12000,
            cites: [{ law: "oz", par: "2053" }, { law: "oz", par: "639" }],
          },
          {
            text: "Ne. Nepodepisovat nic, co uvádí důvod a výši dluhu.",
            outcome: "correct",
            verdict:
              "Správně. Uznáním dluhu by si {N} {sam} prodloužil{a} možnost vymáhání o deset let.",
            wallet: 0,
            cites: [{ law: "oz", par: "639" }],
          },
          {
            text: "Podepsat, ale připsat „s výhradou“.",
            outcome: "partial",
            verdict:
              "Výhrada nemusí účinky uznání vyloučit – rozhoduje, zda dokument dluh uznává co do důvodu i výše. Bezpečnější je nepodepisovat.",
            wallet: -12000,
            cites: [{ law: "oz", par: "2053" }],
          },
        ],
      },
    ],
  },
  {
    id: "platebni-rozkaz",
    title: "Platební rozkaz z roku 2019",
    teaser: "Starý rozsudek a nová exekuce.",
    story:
      "V roce 2019 soud vydal proti {D} platební rozkaz na 20 000 Kč. {N} ho nezaplatil{a} a rozkaz nabyl právní moci. Teď, v roce 2026, věřitel zahajuje exekuci.",
    lesson: { topic: DEBT_TOPIC, lesson: "promlceni" },
    rounds: [
      {
        prompt: "Může {N} namítnout promlčení?",
        card: "oz-640",
        options: [
          {
            text: "Ano, od roku 2019 uběhly víc než tři roky.",
            outcome: "wrong",
            verdict:
              "Tříletá lhůta platí pro nežalované dluhy. Právo přiznané rozhodnutím soudu se promlčuje za deset let ode dne, kdy se mělo podle rozhodnutí plnit.",
            wallet: -3000,
            cites: [{ law: "oz", par: "640" }],
          },
          {
            text: "Ne, právo z rozhodnutí se promlčuje za deset let. Je potřeba dluh řešit.",
            outcome: "correct",
            verdict:
              "Správně. Exekuce je zahájena včas. {N} by měl{a} využít 30denní lhůtu z výzvy ke splnění, případně řešit splátky nebo oddlužení.",
            wallet: 0,
            cites: [{ law: "oz", par: "640" }, { law: "er", par: "46", odst: 6 }],
          },
          {
            text: "Podá odvolání proti platebnímu rozkazu.",
            outcome: "wrong",
            verdict:
              "Proti platebnímu rozkazu se nepodává odvolání, ale odpor – a lhůta k němu uplynula už v roce 2019. Platební rozkaz je pravomocný; teď lze bránit jen samotnou exekuci, a to z jiných důvodů.",
            wallet: -3000,
            cites: [{ law: "er", par: "55", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "vyrozumeni-o-exekuci",
    title: "Vyrozumění o zahájení exekuce",
    teaser: "8 000 Kč za internet a obálka od exekutora.",
    story:
      "{D} přišlo do datové schránky vyrozumění o zahájení exekuce kvůli 8 000 Kč za internet. Ve výzvě je vyčíslena záloha na snížené náklady exekuce (v našem příkladu 1 500 Kč).",
    lesson: { topic: DEBT_TOPIC, lesson: "exekuce" },
    rounds: [
      {
        prompt: "Dluh je oprávněný. Jak ho {N} vyřeší nejlevněji?",
        card: "er-46-6",
        options: [
          {
            text: "Do 30 dnů od doručení zaplatí dluh i zálohu podle výzvy.",
            outcome: "correct",
            verdict:
              "Zaplatíte-li do 30 dnů dluh i zálohu, exekuce skončí se sníženými náklady. Exekutor vydá příkaz k úhradě nákladů a exekuce je tím provedena.",
            wallet: -9500,
            cites: [{ law: "er", par: "46", odst: 6 }],
          },
          {
            text: "Zaplatí jen 8 000 Kč, záloha je přece navíc.",
            outcome: "partial",
            verdict:
              "Zákon vyžaduje obojí: vymáhaný nárok i zálohu. Bez zálohy exekutor exekuci provede a náklady mohou být vyšší.",
            wallet: -11000,
            cites: [{ law: "er", par: "46", odst: 6 }],
          },
          {
            text: "Nebude se přihlašovat do datové schránky, dokud nebude mít peníze.",
            outcome: "wrong",
            verdict:
              "Doručení do datové schránky nastane i bez přihlášení (po uplynutí zákonné lhůty). Lhůta 30 dnů tak běží dál a {N} o levnější konec přijde.",
            wallet: -14000,
            cites: [{ law: "er", par: "46", odst: 6 }],
          },
          {
            text: "Počká, až exekutor zabaví věci, a pak se dohodne.",
            outcome: "wrong",
            verdict:
              "Po 30 dnech exekutor exekuci provede – srážky ze mzdy, blokace účtu, soupis věcí. Náklady rostou s každým úkonem.",
            wallet: -16000,
            cites: [{ law: "er", par: "46", odst: 6 }],
          },
        ],
      },
      {
        prompt: "Jiná situace: {N} zjistí, že tento dluh už loni zaplatil{a} a má potvrzení z banky. Co udělá?",
        card: "er-55-1",
        options: [
          {
            text: "Do 15 dnů od zjištění podá u exekutora návrh na zastavení exekuce s potvrzením o platbě.",
            outcome: "correct",
            verdict:
              "Správně. Návrh se podává u exekutora do 15 dnů ode dne, kdy se povinný o důvodu dozvěděl, a musí k němu přiložit listiny, které tvrzení dokládají.",
            wallet: 0,
            cites: [{ law: "er", par: "55", odst: 1 }, { law: "er", par: "55", odst: 2 }],
          },
          {
            text: "Napíše exekutorovi krátký e-mail, že je zaplaceno.",
            outcome: "partial",
            verdict:
              "Návrh bez listin, které tvrzení dokládají, exekutor odmítne. Potvrzení o platbě je nutné přiložit.",
            wallet: 0,
            cites: [{ law: "er", par: "55", odst: 2 }],
          },
          {
            text: "Nic, exekutor si to přece ověří sám.",
            outcome: "wrong",
            verdict:
              "Exekutor vychází z exekučního titulu. Bez návrhu povinného exekuce pokračuje – a 15denní lhůta mezitím uplyne.",
            wallet: -8000,
            cites: [{ law: "er", par: "55", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    // Kola 2 a 3 se přepočítávají podle postavy v lib/game/personalize.ts; zde zůstávají jako vzor pro 30 000 Kč a 1 dítě.
    id: "vyplatni-paska",
    title: "Výplatní páska",
    teaser: "Kolik zaměstnavatel smí srazit?",
    story:
      "(Příběh a čísla se dopočítají podle příjmu zvolené postavy – viz lib/game/personalize.ts.)",
    lesson: { topic: DEBT_TOPIC, lesson: "exekuce" },
    rounds: [
      {
        prompt: "Jaká je nezabavitelná částka na samotného {A} (bez vyživovaných osob) v roce 2026?",
        card: "nv595-1-1",
        options: [
          {
            text: "14 102 Kč",
            outcome: "correct",
            verdict:
              "Správně. 85 % ze součtu 4 860 + 9 430 + 2 300 Kč = 14 101,50 Kč, zaokrouhleno na celé koruny nahoru.",
            wallet: 0,
            cites: [{ law: "nv595", par: "1", odst: 1 }, { law: "nv595", par: "3" }],
          },
          {
            text: "4 860 Kč (životní minimum)",
            outcome: "wrong",
            verdict: "Životní minimum je jen jedna ze tří složek. Nezabavitelná částka je 85 % součtu všech tří.",
            wallet: 0,
            cites: [{ law: "nv595", par: "1", odst: 1 }],
          },
          {
            text: "Polovina čisté mzdy",
            outcome: "wrong",
            verdict: "Nezabavitelná částka nezávisí na výši mzdy – je pevně daná nařízením vlády.",
            wallet: 0,
            cites: [{ law: "osr", par: "278" }, { law: "nv595", par: "1", odst: 1 }],
          },
        ],
      },
      {
        prompt:
          "S dítětem činí nezabavitelná částka 17 627 Kč. Zbytek mzdy je 12 373 Kč, po zaokrouhlení na dělitelné třemi 12 372 Kč. Kolik se srazí pro dluh u banky?",
        card: "osr-279-1",
        options: [
          {
            text: "4 124 Kč (jedna třetina)",
            outcome: "correct",
            verdict: "Správně. Pro běžné pohledávky lze srazit jen jednu třetinu zbytku.",
            wallet: -4124,
            cites: [{ law: "osr", par: "279", odst: 1 }],
          },
          {
            text: "8 248 Kč (dvě třetiny)",
            outcome: "wrong",
            verdict: "Dvě třetiny se srážejí jen pro přednostní pohledávky. Úvěr u banky mezi ně nepatří.",
            wallet: -8248,
            cites: [{ law: "osr", par: "279", odst: 1 }, { law: "osr", par: "279", odst: 2 }],
          },
          {
            text: "12 373 Kč (celý zbytek)",
            outcome: "wrong",
            verdict: "Celý zbytek by šel jen nad zákonnou hranici (v roce 2026 cca 31 521 Kč).",
            wallet: -12373,
            cites: [{ law: "osr", par: "279", odst: 3 }, { law: "nv595", par: "2" }],
          },
        ],
      },
      {
        prompt: "Kdyby se místo dluhu u banky vymáhalo dlužné výživné, kolik by se srazilo?",
        card: "osr-279-2",
        options: [
          {
            text: "Stejně, 4 124 Kč",
            outcome: "wrong",
            verdict: "Výživné je přednostní pohledávka. Pro ty se srážejí dvě třetiny.",
            wallet: 0,
            cites: [{ law: "osr", par: "279", odst: 2 }],
          },
          {
            text: "8 248 Kč (dvě třetiny)",
            outcome: "correct",
            verdict: "Správně. Pohledávky výživného jsou přednostní a srážejí se ze dvou třetin zbytku čisté mzdy.",
            wallet: 0,
            cites: [{ law: "osr", par: "279", odst: 1 }, { law: "osr", par: "279", odst: 2 }],
          },
          {
            text: "Výživné se ze mzdy nesráží, platí se jen dobrovolně.",
            outcome: "wrong",
            verdict: "Naopak – výživné je první v zákonném výčtu přednostních pohledávek.",
            wallet: 0,
            cites: [{ law: "osr", par: "279", odst: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: "zablokovany-ucet",
    title: "Zablokovaný účet",
    teaser: "Banka zmrazila účet, nájem je za týden.",
    story:
      "Exekutor nařídil exekuci přikázáním pohledávky z účtu. Banka {D} účet zablokovala a za týden je třeba zaplatit nájem.",
    lesson: { topic: DEBT_TOPIC, lesson: "exekuce" },
    rounds: [
      {
        prompt: "Na co má {N} nárok?",
        card: "osr-304b-1",
        options: [
          {
            text: "Na žádost mu banka vyplatí až trojnásobek životního minima (14 580 Kč), jednou za řízení.",
            outcome: "correct",
            verdict:
              "Správně. Blokace se nevztahuje na prostředky do výše trojnásobku životního minima jednotlivce (3 × 4 860 Kč). Banka je vyplatí na žádost, nejvýše jednou v průběhu jednoho řízení.",
            wallet: 0,
            cites: [{ law: "osr", par: "304b", odst: 1 }, { law: "osr", par: "304b", odst: 2 }],
          },
          {
            text: "Na nic, účet je zablokovaný celý.",
            outcome: "wrong",
            verdict: "Zákon chrání fyzické osobě část prostředků na účtu. Stačí o výplatu požádat banku.",
            wallet: -14580,
            cites: [{ law: "osr", par: "304b", odst: 1 }],
          },
          {
            text: "Každý měsíc mu na účtu zůstane nezabavitelná částka jako u mzdy.",
            outcome: "partial",
            verdict:
              "Nezabavitelná částka je pravidlo pro srážky ze mzdy. U účtu platí jiná ochrana: jednorázová výplata do trojnásobku životního minima za řízení.",
            wallet: 0,
            cites: [{ law: "osr", par: "304b", odst: 2 }, { law: "osr", par: "278" }],
          },
        ],
      },
    ],
  },
  {
    id: "dedictvi-v-oddluzeni",
    title: "Dědictví v oddlužení",
    teaser: "Ve druhém roce oddlužení přijde 200 000 Kč.",
    story: "{N} je druhým rokem v oddlužení splátkovým kalendářem. Zemřel {mu} vzdálený příbuzný a {N} zdědil{a} 200 000 Kč.",
    lesson: { topic: DEBT_TOPIC, lesson: "oddluzeni" },
    rounds: [
      {
        prompt: "Co s dědictvím?",
        card: "iz-412-1",
        options: [
          {
            text: "Vydat ho insolvenčnímu správci a použít na mimořádné splátky.",
            outcome: "correct",
            verdict:
              "Správně. Hodnoty získané dědictvím musí dlužník během oddlužení vydat správci a použít na mimořádné splátky. Peníze sníží dluhy {G} – oddlužení zůstává v bezpečí.",
            wallet: 0,
            cites: [{ law: "iz", par: "412", odst: 1, pism: "b" }],
          },
          {
            text: "Nechat si ho, splátkový kalendář je přece pevný.",
            outcome: "wrong",
            verdict:
              "Zatajení je porušením podstatné povinnosti. Soud může oddlužení zrušit a rozhodnout o konkursu – a dluhy by se vrátily v plné výši.",
            wallet: -150000,
            cites: [{ law: "iz", par: "412", odst: 1, pism: "b" }, { law: "iz", par: "418", odst: 1 }],
          },
          {
            text: "Rychle koupit auto, než se to správce dozví.",
            outcome: "wrong",
            verdict: "To je stejné porušení povinností jako zatajení. Riskuje zrušení oddlužení.",
            wallet: -150000,
            cites: [{ law: "iz", par: "418", odst: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "oddluzeni",
    title: "Pět exekucí najednou",
    teaser: "Cesta z dluhové pasti.",
    boss: true,
    story:
      "Závěrečná zkouška: poradkyně v Dluhové poradně dá {D} skutečný případ, se kterým tu pomáhají. Pan Novák má pět exekucí od různých věřitelů, všechny dluhy jsou déle než rok po splatnosti. Z příjmu mu zbývá jen nezabavitelná částka a dluhy dál rostou. Poraďte mu.",
    lesson: { topic: DEBT_TOPIC, lesson: "oddluzeni" },
    rounds: [
      {
        prompt: "Je pan Novák podle zákona v úpadku?",
        card: "iz-3-1",
        options: [
          {
            text: "Ano: více věřitelů, dluhy přes 30 dnů po splatnosti a neschopnost je platit.",
            outcome: "correct",
            verdict: "Správně. Všechny tři podmínky úpadku jsou splněny současně.",
            wallet: 0,
            cites: [{ law: "iz", par: "3", odst: 1 }, { law: "iz", par: "3", odst: 2 }],
          },
          {
            text: "Ne, protože má stálý příjem.",
            outcome: "wrong",
            verdict:
              "Příjem úpadek nevylučuje. Rozhoduje, zda je schopna splatné dluhy plnit – a neplní je déle než 3 měsíce, což zákon považuje za neschopnost.",
            wallet: 0,
            cites: [{ law: "iz", par: "3", odst: 2 }],
          },
          {
            text: "Jen pokud dluží víc než milion.",
            outcome: "wrong",
            verdict: "Zákon žádnou minimální částku nestanoví.",
            wallet: 0,
            cites: [{ law: "iz", par: "3", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Kdo může panu Novákovi sepsat a podat návrh na oddlužení?",
        card: "iz-390a-1",
        options: [
          {
            text: "Akreditovaná nezisková poradna, advokát, notář, exekutor nebo insolvenční správce.",
            outcome: "correct",
            verdict:
              "Správně. Akreditované osoby (např. některé neziskové dluhové poradny) to dělají zpravidla zdarma.",
            wallet: 0,
            cites: [{ law: "iz", par: "390a", odst: 1 }],
          },
          {
            text: "Jakákoli „oddlužovací agentura“ z inzerátu.",
            outcome: "wrong",
            verdict: "Bez akreditace Ministerstva spravedlnosti agentura návrh podat nesmí. Pan Novák by platil zbytečně.",
            wallet: -8000,
            cites: [{ law: "iz", par: "390a", odst: 1 }],
          },
          {
            text: "Pan Novák si ho podá sám, formulář je na internetu.",
            outcome: "partial",
            verdict:
              "Bez prostředníka ho podat může jen s magisterským právním či ekonomickým vzděláním nebo zkouškou insolvenčního správce.",
            wallet: 0,
            cites: [{ law: "iz", par: "390a", odst: 2 }],
          },
        ],
      },
      {
        prompt: "Soud oddlužení schválí. Jak dlouho bude standardně trvat?",
        card: "iz-412a-1",
        options: [
          {
            text: "3 roky",
            outcome: "correct",
            verdict:
              "Správně. Po novele č. 252/2024 Sb. se osvobození přiznává po 3 letech řádného plnění. Pokud dlužník dostal osvobození už v posledních 20 letech, trvá oddlužení 5 let.",
            wallet: 0,
            cites: [{ law: "iz", par: "412a", odst: 1 }, { law: "iz", par: "412a", odst: 3 }],
          },
          {
            text: "5 let",
            outcome: "partial",
            verdict: "Pět let platilo před 1. 10. 2024 a dnes jen pro opakované oddlužení.",
            wallet: 0,
            cites: [{ law: "iz", par: "412a", odst: 3 }],
          },
          {
            text: "Dokud nesplatí všechno.",
            outcome: "wrong",
            verdict: "Smyslem oddlužení je osvobození od zbytku dluhů po stanovené době, i když nejsou splaceny celé.",
            wallet: 0,
            cites: [{ law: "iz", par: "414", odst: 1 }],
          },
        ],
      },
      {
        prompt: "Na které dluhy osvobození z oddlužení nedosáhne?",
        card: "iz-416-1",
        options: [
          {
            text: "Mimo jiné na zákonné výživné, škody způsobené úmyslně a tresty za úmyslné trestné činy.",
            outcome: "correct",
            verdict: "Osvobození se nedotýká mimo jiné peněžitých trestů za úmyslné trestné činy a pohledávek na zákonném výživném.",
            wallet: 0,
            cites: [{ law: "iz", par: "416", odst: 1 }],
          },
          {
            text: "Na žádné – po třech letech zaniknou všechny.",
            outcome: "wrong",
            verdict: "Patří mezi výjimky z osvobození a zůstávají v plné výši.",
            wallet: 0,
            cites: [{ law: "iz", par: "416", odst: 1 }],
          },
          {
            text: "Jen na dluhy u bank.",
            outcome: "wrong",
            verdict: "Na tom, kdo je věřitel, nezáleží – rozhoduje druh pohledávky.",
            wallet: 0,
            cites: [{ law: "iz", par: "416", odst: 1 }],
          },
        ],
      },
    ],
  },
];

export const CASES: GameCase[] = [...BASE_CASES, ...STORY_CASES];

export const CASE_BY_ID = new Map(CASES.map((c) => [c.id, c]));

/** Případ a kolo, které kartu udělují (pro trénink). */
export function roundForCard(cardId: string, preferIds: string[] = []): { gameCase: GameCase; roundIndex: number } | undefined {
  const ordered = [...preferIds.map((id) => CASE_BY_ID.get(id)).filter((c): c is GameCase => !!c), ...CASES];
  for (const c of ordered) {
    const i = c.rounds.findIndex((r) => r.card === cardId);
    if (i >= 0) return { gameCase: c, roundIndex: i };
  }
  return undefined;
}
