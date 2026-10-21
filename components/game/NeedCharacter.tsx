import Link from "next/link";

export function NeedCharacter() {
  return (
    <div className="card need-character">
      <h2>Nejdřív si vyberte postavu</h2>
      <p className="muted">Případy se odehrávají v životě vaší postavy – podle ní se mění příběh i čísla.</p>
      <Link href="/hra/postava" className="btn-primary">Vybrat postavu</Link>
    </div>
  );
}
