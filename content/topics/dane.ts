import type { Topic } from "@/lib/types";

export const dane: Topic = {
  slug: "dane",
  title: "Daně fyzických osob",
  short: "Daň z příjmů",
  description:
    "Kdy musíte podat daňové přiznání, jak fungují slevy a odpočty, v jakých lhůtách se podává a co hrozí při pozdním podání či doměření daně.",
  laws: ["zdp", "dr"],
  lessons: [
    {
      slug: "priznani-slevy-odpocty",
      title: "Přiznání, slevy a odpočty",
      lead:
        "Rozdíl mezi odpočtem (snižuje základ daně) a slevou (snižuje samotnou daň) je zásadní. Sleva 30 840 Kč ušetří přesně 30 840 Kč, odpočet 10 000 Kč ušetří při 15% sazbě jen 1 500 Kč.",
      minutes: 10,
      sections: [
        {
          heading: "Kdo musí podat přiznání",
          blocks: [
            {
              type: "p",
              text:
                "Přiznání musí podat každý, jehož roční zdanitelné příjmy přesáhly 50 000 Kč (nepočítají se příjmy osvobozené a příjmy zdaněné srážkovou daní), nebo kdo vykazuje daňovou ztrátu.",
            },
            {
              type: "p",
              text:
                "Zaměstnanec přiznání podávat nemusí, pokud měl příjmy jen od jednoho (nebo postupně více) zaměstnavatelů, u všech podepsal prohlášení k dani a ostatní příjmy (§ 7 až 10 – podnikání, kapitálové příjmy, nájem, ostatní) nepřesáhly 20 000 Kč. Jinak může požádat zaměstnavatele o roční zúčtování.",
            },
          ],
          cites: [{ law: "zdp", par: "38g", odst: 1 }, { law: "zdp", par: "38g", odst: 2 }],
        },
        {
          heading: "Slevy na dani",
          blocks: [
            {
              type: "p",
              text:
                "Základní sleva na poplatníka činí 30 840 Kč ročně (2 570 Kč měsíčně) a náleží každému poplatníkovi. Sleva snižuje vypočtenou daň, nikoli základ daně – nemůže ale daň snížit pod nulu (daňový bonus vzniká jen u zvýhodnění na děti).",
            },
          ],
          cites: [
            {
              law: "zdp",
              par: "35ba",
              odst: 1,
              quote: "…snižuje o a) základní slevu ve výši 30 840 Kč na poplatníka…",
            },
          ],
        },
        {
          heading: "Nezdanitelné části základu daně (odpočty)",
          blocks: [
            {
              type: "list",
              items: [
                "Dary na veřejně prospěšné účely: úhrn musí přesáhnout 2 % základu daně nebo činit alespoň 1 000 Kč; odečíst lze nejvýše 15 % základu daně.",
                "Úroky z úvěru na bydlení (hypotéka, úvěr ze stavebního spoření): nejvýše 150 000 Kč ročně na domácnost; nemovitost musí sloužit k vlastnímu bydlení.",
                "Produkty spoření na stáří (penzijní spoření, DIP, soukromé životní pojištění) a pojištění dlouhodobé péče: v úhrnu nejvýše 48 000 Kč ročně.",
              ],
            },
            {
              type: "note",
              tone: "info",
              text:
                "U penzijního spoření lze odečíst jen tu část měsíčního příspěvku, která převyšuje částku, od níž náleží maximální státní příspěvek (1 700 Kč měsíčně).",
            },
          ],
          cites: [
            { law: "zdp", par: "15", odst: 1 },
            { law: "zdp", par: "15", odst: 3 },
            { law: "zdp", par: "15", odst: 6 },
            { law: "zdp", par: "15", odst: 7 },
            { law: "zdp", par: "15a" },
          ],
        },
      ],
      situations: [
        {
          title: "Zaměstnanec s podnájmem",
          story: "Máte jednoho zaměstnavatele a k tomu příjem z pronájmu bytu 60 000 Kč ročně.",
          answer:
            "Ostatní příjmy (nájem podle § 9) přesahují 20 000 Kč, takže výjimka pro zaměstnance neplatí – musíte podat daňové přiznání.",
          cites: [{ law: "zdp", par: "38g", odst: 2 }],
        },
        {
          title: "Odpočet nebo sleva?",
          story: "Platíte si DIP 4 000 Kč měsíčně (48 000 Kč ročně) a jste v 15% sazbě.",
          answer:
            "Odpočet 48 000 Kč sníží základ daně; úspora na dani je 15 % = 7 200 Kč. Nárok zanikne a daňová výhoda se dodaní, pokud prostředky vyberete před splněním podmínek (120 měsíců a věk 60 let).",
          cites: [{ law: "zdp", par: "15", odst: 6 }, { law: "zdp", par: "15b", odst: 1 }],
        },
      ],
      takeaways: [
        "Hranice pro přiznání: 50 000 Kč zdanitelných příjmů; zaměstnanci výjimka do 20 000 Kč ostatních příjmů.",
        "Sleva na poplatníka 30 840 Kč snižuje daň, odpočty snižují základ.",
        "Spoření na stáří: odpočet max. 48 000 Kč ročně.",
      ],
      quiz: [
        {
          q: "Jaký je roční limit odpočtu na produkty spoření na stáří?",
          options: ["24 000 Kč", "48 000 Kč", "60 000 Kč"],
          correct: 1,
          explain: "Od základu daně lze odečíst příspěvky v celkovém úhrnu nejvýše 48 000 Kč.",
          cite: { law: "zdp", par: "15", odst: 6 },
        },
      ],
    },
    {
      slug: "lhuty-a-sankce",
      title: "Lhůty, doměření a sankce",
      lead:
        "Přiznání za kalendářní rok se podává do 3 měsíců, elektronicky do 4, s daňovým poradcem do 6. Finanční úřad má na doměření daně zásadně 3 roky.",
      minutes: 7,
      sections: [
        {
          heading: "Lhůty pro podání",
          blocks: [
            {
              type: "list",
              items: [
                "papírově: do 3 měsíců po skončení roku (zpravidla 1. dubna),",
                "elektronicky: do 4 měsíců (zpravidla 1. května),",
                "přes daňového poradce nebo při povinném auditu: do 6 měsíců (zpravidla 1. července).",
              ],
            },
          ],
          cites: [{ law: "dr", par: "136", odst: 1 }, { law: "dr", par: "136", odst: 2 }],
        },
        {
          heading: "Lhůta pro stanovení daně",
          blocks: [
            {
              type: "p",
              text:
                "Daň nelze stanovit po uplynutí 3 let. Lhůta začíná běžet dnem, kdy uplynula lhůta pro podání řádného přiznání. Prodlužuje se o rok, pokud v posledních 12 měsících došlo např. k podání dodatečného přiznání nebo zahájení daňové kontroly.",
            },
          ],
          cites: [{ law: "dr", par: "148", odst: 1 }, { law: "dr", par: "148", odst: 2 }],
        },
        {
          heading: "Penále a úrok z prodlení",
          blocks: [
            {
              type: "p",
              text:
                "Doměří-li správce daň, vzniká penále 20 % z doměřené částky (1 % u snížení ztráty). Při pozdní úhradě vzniká úrok z prodlení od čtvrtého dne po splatnosti.",
            },
            {
              type: "note",
              tone: "info",
              text:
                "Podáte-li dodatečné přiznání sami dříve, než daň doměří úřad, penále nevznikne – vzniká jen úrok z prodlení.",
            },
          ],
          cites: [{ law: "dr", par: "251", odst: 1 }, { law: "dr", par: "252", odst: 2 }],
        },
      ],
      situations: [
        {
          title: "Zapomenutý příjem",
          story: "V roce 2025 jste zapomněli přiznat příjem z prodeje akcií, které jste drželi jen rok.",
          answer:
            "Podejte dodatečné přiznání a doplaťte daň – zaplatíte úrok z prodlení, ale vyhnete se 20% penále, které by vzniklo při doměření úřadem.",
          cites: [{ law: "dr", par: "251", odst: 1 }, { law: "dr", par: "252", odst: 2 }],
        },
      ],
      takeaways: [
        "3 / 4 / 6 měsíců podle způsobu podání.",
        "Doměřit daň lze zásadně do 3 let.",
        "Dobrovolné dodatečné přiznání = bez penále 20 %.",
      ],
      quiz: [
        {
          q: "Jaké penále vzniká z doměřené daně?",
          options: ["1 %", "10 %", "20 %"],
          correct: 2,
          explain: "Penále činí 20 %, je-li daň zvyšována.",
          cite: { law: "dr", par: "251", odst: 1 },
        },
      ],
    },
  ],
};
