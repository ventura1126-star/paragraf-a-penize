import type { Metadata } from "next";
import { Suspense } from "react";
import { buildSearchIndex } from "@/lib/search";
import { Search } from "@/components/Search";

export const metadata: Metadata = { title: "Hledat" };

export default function SearchPage() {
  return (
    <div className="narrow">
      <h1>Hledat</h1>
      <p className="lead">Hledejte pojmy, situace i čísla paragrafů (např. „promlčení“, „§ 279“, „RPSN“).</p>
      <Suspense>
        <Search docs={buildSearchIndex()} />
      </Suspense>
    </div>
  );
}
