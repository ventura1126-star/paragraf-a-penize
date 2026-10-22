import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BUILDINGS, BUILDING_BY_ID, DISTRICT_NAMES } from "@/content/game/city";
import { BuildingScreen } from "@/components/game/BuildingScreen";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return BUILDINGS.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: BUILDING_BY_ID.get((await params).id)?.name };
}

export default async function BuildingPage({ params }: Props) {
  const b = BUILDING_BY_ID.get((await params).id);
  if (!b) notFound();
  return (
    <div className="narrow">
      <nav className="breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/hra">Město</Link> › <span>{DISTRICT_NAMES[b.district]}</span> › <span>{b.name}</span>
      </nav>
      <h1>{b.name}</h1>
      <BuildingScreen b={b} />
    </div>
  );
}
