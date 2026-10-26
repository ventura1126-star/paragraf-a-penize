import { HOME_IDS, SCHOOL_IDS, worldBuildings, type Building } from "@/content/game/city";
import { CAMPAIGN_BY_CHARACTER, ISLAND_CAMPAIGN, PLANET_CAMPAIGN, campaignCaseIds, type Campaign } from "@/content/game/campaigns";
import { caseProgress, deliveredLetters, lectureDone, type GameState } from "./store";
import { lecturesFor, type Lecture } from "@/content/game/lectures";

/** nextMonth = kapitola je na řadě, ale tento měsíc už postava jednu vyřešila (pokračuje se po spánku). */
export type CaseAccess = "available" | "done" | "later" | "elsewhere" | "nextMonth";

/** Příběh světa, ve kterém postava právě je (na ostrově společný Daňový ráj). */
export function campaignFor(s: GameState): Campaign | undefined {
  if (!s.character) return undefined;
  if (s.world === "ostrov") return ISLAND_CAMPAIGN;
  if (s.world === "planeta") return PLANET_CAMPAIGN;
  return CAMPAIGN_BY_CHARACTER.get(s.character);
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
  if (!open) return "later";
  return s.month < storyResumes(s, camp) ? "nextMonth" : "available";
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
  /** Kapitola příběhu tu pokračuje příští měsíc. */
  nextMonth: boolean;
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
    const nextMonth = acc.some((a) => a === "nextMonth");
    return { building: b, open, calling, next: Boolean(next && b.cases.includes(next)), later, done, nextMonth };
  });
}

export function storyFinished(s: GameState): boolean {
  const camp = s.character ? CAMPAIGN_BY_CHARACTER.get(s.character) : undefined;
  return Boolean(camp && caseProgress(s, camp.boss)?.done);
}

/** Počet vyřešených nástrah z příběhu světa, ve kterém postava je. */
export function casesSolved(s: GameState): number {
  const camp = campaignFor(s);
  return camp ? campaignCaseIds(camp).filter((id) => caseProgress(s, id)?.done).length : 0;
}

export type LectureAccess = "done" | "open" | "locked";

/** Přednášky ve škole daného světa: každá vyřešená nástraha z jeho příběhu otevře další. */
export function lectureAccess(s: GameState, i: number): LectureAccess {
  const list = lecturesFor(s.world);
  if (lectureDone(s, list[i].id)) return "done";
  return i < casesSolved(s) ? "open" : "locked";
}

/** První otevřená přednáška ve škole světa, na které postava ještě nebyla. */
export function nextLecture(s: GameState): Lecture | undefined {
  return lecturesFor(s.world).find((_, i) => lectureAccess(s, i) === "open");
}

/** Daňový ráj dokončen (boss ostrova poražen). */
export function islandFinished(s: GameState): boolean {
  return Boolean(caseProgress(s, ISLAND_CAMPAIGN.boss)?.done);
}

/** Planeta investic dokončena. */
export function planetFinished(s: GameState): boolean {
  return Boolean(caseProgress(s, PLANET_CAMPAIGN.boss)?.done);
}

/**
 * Kdy příběh pokračuje: kapitola nejvýš jednou za měsíc a po každé druhé kapitole měsíc volna (mezihra –
 * škola, lidé na ulici, schránka).
 */
export function storyResumes(s: GameState, camp: Campaign): number {
  if (s.lastStoryMonth === undefined) return 0;
  const done = campaignCaseIds(camp).filter((id) => caseProgress(s, id)?.done).length;
  return s.lastStoryMonth + (done > 0 && done % 2 === 0 ? 2 : 1);
}

/** Je tento měsíc mezihra (volno mezi kapitolami)? */
export function isInterlude(s: GameState): boolean {
  const camp = campaignFor(s);
  if (!camp || s.lastStoryMonth === undefined || s.lastStoryMonth === s.month) return false;
  return s.month < storyResumes(s, camp) && Boolean(storyWaits(s));
}

/** Další kapitola příběhu čeká na příští měsíc (dnes už postava jednu vyřešila). */
export function storyWaits(s: GameState): string | undefined {
  const camp = campaignFor(s);
  if (!camp) return undefined;
  return campaignCaseIds(camp).find((id) => caseAccess(s, id) === "nextMonth");
}
