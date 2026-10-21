import type { Character } from "@/content/game/characters";
import { fill } from "@/content/game/characters";
import type { GameCase, Round } from "@/content/game/types";
import type { Citation } from "@/lib/types";
import { computeGarnishment } from "@/lib/garnishment";

const czk = (n: number) => `${new Intl.NumberFormat("cs-CZ").format(n)} Kč`;

function fillRound(r: Round, ch: Character): Round {
  return {
    ...r,
    prompt: fill(r.prompt, ch),
    options: r.options.map((o) => ({ ...o, text: fill(o.text, ch), verdict: fill(o.verdict, ch) })),
  };
}

function dependentsPhrase(n: number): string {
  if (n === 0) return "nikomu neplatí výživné";
  if (n === 1) return "vyživuje jedno dítě";
  if (n === 2) return "vyživuje dvě děti";
  return `vyživuje ${n} ${n < 5 ? "děti" : "dětí"}`;
}

/** Případ „Výplatní páska“ přepočítaný na příjem a vyživované osoby postavy (§ 279 OSŘ, NV 595/2006 Sb.). */
function wageCase(base: GameCase, ch: Character): GameCase {
  const { net, dependents, kind, note } = ch.income;
  const isPension = kind === "duchod";
  const income = isPension ? "důchod" : "čistou mzdu";
  const payer = isPension ? "Plátci důchodu" : "Zaměstnavateli";
  const what = isPension ? "srážkami z důchodu" : "srážkami ze mzdy";
  const incomeCite: Citation[] = isPension ? [{ law: "osr", par: "299", odst: 1, pism: "d" }] : [];

  const r = computeGarnishment({ cistaMzda: net, vyzivovaneOsoby: dependents, prednostni: false });
  const third = r.tretina;
  const remainderRounded = r.zbytekDo - (r.zbytekDo % 3);

  const story =
    `${ch.forms.n} má ${income} ${czk(net)}${note ? ` ${note}` : ""} a ${dependentsPhrase(dependents)}. ` +
    `${payer} přišlo nařízení exekuce ${what} kvůli dluhu u banky. Píše se rok 2026.`;

  const r1 = fillRound(base.rounds[0], ch);
  r1.options = r1.options.map((o) =>
    o.text === "Polovina čisté mzdy" ? { ...o, text: "Polovina příjmu", verdict: "Nezabavitelná částka nezávisí na výši příjmu – je pevně daná nařízením vlády." } : o,
  );

  const nezPrompt =
    dependents === 0
      ? `Nezabavitelná částka je ${czk(r.nezabavitelna)}.`
      : `${dependents === 1 ? "S jednou vyživovanou osobou" : dependents === 2 ? "Se dvěma vyživovanými osobami" : `S ${dependents} vyživovanými osobami`} činí nezabavitelná částka ${czk(r.nezabavitelna)} (čtvrtina základní částky navíc na každou).`;

  const r2: Round = {
    prompt: `${nezPrompt} Zbytek příjmu je ${czk(r.zbytek)}, po zaokrouhlení dolů na částku dělitelnou třemi ${czk(remainderRounded)}. Kolik se srazí pro dluh u banky?`,
    card: "osr-279-1",
    options: [
      {
        text: `${czk(third)} (jedna třetina)`,
        outcome: "correct",
        verdict: `Správně. Pro běžné pohledávky lze srazit jen jednu třetinu zbytku. ${ch.forms.d} zůstane ${czk(net - third)}.`,
        wallet: -third,
        cites: [{ law: "osr", par: "279", odst: 1 }, ...incomeCite],
      },
      {
        text: `${czk(2 * third)} (dvě třetiny)`,
        outcome: "wrong",
        verdict: "Dvě třetiny se srážejí jen pro přednostní pohledávky. Úvěr u banky mezi ně nepatří.",
        wallet: -2 * third,
        cites: [{ law: "osr", par: "279", odst: 1 }, { law: "osr", par: "279", odst: 2 }],
      },
      {
        text: `${czk(r.zbytek)} (celý zbytek)`,
        outcome: "wrong",
        verdict: `Celý zbytek by se srazil jen nad zákonnou hranicí (v roce 2026 ${czk(r.hranice)}). ${ch.forms.n} je pod ní.`,
        wallet: -r.zbytek,
        cites: [{ law: "osr", par: "279", odst: 3 }, { law: "nv595", par: "2" }],
      },
    ],
  };

  const r3: Round = {
    prompt: "Kdyby se místo dluhu u banky vymáhal nedoplatek na dani z příjmů, kolik by se srazilo?",
    card: "osr-279-2",
    options: [
      {
        text: `Stejně, ${czk(third)}`,
        outcome: "wrong",
        verdict: "Daně patří mezi přednostní pohledávky. Pro ty se srážejí dvě třetiny.",
        wallet: 0,
        cites: [{ law: "osr", par: "279", odst: 2, pism: "d" }],
      },
      {
        text: `${czk(2 * third)} (dvě třetiny)`,
        outcome: "correct",
        verdict: "Správně. Pohledávky daní jsou přednostní a srážejí se ze dvou třetin zbytku.",
        wallet: 0,
        cites: [{ law: "osr", par: "279", odst: 1 }, { law: "osr", par: "279", odst: 2, pism: "d" }],
      },
      {
        text: "Daně se z příjmu nesrážejí, vymáhá je jen finanční úřad z účtu.",
        outcome: "wrong",
        verdict: "Srážky z příjmu lze nařídit i pro daně – a jde o přednostní pohledávku.",
        wallet: 0,
        cites: [{ law: "osr", par: "279", odst: 2, pism: "d" }],
      },
    ],
  };

  return { ...base, story, rounds: [r1, r2, r3] };
}

export function personalizeCase(c: GameCase, ch: Character): GameCase {
  if (c.id === "vyplatni-paska") return wageCase(c, ch);
  return { ...c, story: fill(c.story, ch), teaser: fill(c.teaser, ch), rounds: c.rounds.map((r) => fillRound(r, ch)) };
}
