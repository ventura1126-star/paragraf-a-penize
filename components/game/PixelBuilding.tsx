import type { Building, District } from "@/content/game/city";

/** Barvy budov podle čtvrti (vlastní paleta herního plátna – stejná ve světlém i tmavém režimu). */
const BODY: Record<District, [string, string]> = {
  obchod: ["#e9b44c", "#b9862a"],
  finance: ["#6c8ebf", "#4a6a99"],
  urady: ["#b5aea4", "#857e74"],
  bydleni: ["#d98c6a", "#a8613f"],
  namesti: ["#5aa469", "#3c7a4a"],
};
const SIGN: Record<Building["kind"], string> = { risk: "#d64545", normal: "#f4f1e8", office: "#3d3a36", safe: "#2f8f4e" };

/**
 * Pixelová budova 48 × 32 px (3 × 2 dlaždice). Kreslí se v souřadnicích SVG mapy.
 * Dveře jsou uprostřed spodní (nebo horní) hrany podle toho, kde vede silnice.
 */
export function PixelBuilding({ b, x, y, highlight }: { b: Building; x: number; y: number; highlight?: boolean }) {
  const [body, roof] = BODY[b.district];
  const doorBelow = b.door.y > b.y;
  const doorX = x + (b.door.x - b.x) * 16 + 5;
  const sign = SIGN[b.kind];
  const windows = [5, 13, 21, 29, 37].filter((wx) => Math.abs(x + wx + 2 - (doorX + 3)) > 6).slice(0, 4).map((wx) => (
    <g key={wx}>
      <rect x={x + wx} y={y + (doorBelow ? 11 : 15)} width="4" height="4" fill="#fdf6d8" />
      <rect x={x + wx} y={y + (doorBelow ? 19 : 23)} width="4" height="4" fill="#fdf6d8" />
    </g>
  ));
  return (
    <g>
      {highlight && <rect x={x - 2} y={y - 2} width="52" height="36" fill="none" stroke="#ffd447" strokeWidth="2" />}
      {/* tělo */}
      <rect x={x + 1} y={y + 4} width="46" height="27" fill={body} />
      {/* střecha */}
      <rect x={x} y={y + 1} width="48" height="5" fill={roof} />
      <rect x={x + 2} y={y} width="44" height="2" fill={roof} />
      {/* cedule */}
      <rect x={x + 16} y={y + (doorBelow ? 6 : 26)} width="16" height="4" fill={sign} />
      {windows}
      {/* dveře */}
      <rect x={doorX} y={doorBelow ? y + 23 : y + 4} width="6" height="8" fill="#3b2a1e" />
      {/* obrys */}
      <rect x={x} y={y} width="48" height="32" fill="none" stroke="#1f1d22" strokeWidth="1" />
      <title>{b.name}</title>
    </g>
  );
}
