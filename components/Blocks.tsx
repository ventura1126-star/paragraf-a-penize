import type { Block } from "@/lib/types";

const NOTE_LABEL = { info: "Dobré vědět", warn: "Pozor", change: "Změna legislativy" } as const;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "list":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="steps">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <div key={i} className={`note note-${b.tone}`} role="note">
                <span className="note-label">{NOTE_LABEL[b.tone]}</span>
                {b.text}
              </div>
            );
        }
      })}
    </>
  );
}
