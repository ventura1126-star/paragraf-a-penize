import {
  BUILDINGS,
  DECOR,
  FOUNTAIN,
  LAND,
  ROAD_COLS,
  ROAD_ROWS,
  TILE,
  WORLD_H,
  WORLD_W,
  isLand,
  isRoad,
  isSidewalk,
  type Building,
  type District,
} from "@/content/game/city";

/** Paleta herního plátna (pohled shora ve stylu GTA 1) – nezávislá na světlém/tmavém režimu stránky. */
export const C = {
  water: "#24527d",
  waterHi: "#3470a3",
  grass: "#4f7d3a",
  grassDark: "#41692f",
  road: "#38393e",
  roadEdge: "#2c2d31",
  lane: "#d9d6c8",
  zebra: "#e8e5d8",
  sidewalk: "#9b968c",
  sidewalkSeam: "#8a857b",
  curb: "#6e6a63",
  shadow: "rgba(0,0,0,0.38)",
  sand: "#c9b07a",
};

const ROOF: Record<District, { base: string; hi: string; lo: string }> = {
  obchod: { base: "#c79a2a", hi: "#e2bd52", lo: "#8f6c17" },
  finance: { base: "#3f5f8c", hi: "#5f82b3", lo: "#2a4166" },
  urady: { base: "#7b7872", hi: "#9b9891", lo: "#55534f" },
  bydleni: { base: "#a3583b", hi: "#c4795a", lo: "#733b25" },
  namesti: { base: "#3d8c58", hi: "#5fb078", lo: "#2a633e" },
};
const KIND_COLOR: Record<Building["kind"], string> = { risk: "#ff5c5c", normal: "#ffd447", office: "#c9c9c9", safe: "#5fe08a" };

/** Deterministický generátor (stejné město při každém načtení). */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function px(t: number) {
  return t * TILE;
}

