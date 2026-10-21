import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow">
      <h1>Stránka nenalezena</h1>
      <p>Tuto stránku jsme nenašli. <Link href="/">Zpět na úvod</Link></p>
    </div>
  );
}
