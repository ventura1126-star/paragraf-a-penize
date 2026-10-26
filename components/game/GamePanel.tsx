"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BUILDING_BY_ID, DISTRICT_NAMES } from "@/content/game/city";
import { CASE_BY_ID } from "@/content/game/cases";
import { PREP_BY_ID } from "@/content/game/preps";
import { characterOf, deliveredLetters, dueCards, levelOf, useGame } from "@/lib/game/store";
import { formatCzk } from "@/lib/format";
import { BuildingScreen } from "./BuildingScreen";
import { CasePlayer } from "./CasePlayer";
import { Mailbox, monthLabel } from "./Mailbox";
import { Album } from "./Album";
import { Training } from "./Training";
import { DeadlineGame } from "./DeadlineGame";
import { CharacterPicker } from "./CharacterPicker";
import { PrepPage } from "./PrepPage";
import { CampaignMap } from "./CampaignMap";
import { YearReport } from "./YearReport";
import { HelpBanner } from "./HelpBanner";
import { GameLink } from "./GameNav";
import { PixelSprite } from "./PixelSprite";
import { LectureScreen } from "./Lecture";
import { StreetAdvice } from "./StreetAdvice";
import { BoatScreen } from "./Boat";
import { WorldIntro } from "./WorldIntro";
import { RocketScreen } from "./Rocket";
import { STREET_BY_ID } from "@/content/game/street";
import { LECTURE_BY_ID } from "@/content/game/lectures";

type View = { eyebrow?: string; title: string; body: ReactNode };

/** Pauza ve hře: postava, postup a rozcestník na ostatní herní obrazovky. */
function PauseMenu() {
  const g = useGame();
  const ch = characterOf(g);
  const lvl = levelOf(g.xp);
  const mail = deliveredLetters(g).filter((l) => !l.read).length;
  const due = dueCards(g).length;
  const items: [string, string, string?][] = [
    ["/hra/pribeh", "Příběh postavy"],
    ["/hra/schranka", "Schránka", mail ? `${mail} nové` : undefined],
    ["/hra/album", "Album karet"],
    ["/hra/trenink", "Trénink", due ? `${due} k opakování` : undefined],
    ["/hra/lhuta", "Lhůta běží", "kalendářní hádanky"],
    ["/hra/start", "Hlavní menu", "nová hra / jiná postava"],
  ];
  return (
    <>
      {ch && (
        <div className="pm-char">
          <PixelSprite id={ch.id} variant="bust" scale={4} />
          <div>
            <strong>{ch.forms.n}</strong> <span className="muted small">{ch.role}</span>
            <div className="small">
              {lvl.name} · {g.xp} XP · {formatCzk(g.wallet)} · {monthLabel(g.month)} · zátěž {g.load}/100
            </div>
          </div>
        </div>
      )}
      <nav className="pm-list" aria-label="Herní menu">
        <GameLink href="/hra" className="pm-item pm-resume">▶ Pokračovat ve hře</GameLink>
        {items.map(([href, label, note]) => (
          <GameLink key={href} href={href} className="pm-item">
            {label}
            {note && <span className="pm-note">{note}</span>}
          </GameLink>
        ))}
        <Link href="/" className="pm-item pm-exit">Opustit hru</Link>
      </nav>
      <p className="muted small">Hra se ukládá průběžně, jen v tomto prohlížeči.</p>
    </>
  );
}

export function panelView(href: string): View | null {
  const [path, query = ""] = href.split("?");
  const [, , kind, id] = path.split("/");
  switch (kind) {
    case "menu":
      return { eyebrow: "Pauza", title: "Menu", body: <PauseMenu /> };
    case "budova": {
      const b = BUILDING_BY_ID.get(id);
      return b ? { eyebrow: DISTRICT_NAMES[b.district], title: b.name, body: <BuildingScreen b={b} /> } : null;
    }
    case "pripad": {
      const c = CASE_BY_ID.get(id);
      return c
        ? { eyebrow: c.boss ? "Boss příběhu" : "Nástraha", title: c.title, body: <><CasePlayer gameCase={c} /><HelpBanner /></> }
        : null;
    }
    case "svet":
      return { eyebrow: "Nový svět", title: "Váš příběh", body: <WorldIntro /> };
    case "raketa":
      return { eyebrow: "Raketová rampa", title: "Raketa Paragraf I", body: <RocketScreen /> };
    case "lod":
      return { eyebrow: "Přístav", title: "Loď Paragraf", body: <BoatScreen /> };
    case "rada": {
      const p = STREET_BY_ID.get(id);
      return p ? { eyebrow: "Na ulici · chce poradit", title: p.npc.name, body: <StreetAdvice person={p} /> } : null;
    }
    case "prednaska": {
      const l = LECTURE_BY_ID.get(id);
      return l ? { eyebrow: "Přednáška", title: l.title, body: <LectureScreen lecture={l} /> } : null;
    }
    case "priprava": {
      const p = PREP_BY_ID.get(id);
      const zpet = new URLSearchParams(query).get("zpet");
      const back = zpet && BUILDING_BY_ID.has(zpet) ? `/hra/budova/${zpet}` : "/hra";
      return p ? { eyebrow: "Příprava", title: p.title, body: <PrepPage prep={p} back={back} /> } : null;
    }
    case "schranka":
      return { eyebrow: "Doma", title: "Schránka", body: <Mailbox /> };
    case "album":
      return { title: "Album paragrafů", body: <Album /> };
    case "trenink":
      return { eyebrow: "Opakování karet", title: "Trénink", body: <Training /> };
    case "lhuta":
      return { eyebrow: "Kalendářní hádanky", title: "Lhůta běží", body: <DeadlineGame /> };
    case "pribeh":
      return { title: "Příběh postavy", body: <><YearReport /><CampaignMap /></> };
    case "postava":
      return { eyebrow: "Město dluhů", title: "Za koho budete hrát?", body: <CharacterPicker /> };
    default:
      return null;
  }
}