/** Střecha budovy vč. stínu, detailů a cedule. `ox, oy` = posun (pro náhled mimo mapu). */
export function drawBuilding(ctx: CanvasRenderingContext2D, b: Building, ox = 0, oy = 0) {
  const x = px(b.x) + ox;
  const y = px(b.y) + oy;
  const w = px(b.w);
  const h = px(b.h);
  const r = ROOF[b.district];
  const rand = rng(b.id);
  // stín na jihovýchod
  ctx.fillStyle = C.shadow;
  ctx.fillRect(x + 8, y + 8, w, h);
  // atika a střecha
  ctx.fillStyle = r.lo;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = r.hi;
  ctx.fillRect(x, y, w - 4, h - 4);
  ctx.fillStyle = r.base;
  ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
  // štěrk
  for (let i = 0; i < (w * h) / 90; i++) {
    ctx.fillStyle = rand() > 0.5 ? r.lo : r.hi;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(x + 6 + rand() * (w - 14), y + 6 + rand() * (h - 14), 2, 2);
  }
  ctx.globalAlpha = 1;
  // světlíky
  const skyN = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < skyN; i++) {
    const sx = x + 12 + rand() * (w - 50);
    const sy = y + 12 + rand() * (h - 60);
    ctx.fillStyle = "#1f2b38";
    ctx.fillRect(sx, sy, 26, 14);
    ctx.fillStyle = "#7fb4d8";
    ctx.fillRect(sx + 2, sy + 2, 10, 10);
    ctx.fillRect(sx + 14, sy + 2, 10, 10);
  }
  // klimatizace
  const acN = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < acN; i++) {
    const ax = x + 10 + rand() * (w - 34);
    const ay = y + 10 + rand() * (h - 52);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(ax + 3, ay + 3, 16, 16);
    ctx.fillStyle = "#b9bcc0";
    ctx.fillRect(ax, ay, 16, 16);
    ctx.fillStyle = "#6f7378";
    ctx.beginPath();
    ctx.arc(ax + 8, ay + 8, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // zvláštní střechy
  const cxr = x + w / 2;
  const cyr = y + h / 2 + (b.door.y >= b.y + b.h ? -10 : 10);
  if (b.id === "banka") {
    ctx.fillStyle = "#2f3a48";
    ctx.beginPath();
    ctx.arc(cxr, cyr, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f4f1e8";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f4f1e8";
    ctx.font = "bold 20px ui-monospace, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("H", cxr, cyr + 1);
    ctx.textAlign = "start";
  } else if (b.id === "soud") {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(cxr + 5, cyr + 5, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6e8f86";
    ctx.beginPath();
    ctx.arc(cxr, cyr, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8fb3a8";
    ctx.beginPath();
    ctx.arc(cxr - 6, cyr - 6, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.id === "poradna") {
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(cxr - 6, cyr - 20, 12, 40);
    ctx.fillRect(cxr - 20, cyr - 6, 40, 12);
  } else if (b.id === "kulturak" || b.id === "nebankovka") {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x + 14, y + 18, w - 24, 22);
    ctx.fillStyle = b.id === "kulturak" ? "#e84393" : "#ff5c5c";
    ctx.fillRect(x + 10, y + 14, w - 24, 22);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px ui-monospace, Menlo, monospace";
    ctx.textBaseline = "middle";
    ctx.fillText(b.id === "kulturak" ? "OBĚD ZDARMA!" : "PENÍZE HNED!", x + 16, y + 25, w - 36);
  }
  // vchod (stříška nad dveřmi)
  const doorBelow = b.door.y >= b.y + b.h;
  const dx = px(b.door.x) + ox;
  ctx.fillStyle = "#1a1a1d";
  ctx.fillRect(dx + 4, doorBelow ? y + h - 6 : y, TILE - 8, 6);
  ctx.fillStyle = KIND_COLOR[b.kind];
  ctx.fillRect(dx + 2, doorBelow ? y + h - 2 : y - 2, TILE - 4, 4);
  // cedule s názvem
  const plateH = 18;
  const py = doorBelow ? y + h - 30 : y + 12;
  ctx.font = "bold 11px ui-monospace, Menlo, monospace";
  let fs = 11;
  while (ctx.measureText(b.name).width > w - 20 && fs > 7) {
    fs -= 1;
    ctx.font = `bold ${fs}px ui-monospace, Menlo, monospace`;
  }
  const tw = Math.min(ctx.measureText(b.name).width, w - 20);
  const plx = x + (w - tw) / 2 - 8;
  ctx.fillStyle = "rgba(10,10,12,0.82)";
  ctx.fillRect(plx, py, tw + 16, plateH);
  ctx.fillStyle = KIND_COLOR[b.kind];
  ctx.fillRect(plx, py, 3, plateH);
  ctx.fillStyle = "#f4f1e8";
  ctx.textBaseline = "middle";
  ctx.fillText(b.name, plx + 8, py + plateH / 2 + 1, w - 20);
}

function drawTree(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = C.shadow;
  ctx.beginPath();
  ctx.arc(cx + 5, cy + 5, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f5e2a";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3f7a37";
  ctx.beginPath();
  ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

/** Zaparkované auto (statické). */
export function drawCar(ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(-17, -7, 38, 20);
  ctx.fillStyle = color;
  ctx.fillRect(-20, -10, 40, 20);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(-20, -10, 40, 4);
  ctx.fillStyle = "#1c2733";
  ctx.fillRect(6, -8, 8, 16); // přední sklo
  ctx.fillRect(-15, -8, 5, 16); // zadní sklo
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(-9, -8, 14, 16); // střecha
  ctx.fillStyle = "#fff6c2";
  ctx.fillRect(18, -8, 2, 4);
  ctx.fillRect(18, 4, 2, 4);
  ctx.fillStyle = "#b8231f";
  ctx.fillRect(-20, -8, 2, 4);
  ctx.fillRect(-20, 4, 2, 4);
  ctx.restore();
}

/** Statická vrstva celého města (vykreslí se jednou do offscreen plátna). */
export function drawStatic(ctx: CanvasRenderingContext2D) {
  const W = WORLD_W * TILE;
  const H = WORLD_H * TILE;
  const rand = rng("mesto-dluhu");
  // voda
  ctx.fillStyle = C.water;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = C.waterHi;
    ctx.fillRect(rand() * W, rand() * H, 10 + rand() * 14, 2);
  }
  // pevnina: tráva
  ctx.fillStyle = C.grass;
  ctx.fillRect(px(LAND.x0), px(LAND.y0), px(LAND.x1 - LAND.x0 + 1), px(LAND.y1 - LAND.y0 + 1));
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = C.grassDark;
    ctx.fillRect(px(LAND.x0) + rand() * px(LAND.x1 - LAND.x0), px(LAND.y0) + rand() * px(LAND.y1 - LAND.y0), 3, 3);
  }
  // nábřeží (stín pevniny do vody)
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(px(LAND.x0) + 6, px(LAND.y1 + 1), px(LAND.x1 - LAND.x0 + 1), 6);
  ctx.fillRect(px(LAND.x1 + 1), px(LAND.y0) + 6, 6, px(LAND.y1 - LAND.y0 + 1));

  // chodníky a silnice po dlaždicích
  for (let ty = LAND.y0; ty <= LAND.y1; ty++) {
    for (let tx = LAND.x0; tx <= LAND.x1; tx++) {
      const x = px(tx);
      const y = px(ty);
      if (isRoad(tx, ty)) {
        ctx.fillStyle = C.road;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = C.roadEdge;
        ctx.fillRect(x + ((tx * 7 + ty * 3) % 28), y + ((tx * 5 + ty * 11) % 28), 3, 3);
      } else if (isSidewalk(tx, ty)) {
        ctx.fillStyle = C.sidewalk;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = C.sidewalkSeam;
        ctx.fillRect(x, y, TILE, 1);
        ctx.fillRect(x, y, 1, TILE);
        ctx.fillRect(x + 16, y, 1, TILE);
        ctx.fillRect(x, y + 16, TILE, 1);
      }
    }
  }
  // obrubníky
  for (let ty = LAND.y0; ty <= LAND.y1; ty++) {
    for (let tx = LAND.x0; tx <= LAND.x1; tx++) {
      if (!isRoad(tx, ty)) continue;
      ctx.fillStyle = C.curb;
      if (!isRoad(tx, ty - 1) && isLand(tx, ty - 1)) ctx.fillRect(px(tx), px(ty), TILE, 3);
      if (!isRoad(tx, ty + 1) && isLand(tx, ty + 1)) ctx.fillRect(px(tx), px(ty + 1) - 3, TILE, 3);
      if (!isRoad(tx - 1, ty) && isLand(tx - 1, ty)) ctx.fillRect(px(tx), px(ty), 3, TILE);
      if (!isRoad(tx + 1, ty) && isLand(tx + 1, ty)) ctx.fillRect(px(tx + 1) - 3, px(ty), 3, TILE);
    }
  }
  // středové čáry (přerušované) mezi pruhy, mimo křižovatky
  ctx.fillStyle = C.lane;
  for (let i = 0; i < ROAD_ROWS.length; i += 2) {
    const yLine = px(ROAD_ROWS[i + 1]) - 1;
    for (let x = px(LAND.x0); x < px(LAND.x1 + 1); x += 24) {
      const tx = Math.floor(x / TILE);
      if (ROAD_COLS.includes(tx) || ROAD_COLS.includes(tx + 1)) continue;
      ctx.fillRect(x, yLine, 12, 2);
    }
  }
  for (let i = 0; i < ROAD_COLS.length; i += 2) {
    const xLine = px(ROAD_COLS[i + 1]) - 1;
    for (let y = px(LAND.y0); y < px(LAND.y1 + 1); y += 24) {
      const ty = Math.floor(y / TILE);
      if (ROAD_ROWS.includes(ty) || ROAD_ROWS.includes(ty + 1)) continue;
      ctx.fillRect(xLine, y, 2, 12);
    }
  }
  // přechody pro chodce u křižovatek
  ctx.fillStyle = C.zebra;
  for (let i = 0; i < ROAD_COLS.length; i += 2) {
    for (let j = 0; j < ROAD_ROWS.length; j += 2) {
      const cx0 = px(ROAD_COLS[i]);
      const cy0 = px(ROAD_ROWS[j]);
      for (let k = 0; k < 6; k++) {
        ctx.fillRect(cx0 + 4 + k * 10, cy0 - 30, 6, 26); // nad křižovatkou (na silnici)
        ctx.fillRect(cx0 + 4 + k * 10, cy0 + 2 * TILE + 4, 6, 26);
        ctx.fillRect(cx0 - 30, cy0 + 4 + k * 10, 26, 6);
        ctx.fillRect(cx0 + 2 * TILE + 4, cy0 + 4 + k * 10, 26, 6);
      }
    }
  }

  // dekorace bloků
  for (const d of DECOR) {
    const x = px(d.x);
    const y = px(d.y);
    const w = px(d.w);
    const h = px(d.h);
    if (d.kind === "parking") {
      ctx.fillStyle = "#47494e";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#cfcfc6";
      for (let i = 0; i <= 8; i++) {
        ctx.fillRect(x + 12 + i * 32, y + 10, 2, 54);
        ctx.fillRect(x + 12 + i * 32, y + h - 64, 2, 54);
      }
      const colors = ["#c0392b", "#2e86c1", "#f1c40f", "#7f8c8d", "#27ae60", "#ecf0f1", "#8e44ad"];
      for (let i = 0; i < 8; i++) {
        if (rand() < 0.35) continue;
        drawCar(ctx, x + 28 + i * 32, y + 38, Math.PI / 2, colors[Math.floor(rand() * colors.length)]);
        if (rand() < 0.5) drawCar(ctx, x + 28 + i * 32, y + h - 38, -Math.PI / 2, colors[Math.floor(rand() * colors.length)]);
      }
    } else if (d.kind === "park") {
      ctx.fillStyle = "#5c9445";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = C.sand;
      ctx.fillRect(x, y + h / 2 - 10, w, 20);
      ctx.fillRect(x + w / 2 - 10, y, 20, h);
      for (let i = 0; i < 14; i++) {
        const tx = x + 16 + rand() * (w - 32);
        const ty = y + 16 + rand() * (h - 32);
        if (Math.abs(tx - (x + w / 2)) < 70 && Math.abs(ty - (y + h / 2)) < 70) continue;
        drawTree(ctx, tx, ty, 9 + rand() * 6);
      }
    } else if (d.kind === "gas") {
      ctx.fillStyle = "#8c8b87";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = C.shadow;
      ctx.fillRect(x + 48, y + 56, 192, 96);
      ctx.fillStyle = "#e6e3dc";
      ctx.fillRect(x + 40, y + 48, 192, 96);
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(x + 40, y + 48, 192, 10);
      ctx.fillStyle = "#1a1a1d";
      ctx.font = "bold 12px ui-monospace, Menlo, monospace";
      ctx.textBaseline = "middle";
      ctx.fillText("BENZINA", x + 104, y + 100);
    }
  }
  // kašna
  {
    const x = px(FOUNTAIN.x);
    const y = px(FOUNTAIN.y);
    const s = px(FOUNTAIN.w);
    ctx.fillStyle = C.shadow;
    ctx.beginPath();
    ctx.arc(x + s / 2 + 6, y + s / 2 + 6, s / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c7c1b4";
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4f9fd1";
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s / 2 - 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c7c1b4";
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // stromy na trávě za budovami
  for (let i = 0; i < 70; i++) {
    const tx = LAND.x0 + 1 + Math.floor(rand() * (LAND.x1 - LAND.x0 - 1));
    const ty = LAND.y0 + 1 + Math.floor(rand() * (LAND.y1 - LAND.y0 - 1));
    if (isRoad(tx, ty) || isSidewalk(tx, ty)) continue;
    if (BUILDINGS.some((b) => tx >= b.x - 1 && tx <= b.x + b.w && ty >= b.y - 1 && ty <= b.y + b.h)) continue;
    if (DECOR.some((d) => tx >= d.x && tx < d.x + d.w && ty >= d.y && ty < d.y + d.h)) continue;
    drawTree(ctx, px(tx) + 16, px(ty) + 16, 10 + rand() * 5);
  }
  // budovy
  for (const b of BUILDINGS) drawBuilding(ctx, b);
  // rohože u dveří
  for (const b of BUILDINGS) {
    ctx.fillStyle = "#5a4a3a";
    ctx.fillRect(px(b.door.x) + 6, px(b.door.y) + 6, TILE - 12, TILE - 12);
  }
}
