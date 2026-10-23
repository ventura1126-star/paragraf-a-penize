"use client";

import { useEffect, useRef } from "react";
import { TILE, type Building } from "@/content/game/city";
import { drawBuilding, palette, setTheme } from "@/lib/game/render";

/** Náhled střechy budovy shora (stejná kresba jako ve městě). */
export function RoofPreview({ b }: { b: Building }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = b.w * TILE + 40;
  const h = b.h * TILE + 56;
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setTheme(b.id.startsWith("o-") ? "ostrov" : "mesto");
    const C = palette();
    ctx.fillStyle = C.grass;
    ctx.fillRect(0, 0, w, h);
    const doorBelow = b.door.y >= b.y + b.h;
    ctx.fillStyle = C.sidewalk;
    ctx.fillRect(0, doorBelow ? h - 36 : 0, w, 36);
    drawBuilding(ctx, b, 20 - b.x * TILE, (doorBelow ? 10 : 46) - b.y * TILE);
  }, [b, w, h]);
  return <canvas ref={ref} className="roof-preview" style={{ width: Math.min(w, 220), height: (Math.min(w, 220) / w) * h }} aria-hidden />;
}
