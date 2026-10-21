import type { Citation } from "@/lib/types";

/** Sběratelská karta = jedno ustanovení zákona. */
export type Card = {
  id: string;
  cite: Citation;
  /** Lidský název, např. „Námitka promlčení“. */
  name: string;
  /** Jedna věta výkladu. */
  summary: string;
  /** Doslovná citace (zkrácená) – zobrazí se na rubu karty. */
  quote: string;
};

export type Outcome = "correct" | "partial" | "wrong";

export type Option = {
  text: string;
  outcome: Outcome;
  /** Co se stane a proč – s oporou v zákoně. */
  verdict: string;
  /** Ilustrativní dopad na peněženku postavy v Kč (záporné = ztráta). */
  wallet: number;
  cites: Citation[];
};

export type Round = {
  prompt: string;
  options: Option[];
  /** Karta, kterou hráč získá za správnou odpověď. */
  card: string;
};

export type GameCase = {
  id: string;
  title: string;
  teaser: string;
  story: string;
  boss?: boolean;
  /** Lekce, ze které případ vychází (pro odkaz „Přečíst lekci“). */
  lesson: { topic: string; lesson: string };
  rounds: Round[];
};

export type District = {
  id: string;
  name: string;
  topic: string;
  blurb: string;
  playable: boolean;
};
