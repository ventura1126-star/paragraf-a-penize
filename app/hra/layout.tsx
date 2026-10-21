import { GameHeader } from "@/components/game/GameHeader";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="game">
      <GameHeader />
      {children}
    </div>
  );
}
