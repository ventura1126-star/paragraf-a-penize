import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DISTRICTS } from "@/content/game/cases";
import { DistrictCases } from "@/components/game/DistrictCases";

type Props = { params: Promise<{ district: string }> };

export function generateStaticParams() {
  return DISTRICTS.filter((d) => d.playable).map((d) => ({ district: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district } = await params;
  return { title: DISTRICTS.find((x) => x.id === district)?.name };
}

export default async function DistrictPage({ params }: Props) {
  const { district } = await params;
  const d = DISTRICTS.find((x) => x.id === district && x.playable);
  if (!d) notFound();
  return (
    <div className="narrow">
      <nav className="breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/hra">Mapa</Link> › <span>{d.name}</span>
      </nav>
      <h1>{d.name}</h1>
      <p className="lead">{d.blurb} Vyřešte případy a odemkněte bosse čtvrti.</p>
      <DistrictCases />
      <p className="muted small" style={{ marginTop: "1.5rem" }}>
        Chcete nejdřív teorii? <Link href={`/tema/${d.topic}`}>Lekce k této čtvrti</Link>
      </p>
    </div>
  );
}
