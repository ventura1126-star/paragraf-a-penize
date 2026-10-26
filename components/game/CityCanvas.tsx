"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PIER_END,
  PAD_END,
  worldBuildings,
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
  SCHOOL_IDS,
  HOME_IDS,
  EXECUTOR_FROM,
  RACE_BY_CASE,
  SPAWN,
  wantedLevel,
  type Building,
  type Race,
} from "@/content/game/city";
import { SPRITES } from "@/content/game/sprites";
import { streetFor, type StreetNpc } from "@/content/game/street";
import { isInterlude, storyWaits, buildingStates, islandFinished, nextLecture, nextStoryCase, planetFinished, storyFinished, type BuildingState } from "@/lib/game/city-logic";
import { drawBoat, drawCar, drawRocket, drawStatic, waterColor } from "@/lib/game/render";
import { carBox, hasLights, makeTraffic, stepTraffic } from "@/lib/game/traffic";
import { ENERGY_COST, worldSeen, caseProgress, caughtByExecutor, characterOf, deliveredLetters, levelOf, raceResult, readGame, recordRace, setPos, streetQuestionIndex, useGame, useHydrated, type GameState } from "@/lib/game/store";
import { monthLabel } from "./Mailbox";
import { fill } from "@/content/game/characters";
import { GameNavContext, type GameNav } from "./GameNav";
import { panelView } from "./GamePanel";
import { TitleScreen } from "./TitleScreen";
import { Opening } from "./Opening";
import { WorldsOverview } from "./WorldsOverview";
import { MusicToggle } from "./MusicToggle";
import { Energy } from "./Sleep";
import { music } from "@/lib/game/music";

type V = { x: number; y: number };

const SPEED = 130; // px/s
const R = 9; // poloměr postavy pro kolize
const NPC_R = 11; // poloměr člověka na ulici pro kolize

function tileCenter(t: V): V {
  return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 };
}

