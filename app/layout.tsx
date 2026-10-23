import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import { LEGAL_STATE_DATE } from "@/content";
import "./globals.css";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Paragraf a peníze", template: "%s · Paragraf a peníze" },
  description: "Finanční gramotnost do hloubky: srozumitelný výklad českých zákonů s citacemi konkrétních paragrafů.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden>§</span>
              Paragraf a peníze
            </Link>
            <nav className="nav" aria-label="Hlavní navigace">
              <Link href="/hra">Hra</Link>
              <Link href="/#temata">Témata</Link>
              <Link href="/slovnik">Slovník</Link>
              <Link href="/hledat">Hledat</Link>
            </nav>
          </div>
        </header>
        <main>
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container disclaimer">
            <p>
              Obsah je vzdělávací a vychází z právního stavu k {LEGAL_STATE_DATE}. Nejde o právní ani daňové poradenství.
              Odkazy vedou na aktuální znění na zakonyprolidi.cz; právně závazné znění je ve Sbírce zákonů (e-Sbírka).
              V konkrétní situaci se obraťte na advokáta, daňového poradce nebo bezplatnou poradnu.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
