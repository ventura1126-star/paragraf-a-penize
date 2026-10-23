import { COL_PAIRS, GARAGES, PARKING, ROW_PAIRS, TILE, type Garage } from "@/content/game/city";

/**
 * Provoz ve městě: auta jezdí po pruzích (vpravo), na křižovatkách odbočují, stojí na červenou,
 * dávají přednost autu před sebou a postavě. Občas zajedou na parkoviště nebo do garáže budovy,
 * chvíli tam stojí a zase vyjedou. Nikde nemizí ani neprojíždějí do vody – okružní silnice je uzavírá.
 */

/** Směr jízdy: 0 východ, 1 jih, 2 západ, 3 sever. */
export type Dir = 0 | 1 | 2 | 3;
const DV: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const ANG = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

type Wp = { x: number; y: number; rev?: boolean };
type Goal = { kind: "park"; slot: number } | { kind: "garage"; g: Garage };

export type Car = {
  x: number;
  y: number;
  ang: number;
  color: string;
  speed: number;
  /** drive = po silnici, move = manévr (vjezd/výjezd), parked = na stání, inside = v garáži (není vidět) */
  mode: "drive" | "move" | "parked" | "inside";
  dir: Dir;
  turn: { at: number; dir: Dir } | null;
  inter: string | null;
  goal: Goal | null;
  goalIn: number;
  wp: Wp[];
  then: { mode: "drive"; dir: Dir } | { mode: "parked" } | { mode: "inside" };
  timer: number;
  slot: number;
  garage: Garage | null;
  alpha: number;
};

const COLORS = ["#c0392b", "#2e86c1", "#f1c40f", "#16a085", "#ecf0f1", "#8e44ad", "#d35400", "#2c3e50", "#7f8c8d", "#27ae60"];
const MOVE_SPEED = 45;

const c16 = (t: number) => t * TILE + 16;
/** Souřadnice pruhu pro daný směr: vodorovné na řádku dvojice, svislé na sloupci dvojice. */
function laneOf(dir: Dir, ri: number, ci: number): number {
  if (dir === 0) return c16(ROW_PAIRS[ri][1]);
  if (dir === 2) return c16(ROW_PAIRS[ri][0]);
  if (dir === 1) return c16(COL_PAIRS[ci][0]);
  return c16(COL_PAIRS[ci][1]);
}
function pairAt(pairs: [number, number][], v: number): number {
  return pairs.findIndex(([a, b]) => v >= a * TILE && v < (b + 1) * TILE);
}
/** Křižovatka (index dvojice řádků a sloupců), ve které leží bod, jinak null. */
function interAt(x: number, y: number): [number, number] | null {
  const ri = pairAt(ROW_PAIRS, y);
  const ci = pairAt(COL_PAIRS, x);
  return ri >= 0 && ci >= 0 ? [ri, ci] : null;
}
/** Semafory jsou jen na vnitřních křižovatkách (ne na okružní silnici). */
export function hasLights(ri: number, ci: number) {
  return ri > 0 && ri < ROW_PAIRS.length - 1 && ci > 0 && ci < COL_PAIRS.length - 1;
}
function allowed(dir: Dir, ri: number, ci: number): Dir[] {
  const out: Dir[] = [];
  if (ci < COL_PAIRS.length - 1) out.push(0);
  if (ri < ROW_PAIRS.length - 1) out.push(1);
  if (ci > 0) out.push(2);
  if (ri > 0) out.push(3);
  return out.filter((d) => d !== ((dir + 2) % 4));
}

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function blank(x: number, y: number, dir: Dir, k: number): Car {
  return {
    x, y, ang: ANG[dir], dir, color: COLORS[k % COLORS.length], speed: 85 + ((k * 37) % 55),
    mode: "drive", turn: null, inter: null, goal: null, goalIn: rnd(15, 60), wp: [], then: { mode: "drive", dir },
    timer: 0, slot: -1, garage: null, alpha: 1,
  };
}

