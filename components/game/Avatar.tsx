import type { Character } from "@/content/game/characters";
import { initials } from "@/content/game/characters";

export function Avatar({ ch, size = 44 }: { ch: Character; size?: number }) {
  return (
    <span className={`avatar avatar-c${ch.color}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden>
      {initials(ch)}
    </span>
  );
}
