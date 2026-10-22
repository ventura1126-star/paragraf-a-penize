"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CITY_H, CITY_W, DISTRICT_NAMES, ROAD_COLS, ROAD_ROWS, findPath, isWalkable, type Building } from "@/content/game/city";
import { SPRITE_H, spriteRuns } from "@/content/game/sprites";
import { buildingStates } from "@/lib/game/city-logic";
import { characterOf, readGame, setPos, useGame } from "@/lib/game/store";
import { PixelBuilding } from "./PixelBuilding";

const T = 16; // velikost dlaždice v px souřadnic SVG
const STEP_MS = 110;

type P = { x: number; y: number };

/** Mapa města: chůze po silnicích (šipky/WASD nebo klepnutí na budovu), Enter vstoupí do budovy. */
export function CityMap() {
  const g = useGame();
  const ch = characterOf(g);
  const router = useRouter();
  const [pos, setLocalPos] = useState<P>(() => readGame().pos);
  const [path, setPath] = useState<P[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const svgRef = useRef<SVGSVGElement>(null);

  const states = buildingStates(g);
  const atDoor = states.find((s) => s.building.door.x === pos.x && s.building.door.y === pos.y);
  const focus = states.find((s) => s.building.id === (hovered ?? selected ?? atDoor?.building.id));

  // Krok po kroku po naplánované cestě.
  useEffect(() => {
    if (!path.length) return;
    const t = setTimeout(() => {
      const [next, ...rest] = path;
      setFacing(next.x < pos.x ? -1 : next.x > pos.x ? 1 : facing);
      setLocalPos(next);
      setPath(rest);
      if (!rest.length) setPos(next);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [path, pos, facing]);

  const walkTo = useCallback(
    (b: Building) => {
      setSelected(b.id);
      setPath(findPath(pos, b.door));
    },
    [pos],
  );

  const enter = useCallback(
    (b: Building) => {
      setPos(pos);
      router.push(`/hra/budova/${b.id}`);
    },
    [pos, router],
  );

  // Klávesnice: šipky / WASD, Enter = vstoupit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const dir: Record<string, P> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const d = dir[e.key];
      if (d) {
        e.preventDefault();
        const n = { x: pos.x + d.x, y: pos.y + d.y };
        if (isWalkable(n.x, n.y)) {
          if (d.x) setFacing(d.x < 0 ? -1 : 1);
          setPath([]);
          setSelected(null);
          setLocalPos(n);
          setPos(n);
        }
      } else if ((e.key === "Enter" || e.key === " ") && atDoor && document.activeElement === svgRef.current) {
        e.preventDefault();
        if (atDoor.open) enter(atDoor.building);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pos, atDoor, enter]);

  if (!ch) return null;
  const runs = spriteRuns(ch.id);
  const walking = path.length > 0;

  return (
    <div className="city">
      <div className="city-frame">
        <svg
          ref={svgRef}
          className="city-svg"
          viewBox={`0 0 ${CITY_W * T} ${CITY_H * T}`}
          shapeRendering="crispEdges"
          role="application"
          aria-label="Mapa města. Šipkami chodíte po silnicích, Enter vstoupí do budovy."
          tabIndex={0}
        >
          {/* tráva */}
          <rect x="0" y="0" width={CITY_W * T} height={CITY_H * T} fill="#7fb069" />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={(i * 37) % (CITY_W * T)} y={(i * 53) % (CITY_H * T)} width="2" height="2" fill="#6a9a57" />
          ))}
          {/* silnice */}
          {ROAD_ROWS.map((r) => (
            <g key={`r${r}`}>
              <rect x="0" y={r * T} width={CITY_W * T} height={T} fill="#8d8f94" />
              {Array.from({ length: CITY_W }, (_, i) => (
                <rect key={i} x={i * T + 5} y={r * T + 7} width="6" height="2" fill="#c9cbd0" />
              ))}
            </g>
          ))}
          {ROAD_COLS.map((c) => (
            <rect key={`c${c}`} x={c * T} y={2 * T} width={T} height={7 * T} fill="#8d8f94" />
          ))}
          {ROAD_COLS.flatMap((c) => ROAD_ROWS.map((r) => <rect key={`x${c}-${r}`} x={c * T} y={r * T} width={T} height={T} fill="#8d8f94" />))}
          {/* park a kašna na náměstí */}
          {[{ x: 8, y: 0 }, { x: 10, y: 0 }, { x: 9, y: 1 }, { x: 8, y: 9 }, { x: 10, y: 10 }, { x: 9, y: 9 }].map((t, i) => (
            <g key={`t${i}`}>
              <rect x={t.x * T + 4} y={t.y * T + 2} width="8" height="9" fill="#3e7a3c" />
              <rect x={t.x * T + 7} y={t.y * T + 11} width="2" height="4" fill="#6b4a2b" />
            </g>
          ))}
          <rect x={8 * T + 6} y={6 * T + 4} width={2 * T + 4} height={T + 8} fill="#b8b2a6" />
          <rect x={8 * T + 10} y={6 * T + 8} width={2 * T - 4} height={T} fill="#5fa8d3" />
          {/* budovy */}
          {states.map((s) => (
            <g
              key={s.building.id}
              className={`city-building ${s.open ? "" : "closed"}`}
              onClick={() => walkTo(s.building)}
              onMouseEnter={() => setHovered(s.building.id)}
              onMouseLeave={() => setHovered(null)}
              role="button"
              aria-label={s.building.name}
            >
              <PixelBuilding b={s.building} x={s.building.x * T} y={s.building.y * T} highlight={focus?.building.id === s.building.id} />
              {!s.open && <rect x={s.building.x * T} y={s.building.y * T} width={3 * T} height={2 * T} fill="#1f1d22" opacity="0.35" />}
              {s.calling && (
                <g className="city-bang">
                  <rect x={s.building.x * T + 40} y={s.building.y * T - 6} width="9" height="11" fill={s.next ? "#ffd447" : "#f0a43a"} stroke="#1f1d22" strokeWidth="1" />
                  <rect x={s.building.x * T + 44} y={s.building.y * T - 4} width="2" height="4" fill="#1f1d22" />
                  <rect x={s.building.x * T + 44} y={s.building.y * T + 1} width="2" height="2" fill="#1f1d22" />
                </g>
              )}
            </g>
          ))}
          {/* postava */}
          <g
            className={`city-hero ${walking ? "walking" : ""}`}
            style={{ transform: `translate(${pos.x * T}px, ${pos.y * T - (SPRITE_H - T) + 2}px)` }}
          >
            <g transform={facing === -1 ? `translate(16 0) scale(-1 1)` : undefined}>
              {runs.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
              ))}
            </g>
          </g>
        </svg>
      </div>

      <div className="card city-panel" aria-live="polite">
        {focus ? (
          <>
            <div>
              <div className="eyebrow">{DISTRICT_NAMES[focus.building.district]}</div>
              <strong className="city-panel-name">{focus.building.name}</strong>
              <div className="muted small">
                {!focus.open
                  ? "Zavřeno – vaše postava sem zatím nemá důvod jít."
                  : focus.calling
                    ? focus.next
                      ? "Tady pokračuje váš příběh."
                      : "Čeká tu na vás nástraha."
                    : focus.building.kind === "safe"
                      ? "Bezpečné místo – tady vám poradí."
                      : focus.later
                        ? "Sem se vrátíte později v příběhu."
                        : focus.done
                          ? "Tady už máte hotovo."
                          : "Pro vás tu teď nic nečeká."}
              </div>
            </div>
            {focus.open && atDoor?.building.id === focus.building.id ? (
              <button type="button" className="btn-primary" onClick={() => enter(focus.building)}>
                Vstoupit
              </button>
            ) : focus.open ? (
              <span className="muted small">{walking ? "Jdete…" : "Klepněte na budovu, postava dojde ke dveřím."}</span>
            ) : null}
          </>
        ) : (
          <span className="muted small">
            Klepněte na budovu, nebo choďte šipkami (WASD). Budovy s vykřičníkem patří do vašeho příběhu; žlutý = tudy
            vede příběh dál.
          </span>
        )}
      </div>

      <details className="city-list">
        <summary>Budovy v seznamu (bez chůze)</summary>
        <ul>
          {states
            .filter((s) => s.open)
            .map((s) => (
              <li key={s.building.id}>
                <Link href={`/hra/budova/${s.building.id}`}>{s.building.name}</Link>{" "}
                <span className="muted small">
                  · {DISTRICT_NAMES[s.building.district]}
                  {s.next ? " · pokračuje tu příběh" : s.calling ? " · čeká nástraha" : ""}
                </span>
              </li>
            ))}
        </ul>
      </details>
    </div>
  );
}
