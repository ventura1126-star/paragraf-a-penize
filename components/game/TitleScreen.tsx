"use client";

import { useState } from "react";
import { CHARACTERS, type Character } from "@/content/game/characters";
import { CAMPAIGN_BY_CHARACTER, ISLAND_CAMPAIGN, PLANET_CAMPAIGN, campaignCaseIds } from "@/content/game/campaigns";
import { continueGame, levelOf, newGame, savedGames, type GameState } from "@/lib/game/store";
import { formatCzk } from "@/lib/format";
import { PixelSprite } from "./PixelSprite";
import { monthLabel } from "./Mailbox";

type Step = "menu" | "new" | "continue";

function progress(ch: Character, s: GameState) {
  const done = (ids: string[]) => ids.filter((id) => s.cases[`${ch.id}:${id}`]?.done).length;
  const camp = CAMPAIGN_BY_CHARACTER.get(ch.id);
  const city = camp ? campaignCaseIds(camp) : [];
  const island = campaignCaseIds(ISLAND_CAMPAIGN);
  const planet = campaignCaseIds(PLANET_CAMPAIGN);
  return {
    city: `${done(city)}/${city.length}`,
    island: done(island) ? `${done(island)}/${island.length}` : null,
    planet: done(planet) ? `${done(planet)}/${planet.length}` : null,
  };
}

/** Hlavní menu: nová hra (přepíše uložený postup postavy), nebo pokračování v uložené hře. */
export function TitleScreen({ onStart, onIntro }: { onStart: () => void; onIntro?: () => void }) {
  const [step, setStep] = useState<Step>("menu");
  const [confirm, setConfirm] = useState<Character | null>(null);
  const saves = savedGames();
  const withSave = CHARACTERS.filter((c) => saves[c.id]);

  const startNew = (c: Character) => {
    newGame(c.id, c.wallet);
    onStart();
  };

  return (
    <div className="title-screen" role="dialog" aria-label="Hlavní menu">
      <div className="title-box">
        <div className="title-logo">
          <span>MĚSTO</span>
          <span>DLUHŮ</span>
        </div>
        <div className="title-sub">Daňový ráj · Planeta investic</div>

        {step === "menu" && (
          <div className="title-menu">
            <button type="button" className="title-btn primary" onClick={() => setStep("new")}>▶ Nová hra</button>
            <button type="button" className="title-btn" disabled={!withSave.length} onClick={() => setStep("continue")}>
              ⟳ Pokračovat{withSave.length ? ` (${withSave.length})` : ""}
            </button>
            {!withSave.length && <p className="title-note">Zatím tu není žádná uložená hra.</p>}
            <p className="title-note">Hra se ukládá jen v tomto prohlížeči. Každá postava má svůj vlastní postup.</p>
            {onIntro && (
              <button type="button" className="title-replay" onClick={onIntro}>
                ▶ Přehrát intro
              </button>
            )}
            <p className="title-credit">© Ventura Games</p>
          </div>
        )}

        {step !== "menu" && (
          <>
            <div className="title-head">
              <button type="button" className="title-back" onClick={() => { setStep("menu"); setConfirm(null); }}>← Zpět</button>
              <strong>{step === "new" ? "Nová hra: za koho budete hrát?" : "Pokračovat: vyberte uloženou hru"}</strong>
            </div>
            <div className="title-chars">
              {(step === "new" ? CHARACTERS : withSave).map((c) => {
                const s = saves[c.id];
                const pr = s ? progress(c, s) : null;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`title-char ${confirm?.id === c.id ? "picked" : ""}`}
                    onClick={() => {
                      if (step === "continue") {
                        continueGame(c.id, c.wallet);
                        onStart();
                      } else if (s) setConfirm(c);
                      else startNew(c);
                    }}
                  >
                    <span className={`title-sprite avatar-c${c.color}`}>
                      <PixelSprite id={c.id} scale={4} />
                    </span>
                    <span className="title-char-body">
                      <strong>{c.forms.n}, {c.age}</strong>
                      <span className="title-role">{c.role}</span>
                      {step === "new" ? (
                        <span className="title-tag">{c.tagline}</span>
                      ) : (
                        s && pr && (
                          <span className="title-save">
                            {monthLabel(s.month)} · {levelOf(s.xp).name} · {s.xp} XP · {formatCzk(s.wallet)}
                            <br />
                            Město {pr.city}
                            {pr.island ? ` · Daňový ráj ${pr.island}` : ""}
                            {pr.planet ? ` · Planeta ${pr.planet}` : ""}
                            {s.world === "ostrov" ? " · teď na ostrově" : s.world === "planeta" ? " · teď na planetě" : ""}
                          </span>
                        )
                      )}
                      {step === "new" && s && <span className="title-warn">má uloženou hru</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            {confirm && (
              <div className="title-confirm" role="alertdialog" aria-label="Přepsat uloženou hru">
                <p>
                  <strong>{confirm.forms.n}</strong> už má uloženou hru. Nová hra ji přepíše a začne se od začátku.
                </p>
                <div className="title-confirm-actions">
                  <button type="button" className="title-btn primary" onClick={() => startNew(confirm)}>Přepsat a začít znovu</button>
                  <button type="button" className="title-btn" onClick={() => setConfirm(null)}>Ne, zpět</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
