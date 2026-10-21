import type { LawId } from "@/content/laws";

/** Odkaz na konkrétní ustanovení zákona. */
export type Citation = {
  law: LawId;
  /** Číslo paragrafu bez znaku §, např. "609" nebo "304b". */
  par: string;
  odst?: number;
  pism?: string;
  /** Doslovná citace (krátká) – zobrazí se v rozbalení. */
  quote?: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "note"; tone: "info" | "warn" | "change"; text: string };

export type Section = {
  heading: string;
  blocks: Block[];
  cites: Citation[];
};

/** Modelová situace: otázka z praxe a odpověď s oporou v zákoně. */
export type Situation = {
  title: string;
  story: string;
  answer: string;
  cites: Citation[];
};

export type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
  cite?: Citation;
};

export type Lesson = {
  slug: string;
  title: string;
  lead: string;
  minutes: number;
  sections: Section[];
  situations: Situation[];
  takeaways: string[];
  quiz: Question[];
};

export type Topic = {
  slug: string;
  title: string;
  short: string;
  description: string;
  /** Hlavní předpisy oblasti. */
  laws: LawId[];
  lessons: Lesson[];
};

export type GlossaryEntry = {
  term: string;
  definition: string;
  cite?: Citation;
};
