import type { Card } from "./types";

/** Karty Planety investic: ochrana investora, daně z investic a DIP. Citace jsou doslovné (zakonyprolidi.cz). */
export const PLANET_CARDS: Card[] = [
  {
    id: "zob-41e-2",
    cite: { law: "zob", par: "41e", odst: 2 },
    name: "Vklady do 100 000 EUR",
    summary: "Vklady jednoho člověka u jedné banky jsou pojištěné do částky odpovídající 100 000 EUR.",
    quote: "nejvýše však ve výši odpovídající 100000 EUR pro jednu oprávněnou osobu u jedné banky",
  },
  {
    id: "zpkt-5-1",
    cite: { law: "zpkt", par: "5", odst: 1 },
    name: "Jen s licencí ČNB",
    summary: "Investiční služby smí poskytovat jen obchodník s povolením České národní banky.",
    quote: "na základě povolení k činnosti obchodníka s cennými papíry uděleného Českou národní bankou",
  },
  {
    id: "zpkt-15h-1",
    cite: { law: "zpkt", par: "15h", odst: 1 },
    name: "Investiční dotazník",
    summary: "Před radou nebo správou portfolia musí obchodník zjistit vaše znalosti, zkušenosti, finance a toleranci k riziku.",
    quote: "povinen získat od zákazníka nezbytné informace o jeho",
  },
  {
    id: "zdp-4-1t",
    cite: { law: "zdp", par: "4", odst: 1, pism: "t" },
    name: "Prodeje do 100 000 Kč",
    summary: "Příjmy z prodeje cenných papírů do 100 000 Kč za rok jsou od daně osvobozené.",
    quote: "příjmy z úplatného převodu cenných papírů, pokud jejich úhrn u poplatníka nepřesáhne ve zdaňovacím období částku 100000 Kč",
  },
  {
    id: "zdp-4-1u",
    cite: { law: "zdp", par: "4", odst: 1, pism: "u" },
    name: "Časový test 3 roky",
    summary: "Kdo cenný papír drží déle než 3 roky, neplatí z jeho prodeje daň.",
    quote: "příjem z úplatného převodu cenného papíru, přesáhne-li doba mezi nabytím a úplatným převodem tohoto cenného papíru při jeho úplatném převodu dobu 3 let",
  },
  {
    id: "zdp-4-1q",
    cite: { law: "zdp", par: "4", odst: 1, pism: "q" },
    name: "Podíl ve firmě: 5 let",
    summary: "Prodej podílu v s.r.o. je osvobozený, když ho majitel držel déle než 5 let.",
    quote: "příjem z úplatného převodu podílu v obchodní korporaci s výjimkou příjmu z úplatného převodu cenného papíru, přesahuje-li doba mezi jeho nabytím a úplatným převodem dobu 5 let",
  },
  {
    id: "zdp-4-1zj",
    cite: { law: "zdp", par: "4", odst: 1, pism: "zj" },
    name: "Krypto do 100 000 Kč",
    summary: "Příjmy z prodeje kryptoaktiv do 100 000 Kč za rok jsou osvobozené.",
    quote: "příjmy z úplatného převodu kryptoaktiva s výjimkou elektronického peněžního tokenu, pokud jejich úhrn u poplatníka nepřesáhne ve zdaňovacím období částku 100000 Kč",
  },
  {
    id: "zdp-4-1zk",
    cite: { law: "zdp", par: "4", odst: 1, pism: "zk" },
    name: "Krypto: 3 roky",
    summary: "Kryptoaktivum držené déle než 3 roky se prodává bez daně (s horním limitem u velmi vysokých příjmů).",
    quote: "příjem z úplatného převodu kryptoaktiva, přesáhne-li doba mezi nabytím a úplatným převodem tohoto kryptoaktiva při jeho úplatném převodu dobu 3 let",
  },
  {
    id: "zdp-36-2a",
    cite: { law: "zdp", par: "36", odst: 2, pism: "a" },
    name: "Dividenda z akcií",
    summary: "Z dividend z akcií a podílových listů se v Česku sráží daň 15 %.",
    quote: "z podílu na zisku z účasti na obchodní společnosti nebo v podílovém fondu, je-li podíl v nich představován cenným papírem",
  },
  {
    id: "zdp-15-6",
    cite: { law: "zdp", par: "15", odst: 6 },
    name: "DIP: odpočet 48 000 Kč",
    summary: "Příspěvky na produkty spoření na stáří (i DIP) lze odečíst od základu daně, celkem nejvýš 48 000 Kč ročně.",
    quote: "Od základu daně lze odečíst příspěvky v celkovém úhrnu nejvýše 48000 Kč",
  },
  {
    id: "zdp-15b-1",
    cite: { law: "zdp", par: "15b", odst: 1 },
    name: "DIP: 10 let a 60 let",
    summary: "Daňově podporovaný výběr je až po 120 měsících, nejdřív v roce, kdy je vám 60.",
    quote: "po 120 kalendářních měsících od vzniku produktu, nejdříve však v kalendářním roce, ve kterém poplatník dosáhne 60 let věku",
  },
  {
    id: "zdp-15b-4",
    cite: { law: "zdp", par: "15b", odst: 4 },
    name: "Předčasný výběr",
    summary: "Kdo z DIP vybere dřív, vrací daňovou podporu, kterou si odečetl.",
    quote: "K navrácení daňové podpory produktu spoření na stáří dochází",
  },
];
