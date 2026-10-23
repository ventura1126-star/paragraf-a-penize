/** Rozdělí text na věty (konec věty = . ! ? … následované velkým písmenem nebo uvozovkou/závorkou). */
export function sentences(text: string): string[] {
  return text
    .replace(/^Správně\.\s*/, "")
    .split(/(?<=[.!?…“)])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ„(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function firstSentence(text: string): string {
  return sentences(text)[0] ?? text;
}

export function restSentences(text: string): string {
  return sentences(text).slice(1).join(" ");
}
