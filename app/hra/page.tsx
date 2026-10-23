import type { Metadata } from "next";
import { CityCanvas } from "@/components/game/CityCanvas";

export const metadata: Metadata = {
  title: "Hra",
  description: "Město dluhů: projděte se městem, vstupte do budov a rozhodněte se podle paragrafu. Sbírejte karty zákonů.",
};

/** Celá hra běží v jednom okně města; budovy, nástrahy i schránka se otevírají jako panely nad mapou. */
export default function GameHome() {
  return <CityCanvas />;
}
