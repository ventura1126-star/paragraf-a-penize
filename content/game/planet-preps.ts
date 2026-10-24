import type { Prep } from "./preps";

/** Přípravy Planety investic. Čísla ze zákonů, žádné statistiky – místo „V číslech“ postup nebo příklad. */
export const PLANET_PREPS: Prep[] = [
  {
    id: "investovani",
    title: "Investování od nuly",
    plain:
      "Nejdřív rezerva, pak investice. Rezerva patří na účet, kde je hned po ruce a v bezpečí. Investice jsou na roky: rozložte je mezi mnoho firem a nepanikařte, když trh spadne.",
    concepts: [
      { term: "Rezerva", explain: "Peníze na nečekané výdaje. Vklady v bance jsou pojištěné do částky odpovídající 100 000 EUR.", cite: { law: "zob", par: "41e", odst: 2 } },
      { term: "Diverzifikace", explain: "Rozložení peněz mezi mnoho investic, aby jedna chyba nebolela tolik." },
      { term: "Tolerance k riziku", explain: "Kolik propadu unesete. Obchodník se na to musí zeptat.", cite: { law: "zpkt", par: "15h", odst: 1 } },
    ],
    process: {
      title: "Pořadí",
      steps: ["Splatit drahé dluhy.", "Vytvořit rezervu na 3–6 měsíců výdajů.", "Pravidelně investovat do rozložených fondů (ETF).", "Nesahat na to roky a nepanikařit při propadech."],
    },
    examples: [{ title: "Všechno do jedné akcie", text: "Když firma zkrachuje, přijdete o všechno. V indexovém ETF je stovky firem najednou." }],
    stats: [],
    check: {
      q: "Co by mělo přijít před investováním?",
      options: ["Finanční rezerva", "Půjčka na akcie", "Krypto"],
      correct: 0,
      explain: "Rezerva chrání investice: nemusíte je prodávat v nejhorší chvíli.",
    },
  },
  {
    id: "dane-z-investic",
    title: "Daně z investic",
    plain:
      "Z prodeje akcií a fondů se daň neplatí, když je držíte déle než 3 roky, nebo když za rok prodáte nejvýš za 100 000 Kč. U kryptoaktiv platí totéž. Podíl v s.r.o. musíte držet 5 let. Z dividend se sráží 15 %.",
    concepts: [
      { term: "Časový test", explain: "Cenné papíry držené déle než 3 roky se prodávají bez daně.", cite: { law: "zdp", par: "4", odst: 1, pism: "u" } },
      { term: "Limit 100 000 Kč", explain: "Prodeje cenných papírů do 100 000 Kč za rok jsou osvobozené.", cite: { law: "zdp", par: "4", odst: 1, pism: "t" } },
      { term: "Dividenda", explain: "Z dividend z akcií se sráží 15 %.", cite: { law: "zdp", par: "36", odst: 2, pism: "a" } },
    ],
    examples: [{ title: "Akcie po 4 letech", text: "Koupeno za 200 000 Kč, prodáno za 500 000 Kč po 4 letech: zisk 300 000 Kč bez daně." }],
    stats: [],
    check: {
      q: "Jak dlouho držet akcie, aby byl prodej bez daně?",
      options: ["1 rok", "Déle než 3 roky", "10 let"],
      correct: 1,
      explain: "Časový test pro cenné papíry jsou 3 roky.",
    },
  },
  {
    id: "dip",
    title: "Dlouhodobý investiční produkt",
    plain:
      "DIP je „obal“ na investice na stáří. Co do něj pošlete, si můžete odečíst od základu daně – s ostatními produkty na stáří dohromady 48 000 Kč ročně. Vybrat bez ztráty výhody jde až po 10 letech a od 60 let.",
    concepts: [
      { term: "Odpočet", explain: "Až 48 000 Kč ročně za všechny produkty spoření na stáří.", cite: { law: "zdp", par: "15", odst: 6 } },
      { term: "Podmínky výběru", explain: "Po 120 měsících, nejdřív v roce, kdy je vám 60.", cite: { law: "zdp", par: "15b", odst: 1 } },
      { term: "Předčasný výběr", explain: "Daňová podpora se vrací.", cite: { law: "zdp", par: "15b", odst: 4 } },
    ],
    examples: [{ title: "4 000 Kč měsíčně", text: "48 000 Kč za rok × 15 % daň = úspora až 7 200 Kč ročně." }],
    stats: [],
    check: {
      q: "Kolik lze ročně odečíst za produkty spoření na stáří?",
      options: ["24 000 Kč", "48 000 Kč", "100 000 Kč"],
      correct: 1,
      explain: "Úhrnem nejvýše 48 000 Kč za rok.",
    },
  },
  {
    id: "ochrana-investora",
    title: "Ochrana investora",
    plain:
      "Investiční služby smí nabízet jen ten, kdo má povolení ČNB. Ověřte si to v seznamu na webu ČNB. Garantovaný vysoký výnos a bonusy za přivedení kamarádů jsou znaky podvodu.",
    concepts: [
      { term: "Licence ČNB", explain: "Obchodník s cennými papíry musí mít povolení ČNB.", cite: { law: "zpkt", par: "5", odst: 1 } },
      { term: "Investiční dotazník", explain: "Obchodník zjišťuje znalosti, zkušenosti, finance a toleranci k riziku.", cite: { law: "zpkt", par: "15h", odst: 1 } },
      { term: "Garanční fond", explain: "Při krachu licencovaného obchodníka 90 %, max. 20 000 EUR – ne ztráty z poklesu cen.", cite: { law: "zpkt", par: "130", odst: 9 } },
    ],
    process: {
      title: "Než pošlete peníze",
      steps: ["Ověřit licenci v seznamu ČNB.", "Přečíst si poplatky a rizika.", "Vyplnit dotazník pravdivě.", "Nikdy neposílat peníze kvůli „garanci“ nebo časovému nátlaku."],
    },
    examples: [{ title: "Pyramida", text: "První účastníci dostávají „výnosy“ z vkladů nových. Až noví nepřibývají, systém se zhroutí." }],
    stats: [],
    check: {
      q: "Kde ověříte, že investiční firma smí poskytovat služby?",
      options: ["V seznamu ČNB", "V recenzích", "Na sociálních sítích"],
      correct: 0,
      explain: "Povolení uděluje Česká národní banka a seznam je veřejný.",
    },
  },
];

export const PLANET_PREP_FOR_CASE: Record<string, string> = {
  "nejdriv-rezerva": "investovani",
  "investicni-dotaznik": "ochrana-investora",
  "prodej-akcii": "dane-z-investic",
  "dip-na-stari": "dip",
  krypto: "dane-z-investic",
  startup: "dane-z-investic",
  "garance-vynosu": "ochrana-investora",
  bublina: "investovani",
};
