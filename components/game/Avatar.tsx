import type { Character } from "@/content/game/characters";
import { PixelSprite } from "./PixelSprite";

/** Kulatý avatar s pixelovou bustou postavy. */
export function Avatar({ ch, size = 44 }: { ch: Character; size?: number }) {
  return (
    <span className={`avatar avatar-c${ch.color}`} style={{ width: size, height: size }} aria-hidden>
      <PixelSprite id={ch.id} variant="bust" scale={(size * 0.78) / 12} />
    </span>
  );
}
