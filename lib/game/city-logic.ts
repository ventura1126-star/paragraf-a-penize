import { HOME_IDS, SCHOOL_IDS, worldBuildings, type Building } from "@/content/game/city";
import { CAMPAIGN_BY_CHARACTER, ISLAND_CAMPAIGN, campaignCaseIds, type Campaign } from "@/content/game/campaigns";
import { caseProgress, deliveredLetters, lectureDone, type GameState } from "./store";
import { LECTURES, type Lecture } from "@/content/game/lectures";

export type CaseAccess = "available" | "done" | "later" | "elsewhere";

/** Příběh světa, ve kterém postava právě je (na ostrově společný Daňový ráj). */
export function campaignFor(s: GameState): Campaign | undefined {
  if (!s.character) return undefined;
  return s.world === "ostrov" ? ISLAND_CAMPAIGN : CAMPAIGN_BY_CHARACTER.get(s.character);
}

/** Stav nástrahy pro aktuální postavu: k hraní, vyřešená, později v příběhu, nebo není v jejím příběhu. */
export function caseAccess(s: GameState, caseId: string): CaseAccess {
  if (caseProgress(s, caseId)?.done) return "done";
  const camp = campaignFor(s);
  const letter = deliveredLetters(s).some((l) => l.caseId === caseId && !l.read);
  if (letter) return "available";
  if (!camp) return "elsewhere";
  const ids = campaignCaseIds(camp);
  const i = ids.indexOf(caseId);
  if (i < 0) return "elsewhere";
  const open = s.opened[camp.character] || i === 0 || Boolean(caseProgress(s, ids[i - 1])?.done);
  return open ? "available" : "later";
}

export type BuildingState = {
  building: Building;
  /** Postava sem má důvod jít (nástraha z příběhu nebo dopis). */
  open: boolean;
  /** Svítí vykřičník – čeká tu nevyřešená nástraha. */
  calling: boolean;
  /** Tady pokračuje hlavní příběh. */
  next: boolean;
  /** Nástraha z příběhu tu přijde na řadu později. */
  later: boolean;
  /** Všechny nástrahy postavy tady jsou vyřešené. */
  done: boolean;
};

export function nextStoryCase(s: GameState): string | undefined {
  const camp = campaignFor(s);
  if (!camp) return undefined;
  return campaignCaseIds(camp).find((id) => caseAccess(s, id) === "available");
}

export function buildingStates(s: GameState): BuildingState[] {
  const next = nextStoryCase(s);
  return worldBuildings(s.world).map((b) => {
    const acc = b.cases.map((c) => caseAccess(s, c));
    // Domov se schránkou, škola a bezpečná místa jsou otevřená vždy.
    const open = b.kind === "safe" || HOME_IDS.has(b.id) || SCHOOL_IDS.has(b.id) || acc.some((a) => a !== "elsewhere");
    const calling = acc.some((a) => a === "available") || (SCHOOL_IDS.has(b.id) && Boolean(nextLecture(s)));
    const later = acc.some((a) => a === "later");
    const done = acc.some((a) => a === "done") && !calling && !later;
    return { building: b, open, calling, next: Boolean(next && b.cases.includes(next)), later, done };
  });
}

export function storyFinished(s: GameState): boolean {
  const camp = s.character ? CAMPAIGN_BY_CHARACTER.get(s.character) : undefined;
  return Boolean(camp && caseProgress(s, camp.boss)?.done);
}

/** Počet vyřešených nástrah aktuální postavy. */
export function casesSolved(s: GameState): number {
  const prefix = `${s.character ?? "-"}:`;
  return Object.entries(s.cases).filter(([k, v]) => k.startsWith(prefix) && v.done).length;
}

export type LectureAccess = "done" | "open" | "locked";

/** Přednášky ve škole: každá vyřešená nástraha otevře další. */
export function lectureAccess(s: GameState, i: number): LectureAccess {
  if (lectureDone(s, LECTURES[i].id)) return "done";
  return i < casesSolved(s) ? "open" : "locked";
}

/** První otevřená přednáška, na které postava ještě nebyla. */
export function nextLecture(s: GameState): Lecture | undefined {
  return LECTURES.find((_, i) => lectureAccess(s, i) === "open");
}

/** Daňový ráj dokončen (boss ostrova poražen). */
export function islandFinished(s: GameState): boolean {
  return Boolean(caseProgress(s, ISLAND_CAMPAIGN.boss)?.done);
}
