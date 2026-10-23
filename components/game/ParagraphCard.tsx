import { LAWS, lawUrl } from "@/content/laws";
import type { Card } from "@/content/game/types";
import { formatCitation } from "@/lib/format";
import { CardIcon, LAW_COLOR } from "@/content/game/icons";

/** Líc karty: barva podle zákona, symbol toho, co ustanovení znamená, číslo paragrafu a lidský název. */
export function CardFace({ card, size = "md" }: { card: Card; size?: "sm" | "md" }) {
  const [dark, light] = LAW_COLOR[card.cite.law];
  return (
    <div className={`pcard pcard-${size}`} style={{ "--c1": dark, "--c2": light } as React.CSSProperties}>
      <div className="pcard-top">
        <span className="pcard-law">{LAWS[card.cite.law].abbr}</span>
        <span className="pcard-sect">§</span>
      </div>
      <div className="pcard-art">
        <CardIcon id={card.id} size={size === "sm" ? 30 : 42} />
      </div>
      <div className="pcard-par">{formatCitation(card.cite, false)}</div>
      <div className="pcard-name">{card.name}</div>
    </div>
  );
}

/** Rub karty: výklad, doslovná citace, odkaz na znění. */
export function CardBack({ card }: { card: Card }) {
  return (
    <div className="pcard-back">
      <h3>
        {formatCitation(card.cite)} · {card.name}
      </h3>
      <p>{card.summary}</p>
      <blockquote>„{card.quote}“</blockquote>
      <a href={lawUrl(card.cite.law, card.cite.par, card.cite.odst)} target="_blank" rel="noopener noreferrer">
        Otevřít znění: {LAWS[card.cite.law].name} ↗
      </a>
    </div>
  );
}
