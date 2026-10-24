"use client";

import { useEffect, useRef } from "react";
import { TILE, WORLD_H, WORLD_W, type World } from "@/content/game/city";
import { drawBoat, drawRocket, drawStatic } from "@/lib/game/render";

const WORLDS: { id: World; name: string; what: string; how: string; color: string }[] = [
  {
    id: "mesto",
    name: "Město dluhů",
    what: "Zákony a povinnosti: smlouvy, půjčky, exekuce, reklamace a lhůty.",
    how: "Tady začínáte.",
    color: "#ffd447",
  },
  {
    id: "ostrov",
    name: "Daňový ráj",
    what: "Daně v podnikání: živnost, pojištění, DPH a vlastní firma.",
    how: "Lodí z přístavu, až dokončíte příběh ve městě.",
    color: "#5ccfd8",
  },
  {
    id: "planeta",
    name: "Planeta investic",
    what: "Investice: rezerva, akcie, DIP, krypto, startupy – a jak nenaletět.",
    how: "Raketou z rampy – z města i z ostrova.",
    color: "#b294ec",
  },
];

/** Zmenšená mapa světa (kreslí se jednou stejnou kresbou jako hra). */
function WorldThumb({ world }: { world: World }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const big = document.createElement("canvas");
    big.width = WORLD_W * TILE;
    big.height = WORLD_H * TILE;
    const bctx = big.getContext("2d")!;
    drawStatic(bctx, world);
    if (world !== "planeta") drawBoat(bctx, 0, true);
    drawRocket(bctx, 0, true);
    const dpr = window.devicePixelRatio || 1;
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(big, 0, 0, c.width, c.height);
  }, [world]);
  return <canvas ref={ref} className="wo-thumb" aria-hidden />;
}

/** Okno s přehledem tří světů hry a cestou mezi nimi. */
export function WorldsOverview({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  return (
    <div className="title-screen" role="dialog" aria-label="Světy hry">
      <div className="title-box wo-box">
        <div className="wo-head">
          <strong>Tři světy, jedna cesta</strong>
          <span>Každý svět učí něco jiného. Splňte příběh a otevře se vám další.</span>
        </div>
        <ol className="wo-list">
          {WORLDS.map((w, i) => (
            <li key={w.id} className="wo-world" style={{ borderColor: w.color }}>
              <div className="wo-step" style={{ background: w.color }}>{i + 1}</div>
              <WorldThumb world={w.id} />
              <strong style={{ color: w.color }}>{w.name}</strong>
              <p>{w.what}</p>
              <p className="wo-how">{w.how}</p>
            </li>
          ))}
        </ol>
        <div className="wo-routes" aria-label="Cesty mezi světy">
          <span>Město dluhů ⛵ Daňový ráj</span>
          <span>Město dluhů 🚀 Planeta investic</span>
          <span>Daňový ráj 🚀 Planeta investic</span>
        </div>
        <button type="button" className="title-btn primary wo-go" onClick={onDone}>
          Pokračovat ▶
        </button>
      </div>
    </div>
  );
}
