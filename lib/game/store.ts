"use client";

import { useSyncExternalStore } from "react";
import type { Outcome } from "@/content/game/types";
import { CHARACTER_BY_ID, type Character } from "@/content/game/characters";
import { addDays, todayIso } from "./dates";

/** Intervaly opakování ve dnech pro přihrádky 0–2; přihrádka 3 = zvládnuto. */
const INTERVALS = [1, 3, 7];
export const START_WALLET = 50000;
const KEY = "pp-game-v1";

export type CardState = {
  collected: boolean;
  box: number;
  /** Kdy kartu zopakovat (ISO datum), null = zvládnuto. */
  due: string | null;
};

export type GameState = {
  v: 1;
  xp: number;
  wallet: number;
  cards: Record<string, CardState>;
  cases: Record<string, { done: boolean; correct: number; total: number }>;
  bossUnlocked: boolean;
  deadlinesSolved: number;
  /** Zvolená postava (id z characters.ts). */
  character: string | null;
};

const INITIAL: GameState = {
  v: 1,
  xp: 0,
  wallet: START_WALLET,
  cards: {},
  cases: {},
  bossUnlocked: false,
  deadlinesSolved: 0,
  character: null,
};

export const LEVELS = [
  { xp: 0, name: "Laik" },
  { xp: 300, name: "Poučený spotřebitel" },
  { xp: 800, name: "Znalec smluv" },
  { xp: 1500, name: "Advokát vlastní kapsy" },
];

export function levelOf(xp: number) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++;
  const next = LEVELS[i + 1];
  return { index: i, name: LEVELS[i].name, from: LEVELS[i].xp, to: next?.xp ?? null };
}

let state: GameState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GameState;
      if (parsed?.v === 1) state = { ...INITIAL, ...parsed };
    }
  } catch {
    // Úložiště nedostupné (anonymní okno apod.) – hraje se bez uložení.
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignorovat
  }
}

function set(next: GameState) {
  state = next;
  save();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  load();
  return state;
}

/** Aktuální stav mimo React (např. v efektu po načtení stránky). */
export function readGame(): GameState {
  load();
  return state;
}

export function useGame(): GameState {
  return useSyncExternalStore(subscribe, getSnapshot, () => INITIAL);
}

function scheduleCard(prev: CardState | undefined, ok: boolean, firstSeenInCase: boolean): CardState {
  const today = todayIso();
  if (!ok) return { collected: prev?.collected ?? false, box: 0, due: addDays(today, INTERVALS[0]) };
  // Správně hned napoprvé v případu: karta do alba, kontrola za týden.
  if (firstSeenInCase && !prev) return { collected: true, box: 2, due: addDays(today, INTERVALS[2]) };
  const box = Math.min((prev?.box ?? 0) + 1, 3);
  return { collected: true, box, due: box >= 3 ? null : addDays(today, INTERVALS[box]) };
}

const XP = { correct: 50, partial: 20, wrong: 10 } as const;

/** Odpověď v kole případu – volá se po přečtení verdiktu. */
export function recordRound(opts: { cardId: string; outcome: Outcome; wallet: number; boss?: boolean }) {
  load();
  const ok = opts.outcome === "correct";
  const xp = ok && opts.boss ? 80 : XP[opts.outcome];
  set({
    ...state,
    xp: state.xp + xp,
    wallet: state.wallet + opts.wallet,
    cards: { ...state.cards, [opts.cardId]: scheduleCard(state.cards[opts.cardId], ok, true) },
  });
  return xp;
}

export function recordCase(caseId: string, correct: number, total: number) {
  load();
  const prev = state.cases[caseId];
  set({
    ...state,
    cases: {
      ...state.cases,
      [caseId]: { done: true, correct: Math.max(correct, prev?.correct ?? 0), total },
    },
  });
}

/** Odpověď v tréninku nebo v režimu Lhůta běží. */
export function recordReview(cardIds: string[], ok: boolean, source: "training" | "deadline") {
  load();
  const cards = { ...state.cards };
  for (const id of cardIds) cards[id] = scheduleCard(cards[id], ok, source === "deadline");
  const xp = ok ? (source === "deadline" ? 30 : 20) : 5;
  set({
    ...state,
    xp: state.xp + xp,
    cards,
    deadlinesSolved: state.deadlinesSolved + (ok && source === "deadline" ? 1 : 0),
  });
  return xp;
}

/** Výběr postavy. Při změně začne peněženka znovu od startovní částky postavy; karty a XP zůstávají. */
export function chooseCharacter(id: string, startWallet: number) {
  load();
  if (state.character === id) return;
  set({ ...state, character: id, wallet: startWallet });
}

export function unlockBoss() {
  load();
  set({ ...state, bossUnlocked: true });
}

export function resetGame() {
  set(INITIAL);
}

export function dueCards(s: GameState, today = todayIso()): string[] {
  return Object.entries(s.cards)
    .filter(([, c]) => c.due !== null && c.due <= today)
    .map(([id]) => id);
}

export function characterOf(s: GameState): Character | null {
  return s.character ? CHARACTER_BY_ID.get(s.character) ?? null : null;
}

const noop = () => () => {};
/** false při serverovém renderu a hydrataci, poté true – aby se neukázal stav „bez postavy“ předčasně. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
