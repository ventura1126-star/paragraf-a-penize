import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PREPS, PREP_BY_ID } from "@/content/game/preps";
import { PrepPage } from "@/components/game/PrepPage";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PREPS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Příprava: ${PREP_BY_ID.get((await params).id)?.title ?? ""}` };
}

export default async function PrepRoute({ params }: Props) {
  const prep = PREP_BY_ID.get((await params).id);
  if (!prep) notFound();
  // ?zpet=budova se čte v prohlížeči (stránky jsou předgenerované, bez serveru)
  return (
    <div className="narrow">
      <Suspense>
        <PrepPage prep={prep} />
      </Suspense>
    </div>
  );
}
