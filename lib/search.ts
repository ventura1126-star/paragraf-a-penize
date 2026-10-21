import { TOPICS } from "@/content";
import { GLOSSARY } from "@/content/glossary";
import { LAWS } from "@/content/laws";
import { formatCitation } from "@/lib/format";
import type { Block } from "@/lib/types";

export type SearchDoc = { href: string; title: string; context: string; text: string };

function blockText(b: Block): string {
  return b.type === "list" || b.type === "steps" ? b.items.join(" ") : b.text;
}

/** Index po sekcích lekcí, situacích a hesel slovníku. */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const t of TOPICS) {
    for (const l of t.lessons) {
      const base = `/tema/${t.slug}/${l.slug}`;
      l.sections.forEach((s, i) => {
        docs.push({
          href: `${base}#s${i + 1}`,
          title: s.heading,
          context: `${t.short} › ${l.title}`,
          text: [s.blocks.map(blockText).join(" "), s.cites.map((c) => `${formatCitation(c)} ${LAWS[c.law].name}`).join(" ")].join(" "),
        });
      });
      l.situations.forEach((s) => {
        docs.push({
          href: `${base}#situace`,
          title: s.title,
          context: `${t.short} › ${l.title} › Modelová situace`,
          text: `${s.story} ${s.answer} ${s.cites.map((c) => formatCitation(c)).join(" ")}`,
        });
      });
    }
  }
  for (const g of GLOSSARY) {
    docs.push({ href: `/slovnik#${encodeURIComponent(g.term)}`, title: g.term, context: "Slovník", text: g.definition });
  }
  return docs;
}
