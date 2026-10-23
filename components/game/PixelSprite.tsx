import { SPRITE_H, SPRITE_W, spriteRuns } from "@/content/game/sprites";

/**
 * Pixelová postavička jako SVG. „bust“ ořízne hlavu a ramena (pro avatar v hlavičce).
 * `scale` = počet obrazovkových pixelů na jeden pixel postavičky.
 */
export function PixelSprite({
  id,
  variant = "full",
  scale = 4,
  className,
  title,
  palette,
}: {
  id: string;
  palette?: Record<string, string>;
  variant?: "full" | "bust";
  scale?: number;
  className?: string;
  title?: string;
}) {
  const box = variant === "bust" ? { x: 2, y: 0, w: 12, h: 12 } : { x: 0, y: 0, w: SPRITE_W, h: SPRITE_H };
  return (
    <svg
      className={className}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      width={box.w * scale}
      height={box.h * scale}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {spriteRuns(id, palette).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
