import type { Lesson, Topic } from "@/lib/types";
import { vymahani } from "./topics/vymahani";
import { uvery } from "./topics/uvery";
import { dane } from "./topics/dane";
import { investice } from "./topics/investice";
import { spotrebitel } from "./topics/spotrebitel";

/** Stav právní úpravy, ke kterému je obsah aktualizován. */
export const LEGAL_STATE_DATE = "21. 10. 2026";

export const TOPICS: Topic[] = [vymahani, uvery, dane, investice, spotrebitel];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getLesson(topicSlug: string, lessonSlug: string): { topic: Topic; lesson: Lesson } | undefined {
  const topic = getTopic(topicSlug);
  const lesson = topic?.lessons.find((l) => l.slug === lessonSlug);
  return topic && lesson ? { topic, lesson } : undefined;
}
