/**
 * Kalendářní data jako ISO řetězce "YYYY-MM-DD", počítaná v UTC (bez posunů časového pásma).
 */

export function parseIso(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = parseIso(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toIso(d);
}

/** Dnešní datum v místním čase uživatele. */
export function todayIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Velikonoční neděle (anonymní gregoriánský algoritmus). */
function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Státní a ostatní svátky ČR (zákon č. 245/2000 Sb.). */
export function holidays(year: number): Map<string, string> {
  const easter = easterSunday(year);
  const fixed: [string, string][] = [
    ["01-01", "Den obnovy samostatného českého státu"],
    ["05-01", "Svátek práce"],
    ["05-08", "Den vítězství"],
    ["07-05", "Den slovanských věrozvěstů Cyrila a Metoděje"],
    ["07-06", "Den upálení mistra Jana Husa"],
    ["09-28", "Den české státnosti"],
    ["10-28", "Den vzniku samostatného československého státu"],
    ["11-17", "Den boje za svobodu a demokracii"],
    ["12-24", "Štědrý den"],
    ["12-25", "1. svátek vánoční"],
    ["12-26", "2. svátek vánoční"],
  ];
  const map = new Map<string, string>(fixed.map(([md, name]) => [`${year}-${md}`, name]));
  map.set(addDays(easter, -2), "Velký pátek");
  map.set(addDays(easter, 1), "Velikonoční pondělí");
  return map;
}

export function holidayName(iso: string): string | undefined {
  return holidays(Number(iso.slice(0, 4))).get(iso);
}

export function weekday(iso: string): number {
  return parseIso(iso).getUTCDay(); // 0 = neděle
}

export function nonWorkReason(iso: string): string | undefined {
  const h = holidayName(iso);
  if (h) return `svátek (${h})`;
  const w = weekday(iso);
  if (w === 6) return "sobota";
  if (w === 0) return "neděle";
  return undefined;
}

/** § 57 odst. 2 OSŘ / § 607 OZ: konec lhůty o víkendu či svátku se posouvá na nejbližší pracovní den. */
export function shiftToWorkday(iso: string): { date: string; skipped: { date: string; reason: string }[] } {
  const skipped: { date: string; reason: string }[] = [];
  let d = iso;
  let reason = nonWorkReason(d);
  while (reason) {
    skipped.push({ date: d, reason });
    d = addDays(d, 1);
    reason = nonWorkReason(d);
  }
  return { date: d, skipped };
}

const WEEKDAYS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
export const MONTHS = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

export function formatDay(iso: string, withWeekday = true): string {
  const d = parseIso(iso);
  const s = `${d.getUTCDate()}. ${d.getUTCMonth() + 1}. ${d.getUTCFullYear()}`;
  return withWeekday ? `${s} (${WEEKDAYS[d.getUTCDay()]})` : s;
}
