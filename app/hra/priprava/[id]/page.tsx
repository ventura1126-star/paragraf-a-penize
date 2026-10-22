import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PREPS, PREP_BY_ID } from "@/content/game/preps";
import { BUILDING_BY_ID } from "@/content/game/city";
import { PrepPage } from "@/components/game/PrepPage";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ zpet?: string }> };

export function generateStaticParams() {
  return PREPS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Příprava: ${PREP_BY_ID.get((await params).id)?.title ?? ""}` };
}

export default async function PrepRoute({ params, searchParams }: Props) {
  const prep = PREP_BY_ID.get((await params).id);
  if (!prep) notFound();
  const zpet = (await searchParams).zpet;
  const back = zpet && BUILDING_BY_ID.has(zpet) ? `/hra/budova/${zpet}` : "/hra";
  return (
    <div className="narrow">
      <PrepPage prep={prep} back={back} />
    </div>
  );
}
