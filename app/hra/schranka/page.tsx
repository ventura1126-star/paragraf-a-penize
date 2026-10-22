import type { Metadata } from "next";
import { Mailbox } from "@/components/game/Mailbox";

export const metadata: Metadata = { title: "Schránka" };

export default function MailPage() {
  return (
    <div className="narrow">
      <h1>Schránka</h1>
      <p className="lead">Dopisy, které přišly kvůli dřívějším rozhodnutím. Každý otevře novou nástrahu.</p>
      <Mailbox />
    </div>
  );
}
