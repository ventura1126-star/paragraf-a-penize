"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CHARACTERS } from "@/content/game/characters";
import { chooseCharacter, readGame, useGame } from "@/lib/game/store";
import { formatCzk } from "@/lib/format";
import { Avatar } from "./Avatar";

function dependents(n: number): string {
  if (n === 0) return "žádné";
  return n === 1 ? "1 dítě" : `${n} děti`;
}

export function CharacterPicker() {
  const g = useGame();
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => setSel(readGame().character ?? CHARACTERS[0].id), []);

  const current = g.character;
  const chosen = CHARACTERS.find((c) => c.id === sel);

  return (
    <>
      <div className="char-grid" role="radiogroup" aria-label="Postava">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={sel === c.id}
            className={`card char-card ${sel === c.id ? "selected" : ""}`}
            onClick={() => setSel(c.id)}
          >
            <div className="char-head">
              <Avatar ch={c} size={52} />
              <div>
                <div className="char-name">
                  {c.forms.n}, {c.age}
                  {current === c.id && <span className="tag tag-done">hrajete</span>}
                </div>
                <div className="muted small">{c.role}</div>
              </div>
            </div>
            <p className="char-tagline">{c.tagline}</p>
            <dl className="char-stats">
              <div><dt>{c.income.kind === "duchod" ? "Důchod" : "Čistá mzda"}</dt><dd>{formatCzk(c.income.net)}</dd></div>
              <div><dt>Vyživované osoby</dt><dd>{dependents(c.income.dependents)}</dd></div>
              <div><dt>Peněženka</dt><dd>{formatCzk(c.wallet)}</dd></div>
            </dl>
          </button>
        ))}
      </div>

      {chosen && (
        <div className="card char-confirm">
          <div className="char-head">
            <Avatar ch={chosen} size={56} />
            <div>
              <h2>{chosen.forms.n}: proč se dostává do problémů</h2>
              <ul>
                {chosen.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
          {current && current !== chosen.id && (
            <p className="muted small">Při změně postavy začne peněženka znovu od {formatCzk(chosen.wallet)}. Karty a XP zůstanou.</p>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              chooseCharacter(chosen.id, chosen.wallet);
              router.push("/hra");
            }}
          >
            {current === chosen.id ? "Pokračovat" : `Hrát za ${chosen.forms.a}`}
          </button>
        </div>
      )}
    </>
  );
}