/** Počáteční provoz: auta v pruzích mezi křižovatkami, část zaparkovaná a část v garážích. */
export function makeTraffic(): Car[] {
  const cars: Car[] = [];
  let k = 0;
  ROW_PAIRS.forEach(([a, b], ri) => {
    for (let ci = 0; ci < COL_PAIRS.length - 1; ci++) {
      const x0 = (COL_PAIRS[ci][1] + 1) * TILE;
      const x1 = COL_PAIRS[ci + 1][0] * TILE;
      if ((ri + ci) % 2 === 0) cars.push(blank(x0 + (x1 - x0) * 0.4, c16(b), 0, k++));
      else cars.push(blank(x0 + (x1 - x0) * 0.6, c16(a), 2, k++));
    }
  });
  COL_PAIRS.forEach(([a, b], ci) => {
    for (let ri = 0; ri < ROW_PAIRS.length - 1; ri++) {
      const y0 = (ROW_PAIRS[ri][1] + 1) * TILE;
      const y1 = ROW_PAIRS[ri + 1][0] * TILE;
      if ((ri + ci) % 2 === 0) cars.push(blank(c16(a), y0 + (y1 - y0) * 0.5, 1, k++));
      else cars.push(blank(c16(b), y0 + (y1 - y0) * 0.5, 3, k++));
    }
  });
  // zaparkovaná auta (nikdy ne všechna stání)
  PARKING.slots.forEach((s, i) => {
    if ((i * 7) % 5 >= 3) return;
    const c = blank(s.x, s.y, 1, k++);
    Object.assign(c, { mode: "parked", ang: s.up ? -Math.PI / 2 : Math.PI / 2, slot: i, timer: rnd(5, 70) });
    cars.push(c);
  });
  // v každé garáži jedno auto
  for (const g of GARAGES) {
    const c = blank(c16(g.x), c16(g.y), g.above ? 1 : 3, k++);
    Object.assign(c, { mode: "inside", garage: g, timer: rnd(5, 40), alpha: 0 });
    cars.push(c);
  }
  return cars;
}

/** Obdélník karoserie (40 × 20) podle natočení. */
export function carBox(c: Car) {
  const horiz = Math.abs(Math.cos(c.ang)) >= 0.7;
  return { x: c.x, y: c.y, hw: horiz ? 20 : 10, hh: horiz ? 10 : 20 };
}

/** Bod, kudy auto vjíždí do cíle (pro volbu odboček). */
function goalPoint(goal: Goal): [number, number] {
  if (goal.kind === "park") return [PARKING.laneX, PARKING.aisleY];
  return [c16(goal.g.x), c16(goal.g.y)];
}

/** Pruh, ze kterého se do garáže zajíždí: u budovy nad chodníkem pruh na západ, pod chodníkem na východ. */
function garageLane(g: Garage): { dir: Dir; y: number } {
  return g.above ? { dir: 2, y: c16(g.y + 1) } : { dir: 0, y: c16(g.y - 1) };
}

function startMove(c: Car, wp: Wp[], then: Car["then"]) {
  c.mode = "move";
  c.wp = wp;
  c.then = then;
  c.turn = null;
}

type World = { player: { x: number; y: number }; hGreen: boolean; vGreen: boolean };

/** Je před autem (ve směru `hx, hy`) překážka? */
function blockedAhead(c: Car, hx: number, hy: number, cars: Car[], w: World, inBox: boolean): boolean {
  // postava před autem
  const px = w.player.x - c.x;
  const py = w.player.y - c.y;
  const pa = px * hx + py * hy;
  if (pa > 0 && pa < 48 && Math.abs(px * hy - py * hx) < 20) return true;
  for (const o of cars) {
    if (o === c || o.mode === "inside") continue;
    const rx = o.x - c.x;
    const ry = o.y - c.y;
    const along = rx * hx + ry * hy;
    if (along <= 0 || along > 50) continue;
    if (Math.abs(rx * hy - ry * hx) > 16) continue;
    // v křižovatce nečekat na auta, která jedou napříč (uvízla by navzájem)
    if (inBox && o.mode === "drive" && o.dir % 2 !== c.dir % 2 && interAt(c.x, c.y)) continue;
    return true;
  }
  return false;
}

function freeSlot(cars: Car[]): number {
  const taken = new Set(cars.filter((c) => c.slot >= 0).map((c) => c.slot));
  const goals = new Set(cars.map((c) => (c.goal?.kind === "park" ? c.goal.slot : -1)));
  const free = PARKING.slots.map((_, i) => i).filter((i) => !taken.has(i) && !goals.has(i));
  return free.length ? free[Math.floor(Math.random() * free.length)] : -1;
}

/** Je pruh u výjezdu volný (žádné auto, které by do vyjíždějícího narazilo)? */
function laneClear(cars: Car[], x: number, y: number, dir: Dir, self: Car): boolean {
  const [hx, hy] = DV[dir];
  return !cars.some((o) => {
    if (o === self || o.mode !== "drive") return false;
    const rx = o.x - x;
    const ry = o.y - y;
    const along = rx * hx + ry * hy; // záporné = auto přijíždí zezadu
    return Math.abs(rx * hy - ry * hx) < 20 && along > -110 && along < 40;
  });
}