function canStand(x: number, y: number): boolean {
  for (const [dx, dy] of [[-R, -R], [R, -R], [-R, R], [R, R]]) {
    if (!isWalkable(Math.floor((x + dx) / TILE), Math.floor((y + dy) / TILE))) return false;
  }
  return true;
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
  // nově získané XP vyskočí v HUD, jakmile je hráč zpátky na mapě
  const [xpPop, setXpPop] = useState<{ n: number; id: number } | null>(null);
  const shownXp = useRef<number | null>(null);
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
  const walkRef = useRef<(tile: V, b: Building | null) => void>(() => {});
  const realm = g.world;
  const [atPier, setAtPier] = useState(false);
  const [atPad, setAtPad] = useState(false);

  // Herní obrazovky (budova, nástraha, schránka…) jako panel nad mapou; historie kvůli tlačítku zpět.
  const [stack, setStack] = useState<string[]>([]);
  const hydrated = useHydrated();
  // hlavní menu (nová hra / pokračovat) se ukáže při každém otevření hry
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  startedRef.current = started;
  // nové spuštění (i za stejnou postavu) znovu postaví mapu a postavu na uloženou pozici
  const [run, setRun] = useState(0);
  // úvod (logo + titulky) se přehraje při první návštěvě; z hlavního menu jde pustit znovu
  const [opening, setOpening] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setOpening(!window.localStorage.getItem("pp-intro-seen"));
    } catch {
      setOpening(false);
    }
  }, []);
  // po úvodu se ukáže přehled tří světů, pak hlavní menu
  const [worldsOpen, setWorldsOpen] = useState(false);
  // při prvním vstupu postavy do světa se ukáže její příběh v tomto světě
  useEffect(() => {
    if (!hydrated || !started || !ch || opening || worldSeen(g, realm)) return;
    setStack((st) => (st.includes("/hra/svet") ? st : [...st, "/hra/svet"]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, started, ch?.id, realm, opening]);
  // hudba podle toho, kde hráč je: menu, nebo motiv světa
  useEffect(() => {
    if (!hydrated) return;
    music()?.setTheme(opening ? null : !started ? "menu" : realm);
  }, [hydrated, opening, started, realm]);
  useEffect(() => () => music()?.setTheme(null), []);
  const endOpening = useCallback(() => {
    setOpening(false);
    setWorldsOpen(true);
    try {
      window.localStorage.setItem("pp-intro-seen", "1");
    } catch {
      // ignorovat
    }
  }, []);
  const panel = !hydrated || !started ? null : ch ? stack[stack.length - 1] ?? null : null;
  const pausedRef = useRef(false);
  pausedRef.current = !hydrated || !started || Boolean(panel) || intro;
  const nav = useMemo<GameNav>(
    () => ({
      go: (href) => {
        if (href === "/hra") setStack([]);
        else if (href === "/hra/start") {
          setStack([]);
          setStarted(false);
        } else setStack((s) => (s[s.length - 1] === href ? s : [...s, href]));
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
  useEffect(() => {
    if (!hydrated) return;
    if (shownXp.current === null) shownXp.current = g.xp;
    if (panel || g.xp <= shownXp.current) {
      if (g.xp < shownXp.current) shownXp.current = g.xp;
      return;
    }
    setXpPop({ n: g.xp - shownXp.current, id: Date.now() });
    shownXp.current = g.xp;
    const t = setTimeout(() => setXpPop(null), 2600);
    return () => clearTimeout(t);
  }, [hydrated, panel, g.xp]);
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
      if (e.key !== "Escape" || !startedRef.current || !characterOf(gRef.current)) return;
      setStack((s) => (s.length ? s.slice(0, -1) : ["/hra/menu"]));
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const states = statesRef.current;
  const target = states.find((s) => s.next) ?? states.find((s) => s.calling);
  const letters = deliveredLetters(g).filter((l) => !l.read);
  const lecture = ch ? nextLecture(g) : undefined;
  const islandStarted = Boolean(caseProgress(g, "zivnostensky-list"));
  const planetStarted = Boolean(caseProgress(g, "nejdriv-rezerva"));

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
    drawStatic(world.getContext("2d")!, realm);
    const BL = worldBuildings(realm);
    const STREET = streetFor(realm);
    const npcTiles = new Set(STREET.map((n) => n.at.y * WORLD_W + n.at.x));
    const npcTile = (x: number, y: number) => npcTiles.has(y * WORLD_W + x);
    let lastPier = false;
    let lastPad = false;

    // minimapa
    const mini = miniRef.current;
    const mctx = mini?.getContext("2d");

    const start = readGame().pos;
    const startTile = isWalkable(start.x, start.y) ? start : SPAWN;
    const p = { ...tileCenter(startTile), angle: Math.PI / 2, step: 0, moving: false };
    let path: V[] = [];
    let pathBuilding: Building | null = null;
    let stuck = 0;
    const keys = new Set<string>();
    const cars = makeTraffic();
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
        if (c.mode === "inside") continue;
        const b = carBox(c);
        if (Math.abs(x - b.x) < b.hw + R - 2 && Math.abs(y - b.y) < b.hh + R - 2) return true;
      }
      for (const n of STREET) {
        const c = tileCenter(n.at);
        if (Math.hypot(x - c.x, y - c.y) < R + NPC_R) return true;
      }
      return false;
    };
    /** Dlaždice, na které zrovna stojí auto. */
    const carTile = (tx: number, ty: number) =>
      cars.some((c) => {
        if (c.mode === "inside") return false;
        const b = carBox(c);
        return b.x + b.hw > tx * TILE && b.x - b.hw < (tx + 1) * TILE && b.y + b.hh > ty * TILE && b.y - b.hh < (ty + 1) * TILE;
      });
    // když už postava v překážce je (auto do ní najelo), smí se z ní dostat ven
    const canMove = (x: number, y: number) => canStand(x, y) && (!hitsObstacle(x, y) || hitsObstacle(p.x, p.y));

    const goTo = (tile: V, b: Building | null) => {
      path = findPath(playerTile(), tile, npcTile);
      pathBuilding = b;
      if (!path.length && b && playerTile().x === b.door.x && playerTile().y === b.door.y) path = [];
    };

    const enter = () => {
      const pt = playerTile();
      const b = BL.find((bb) => bb.door.x === pt.x && bb.door.y === pt.y);
      if (pt.x === PIER_END.x && pt.y === PIER_END.y) {
        keys.clear();
        path = [];
        navRef.current.go("/hra/lod");
        return;
      }
      if (pt.x === PAD_END.x && pt.y === PAD_END.y) {
        keys.clear();
        path = [];
        navRef.current.go("/hra/raketa");
        return;
      }
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
    walkRef.current = (tile, b) => {
      canvas.focus();
      goTo(tile, b);
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
        const ox = p.x;
        const oy = p.y;
        if (canMove(nx, p.y)) p.x = nx;
        if (canMove(p.x, ny)) p.y = ny;
        // cesta po kliknutí narazila na auto (to zase čeká na postavu): najít cestu kolem aut
        if (path.length && Math.hypot(p.x - ox, p.y - oy) < 0.2) {
          stuck += dt;
          if (stuck > 0.4) {
            stuck = 0;
            const dest = path[path.length - 1];
            const around = findPath(playerTile(), dest, (x, y) => npcTile(x, y) || carTile(x, y));
            if (around.length) path = around;
          }
        } else stuck = 0;
        p.angle = Math.atan2(vy, vx);
        p.step += dt * 14;
      }

      // dveře pod postavou
      const pt = playerTile();
      const atDoor = BL.find((b) => b.door.x === pt.x && b.door.y === pt.y) ?? null;
      const pier = pt.x === PIER_END.x && pt.y === PIER_END.y;
      if (pier !== lastPier) {
        lastPier = pier;
        setAtPier(pier);
      }
      const pad = pt.x === PAD_END.x && pt.y === PAD_END.y;
      if (pad !== lastPad) {
        lastPad = pad;
        setAtPad(pad);
      }
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

      // --- auta: odbočují na křižovatkách, stojí na červenou, parkují a zajíždějí do garáží
      const cyc = t % 16;
      const hGreen = cyc < 7;
      const vGreen = cyc >= 8 && cyc < 15;
      stepTraffic(cars, dt, { player: p, hGreen, vGreen });
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
      const rc = realm !== "mesto" ? null : candidates.find((id) => RACE_BY_CASE.has(id) && !raceResult(gs, id) && !doneRaces.has(id)) ?? null;
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
      ctx.fillStyle = waterColor(realm);
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
      // loď v přístavu
      if (realm !== "planeta") drawBoat(ctx, t, realm === "ostrov" || storyFinished(gRef.current));
      drawRocket(ctx, t, realm === "planeta" || storyFinished(gRef.current));
      // auta
      for (const c of cars) {
        if (c.mode === "inside") continue;
        ctx.globalAlpha = c.alpha;
        drawCar(ctx, c.x, c.y, c.ang, c.color);
        ctx.globalAlpha = 1;
      }
      // semafory na rozích křižovatek
      for (let i = 0; i < ROAD_COLS.length; i += 2) {
        for (let j = 0; j < ROAD_ROWS.length; j += 2) {
          if (!hasLights(j / 2, i / 2)) continue;
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
  }, [ch?.id, realm, run]);

  useEffect(() => {
    const waits = storyWaits(g);
    if (target?.next && g.energy >= ENERGY_COST.case) setHint(`Cíl: ${target.building.name} – tudy vede váš příběh`);
    else if (ch && g.energy === 0) setHint("Došla energie – jděte domů a vyspěte se. Začne další měsíc.");
    else if (waits && isInterlude(g)) setHint("Mezihra: tento měsíc je volno · škola a lidé na ulici dávají XP, pak spát doma");
    else if (waits) setHint("Příběh pokračuje příští měsíc · teď škola a lidé na ulici (⚡), pak spát doma");
    else if (target && !target.next) setHint(`Cíl: ${target.building.name}`);
    else if (target) setHint(`Cíl: ${target.building.name} – na příběh je potřeba ⚡⚡, vyspěte se doma`);
    else if (realm === "mesto" && storyFinished(g)) setHint("Cíl: loď do Daňového ráje (přístav na východě), nebo raketa na Planetu investic (rampa na jihozápadě)");
    else if (realm === "ostrov" && islandFinished(g)) setHint("Daňový ráj dokončen – loď vás odveze do města, raketa na Planetu investic.");
    else if (realm === "planeta" && planetFinished(g)) setHint("Planeta investic dokončena – raketa vás vrátí na Zemi.");
    else setHint("Všechno hotovo – projděte se městem, nebo zkuste jinou postavu.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.building.id, target?.next, realm, g.cases, g.energy, g.month, g.lastStoryMonth]);

  const view = panel ? panelView(panel) : null;
  const lvl = levelOf(g.xp);
  const lvlPct = lvl.to ? ((g.xp - lvl.from) / (lvl.to - lvl.from)) * 100 : 100;
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
        <div className="gta-money" aria-label={`Peněženka ${g.wallet} Kč, ${g.xp} XP, měsíc ${g.month}, hledanost ${wantedLevel(g.load)} z 5`}>
          <span className={g.wallet < 0 ? "neg" : undefined}>{new Intl.NumberFormat("cs-CZ").format(g.wallet)} Kč</span>
          <span className={`gta-stars ${wantedLevel(g.load) >= EXECUTOR_FROM ? "hot" : ""}`} title={`Dluhová zátěž ${g.load}/100`}>
            {"★".repeat(wantedLevel(g.load))}
            <span className="off">{"★".repeat(5 - wantedLevel(g.load))}</span>
          </span>
          <small>{monthLabel(g.month)}</small>
          {ch && (
            <small className="gta-energy" title="Energie na tento měsíc: nástraha ⚡⚡, přednáška a rozhovor ⚡. Doplní se spánkem doma.">
              <Energy value={g.energy} />
            </small>
          )}
          <div className="gta-xp" title={lvl.to ? `${lvl.to - g.xp} XP do úrovně ${lvl.index + 2}` : "Nejvyšší úroveň"}>
            <b>{g.xp} XP</b> <small>{lvl.name}</small>
            <div className="gta-xpbar">
              <div style={{ width: `${lvlPct}%` }} />
            </div>
          </div>
          {xpPop && <div key={xpPop.id} className="gta-xp-pop">+{xpPop.n} XP</div>}
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
            <MusicToggle />
            <div className="gta-goal">{race ? `Cíl: ${BUILDING_BY_ID.get(race.r.building)?.name} – běží lhůta!` : hint}</div>
          </div>
          {g.load >= 70 && (
            <button type="button" onClick={() => nav.go("/hra/budova/poradna")} className="gta-pager gta-alarm">
              HLEDANOST {"★".repeat(wantedLevel(g.load))} · dluhy rostou – Dluhová poradna na náměstí je úkryt
            </button>
          )}
          {lecture && (
            <button type="button" onClick={() => {
                const sk = worldBuildings(realm).find((b) => SCHOOL_IDS.has(b.id))!;
                walkRef.current(sk.door, sk);
              }} className="gta-pager gta-school">
              ŠKOLA · nová přednáška: {lecture.title} – klepněte a postava tam dojde
            </button>
          )}
          {realm === "mesto" && ch && storyFinished(g) && !islandStarted && (
            <button type="button" onClick={() => walkRef.current(PIER_END, null)} className="gta-pager gta-school">
              PŘÍSTAV · loď do Daňového ráje je připravena – klepněte a postava dojde na molo
            </button>
          )}
          {realm !== "planeta" && ch && storyFinished(g) && !planetStarted && (
            <button type="button" onClick={() => walkRef.current(PAD_END, null)} className="gta-pager gta-school">
              RAMPA · raketa na Planetu investic je připravena – klepněte a postava dojde k rampě
            </button>
          )}
          {ch && g.energy === 0 && (
            <button
              type="button"
              onClick={() => {
                const home = worldBuildings(realm).find((b) => HOME_IDS.has(b.id))!;
                walkRef.current(home.door, home);
              }}
              className="gta-pager gta-school"
            >
              DOMŮ · energie došla – klepněte a postava půjde domů spát
            </button>
          )}
          {letters.length > 0 && (
            <button type="button" onClick={() => nav.go("/hra/schranka")} className="gta-pager">
              PAGER · {letters.length === 1 ? "nová zpráva" : `${letters.length} nové zprávy`}: {ch ? fill(letters[0].subject, ch) : letters[0].subject}
            </button>
          )}
        </div>
        {intro && ch && started && !panel && (
          <div className="gta-intro" role="dialog" aria-label="Jak se hraje">
            <strong>Vítejte v Městě dluhů</strong>
            <ul>
              <li><b>Chůze:</b> klepněte na budovu nebo místo na mapě – postava tam dojde. Na počítači i šipky / WASD.</li>
              <li><b>Žlutá šipka</b> ukazuje, kam vede váš příběh. Klepnutím do minimapy se dá cestovat.</li>
              <li><b>Dveře:</b> tlačítko Vstoupit dole (na počítači i E / Enter).</li>
              <li><b>Lidé s otazníkem</b> chtějí poradit. Dojděte k nim a promluvte si – za dobrou radu jsou XP.</li>
              <li><b>Čas:</b> každý měsíc máte ⚡⚡⚡. Kapitola příběhu stojí ⚡⚡ (jedna za měsíc, občas přijde měsíc volna), přednáška a rozhovor ⚡. Doma se vyspíte do dalšího měsíce.</li>
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
                      : HOME_IDS.has(door.id)
                        ? "Doma: schránka a postel – vyspáním začne další měsíc."
                        : doorState.nextMonth
                        ? "Příběh tu pokračuje příští měsíc."
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
        {atPad && !intro && !panel && (
          <div className="gta-door">
            <div>
              <div className="gta-door-district">Raketová rampa</div>
              <strong>{realm === "planeta" ? "Raketa na Zemi" : "Raketa na Planetu investic"}</strong>
              <div className="gta-door-status">
                {realm === "planeta" || storyFinished(g) ? "Pilotka čeká, motory se zahřívají." : "Raketa startuje, až dokončíte svůj příběh."}
              </div>
            </div>
            <button type="button" className="gta-enter" onClick={() => enterRef.current()}>
              K raketě <kbd>E</kbd>
            </button>
          </div>
        )}
        {atPier && !intro && !panel && (
          <div className="gta-door">
            <div>
              <div className="gta-door-district">Přístav</div>
              <strong>{realm === "planeta" ? "Vesmírná vyhlídka" : realm === "ostrov" ? "Loď do Města dluhů" : "Loď do Daňového ráje"}</strong>
              <div className="gta-door-status">
                {realm === "planeta" ? "Lodě tu neplují – letí se raketou." : realm === "ostrov" ? "Kapitán čeká na palubě." : storyFinished(g) ? "Kapitán čeká. Na ostrově vás čekají daně." : "Loď vyplouvá, až dokončíte svůj příběh."}
              </div>
            </div>
            <button type="button" className="gta-enter" onClick={() => enterRef.current()}>
              Na molo <kbd>E</kbd>
            </button>
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
        {hydrated && !started && opening && <Opening onDone={endOpening} />}
        {hydrated && !started && opening === false && <MusicToggle className="gta-menu title-music" />}
        {hydrated && !started && opening === false && worldsOpen && <WorldsOverview onDone={() => setWorldsOpen(false)} />}
        {hydrated && !started && opening === false && !worldsOpen && (
          <TitleScreen
            onIntro={() => setOpening(true)}
            onWorlds={() => setWorldsOpen(true)}
            onStart={() => {
              shownXp.current = null;
              setStack([]);
              setRun((n) => n + 1);
              setStarted(true);
            }}
          />
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
