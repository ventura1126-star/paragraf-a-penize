"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BUILDINGS,
  DISTRICT_NAMES,
  LAND,
  ROAD_COLS,
  ROAD_ROWS,
  TILE,
  WORLD_H,
  WORLD_W,
  buildingAt,
  findPath,
  isSidewalk,
  isWalkable,
  BUILDING_BY_ID,
  EXECUTOR_FROM,
  RACE_BY_CASE,
  wantedLevel,
  type Building,
  type Race,
} from "@/content/game/city";
import { SPRITES } from "@/content/game/sprites";
import { STREET, type StreetNpc } from "@/content/game/street";
import { buildingStates, nextLecture, nextStoryCase, type BuildingState } from "@/lib/game/city-logic";
import { drawCar, drawStatic } from "@/lib/game/render";
import { caughtByExecutor, characterOf, deliveredLetters, raceResult, readGame, recordRace, setPos, streetQuestionIndex, useGame, useHydrated, type GameState } from "@/lib/game/store";
import { monthLabel } from "./Mailbox";
import { fill } from "@/content/game/characters";
import { GameNavContext, type GameNav } from "./GameNav";
import { panelView } from "./GamePanel";

type V = { x: number; y: number };
type Car = { axis: "h" | "v"; lane: number; dir: 1 | -1; pos: number; speed: number; color: string };

const SPEED = 130; // px/s
const R = 9; // poloměr postavy pro kolize
const NPC_R = 11; // poloměr člověka na ulici pro kolize
const NPC_TILES = new Set(STREET.map((n) => n.at.y * WORLD_W + n.at.x));
const npcTile = (x: number, y: number) => NPC_TILES.has(y * WORLD_W + x);
const CAR_COLORS = ["#c0392b", "#2e86c1", "#f1c40f", "#16a085", "#ecf0f1", "#8e44ad", "#d35400", "#2c3e50", "#7f8c8d"];

function tileCenter(t: V): V {
  return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 };
}

function canStand(x: number, y: number): boolean {
  for (const [dx, dy] of [[-R, -R], [R, -R], [-R, R], [R, R]]) {
    if (!isWalkable(Math.floor((x + dx) / TILE), Math.floor((y + dy) / TILE))) return false;
  }
  return true;
}

function makeCars(): Car[] {
  const cars: Car[] = [];
  let k = 0;
  // vodorovné pásy: horní pruh jede doleva, dolní doprava (jako v ČR)
  for (let i = 0; i < ROAD_ROWS.length; i += 2) {
    for (let n = 0; n < 4; n++) {
      cars.push({ axis: "h", lane: ROAD_ROWS[i] * TILE + 16, dir: -1, pos: (n * 431 + i * 97) % (WORLD_W * TILE), speed: 90 + ((k * 37) % 60), color: CAR_COLORS[k++ % CAR_COLORS.length] });
      cars.push({ axis: "h", lane: ROAD_ROWS[i + 1] * TILE + 16, dir: 1, pos: (n * 389 + i * 211) % (WORLD_W * TILE), speed: 90 + ((k * 41) % 60), color: CAR_COLORS[k++ % CAR_COLORS.length] });
    }
  }
  // svislé pásy: levý pruh jede dolů, pravý nahoru
  for (let i = 0; i < ROAD_COLS.length; i += 2) {
    for (let n = 0; n < 2; n++) {
      cars.push({ axis: "v", lane: ROAD_COLS[i] * TILE + 16, dir: 1, pos: (n * 467 + i * 131) % (WORLD_H * TILE), speed: 80 + ((k * 29) % 50), color: CAR_COLORS[k++ % CAR_COLORS.length] });
      cars.push({ axis: "v", lane: ROAD_COLS[i + 1] * TILE + 16, dir: -1, pos: (n * 353 + i * 59) % (WORLD_H * TILE), speed: 80 + ((k * 31) % 50), color: CAR_COLORS[k++ % CAR_COLORS.length] });
    }
  }
  return cars;
}