export function stepTraffic(cars: Car[], dt: number, w: World) {
  if (dt <= 0) return;
  for (const c of cars) {
    if (c.mode === "parked") {
      c.timer -= dt;
      if (c.timer <= 0) {
        const s = PARKING.slots[c.slot];
        // ulička je jednosměrná na západ: vycouvat jen když za autem nikdo nejede
        const busy = cars.some(
          (o) =>
            o !== c &&
            o.mode === "move" &&
            o.x < PARKING.edgeX + 60 &&
            ((Math.abs(o.y - PARKING.aisleY) < 4 && o.x > s.x - 30 && o.x < s.x + 90) || Math.abs(o.x - s.x) < 50),
        );
        if (busy || !laneClear(cars, PARKING.exitLaneX, PARKING.aisleY - 24, 3, c)) {
          c.timer = 1;
          continue;
        }
        startMove(
          c,
          [
            { x: s.x, y: PARKING.aisleY, rev: true },
            { x: PARKING.exitEdgeX, y: PARKING.aisleY },
            { x: PARKING.exitLaneX + 32, y: PARKING.aisleY },
            { x: PARKING.exitLaneX, y: PARKING.aisleY - 30 },
          ],
          { mode: "drive", dir: 3 },
        );
        // stání zůstává obsazené, dokud auto neodjede
      }
      continue;
    }
    if (c.mode === "inside") {
      c.timer -= dt;
      const g = c.garage!;
      const lane = garageLane(g);
      if (c.timer <= 0) {
        const ex = c16(g.x) + DV[lane.dir][0] * 26;
        if (!laneClear(cars, ex, lane.y, lane.dir, c)) {
          c.timer = 1;
          continue;
        }
        const inY = g.above ? g.y * TILE - 6 : (g.y + 1) * TILE + 6;
        Object.assign(c, { x: c16(g.x), y: inY, ang: g.above ? Math.PI / 2 : -Math.PI / 2, alpha: 0 });
        startMove(c, [{ x: c16(g.x), y: c16(g.y) }, { x: ex, y: lane.y }], { mode: "drive", dir: lane.dir });
        c.garage = null;
      }
      continue;
    }
    if (c.mode === "move") {
      const t = c.wp[0];
      const dx = t.x - c.x;
      const dy = t.y - c.y;
      const d = Math.hypot(dx, dy);
      const hx = dx / (d || 1);
      const hy = dy / (d || 1);
      // couvání: auto se dívá opačně, než jede
      const fx = t.rev ? -hx : hx;
      const fy = t.rev ? -hy : hy;
      if (c.alpha < 1 && c.then.mode !== "inside") c.alpha = Math.min(1, c.alpha + dt * 2.5);
      if (c.then.mode === "inside" && c.wp.length === 1) c.alpha = Math.max(0, Math.min(1, d / 24));
      if (blockedAhead(c, hx, hy, cars, w, false)) continue;
      const step = MOVE_SPEED * dt;
      if (d <= step) {
        c.x = t.x;
        c.y = t.y;
        c.wp.shift();
      } else {
        c.x += hx * step;
        c.y += hy * step;
      }
      const target = Math.atan2(fy, fx);
      let da = target - c.ang;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      c.ang += da * Math.min(1, dt * 8);
      if (!c.wp.length) {
        if (c.then.mode === "drive") {
          Object.assign(c, { mode: "drive", dir: c.then.dir, inter: null, turn: null, goal: null, goalIn: rnd(20, 70), alpha: 1, slot: -1 });
        } else if (c.then.mode === "parked") {
          Object.assign(c, { mode: "parked", timer: rnd(20, 80) });
        } else {
          Object.assign(c, { mode: "inside", timer: rnd(12, 45), alpha: 0 });
        }
      }
      continue;
    }

    // --- jízda po silnici
    const [hx, hy] = DV[c.dir];
    const fx = c.x + hx * 22;
    const fy = c.y + hy * 22;
    const here = interAt(c.x, c.y);
    const ahead = interAt(fx, fy);
    // rozhodnutí na křižovatce (jednou, při vjezdu)
    if (ahead) {
      const key = `${ahead[0]},${ahead[1]}`;
      if (c.inter !== key) {
        c.inter = key;
        const opts = allowed(c.dir, ahead[0], ahead[1]);
        let nd: Dir = opts.includes(c.dir) && Math.random() < 0.55 ? c.dir : opts[Math.floor(Math.random() * opts.length)];
        if (c.goal && Math.random() < 0.8) {
          const [gx, gy] = goalPoint(c.goal);
          const best = opts.slice().sort((a, b) => (gx - c.x) * DV[b][0] + (gy - c.y) * DV[b][1] - ((gx - c.x) * DV[a][0] + (gy - c.y) * DV[a][1]))[0];
          if (best !== undefined) nd = best;
        }
        c.turn = nd === c.dir ? null : { dir: nd, at: laneOf(nd, ahead[0], ahead[1]) };
      }
    } else if (!here) c.inter = null;

    let stop = false;
    // červená: zastavit před přechodem, dokud auto do křižovatky ještě nevjelo
    const approach = interAt(c.x + hx * 56, c.y + hy * 56);
    if (approach && !ahead && !here && hasLights(approach[0], approach[1])) {
      const green = c.dir % 2 === 0 ? w.hGreen : w.vGreen;
      if (!green) stop = true;
    }
    // do křižovatky nevjíždět, dokud v ní je auto z jiného směru (přednost tomu, kdo už je uvnitř)
    if (!stop && ahead && !here) {
      stop = cars.some((o) => {
        if (o === c || o.mode !== "drive" || o.dir === c.dir) return false;
        const oi = interAt(o.x, o.y);
        return Boolean(oi && oi[0] === ahead[0] && oi[1] === ahead[1]);
      });
    }
    if (!stop && blockedAhead(c, hx, hy, cars, w, Boolean(here))) stop = true;

    // cíl: kdy je čas zajet na parkoviště nebo do garáže
    if (!c.goal) {
      c.goalIn -= dt;
      if (c.goalIn <= 0) {
        c.goalIn = rnd(20, 60);
        const inside = cars.filter((o) => o.mode === "inside").length;
        const slot = Math.random() < 0.55 ? freeSlot(cars) : -1;
        if (slot >= 0) c.goal = { kind: "park", slot };
        else if (inside < GARAGES.length) {
          const g = GARAGES[Math.floor(Math.random() * GARAGES.length)];
          if (!cars.some((o) => o.garage === g || (o.goal?.kind === "garage" && o.goal.g === g))) c.goal = { kind: "garage", g };
        }
      }
    }

    if (stop) continue;
    const step = c.speed * dt;
    const prevAlong = c.dir % 2 === 0 ? c.x : c.y;
    c.x += hx * step;
    c.y += hy * step;
    const along = c.dir % 2 === 0 ? c.x : c.y;
    const dirSign = c.dir === 0 || c.dir === 1 ? 1 : -1;
    const crossed = (at: number) => (along - at) * dirSign >= 0 && (prevAlong - at) * dirSign < 0;

    // odbočení: v místě nového pruhu se auto stočí
    if (c.turn && crossed(c.turn.at)) {
      if (c.dir % 2 === 0) c.x = c.turn.at;
      else c.y = c.turn.at;
      c.dir = c.turn.dir;
      c.turn = null;
    }
    // vjezd do cíle
    if (c.goal?.kind === "park" && c.dir === 1 && Math.abs(c.x - PARKING.laneX) < 2 && crossed(PARKING.aisleY - 26)) {
      const s = PARKING.slots[c.goal.slot];
      startMove(
        c,
        [
          { x: PARKING.laneX - 32, y: PARKING.aisleY },
          { x: PARKING.edgeX, y: PARKING.aisleY },
          { x: s.x, y: PARKING.aisleY },
          { x: s.x, y: s.y },
        ],
        { mode: "parked" },
      );
      c.slot = c.goal.slot;
      c.goal = null;
    } else if (c.goal?.kind === "garage") {
      const g = c.goal.g;
      const lane = garageLane(g);
      if (c.dir === lane.dir && Math.abs(c.y - lane.y) < 2 && crossed(c16(g.x) - DV[lane.dir][0] * 26)) {
        startMove(c, [{ x: c16(g.x), y: c16(g.y) }, { x: c16(g.x), y: g.above ? g.y * TILE - 8 : (g.y + 1) * TILE + 8 }], { mode: "inside" });
        c.garage = g;
        c.goal = null;
      }
    }
    // plynulé natočení
    let da = ANG[c.dir] - c.ang;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    c.ang += da * Math.min(1, dt * 10);
  }
}
