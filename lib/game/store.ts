"use client";

import { useSyncExternalStore } from "react";
import type { Outcome } from "@/content/game/types";
import { CHARACTER_BY_ID, type Character } from "@/content/game/characters";
import { LETTER_RULES, PAD_END, PIER_END, SPAWN, START_LOAD, type World } from "@/content/game/city";
import { EVENTS, EVENT_BY_ID } from "@/content/game/events";
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
  /** Postup v případech, klíč `${postava}:${případ}`. */
  cases: Record<string, { done: boolean; correct: number; total: number }>;
  /** Dokončené přípravy, klíč `${postava}:${téma}`. */
  preps: Record<string, boolean>;
  /** Postavy, které mají odemčené všechny nástrahy najednou. */
  opened: Record<string, boolean>;
  deadlinesSolved: number;
  /** Zvolená postava (id z characters.ts). */
  character: string | null;
  /** Herní měsíc (1 = leden prvního roku); každá vyřešená nástraha posune čas o měsíc. */
  month: number;
  /** Dluhová zátěž postavy 0–100. */
  load: number;
  /** Dopisy ve schránce (naplánované důsledky). */
  letters: Letter[];
  /** Pozice postavy ve městě. */
  pos: { x: number; y: number };
  /** Měsíc poslední konzultace v poradně. */
  consultMonth: number;
  /** Výsledky závodů s lhůtou, klíč `${postava}:${případ}`. */
  races: Record<string, "won" | "lost">;
  /** Absolvované přednášky ve školách (počet správných odpovědí), klíč `${postava}:${přednáška}`. */
  lectures: Record<string, number>;
  /** Rady lidem na ulici, klíč `${postava}:${člověk}:${otázka}` = poradil(a) správně. */
  advice: Record<string, boolean>;
  /** Verze mapy (2 = město s okružní silnicí, souřadnice posunuté o 3 dlaždice). */
  mapV?: number;
  /** Kde postava je: Město dluhů, nebo ostrov Daňový ráj. */
  world: World;
};

export type Letter = {
  id: string;
  month: number;
  /** Nástraha, kterou dopis otevře (prázdné u náhodné události). */
  caseId: string;
  /** Náhodná událost (events.ts) a zvolená odpověď. */
  eventId?: string;
  choice?: number;
  sender: string;
  subject: string;
  reason: string;
  read: boolean;
};

const INITIAL: GameState = {
  v: 1,
  xp: 0,
  wallet: START_WALLET,
  cards: {},
  cases: {},
  preps: {},
  opened: {},
  deadlinesSolved: 0,
  character: null,
  month: 1,
  load: 0,
  letters: [],
  pos: SPAWN,
  consultMonth: 0,
  races: {},
  lectures: {},
  advice: {},
  mapV: 2,
  world: "mesto",
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
/** Uložené hry po postavách (každá postava má vlastní postup) a naposledy hraná postava. */
let saves: Record<string, GameState> = {};
let last: string | null = null;
let loaded = false;
const listeners = new Set<() => void>();
const SAVES_KEY = "pp-saves-v1";

/** Doplní chybějící pole ze starších verzí uložené hry. */
function normalize(parsed: GameState): GameState {
  let st: GameState = { ...INITIAL, ...parsed, opened: parsed.opened ?? {}, preps: parsed.preps ?? {}, letters: parsed.letters ?? [], pos: parsed.pos ?? SPAWN, races: parsed.races ?? {}, lectures: parsed.lectures ?? {}, advice: parsed.advice ?? {} };
  // starší uložená pozice je z menší mapy bez okružní silnice
  if (parsed.mapV !== 2) st = { ...st, pos: parsed.pos ? { x: parsed.pos.x + 3, y: parsed.pos.y + 3 } : SPAWN, mapV: 2 };
  return st;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(SAVES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { saves: Record<string, GameState>; last: string | null };
      for (const [id, st] of Object.entries(parsed.saves ?? {})) if (st?.v === 1) saves[id] = normalize(st);
      last = parsed.last ?? null;
    } else {
      // dřívější verze: jedna společná uložená hra → patří postavě, která se naposledy hrála
      const old = window.localStorage.getItem(KEY);
      const parsed = old ? (JSON.parse(old) as GameState) : null;
      if (parsed?.v === 1 && parsed.character) {
        saves[parsed.character] = normalize(parsed);
        last = parsed.character;
      }
    }
    if (last && saves[last]) state = saves[last];
  } catch {
    // Úložiště nedostupné (anonymní okno apod.) – hraje se bez uložení.
  }
}

