import type { Topic } from "@/lib/types";

export const investice: Topic = {
  slug: "investice-a-sporeni",
  title: "Investice a spoření",
  short: "Ochrana investora",
  description:
    "Jak vás chrání zákon, když investujete: test vhodnosti, pojištění vkladů, garanční fond, daňová pravidla pro prodej cenných papírů a podmínky penzijního spoření a DIP.",
  laws: ["zpkt", "zob", "zdps", "zdp", "zfa"],
  lessons: [
    {
      slug: "ochrana-investora",
      title: "Ochrana investora a vkladatele",
      lead:
        "Vklad v bance je pojištěn do 100 000 EUR. Investice u obchodníka s cennými papíry jsou chráněny jen do 90 % a max. 20 000 EUR – a to pouze proti selhání obchodníka, nikoli proti poklesu trhu.",
      minutes: 9,
      sections: [
        {
          heading: "Test vhodnosti a přiměřenosti",
          blocks: [
            {
              type: "p",
              text:
                "Poskytuje-li vám obchodník investiční poradenství nebo obhospodařuje portfolio, musí od vás zjistit odborné znalosti, zkušenosti, finanční zázemí (včetně schopnosti nést ztráty) a investiční cíle (včetně tolerance k riziku). Doporučit smí jen to, co tomu odpovídá.",
            },
            {
              type: "note",
              tone: "warn",
              text:
                "Test vás chrání, jen když odpovídáte pravdivě. „Přikrášlené“ odpovědi oslabují vaši pozici v případném sporu.",
            },
          ],
          cites: [{ law: "zpkt", par: "15h", odst: 1 }, { law: "zpkt", par: "15h", odst: 2 }],
        },
        {
          heading: "Pojištění vkladů",
          blocks: [
            {
              type: "p",
              text:
                "Selže-li banka, náhrada vkladu se vyplácí nejvýše do částky odpovídající 100 000 EUR na jednu osobu u jedné banky. Limit se počítá za banku, ne za účet – více účtů u téže banky se sčítá.",
            },
          ],
          cites: [{ law: "zob", par: "41e", odst: 2 }],
        },
        {
          heading: "Garanční fond obchodníků s cennými papíry",
          blocks: [
            {
              type: "p",
              text:
                "Pokud obchodník s cennými papíry nevydá klientský majetek (např. zpronevěra, úpadek), vyplácí Garanční fond náhradu ve výši 90 % nevydaného majetku, nejvýše 20 000 EUR na zákazníka u jednoho obchodníka.",
            },
            {
              type: "note",
              tone: "info",
              text: "Garanční fond nekryje investiční ztrátu z poklesu cen. Ověřujte licenci poskytovatele v seznamu regulovaných subjektů ČNB.",
            },
          ],
          cites: [{ law: "zpkt", par: "130", odst: 9 }],
        },
        {
          heading: "Spory: finanční arbitr",
          blocks: [
            {
              type: "p",
              text:
                "Spory spotřebitele s osobou poskytující investiční služby nebo s investiční společností (fondy kolektivního investování) rozhoduje bezplatně finanční arbitr.",
            },
          ],
          cites: [{ law: "zfa", par: "1", odst: 1 }],
        },
      ],
      situations: [
        {
          title: "Dva miliony v jedné bance",
          story: "Máte na spořicích účtech u jedné banky ekvivalent 150 000 EUR.",
          answer:
            "Pojištění kryje nejvýše 100 000 EUR na osobu u jedné banky. Pro plné krytí rozložte úspory do více bank (pozor na banky, které patří do jedné skupiny, ale fungují pod jednou licencí).",
          cites: [{ law: "zob", par: "41e", odst: 2 }],
        },
      ],
      takeaways: [
        "Vklady: 100 000 EUR na osobu a banku.",
        "Garanční fond: 90 %, max. 20 000 EUR – jen při selhání obchodníka.",
        "Test vhodnosti chrání jen při pravdivých odpovědích.",
      ],
      quiz: [
        {
          q: "Kryje Garanční fond ztrátu způsobenou poklesem akcií?",
          options: ["Ano, do 20 000 EUR", "Ne, kryje jen nevydaný klientský majetek", "Ano, do 90 %"],
          correct: 1,
          explain: "Náhrada se poskytuje, když obchodník není schopen vydat klientský majetek – ne za tržní ztrátu.",
          cite: { law: "zpkt", par: "130", odst: 9 },
        },
      ],
    },
    {
      slug: "dane-a-produkty-na-stari",
      title: "Daně z investic a spoření na stáří",
      lead:
        "Akcie držené déle než 3 roky prodáte bez daně. Penzijní spoření má státní příspěvek až 340 Kč měsíčně. DIP přináší daňový odpočet – ale jen při dodržení podmínek.",
      minutes: 10,
      sections: [
        {
          heading: "Osvobození příjmů z prodeje cenných papírů",
          blocks: [
            {
              type: "list",
              items: [
                "Časový test: příjem z prodeje cenného papíru je osvobozen, přesáhne-li doba mezi nabytím a prodejem 3 roky.",
                "Hodnotový test: příjmy z prodeje cenných papírů jsou osvobozeny, pokud jejich úhrn za rok nepřesáhne 100 000 Kč (do úhrnu se počítají všechny prodeje, i ty splňující časový test).",
              ],
            },
            {
              type: "note",
              tone: "change",
              text:
                "Pro rok 2025 platil u časového testu strop osvobození 40 mil. Kč. Novela schválená v září 2025 jej pro cenné papíry a obchodní podíly od 1. 1. 2026 zrušila; u kryptoaktiv strop zůstává. Ověřte aktuální znění § 4 ZDP.",
            },
          ],
          cites: [
            { law: "zdp", par: "4", odst: 1, pism: "t" },
            { law: "zdp", par: "4", odst: 1, pism: "u" },
          ],
        },
        {
          heading: "Doplňkové penzijní spoření – státní příspěvek",
          blocks: [
            {
              type: "list",
              items: [
                "příspěvek účastníka 500–1 699 Kč měsíčně → státní příspěvek 20 % z této částky,",
                "příspěvek 1 700 Kč a více → státní příspěvek 340 Kč (maximum),",
                "co platíte nad 1 700 Kč měsíčně, můžete odečíst od základu daně (v rámci limitu 48 000 Kč).",
              ],
            },
          ],
          cites: [
            { law: "zdps", par: "14", odst: 1 },
            { law: "zdps", par: "14", odst: 2 },
            { law: "zdp", par: "15", odst: 7 },
          ],
        },
        {
          heading: "Dlouhodobý investiční produkt (DIP)",
          blocks: [
            {
              type: "p",
              text:
                "DIP je smluvní rámec u licencovaného poskytovatele, do kterého investujete (fondy, ETF, akcie…). Daňově podporovaný je, pokud je výplata sjednána nejdříve po 120 kalendářních měsících od vzniku produktu a zároveň nejdříve v roce, kdy dosáhnete 60 let.",
            },
            {
              type: "note",
              tone: "warn",
              text:
                "Při předčasném výběru nebo porušení podmínek vzniká ostatní příjem (§ 10) ve výši příspěvků odečtených od základu daně za bezprostředně předcházejících 10 let – a ten musíte zdanit.",
            },
          ],
          cites: [
            { law: "zpkt", par: "134g", odst: 1 },
            { law: "zdp", par: "15b", odst: 1 },
            { law: "zdp", par: "15", odst: 6 },
          ],
        },
      ],
      situations: [
        {
          title: "Prodej ETF po čtyřech letech",
          story: "Prodáte ETF za 500 000 Kč, které držíte 4 roky.",
          answer:
            "Doba držení přesahuje 3 roky – příjem je osvobozen bez ohledu na výši (od roku 2026 bez stropu 40 mil. Kč). Osvobozený příjem nad 5 mil. Kč by bylo třeba oznámit správci daně do konce lhůty pro podání přiznání.",
          cites: [
            { law: "zdp", par: "4", odst: 1, pism: "u" },
            { law: "zdp", par: "38v", odst: 1 },
          ],
        },
      ],
      takeaways: [
        "Časový test 3 roky, hodnotový test 100 000 Kč ročně.",
        "Max. státní příspěvek 340 Kč při 1 700 Kč měsíčně.",
        "DIP: 120 měsíců a věk 60 let, jinak dodanění.",
      ],
      quiz: [
        {
          q: "Od jaké výše měsíčního příspěvku náleží maximální státní příspěvek 340 Kč?",
          options: ["1 000 Kč", "1 700 Kč", "2 000 Kč"],
          correct: 1,
          explain: "Při příspěvku 1 700 Kč a více činí státní příspěvek 340 Kč.",
          cite: { law: "zdps", par: "14", odst: 2 },
        },
      ],
    },
  ],
};
