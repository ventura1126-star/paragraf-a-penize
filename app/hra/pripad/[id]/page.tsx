import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASES, CASE_BY_ID } from "@/content/game/cases";
import { CasePlayer } from "@/components/game/CasePlayer";
import { HelpBanner } from "@/components/game/HelpBanner";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CASES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = CASE_BY_ID.get((await params).id);
  return { title: c ? `Případ: ${c.title}` : undefined };
}

export default async function CasePage({ params }: Props) {
  const c = CASE_BY_ID.get((await params).id);
  if (!c) notFound();
  return (
    <div className="narrow">
      <nav className="breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/hra">Příběh</Link> › <span>{c.title}</span>
      </nav>
      <div className="eyebrow">{c.boss ? "Boss příběhu" : "Nástraha"}</div>
      <h1>{c.title}</h1>
      <CasePlayer gameCase={c} />
      <HelpBanner />
    </div>
  );
}