function save() {
  if (state.character) {
    saves = { ...saves, [state.character]: state };
    last = state.character;
  }
  try {
    window.localStorage.setItem(SAVES_KEY, JSON.stringify({ saves, last }));
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
  const dLoad = opts.outcome === "correct" ? -5 : opts.outcome === "partial" ? 5 : 12;
  set({
    ...state,
    xp: state.xp + xp,
    wallet: state.wallet + opts.wallet,
    load: clampLoad(state.load + dLoad),
    cards: { ...state.cards, [opts.cardId]: scheduleCard(state.cards[opts.cardId], ok, true) },
  });
  return xp;
}

export function caseKey(character: string | null, caseId: string): string {
  return `${character ?? "-"}:${caseId}`;
}

export function caseProgress(s: GameState, caseId: string) {
  return s.cases[caseKey(s.character, caseId)];
}

export function recordCase(caseId: string, correct: number, total: number): Letter[] {
  load();
  const key = caseKey(state.character, caseId);
  const prev = state.cases[key];
  const month = state.month + 1;
  // Důsledky: nevyřešená nástraha naplánuje dopis (jen poprvé a jen pokud podobný dopis už nečeká).
  const letters = state.letters.map((l) => (l.caseId === caseId ? { ...l, read: true } : l));
  const scheduled: Letter[] = [];
  if (correct < total && !prev) {
    for (const r of LETTER_RULES.filter((r) => r.fromCase === caseId)) {
      const pending = letters.some((l) => l.caseId === r.caseId && !l.read);
      const done = state.cases[caseKey(state.character, r.caseId)]?.done;
      if (!pending && !done) {
        const letter = { id: `${r.fromCase}>${r.caseId}`, month: month + r.delay - 1, caseId: r.caseId, sender: r.sender, subject: r.subject, reason: r.reason, read: false };
        letters.push(letter);
        scheduled.push(letter);
      }
    }
  }
  // Vysoká dluhová zátěž: dluhy přerostou přes hlavu a přijde exekutor (jen jednou).
  const exekuce = "vyrozumeni-o-exekuci";
  if (
    state.load >= 70 &&
    caseId !== exekuce &&
    !letters.some((l) => l.caseId === exekuce && !l.read) &&
    !state.cases[caseKey(state.character, exekuce)]?.done
  ) {
    const letter = { id: `zatez>${exekuce}>${month}`, month: month + 1, caseId: exekuce, sender: "Exekutorský úřad", subject: "Vyrozumění o zahájení exekuce", reason: "dluhová zátěž přerostla přes hlavu", read: false };
    letters.push(letter);
    scheduled.push(letter);
  }
  // Náhodná událost do schránky (zhruba v každém druhém měsíci, každá jen jednou za příběh).
  const used = new Set(letters.map((l) => l.eventId).filter(Boolean));
  const pool = EVENTS.filter((e) => !used.has(e.id));
  if (pool.length && Math.random() < 0.5) {
    const e = pool[Math.floor(Math.random() * pool.length)];
    letters.push({ id: `udalost>${e.id}`, month, caseId: "", eventId: e.id, sender: e.sender, subject: e.subject, reason: "", read: false });
  }
  set({
    ...state,
    month,
    letters,
    cases: {
      ...state.cases,
      [key]: { done: true, correct: Math.max(correct, prev?.correct ?? 0), total },
    },
  });
  return scheduled;
}

function clampLoad(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Vyřízení náhodné události: volba (nebo jen přečtení oznámení) a její dopad. */
export function resolveEvent(letterId: string, choice: number | null) {
  load();
  const letter = state.letters.find((l) => l.id === letterId);
  const e = letter?.eventId ? EVENT_BY_ID.get(letter.eventId) : undefined;
  if (!letter || !e || letter.read) return;
  const c = choice === null ? undefined : e.choices[choice];
  const notice = e.choices.length === 0 ? e.notice ?? 0 : 0;
  set({
    ...state,
    wallet: state.wallet + (c?.wallet ?? notice),
    load: clampLoad(state.load + (c?.load ?? 0)),
    xp: state.xp + 5,
    letters: state.letters.map((l) => (l.id === letterId ? { ...l, read: true, choice: choice ?? undefined } : l)),
  });
}

/** Výsledek závodu s lhůtou. */
export function recordRace(caseId: string, won: boolean, wallet: number, dLoad: number) {
  load();
  set({
    ...state,
    xp: state.xp + (won ? 25 : 0),
    wallet: state.wallet + (won ? 0 : wallet),
    load: clampLoad(state.load + (won ? -3 : dLoad)),
    races: { ...state.races, [caseKey(state.character, caseId)]: won ? "won" : "lost" },
  });
}

export function raceResult(s: GameState, caseId: string): "won" | "lost" | undefined {
  return s.races?.[caseKey(s.character, caseId)];
}

/** Exekutor postavu dostihl. Vrací nástrahu, kam hru přesměrovat, nebo null (jen náklady). */
export function caughtByExecutor(): string | null {
  load();
  const exekuce = "vyrozumeni-o-exekuci";
  const done = state.cases[caseKey(state.character, exekuce)]?.done;
  if (!done) {
    const has = state.letters.some((l) => l.caseId === exekuce && !l.read);
    const letters = has
      ? state.letters.map((l) => (l.caseId === exekuce ? { ...l, month: Math.min(l.month, state.month) } : l))
      : [...state.letters, { id: `dopaden>${state.month}`, month: state.month, caseId: exekuce, sender: "Exekutorský úřad", subject: "Vyrozumění o zahájení exekuce", reason: "exekutor vás dostihl", read: false }];
    set({ ...state, letters });
    return exekuce;
  }
  set({ ...state, wallet: state.wallet - 1500 });
  return null;
}

export function setPos(pos: { x: number; y: number }) {
  load();
  set({ ...state, pos });
}

/** Konzultace v poradně – jednou za herní měsíc sníží zátěž. */
export function consult(): boolean {
  load();
  if (state.consultMonth === state.month) return false;
  set({ ...state, load: clampLoad(state.load - 10), xp: state.xp + 5, consultMonth: state.month });
  return true;
}

export function deliveredLetters(s: GameState): Letter[] {
  return s.letters.filter((l) => l.month <= s.month);
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

/** Výběr postavy. Při změně začne znovu peněženka, kalendář, zátěž a schránka; karty a XP zůstávají. */
/** Nová hra za postavu: její dosavadní uložený postup se přepíše. */
export function newGame(id: string, startWallet: number) {
  load();
  set({ ...INITIAL, character: id, wallet: startWallet, load: START_LOAD[id] ?? 20 });
}

/** Pokračovat v uložené hře postavy (bez uložené hry začne nová). */
export function continueGame(id: string, startWallet: number) {
  load();
  if (saves[id]) set(saves[id]);
  else newGame(id, startWallet);
}

/** Přehled uložených her pro hlavní menu. */
export function savedGames(): Record<string, GameState> {
  load();
  return saves;
}

/** Postava se vybírá v obchodě s postavami (stránka /hra/postava): pokračuje, nebo začne nově. */
export function chooseCharacter(id: string, startWallet: number) {
  continueGame(id, startWallet);
}

export function prepDone(s: GameState, prepId: string): boolean {
  return Boolean(s.preps[caseKey(s.character, prepId)]);
}

/** Dokončení přípravy – XP jen poprvé. */
export function recordPrep(prepId: string, correct: boolean): number {
  load();
  const key = caseKey(state.character, prepId);
  const first = !state.preps[key];
  const xp = first ? (correct ? 20 : 5) : 0;
  set({ ...state, xp: state.xp + xp, preps: { ...state.preps, [key]: true } });
  return xp;
}

export function lectureDone(s: GameState, lectureId: string): boolean {
  return caseKey(s.character, lectureId) in s.lectures;
}

/** Absolvování přednášky – XP jen poprvé (lepší výsledek testu se zapíše vždy). */
export function recordLecture(lectureId: string, correct: number): number {
  load();
  const key = caseKey(state.character, lectureId);
  const first = !(key in state.lectures);
  const xp = first ? 30 + correct * 20 : 0;
  set({ ...state, xp: state.xp + xp, lectures: { ...state.lectures, [key]: Math.max(correct, state.lectures[key] ?? 0) } });
  return xp;
}

/** Kterou otázku má člověk na ulici právě připravenou (-1 = všechno vyřešeno). */
export function streetQuestionIndex(s: GameState, npcId: string, count: number): number {
  for (let i = 0; i < count; i++) if (!s.advice[`${s.character ?? "-"}:${npcId}:${i}`]) return i;
  return -1;
}

/** Rada člověku na ulici: XP za správnou radu, špatnou si může zopakovat při další návštěvě. */
export function recordAdvice(npcId: string, index: number, ok: boolean): number {
  load();
  if (!ok) return 0;
  const key = `${state.character ?? "-"}:${npcId}:${index}`;
  if (state.advice[key]) return 0;
  set({ ...state, xp: state.xp + 25, advice: { ...state.advice, [key]: true } });
  return 25;
}

/** Cesta do jiného světa: lodí (vystoupí se na konci mola), nebo raketou (u rampy). */
export function travel(world: World, via: "lod" | "raketa" = "lod") {
  load();
  set({ ...state, world, pos: via === "raketa" ? PAD_END : PIER_END });
}

export function openAll() {
  load();
  if (!state.character) return;
  set({ ...state, opened: { ...state.opened, [state.character]: true } });
}

/** Smaže všechny uložené hry v tomto prohlížeči. */
export function resetGame() {
  load();
  saves = {};
  last = null;
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
