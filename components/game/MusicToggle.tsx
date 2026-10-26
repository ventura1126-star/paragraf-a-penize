"use client";

import { useSyncExternalStore } from "react";
import { music } from "@/lib/game/music";

const subscribe = (l: () => void) => music()?.subscribe(l) ?? (() => {});

/** Tlačítko hudby (zapnout / ztlumit), volba se pamatuje v prohlížeči. */
export function MusicToggle({ className = "gta-menu" }: { className?: string }) {
  const on = useSyncExternalStore(subscribe, () => music()?.on ?? true, () => true);
  return (
    <button
      type="button"
      className={`${className} music-toggle ${on ? "" : "off"}`}
      onClick={() => music()?.toggle()}
      aria-pressed={on}
      aria-label={on ? "Ztlumit hudbu" : "Zapnout hudbu"}
      title={on ? "Ztlumit hudbu" : "Zapnout hudbu"}
    >
      {on ? "♪" : "♪̸"}
    </button>
  );
}
