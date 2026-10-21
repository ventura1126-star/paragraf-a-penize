"use client";

import { resetGame } from "@/lib/game/store";

export function ResetButton() {
  return (
    <p className="muted small" style={{ marginTop: "2rem" }}>
      Postup se ukládá jen v tomto prohlížeči.{" "}
      <button
        type="button"
        className="linklike"
        onClick={() => {
          if (window.confirm("Opravdu smazat celý herní postup (XP, karty, peněženku)?")) resetGame();
        }}
      >
        Začít znovu
      </button>
    </p>
  );
}
