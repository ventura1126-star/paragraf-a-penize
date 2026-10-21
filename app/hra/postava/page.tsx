import type { Metadata } from "next";
import { CharacterPicker } from "@/components/game/CharacterPicker";

export const metadata: Metadata = { title: "Výběr postavy" };

export default function CharacterPage() {
  return (
    <>
      <h1>Za koho budete hrát?</h1>
      <p className="lead">
        Pět lidí v situacích, ve kterých se dluhy nejčastěji objevují. Postava mění příběhy, výši příjmu ve výpočtech
        srážek i startovní peněženku. Zákon platí pro všechny stejně.
      </p>
      <CharacterPicker />
    </>
  );
}
