import { BUILDINGS, type Building } from "@/content/game/city";
import { CAMPAIGN_BY_CHARACTER, campaignCaseIds } from "@/content/game/campaigns";
import { caseProgress, deliveredLetters, type GameState } from "./store";

export type CaseAccess = "available" | "done" | "later" | "elsewhere";

/** Stav nástrahy pro aktuální postavu: k hraní, vyřešená, později v příběhu, nebo není v jejím příběhu. */
export function caseAccess(s: GameState, caseId: string): CaseAccess {
  if (caseProgress(s, caseId)?.done) return "done";
  const camp = s.character ? CAMPAIGN_BY_CHARACTER.get(s.character) : undefined;
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
  const camp = s.character ? CAMPAIGN_BY_CHARACTER.get(s.character) : undefined;
  if (!camp) return undefined;
  return campaignCaseIds(camp).find((id) => caseAccess(s, id) === "available");
}

export function buildingStates(s: GameState): BuildingState[] {
  const next = nextStoryCase(s);
  return BUILDINGS.map((b) => {
    const acc = b.cases.map((c) => caseAccess(s, c));
    // Domov se schránkou a bezpečná místa jsou otevřená vždy.
    const open = b.kind === "safe" || b.id === "domov" || acc.some((a) => a !== "elsewhere");
    const calling = acc.some((a) => a === "available");
    const later = acc.some((a) => a === "later");
    const done = acc.some((a) => a === "done") && !calling && !later;
    return { building: b, open, calling, next: Boolean(next && b.cases.includes(next)), later, done };
  });
}

export function storyFinished(s: GameState): boolean {
  const camp = s.character ? CAMPAIGN_BY_CHARACTER.get(s.character) : undefined;
  return Boolean(camp && caseProgress(s, camp.boss)?.done);
}
