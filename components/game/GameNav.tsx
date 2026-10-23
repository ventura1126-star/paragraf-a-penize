"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";

/**
 * Ve městě se herní obrazovky (budova, nástraha, schránka…) otevírají jako panel nad mapou,
 * ne jako nová stránka. Mimo město (samostatné stránky /hra/…) fungují odkazy normálně.
 */
export type GameNav = { go: (href: string) => void };
export const GameNavContext = createContext<GameNav | null>(null);

export function useGameNav() {
  return useContext(GameNavContext);
}

/** Herní adresy, které umí město otevřít v panelu. */
export function isPanelHref(href: string): boolean {
  return /^\/hra(\/(budova|pripad|priprava|prednaska)\/[^/?#]+|\/(schranka|album|trenink|lhuta|postava|pribeh))?(\?.*)?$/.test(href);
}

export function GameLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const nav = useGameNav();
  if (!nav || !isPanelHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        nav.go(href);
      }}
    >
      {children}
    </a>
  );
}

/** Po přechodu na další krok: posunout nahoru panel ve městě, jinak stránku. */
export function scrollGameTop() {
  const panel = document.querySelector(".gta-panel-body");
  if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Navigace z kódu (po dokončení akce): v panelu přes kontext, jinak routerem. */
export function useGameGo() {
  const nav = useGameNav();
  return (href: string, push: (h: string) => void) => (nav && isPanelHref(href) ? nav.go(href) : push(href));
}