/** Postava shora: ramena, hlava, vlasy; nohy se při chůzi střídají. */
function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, step: number, top: string, hair: string, skin: string, pants: string, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(3, 3, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // nohy (ve směru chůze = osa +x)
  const s = Math.sin(step) * 5;
  ctx.fillStyle = pants;
  ctx.fillRect(-2 + s, -5, 7, 4);
  ctx.fillRect(-2 - s, 1, 7, 4);
  // ramena
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // hlava
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(1, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();
  ctx.restore();
}

/** Město dluhů – pohled shora, kamera sleduje postavu. */
export function CityCanvas() {
  const g = useGame();
  const ch = characterOf(g);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const statesRef = useRef<BuildingState[]>([]);
  statesRef.current = buildingStates(g);
  const gRef = useRef<GameState>(g);
  gRef.current = g;
  const [door, setDoor] = useState<Building | null>(null);
  const [person, setPerson] = useState<StreetNpc | null>(null);
  const [race, setRace] = useState<{ r: Race; left: number } | null>(null);
  const [chased, setChased] = useState(false);
  const [toast, setToast] = useState<{ text: string; tone: "good" | "bad" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (text: string, tone: "good" | "bad") => {
    setToast({ text, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  };
  const toastRef = useRef(showToast);
  toastRef.current = showToast;
  const [hint, setHint] = useState<string>("");
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    try {
      setIntro(!window.localStorage.getItem("pp-city-intro"));
    } catch {
      setIntro(false);
    }
  }, []);
  const closeIntro = () => {
    setIntro(false);
    try {
      window.localStorage.setItem("pp-city-intro", "1");
    } catch {
      // ignorovat
    }
    canvasRef.current?.focus();
  };
  const enterRef = useRef<() => void>(() => {});
  const walkRef = useRef<(b: Building) => void>(() => {});

  // Herní obrazovky (budova, nástraha, schránka…) jako panel nad mapou; historie kvůli tlačítku zpět.
  const [stack, setStack] = useState<string[]>([]);
  const hydrated = useHydrated();
  const panel = !hydrated ? null : ch ? stack[stack.length - 1] ?? null : "/hra/postava";
  const pausedRef = useRef(false);
  pausedRef.current = !hydrated || Boolean(panel) || intro;
  const nav = useMemo<GameNav>(
    () => ({
      go: (href) => {
        if (href === "/hra") setStack([]);
        else setStack((s) => (s[s.length - 1] === href ? s : [...s, href]));
      },
    }),
    [],
  );
  const navRef = useRef(nav);
  const closePanel = () => {
    setStack([]);
    setTimeout(() => canvasRef.current?.focus(), 0);
  };
  const back = () => setStack((s) => s.slice(0, -1));
  useEffect(() => {
    if (!panel) setTimeout(() => canvasRef.current?.focus(), 0);
    document.querySelector(".gta-panel-body")?.scrollTo({ top: 0 });
  }, [panel]);
  // celá obrazovka patří hře: stránka pod ní se neposouvá
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, []);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !characterOf(gRef.current)) return;
      setStack((s) => (s.length ? s.slice(0, -1) : ["/hra/menu"]));
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const states = statesRef.current;
  const target = states.find((s) => s.next) ?? states.find((s) => s.calling);
  const letters = deliveredLetters(g).filter((l) => !l.read);
  const lecture = ch ? nextLecture(g) : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;
    const pal = (ch && SPRITES[ch.id]?.palette) || {};

    // statická vrstva
    const world = document.createElement("canvas");
    world.width = WORLD_W * TILE;
    world.height = WORLD_H * TILE;
    drawStatic(world.getContext("2d")!);

    // minimapa
    const mini = miniRef.current;
    const mctx = mini?.getContext("2d");

    const start = readGame().pos;
    const startTile = isWalkable(start.x, start.y) ? start : { x: 30, y: 24 };
    const p = { ...tileCenter(startTile), angle: Math.PI / 2, step: 0, moving: false };
    let path: V[] = [];
    let pathBuilding: Building | null = null;
    const keys = new Set<string>();
    const cars = makeCars();
    let cam = { x: p.x, y: p.y };
    let zoom = 1;
    let vw = 0;
    let vh = 0;
    let lastDoor: string | null = null;
    let lastSave = 0;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    // exekutor (hledanost)
    const ex = { active: false, x: 0, y: 0, path: [] as V[], repath: 0, cooldown: 4, far: 0, flee: 0 };
    // závod s lhůtou
    let raceCase: string | null = null;
    const doneRaces = new Set<string>();
    let raceStart = 0;
    let hudT = 0;
    const poradna = BUILDING_BY_ID.get("poradna")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      vw = wrap.clientWidth;
      vh = wrap.clientHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      zoom = Math.max(0.8, Math.min(1.6, Math.max(vw / (22 * TILE), vh / (14 * TILE)))) * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const playerTile = () => ({ x: Math.floor(p.x / TILE), y: Math.floor(p.y / TILE) });
    /** Člověk na ulici v dosahu (sousední dlaždice). */
    const nearPerson = () => {
      const pt = playerTile();
      return STREET.find((n) => Math.abs(n.at.x - pt.x) <= 1 && Math.abs(n.at.y - pt.y) <= 1) ?? null;
    };
    let lastPerson: string | null = null;
    /** Volná dlaždice vedle člověka, nejblíž postavě (k člověku samotnému se nedá vejít). */
    const besideNpc = (n: StreetNpc) => {
      const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .map(([dx, dy]) => ({ x: n.at.x + dx, y: n.at.y + dy }))
        .filter((t) => isWalkable(t.x, t.y) && !npcTile(t.x, t.y));
      opts.sort((a, b) => Math.hypot(tileCenter(a).x - p.x, tileCenter(a).y - p.y) - Math.hypot(tileCenter(b).x - p.x, tileCenter(b).y - p.y));
      return opts[0] ?? n.at;
    };
    /** Auta a lidé na ulici: postava jimi neprojde. */
    const hitsObstacle = (x: number, y: number) => {
      for (const c of cars) {
        const cx = c.axis === "h" ? c.pos : c.lane;
        const cy = c.axis === "h" ? c.lane : c.pos;
        const hw = (c.axis === "h" ? 20 : 10) + R - 2;
        const hh = (c.axis === "h" ? 10 : 20) + R - 2;
        if (Math.abs(x - cx) < hw && Math.abs(y - cy) < hh) return true;
      }
      for (const n of STREET) {
        const c = tileCenter(n.at);
        if (Math.hypot(x - c.x, y - c.y) < R + NPC_R) return true;
      }
      return false;
    };
    // když už postava v překážce je (auto do ní najelo), smí se z ní dostat ven
    const canMove = (x: number, y: number) => canStand(x, y) && (!hitsObstacle(x, y) || hitsObstacle(p.x, p.y));

    const goTo = (tile: V, b: Building | null) => {
      path = findPath(playerTile(), tile, npcTile);
      pathBuilding = b;
      if (!path.length && b && playerTile().x === b.door.x && playerTile().y === b.door.y) path = [];
    };

    const enter = () => {
      const pt = playerTile();
      const b = BUILDINGS.find((bb) => bb.door.x === pt.x && bb.door.y === pt.y);
      if (!b) {
        const n = nearPerson();
        if (n) {
          setPos(pt);
          keys.clear();
          path = [];
          navRef.current.go(`/hra/rada/${n.id}`);
        }
        return;
      }
      const st = statesRef.current.find((s) => s.building.id === b.id);
      if (!st?.open) return;
      setPos(pt);
      keys.clear();
      path = [];
      navRef.current.go(`/hra/budova/${b.id}`);
    };
    enterRef.current = enter;
    walkRef.current = (b) => {
      canvas.focus();
      goTo(b.door, b);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (pausedRef.current) {
        keys.clear();
        return;
      }
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        if (document.activeElement === canvas || wrap.contains(document.activeElement)) e.preventDefault();
        if (e.type === "keydown") {
          keys.add(k);
          path = [];
          pathBuilding = null;
        } else keys.delete(k);
      } else if (e.type === "keydown" && (k === "e" || k === "enter") && document.activeElement === canvas) {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const wx = (e.clientX - rect.left) * dpr / zoom + cam.x - canvas.width / zoom / 2;
      const wy = (e.clientY - rect.top) * dpr / zoom + cam.y - canvas.height / zoom / 2;
      const tx = Math.floor(wx / TILE);
      const ty = Math.floor(wy / TILE);
      const b = buildingAt(tx, ty);
      canvas.focus();
      const n = STREET.find((nn) => nn.at.x === tx && nn.at.y === ty);
      if (n) goTo(besideNpc(n), null);
      else if (b) goTo(b.door, b);
      else if (isWalkable(tx, ty)) goTo({ x: tx, y: ty }, null);
    };
    canvas.addEventListener("click", onClick);

    // klepnutí do minimapy = dojít tam (na nejbližší průchozí dlaždici, u budovy ke dveřím)
    const onMini = (e: MouseEvent) => {
      if (!mini) return;
      const rect = mini.getBoundingClientRect();
      const tx = Math.floor(((e.clientX - rect.left) / rect.width) * WORLD_W);
      const ty = Math.floor(((e.clientY - rect.top) / rect.height) * WORLD_H);
      const b = buildingAt(tx, ty);
      if (b) return goTo(b.door, b);
      for (let r = 0; r < 4; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (isWalkable(tx + dx, ty + dy)) return goTo({ x: tx + dx, y: ty + dy }, null);
          }
        }
      }
    };
    mini?.addEventListener("click", onMini);

    const frame = (now: number) => {
      // v panelu nebo úvodu hra stojí (čas, auta, exekutor i lhůta)
      const paused = pausedRef.current;
      const dt = paused ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      // --- pohyb postavy
      let vx = 0;
      let vy = 0;
      if (keys.has("arrowleft") || keys.has("a")) vx -= 1;
      if (keys.has("arrowright") || keys.has("d")) vx += 1;
      if (keys.has("arrowup") || keys.has("w")) vy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) vy += 1;
      if (!vx && !vy && path.length) {
        const c = tileCenter(path[0]);
        const dx = c.x - p.x;
        const dy = c.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 4) {
          path.shift();
          if (!path.length) {
            p.x = c.x;
            p.y = c.y;
          }
        } else {
          vx = dx / d;
          vy = dy / d;
        }
      }
      const len = Math.hypot(vx, vy);
      p.moving = len > 0;
      if (len) {
        vx /= len;
        vy /= len;
        const nx = p.x + vx * SPEED * dt;
        const ny = p.y + vy * SPEED * dt;
        if (canMove(nx, p.y)) p.x = nx;
        if (canMove(p.x, ny)) p.y = ny;
        p.angle = Math.atan2(vy, vx);
        p.step += dt * 14;
      }

      // dveře pod postavou
      const pt = playerTile();
      const atDoor = BUILDINGS.find((b) => b.door.x === pt.x && b.door.y === pt.y) ?? null;
      if ((atDoor?.id ?? null) !== lastDoor) {
        lastDoor = atDoor?.id ?? null;
        setDoor(atDoor);
      }
      const np = atDoor ? null : nearPerson();
      if ((np?.id ?? null) !== lastPerson) {
        lastPerson = np?.id ?? null;
        setPerson(np);
      }
      if (!p.moving && pathBuilding && atDoor?.id === pathBuilding.id) {
        pathBuilding = null;
      }
      if (now - lastSave > 1500 && !p.moving) {
        lastSave = now;
        const saved = readGame().pos;
        if (saved.x !== pt.x || saved.y !== pt.y) setPos(pt);
      }

      // --- auta: semafory na křižovatkách, odstup v pruhu, brzdí před postavou
      const cyc = t % 16;
      const hGreen = cyc < 7;
      const vGreen = cyc >= 8 && cyc < 15;
      for (const c of cars) {
        const front = c.pos + c.dir * 20;
        const next = c.pos + c.dir * c.speed * dt;
        let stop = false;
        // postava před autem
        const ax = c.axis === "h" ? front + c.dir * 14 : c.lane;
        const ay = c.axis === "h" ? c.lane : front + c.dir * 14;
        if (Math.abs(ax - p.x) < 22 && Math.abs(ay - p.y) < 22) stop = true;
        // červená: zastavit před stop čárou (pokud ještě není v křižovatce)
        const green = c.axis === "h" ? hGreen : vGreen;
        if (!stop && !green) {
          const stops = c.axis === "h" ? ROAD_COLS : ROAD_ROWS;
          for (let i = 0; i < stops.length; i += 2) {
            const edge = c.dir === 1 ? stops[i] * TILE - 34 : (stops[i + 1] + 1) * TILE + 34;
            const dist = (edge - front) * c.dir;
            if (dist >= 0 && dist < 26) stop = true;
          }
        }
        // auto před námi ve stejném pruhu
        if (!stop) {
          for (const o of cars) {
            if (o === c || o.axis !== c.axis || o.lane !== c.lane) continue;
            const gap = (o.pos - c.pos) * c.dir;
            if (gap > 0 && gap < 52) {
              stop = true;
              break;
            }
          }
        }
        if (!stop) c.pos = next;
        const lo = (c.axis === "h" ? LAND.x0 : LAND.y0) * TILE + 20;
        const hi = ((c.axis === "h" ? LAND.x1 : LAND.y1) + 1) * TILE - 20;
        if (c.pos > hi) c.pos = lo;
        if (c.pos < lo) c.pos = hi;
      }
      // --- exekutor: od 3 hvězdiček honí postavu; poradna je úkryt
      const gs = readGame();
      const stars = wantedLevel(gs.load);
      const ptile = playerTile();
      const nearPoradna = Math.abs(ptile.x - poradna.door.x) + Math.abs(ptile.y - poradna.door.y) <= 3;
      if (paused) {
        // nic
      } else if (!ex.active) {
        ex.cooldown -= dt;
        if (stars >= EXECUTOR_FROM && ex.cooldown <= 0 && !nearPoradna) {
          // objeví se na chodníku daleko od postavy
          for (let i = 0; i < 200; i++) {
            const tx = LAND.x0 + Math.floor(Math.random() * (LAND.x1 - LAND.x0));
            const ty = LAND.y0 + Math.floor(Math.random() * (LAND.y1 - LAND.y0));
            if (isSidewalk(tx, ty) && isWalkable(tx, ty) && Math.abs(tx - ptile.x) + Math.abs(ty - ptile.y) > 16) {
              const c = tileCenter({ x: tx, y: ty });
              Object.assign(ex, { active: true, x: c.x, y: c.y, path: [], repath: 0, far: 0, flee: 0 });
              toastRef.current("Exekutor vás hledá! Utečte, nebo se schovejte v Dluhové poradně.", "bad");
              break;
            }
          }
        }
      } else {
        const exSpeed = 70 + stars * 14;
        ex.repath -= dt;
        if (ex.flee > 0) {
          ex.flee -= dt;
          // odchází směrem od postavy
          const ax = ex.x - p.x;
          const ay = ex.y - p.y;
          const ad = Math.hypot(ax, ay) || 1;
          const nx = ex.x + (ax / ad) * exSpeed * 0.6 * dt;
          const ny = ex.y + (ay / ad) * exSpeed * 0.6 * dt;
          if (isWalkable(Math.floor(nx / TILE), Math.floor(ny / TILE))) {
            ex.x = nx;
            ex.y = ny;
          }
          if (ex.flee <= 0) {
            ex.active = false;
            ex.cooldown = 12;
          }
        } else if (ex.repath <= 0) {
          ex.repath = 0.7;
          ex.path = findPath({ x: Math.floor(ex.x / TILE), y: Math.floor(ex.y / TILE) }, ptile).slice(0, 12);
        }
        const next = ex.path[0];
        if (next && ex.flee <= 0) {
          const c = tileCenter(next);
          const dx = c.x - ex.x;
          const dy = c.y - ex.y;
          const d = Math.hypot(dx, dy);
          if (d < 3) ex.path.shift();
          else {
            ex.x += (dx / d) * exSpeed * dt;
            ex.y += (dy / d) * exSpeed * dt;
          }
        }
        const dist = Math.hypot(ex.x - p.x, ex.y - p.y);
        if (stars < EXECUTOR_FROM) {
          ex.active = false;
          ex.cooldown = 8;
          toastRef.current("Hledanost klesla – exekutor to vzdal.", "good");
        } else if (nearPoradna && ex.flee <= 0) {
          ex.flee = 2.5;
          ex.path = [];
          toastRef.current("Do poradny za vámi exekutor nesmí. Promluvte si tu o dluzích.", "good");
        } else if (dist < 18 && ex.flee <= 0) {
          ex.active = false;
          ex.cooldown = 20;
          keys.clear();
          path = [];
          const redirect = caughtByExecutor();
          if (redirect) {
            setPos(ptile);
            toastRef.current("Exekutor vás dostihl! Přišlo vyrozumění o exekuci.", "bad");
            setTimeout(() => navRef.current.go(`/hra/pripad/${redirect}`), 900);
          } else {
            toastRef.current("Exekutor vás dostihl: další náklady exekuce −1 500 Kč.", "bad");
          }
        } else if (dist > 20 * TILE) {
          ex.far += dt;
          if (ex.far > 5) {
            ex.active = false;
            ex.cooldown = 10;
            toastRef.current("Ztratili jste exekutora. Ale dluhy nezmizely…", "good");
          }
        } else ex.far = 0;
      }

      // --- závod s lhůtou (stav čteme přímo ze store, ne z posledního renderu)
      const candidates = [
        ...deliveredLetters(gs).filter((l) => !l.read && l.caseId).map((l) => l.caseId),
        nextStoryCase(gs),
      ].filter((id): id is string => Boolean(id));
      const rc = candidates.find((id) => RACE_BY_CASE.has(id) && !raceResult(gs, id) && !doneRaces.has(id)) ?? null;
      if (!paused && rc !== raceCase) {
        raceCase = rc;
        raceStart = t;
        if (rc) toastRef.current(`Lhůta běží: ${RACE_BY_CASE.get(rc)!.label}. Doběhněte do budovy!`, "bad");
      }
      let raceLeft = 0;
      if (raceCase) {
        const r = RACE_BY_CASE.get(raceCase)!;
        const tb = BUILDING_BY_ID.get(r.building)!;
        raceLeft = r.days - (t - raceStart) / r.pace;
        if (paused) {
          // lhůta stojí
        } else if (ptile.x === tb.door.x && ptile.y === tb.door.y) {
          doneRaces.add(raceCase);
          recordRace(raceCase, true, 0, 0);
          toastRef.current(`Stihli jste to! Lhůta zachována (zbývalo ${Math.ceil(raceLeft)} dní).`, "good");
          raceCase = null;
        } else if (raceLeft <= 0) {
          doneRaces.add(raceCase);
          recordRace(raceCase, false, r.failWallet, r.failLoad);
          toastRef.current(`${r.failText} ${r.failWallet ? `(${new Intl.NumberFormat("cs-CZ").format(r.failWallet)} Kč)` : ""}`, "bad");
          raceCase = null;
        }
      }
      hudT -= dt;
      if (hudT <= 0) {
        hudT = 0.2;
        setRace(raceCase ? { r: RACE_BY_CASE.get(raceCase)!, left: Math.max(0, Math.ceil(raceLeft)) } : null);
        setChased(ex.active && ex.flee <= 0);
      }

      // --- kamera
      cam.x += (p.x - cam.x) * Math.min(1, dt * 6);
      cam.y += (p.y - cam.y) * Math.min(1, dt * 6);
      const halfW = canvas.width / zoom / 2;
      const halfH = canvas.height / zoom / 2;
      cam.x = Math.max(halfW, Math.min(WORLD_W * TILE - halfW, cam.x));
      cam.y = Math.max(halfH, Math.min(WORLD_H * TILE - halfH, cam.y));

      // --- kreslení
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#24527d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(zoom, 0, 0, zoom, -(cam.x - halfW) * zoom, -(cam.y - halfH) * zoom);
      ctx.drawImage(world, 0, 0);

      // značky u budov
      const pulse = (Math.sin(t * 4) + 1) / 2;
      for (const s of statesRef.current) {
        const b = s.building;
        if (!s.open) {
          ctx.fillStyle = "rgba(10,10,14,0.45)";
          ctx.fillRect(b.x * TILE, b.y * TILE, b.w * TILE, b.h * TILE);
        }
        if (s.calling) {
          const c = tileCenter(b.door);
          ctx.strokeStyle = s.next ? "#ffd447" : "#f0a43a";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(c.x, c.y, 10 + pulse * 6, 0, Math.PI * 2);
          ctx.stroke();
          // šipka nad střechou
          const ax = (b.x + b.w / 2) * TILE;
          const ay = b.y * TILE - 4 - pulse * 6;
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.beginPath();
          ctx.moveTo(ax - 9 + 4, ay - 14 + 4);
          ctx.lineTo(ax + 9 + 4, ay - 14 + 4);
          ctx.lineTo(ax + 4, ay + 4);
          ctx.fill();
          ctx.fillStyle = s.next ? "#ffd447" : "#f0a43a";
          ctx.beginPath();
          ctx.moveTo(ax - 9, ay - 14);
          ctx.lineTo(ax + 9, ay - 14);
          ctx.lineTo(ax, ay);
          ctx.fill();
          ctx.strokeStyle = "#1a1a1d";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      // lidé na ulici, kteří chtějí poradit
      for (const n of STREET) {
        const c = tileCenter(n.at);
        const pl = { ...SPRITES[n.npc.shape]?.palette, ...n.npc.palette };
        drawPerson(ctx, c.x, c.y, Math.atan2(p.y - c.y, p.x - c.x), 0, pl.t ?? "#888", pl.h ?? "#333", pl.s ?? "#e0b48c", pl.p ?? "#2b2f36", 1.05);
        const open = streetQuestionIndex(gRef.current, n.id, n.questions.length) >= 0;
        const by = c.y - 24 - (open ? pulse * 3 : 0);
        ctx.fillStyle = "#1a1a1d";
        ctx.beginPath();
        ctx.arc(c.x, by, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = open ? "#ffd447" : "#5fe08a";
        ctx.beginPath();
        ctx.arc(c.x, by, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a1a1d";
        ctx.font = "bold 11px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(open ? "?" : "✓", c.x, by + 1);
        ctx.textAlign = "start";
      }
      // auta
      for (const c of cars) {
        const x = c.axis === "h" ? c.pos : c.lane;
        const y = c.axis === "h" ? c.lane : c.pos;
        const a = c.axis === "h" ? (c.dir === 1 ? 0 : Math.PI) : c.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
        drawCar(ctx, x, y, a, c.color);
      }
      // semafory na rozích křižovatek
      for (let i = 0; i < ROAD_COLS.length; i += 2) {
        for (let j = 0; j < ROAD_ROWS.length; j += 2) {
          const x0 = ROAD_COLS[i] * TILE;
          const y0 = ROAD_ROWS[j] * TILE;
          const corners: [number, number, boolean][] = [
            [x0 - 12, y0 - 12, vGreen],
            [x0 + 2 * TILE + 4, y0 - 12, hGreen],
            [x0 - 12, y0 + 2 * TILE + 4, hGreen],
            [x0 + 2 * TILE + 4, y0 + 2 * TILE + 4, vGreen],
          ];
          for (const [lx, ly, gr] of corners) {
            ctx.fillStyle = "#151518";
            ctx.fillRect(lx, ly, 8, 8);
            ctx.fillStyle = gr ? "#3ddc6b" : cyc % 8 >= 7 ? "#ffb02e" : "#ff4040";
            ctx.fillRect(lx + 2, ly + 2, 4, 4);
          }
        }
      }
      // hráč
      drawPerson(ctx, p.x, p.y, p.angle, p.moving ? p.step : 0, pal.t ?? "#2e8b8b", pal.h ?? "#3a2416", pal.s ?? "#f1c7a1", pal.p ?? "#3b4a6b", 1.15);
      ctx.strokeStyle = "#ffd447";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // exekutor
      if (ex.active) {
        drawPerson(ctx, ex.x, ex.y, Math.atan2(p.y - ex.y, p.x - ex.x), t * 14, "#1b1b1f", "#111111", "#d9a07a", "#111111", 1.2);
        ctx.fillStyle = "#5a3a1e";
        ctx.fillRect(ex.x + 6, ex.y + 6, 9, 7);
        ctx.fillStyle = Math.floor(t * 6) % 2 ? "#ff3b3b" : "#3b7bff";
        ctx.beginPath();
        ctx.arc(ex.x, ex.y - 18, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // cíl kliknutí
      if (path.length) {
        const c = tileCenter(path[path.length - 1]);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(c.x - 8, c.y - 8, 16, 16);
      }

      // --- HUD šipka k cíli příběhu (když je mimo obraz)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const raceB = raceCase ? BUILDING_BY_ID.get(RACE_BY_CASE.get(raceCase)!.building) : undefined;
      const tgt = (raceB && statesRef.current.find((s) => s.building.id === raceB.id)) ?? statesRef.current.find((s) => s.next) ?? statesRef.current.find((s) => s.calling);
      if (tgt) {
        const c = tileCenter(tgt.building.door);
        const sx = (c.x - cam.x) * zoom + canvas.width / 2;
        const sy = (c.y - cam.y) * zoom + canvas.height / 2;
        const off = sx < 0 || sy < 0 || sx > canvas.width || sy > canvas.height;
        if (off) {
          const ang = Math.atan2(sy - canvas.height / 2, sx - canvas.width / 2);
          const m = 34 * (window.devicePixelRatio || 1);
          const ex = Math.max(m, Math.min(canvas.width - m, canvas.width / 2 + Math.cos(ang) * canvas.width));
          const ey = Math.max(m, Math.min(canvas.height - m, canvas.height / 2 + Math.sin(ang) * canvas.height));
          ctx.save();
          ctx.translate(ex, ey);
          ctx.rotate(ang);
          const k = window.devicePixelRatio || 1;
          ctx.fillStyle = "#ffd447";
          ctx.strokeStyle = "#1a1a1d";
          ctx.lineWidth = 2 * k;
          ctx.beginPath();
          ctx.moveTo(16 * k, 0);
          ctx.lineTo(-10 * k, -12 * k);
          ctx.lineTo(-4 * k, 0);
          ctx.lineTo(-10 * k, 12 * k);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      }

      // --- minimapa
      if (mctx && mini) {
        const sc = mini.width / (WORLD_W * TILE);
        mctx.setTransform(1, 0, 0, 1, 0, 0);
        mctx.drawImage(world, 0, 0, mini.width, mini.height);
        mctx.strokeStyle = "rgba(255,255,255,0.8)";
        mctx.lineWidth = 1;
        mctx.strokeRect((cam.x - halfW) * sc, (cam.y - halfH) * sc, halfW * 2 * sc, halfH * 2 * sc);
        if (tgt && pulse > 0.3) {
          const c = tileCenter(tgt.building.door);
          mctx.fillStyle = "#ffd447";
          mctx.fillRect(c.x * sc - 3, c.y * sc - 3, 6, 6);
        }
        mctx.fillStyle = "#f4f1e8";
        for (const n of STREET) {
          if (streetQuestionIndex(gRef.current, n.id, n.questions.length) < 0) continue;
          const c = tileCenter(n.at);
          mctx.fillRect(c.x * sc - 1.5, c.y * sc - 1.5, 3, 3);
        }
        if (ex.active && Math.floor(t * 4) % 2) {
          mctx.fillStyle = "#3b7bff";
          mctx.fillRect(ex.x * sc - 3, ex.y * sc - 3, 6, 6);
        }
        mctx.fillStyle = "#ff4d4d";
        mctx.beginPath();
        mctx.arc(p.x * sc, p.y * sc, 3, 0, Math.PI * 2);
        mctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Ladění (jen ve vývoji): posun hry o n snímků i ve skrytém okně, kde requestAnimationFrame neběží.
    const dbg = window as unknown as { __city?: unknown };
    if (process.env.NODE_ENV !== "production") {
      dbg.__city = {
        step: (n = 60) => {
          for (let i = 0; i < n; i++) {
            const nowT = last + 1000 / 60;
            cancelAnimationFrame(raf);
            frame(nowT);
          }
        },
        state: () => ({ x: p.x, y: p.y, tile: playerTile(), path: path.length, blocked: hitsObstacle(p.x, p.y), ex: { active: ex.active, x: Math.round(ex.x), y: Math.round(ex.y), flee: ex.flee }, race: raceCase, raceLeft: raceCase ? RACE_BY_CASE.get(raceCase)!.days - (t - raceStart) / RACE_BY_CASE.get(raceCase)!.pace : null }),
        walkTo: (x: number, y: number) => goTo({ x, y }, null),
      };
    }

    return () => {
      delete dbg.__city;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      canvas.removeEventListener("click", onClick);
      mini?.removeEventListener("click", onMini);
    };
    // Smyčka se staví jen jednou pro postavu; aktuální stav budov čte přes ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch?.id]);

  useEffect(() => {
    if (target) setHint(`Cíl: ${target.building.name}${target.next ? " – tudy vede váš příběh" : ""}`);
    else setHint("Všechno hotovo – projděte se městem, nebo zkuste jinou postavu.");
  }, [target?.building.id, target?.next]);

  const view = panel ? panelView(panel) : null;
  const doorState = door ? states.find((s) => s.building.id === door.id) : undefined;

  return (
    <GameNavContext.Provider value={nav}>
    <div className="gta gta-full">
      <div className="gta-frame" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="gta-canvas"
          tabIndex={0}
          role="application"
          aria-label="Město dluhů. Šipkami nebo WASD chodíte, klepnutím na budovu k ní dojdete, E nebo Enter vstoupí."
        />
        <canvas ref={miniRef} className="gta-mini" width={162} height={105} aria-hidden />
        <div className="gta-money" aria-label={`Peněženka ${g.wallet} Kč, měsíc ${g.month}, hledanost ${wantedLevel(g.load)} z 5`}>
          <span className={g.wallet < 0 ? "neg" : undefined}>{new Intl.NumberFormat("cs-CZ").format(g.wallet)} Kč</span>
          <span className={`gta-stars ${wantedLevel(g.load) >= EXECUTOR_FROM ? "hot" : ""}`} title={`Dluhová zátěž ${g.load}/100`}>
            {"★".repeat(wantedLevel(g.load))}
            <span className="off">{"★".repeat(5 - wantedLevel(g.load))}</span>
          </span>
          <small>{monthLabel(g.month)}</small>
        </div>
        {race && (
          <div className={`gta-race ${race.left <= 5 ? "hurry" : ""}`} role="timer" aria-live="off">
            <span>LHŮTA</span>
            <strong>{race.left} {race.left === 1 ? "den" : race.left < 5 && race.left > 1 ? "dny" : "dní"}</strong>
            <small>{race.r.label} → {BUILDING_BY_ID.get(race.r.building)?.name}</small>
          </div>
        )}
        {chased && <div className="gta-chase">EXEKUTOR VÁS HONÍ</div>}
        {toast && <div className={`gta-toast ${toast.tone}`}>{toast.text}</div>}
        <div className="gta-hud">
          <div className="gta-top">
            <button type="button" className="gta-menu" onClick={() => nav.go("/hra/menu")} aria-label="Menu (Esc)">
              ☰ MENU
            </button>
            <div className="gta-goal">{race ? `Cíl: ${BUILDING_BY_ID.get(race.r.building)?.name} – běží lhůta!` : hint}</div>
          </div>
          {g.load >= 70 && (
            <button type="button" onClick={() => nav.go("/hra/budova/poradna")} className="gta-pager gta-alarm">
              HLEDANOST {"★".repeat(wantedLevel(g.load))} · dluhy rostou – Dluhová poradna na náměstí je úkryt
            </button>
          )}
          {lecture && (
            <button type="button" onClick={() => walkRef.current(BUILDING_BY_ID.get("skola")!)} className="gta-pager gta-school">
              ŠKOLA · nová přednáška: {lecture.title} – klepněte a postava tam dojde
            </button>
          )}
          {letters.length > 0 && (
            <button type="button" onClick={() => nav.go("/hra/schranka")} className="gta-pager">
              PAGER · {letters.length === 1 ? "nová zpráva" : `${letters.length} nové zprávy`}: {ch ? fill(letters[0].subject, ch) : letters[0].subject}
            </button>
          )}
        </div>
        {intro && ch && !panel && (
          <div className="gta-intro" role="dialog" aria-label="Jak se hraje">
            <strong>Vítejte v Městě dluhů</strong>
            <ul>
              <li><b>Chůze:</b> šipky / WASD, nebo klepněte na budovu – postava dojde ke dveřím.</li>
              <li><b>Žlutá šipka</b> ukazuje, kam vede váš příběh. Klepnutím do minimapy se dá cestovat.</li>
              <li><b>Dveře:</b> E / Enter nebo tlačítko Vstoupit.</li>
              <li><b>Lidé s otazníkem</b> chtějí poradit. Dojděte k nim a promluvte si – za dobrou radu jsou XP.</li>
              <li><b>LHŮTA</b> vpravo: doběhněte do budovy, než vyprší – jinak to bude dražší.</li>
              <li><b>Hvězdičky ★</b> = hledanost podle dluhů. Od 3 vás honí exekutor; úkryt je Dluhová poradna.</li>
              <li><b>Pager</b> hlásí dopisy – následky vašich rozhodnutí.</li>
            </ul>
            <button type="button" className="gta-enter" onClick={closeIntro}>Jdeme na to</button>
          </div>
        )}
        {door && !intro && !panel && (
          <div className="gta-door">
            <div>
              <div className="gta-door-district">{DISTRICT_NAMES[door.district]}</div>
              <strong>{door.name}</strong>
              <div className="gta-door-status">
                {!doorState?.open
                  ? "Zavřeno – vaše postava sem nemá důvod jít."
                  : doorState.calling
                    ? doorState.next
                      ? "Tady pokračuje váš příběh."
                      : "Čeká tu na vás nástraha."
                    : door.kind === "safe"
                      ? "Bezpečné místo – tady vám poradí."
                      : door.id === "domov"
                        ? "Doma. Ve schránce najdete dopisy."
                        : doorState.later
                        ? "Sem se vrátíte později v příběhu."
                        : "Pro vás tu teď nic nečeká."}
              </div>
            </div>
            {doorState?.open && (
              <button type="button" className="gta-enter" onClick={() => enterRef.current()}>
                Vstoupit <kbd>E</kbd>
              </button>
            )}
          </div>
        )}
        {person && !door && !intro && !panel && (
          <div className="gta-door">
            <div>
              <div className="gta-door-district">{person.npc.role}</div>
              <strong>{person.npc.name}</strong>
              <div className="gta-door-status">
                {streetQuestionIndex(g, person.id, person.questions.length) >= 0 ? "Chce od vás poradit s penězi." : "Už jste poradili. Děkuje."}
              </div>
            </div>
            <button type="button" className="gta-enter" onClick={() => enterRef.current()}>
              Promluvit <kbd>E</kbd>
            </button>
          </div>
        )}
        {view && (
          <div className="gta-panel-back" onClick={(e) => e.target === e.currentTarget && ch && closePanel()}>
            <div className="gta-panel" role="dialog" aria-modal="true" aria-label={view.title}>
              <div className="gta-panel-head">
                {ch && stack.length > 1 && (
                  <button type="button" className="gta-panel-btn" onClick={back} aria-label="Zpět">←</button>
                )}
                <div className="gta-panel-title">
                  {view.eyebrow && <small>{view.eyebrow}</small>}
                  <strong>{view.title}</strong>
                </div>
                {ch && (
                  <button type="button" className="gta-panel-btn" onClick={closePanel} aria-label="Zavřít a zpět do města (Esc)">✕</button>
                )}
              </div>
              <div className="gta-panel-body" key={panel}>{view.body}</div>
            </div>
          </div>
        )}
      </div>
    </div>
    </GameNavContext.Provider>
  );
}
