import type { Citation } from "@/lib/types";
import { addDays, formatDay, nonWorkReason, shiftToWorkday } from "./dates";

export type DeadlineKind = "vyzva" | "fikce" | "zastaveni";

export type DeadlinePuzzle = {
  kind: DeadlineKind;
  title: string;
  story: string;
  question: string;
  /** Den události, od které se lhůta počítá (nebo uložení zásilky). */
  eventDate: string;
  answer: string;
  steps: string[];
  cites: Citation[];
  /** Karty, které hráč získá za správné řešení. */
  cards: string[];
};

function rand(n: number): number {
  return Math.floor(Math.random() * n);
}

/** Konec lhůty určené podle dnů: počíná dnem následujícím (§ 57 odst. 1 OSŘ), posun dle § 57 odst. 2 OSŘ. */
export function daysDeadline(eventDate: string, days: number) {
  const raw = addDays(eventDate, days);
  const { date, skipped } = shiftToWorkday(raw);
  return { start: addDays(eventDate, 1), raw, end: date, skipped };
}

function shiftSteps(raw: string, end: string, skipped: { date: string; reason: string }[]): string[] {
  if (!skipped.length) return [`Konec lhůty (${formatDay(raw)}) je pracovní den, nic se neposouvá.`];
  const list = skipped.map((s) => `${formatDay(s.date, false)} ${s.reason.startsWith("svátek") ? s.reason : `je ${s.reason}`}`);
  return [`Nepracovní dny: ${list.join(", ")}.`, `Lhůta se proto posouvá na nejbližší pracovní den: ${formatDay(end)}.`];
}

/** Vybere datum v roce 2026–2027; v polovině případů tak, aby konec lhůty vyšel na nepracovní den. */
function pickEventDate(days: number, extra = 0): string {
  const wantShift = Math.random() < 0.5;
  for (let i = 0; i < 400; i++) {
    const d = addDays("2026-01-05", rand(700));
    if (extra && nonWorkReason(addDays(d, extra))) continue; // fikce doručení: 10. den má být pracovní
    const raw = addDays(d, extra + days);
    if (Boolean(nonWorkReason(raw)) === wantShift) return d;
  }
  return "2026-03-02";
}

export function generatePuzzle(kind?: DeadlineKind): DeadlinePuzzle {
  const k: DeadlineKind = kind ?? (["vyzva", "fikce", "zastaveni"] as const)[rand(3)];

  if (k === "vyzva") {
    const ev = pickEventDate(30);
    const { start, raw, end, skipped } = daysDeadline(ev, 30);
    return {
      kind: k,
      title: "Výzva ke splnění",
      story: `Tomáš si vyrozumění o zahájení exekuce převzal osobně dne ${formatDay(ev)}. Ve výzvě je lhůta 30 dnů na zaplacení dluhu a zálohy se sníženými náklady.`,
      question: "Který den je posledním dnem lhůty?",
      eventDate: ev,
      answer: end,
      steps: [
        `Den doručení (${formatDay(ev, false)}) se do lhůty nezapočítává – lhůta počíná ${formatDay(start)}.`,
        `30. den lhůty: ${formatDay(raw)}.`,
        ...shiftSteps(raw, end, skipped),
      ],
      cites: [
        { law: "er", par: "46", odst: 6 },
        { law: "osr", par: "57", odst: 1 },
        { law: "osr", par: "57", odst: 2 },
      ],
      cards: ["er-46-6", "osr-57-2"],
    };
  }

  if (k === "fikce") {
    const ev = pickEventDate(30, 10);
    const delivered = addDays(ev, 10);
    const { start, raw, end, skipped } = daysDeadline(delivered, 30);
    return {
      kind: k,
      title: "Nevyzvednutá obálka",
      story: `Pošta Tomáše nezastihla a vyrozumění o zahájení exekuce uložila; k vyzvednutí bylo připraveno dne ${formatDay(ev)}. Tomáš si obálku nevyzvedl.`,
      question: "Který den je posledním dnem 30denní lhůty z výzvy ke splnění?",
      eventDate: ev,
      answer: end,
      steps: [
        `Písemnost se považuje za doručenou posledním dnem 10denní úložní lhůty: ${formatDay(delivered)}.`,
        `Lhůta 30 dnů počíná dnem následujícím: ${formatDay(start)}.`,
        `30. den lhůty: ${formatDay(raw)}.`,
        ...shiftSteps(raw, end, skipped),
      ],
      cites: [
        { law: "osr", par: "49", odst: 4 },
        { law: "er", par: "46", odst: 6 },
        { law: "osr", par: "57", odst: 2 },
      ],
      cards: ["osr-49-4", "osr-57-2"],
    };
  }

  const ev = pickEventDate(15);
  const { start, raw, end, skipped } = daysDeadline(ev, 15);
  return {
    kind: k,
    title: "Návrh na zastavení",
    story: `Dne ${formatDay(ev)} Tomáš našel potvrzení, že vymáhaný dluh už dřív zaplatil. Chce podat návrh na zastavení exekuce.`,
    question: "Do kdy nejpozději musí návrh podat?",
    eventDate: ev,
    answer: end,
    steps: [
      `Lhůta 15 dnů běží ode dne, kdy se Tomáš o důvodu dozvěděl; počíná ${formatDay(start)}.`,
      `15. den lhůty: ${formatDay(raw)}.`,
      ...shiftSteps(raw, end, skipped),
    ],
    cites: [
      { law: "er", par: "55", odst: 1 },
      { law: "osr", par: "57", odst: 1 },
      { law: "osr", par: "57", odst: 2 },
    ],
    cards: ["er-55-1", "osr-57-2"],
  };
}
