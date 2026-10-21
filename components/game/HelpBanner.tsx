/** Odkaz na bezplatnou pomoc – na každé obrazovce případu, ne až po dohrání. */
export function HelpBanner() {
  return (
    <aside className="help-banner" aria-label="Bezplatná pomoc">
      Řešíte podobnou situaci doopravdy? Bezplatně poradí{" "}
      <a href="https://www.obcanskeporadny.cz" target="_blank" rel="noopener noreferrer">občanské poradny</a> nebo{" "}
      <a href="https://www.jakprezitdluhy.cz" target="_blank" rel="noopener noreferrer">dluhové poradny Člověka v tísni</a>.
    </aside>
  );
}
