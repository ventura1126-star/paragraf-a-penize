import type { Topic } from "@/lib/types";

export const uvery: Topic = {
  slug: "uvery-a-dluhy",
  title: "Úvěry a dluhy",
  short: "Spotřebitelský úvěr",
  description:
    "Co musí poskytovatel udělat, než vám půjčí, jak číst RPSN, kdy můžete od smlouvy odstoupit nebo úvěr předčasně splatit a jaké sankce si věřitel smí účtovat.",
  laws: ["zsu", "oz", "zfa"],
  lessons: [
    {
      slug: "pred-podpisem",
      title: "Než podepíšete úvěr",
      lead:
        "Zákon o spotřebitelském úvěru dává spotřebiteli silná práva: úvěr poskytnutý bez řádného posouzení úvěruschopnosti je neplatný, od smlouvy lze 14 dní odstoupit bez důvodu a směnka je zakázaná.",
      minutes: 10,
      sections: [
        {
          heading: "RPSN – jediné číslo, které lze srovnávat",
          blocks: [
            {
              type: "p",
              text:
                "Roční procentní sazba nákladů (RPSN) vyjadřuje celkové náklady úvěru – úroky i poplatky – jako roční procento z celkové výše úvěru. Úroková sazba sama o sobě poplatky neobsahuje, proto může být zavádějící.",
            },
            {
              type: "note",
              tone: "info",
              text: "Dvě nabídky se stejným úrokem se mohou výrazně lišit v RPSN – rozhoduje RPSN a celková částka, kterou zaplatíte.",
            },
          ],
          cites: [{ law: "zsu", par: "3", odst: 2 }],
        },
        {
          heading: "Posouzení úvěruschopnosti a neplatnost smlouvy",
          blocks: [
            {
              type: "p",
              text:
                "Poskytovatel musí před uzavřením smlouvy (i před významným navýšením úvěru) důkladně posoudit vaši úvěruschopnost na základě nezbytných, spolehlivých a dostatečných informací – příjmy, výdaje, závazky, případně údaje z úvěrových registrů. Úvěr smí poskytnout, jen pokud nejsou důvodné pochybnosti o vaší schopnosti splácet.",
            },
            {
              type: "p",
              text:
                "Poruší-li tuto povinnost, je smlouva neplatná a soud k tomu přihlédne i bez návrhu. Spotřebitel pak vrací jen jistinu (to, co si skutečně půjčil), a to v době přiměřené svým možnostem – úroky a poplatky nikoli.",
            },
          ],
          cites: [
            { law: "zsu", par: "86", odst: 1 },
            {
              law: "zsu",
              par: "87",
              odst: 1,
              quote:
                "Poskytne-li poskytovatel spotřebiteli spotřebitelský úvěr v rozporu s § 86 odst. 1 větou druhou, je smlouva neplatná.",
            },
          ],
        },
        {
          heading: "Zákaz směnky a šeku",
          blocks: [
            {
              type: "p",
              text:
                "Ke splacení nebo zajištění spotřebitelského úvěru nelze použít směnku ani šek. Směnka dříve umožňovala věřitelům obejít ochranu spotřebitele ve směnečném řízení. Výjimka platí jen přechodně u úvěrů na bydlení (směnka nikoli na řad do zřízení zástavního práva).",
            },
          ],
          cites: [{ law: "zsu", par: "112", odst: 1 }, { law: "zsu", par: "112", odst: 2 }],
        },
        {
          heading: "Odstoupení do 14 dnů bez udání důvodu",
          blocks: [
            {
              type: "p",
              text:
                "Od smlouvy o spotřebitelském úvěru jiném než na bydlení můžete odstoupit bez uvedení důvodu a bez sankce do 14 dnů od uzavření. Pokud smlouva neobsahovala povinné informace, lhůta neskončí dříve než 14 dnů po jejich doplnění. Odstoupení musí být písemné.",
            },
            {
              type: "p",
              text:
                "Odstoupíte-li od kupní smlouvy financované vázaným úvěrem (např. nákup na splátky v e-shopu), zaniká i úvěr – bez sankcí.",
            },
          ],
          cites: [
            {
              law: "zsu",
              par: "118",
              odst: 1,
              quote:
                "Spotřebitel může od smlouvy o spotřebitelském úvěru jiném než na bydlení odstoupit bez uvedení důvodů a bez jakékoli sankce ve lhůtě 14 dnů ode dne uzavření této smlouvy.",
            },
            { law: "zsu", par: "119", odst: 1 },
          ],
        },
        {
          heading: "Předčasné splacení",
          blocks: [
            {
              type: "p",
              text:
                "Úvěr můžete kdykoli splatit zcela nebo zčásti a máte právo na snížení celkových nákladů o úroky a další náklady za zbývající dobu. Věřitel smí chtít jen náhradu účelně vynaložených nákladů spojených s předčasným splacením.",
            },
            {
              type: "p",
              text:
                "U úvěru na bydlení (hypotéky) je náhrada omezena na 1 % předčasně splacené části, pokud do konce sjednané doby zbývá více než rok, jinak na 0,5 % (a nikdy nesmí přesáhnout úroky za zbývající dobu).",
            },
          ],
          cites: [{ law: "zsu", par: "117", odst: 1 }, { law: "zsu", par: "117", odst: 2 }, { law: "zsu", par: "117", odst: 4 }],
        },
        {
          heading: "Připravovaná změna: směrnice CCD2",
          blocks: [
            {
              type: "note",
              tone: "change",
              text:
                "Směrnice (EU) 2023/2225 se použije od 20. 11. 2026. Vláda schválila návrh novely zákona o spotřebitelském úvěru, která má mj. zavést strop RPSN a strop celkových nákladů u malých krátkodobých půjček a rozšířit působnost i na bezúročné úvěry. Sledujte, zda a v jakém znění byla novela vyhlášena ve Sbírce zákonů.",
            },
          ],
          cites: [],
        },
      ],
      situations: [
        {
          title: "Půjčka bez doložení příjmů",
          story:
            "Nebankovní společnost vám půjčila 50 000 Kč „na občanku“, aniž by zjišťovala příjmy. Úvěr nezvládáte splácet.",
          answer:
            "Pokud poskytovatel úvěruschopnost důkladně neposoudil, je smlouva neplatná. Vracíte jen jistinu (50 000 Kč minus to, co jste už zaplatili) v době přiměřené svým možnostem. Neplatnost lze uplatnit u soudu nebo u finančního arbitra.",
          cites: [{ law: "zsu", par: "87", odst: 1 }, { law: "zfa", par: "1", odst: 1 }],
        },
        {
          title: "Rozmyslel jsem si to po týdnu",
          story: "Týden po podpisu úvěru na auto zjistíte, že jinde je výrazně levnější.",
          answer:
            "U úvěru jiného než na bydlení můžete do 14 dnů písemně odstoupit bez udání důvodu. Vrátíte jistinu a úrok za dobu, kdy jste peníze měli.",
          cites: [{ law: "zsu", par: "118", odst: 1 }],
        },
      ],
      takeaways: [
        "Srovnávejte RPSN a celkovou splatnou částku, ne úrok.",
        "Neposouzená úvěruschopnost = neplatná smlouva, vracíte jen jistinu.",
        "14 dní na odstoupení; předčasně splatit lze kdykoli.",
        "Směnka u spotřebitelského úvěru je zakázaná.",
      ],
      quiz: [
        {
          q: "Co se stane, když poskytovatel poskytne úvěr bez řádného posouzení úvěruschopnosti?",
          options: [
            "Dostane pokutu, smlouva ale platí",
            "Smlouva je neplatná a spotřebitel vrací jen jistinu",
            "Spotřebitel může požadovat odpuštění celého dluhu",
          ],
          correct: 1,
          explain: "Smlouva je neplatná, spotřebitel vrací jistinu v době přiměřené svým možnostem.",
          cite: { law: "zsu", par: "87", odst: 1 },
        },
        {
          q: "Lze spotřebitelský úvěr zajistit směnkou?",
          options: ["Ano, vždy", "Ne (s úzkou výjimkou u úvěrů na bydlení)", "Jen u úvěrů nad 100 000 Kč"],
          correct: 1,
          explain: "Ke splacení nebo zajištění spotřebitelského úvěru nelze použít směnku nebo šek.",
          cite: { law: "zsu", par: "112", odst: 1 },
        },
      ],
    },
    {
      slug: "prodleni-a-sankce",
      title: "Když nesplácíte: sankce a jejich meze",
      lead:
        "Věřitel si nesmí za prodlení účtovat, co chce. Zákon taxativně vyjmenovává, co lze sjednat, a omezuje výši smluvní pokuty.",
      minutes: 8,
      sections: [
        {
          heading: "Co smí věřitel za prodlení požadovat",
          blocks: [
            {
              type: "list",
              items: [
                "náhradu účelně vynaložených nákladů spojených s prodlením (co je sjednáno nad ně, považuje se za smluvní pokutu),",
                "úroky z prodlení – nejvýše ve výši podle nařízení vlády (repo sazba ČNB + 8 p. b.),",
                "smluvní pokutu.",
              ],
            },
            {
              type: "p",
              text:
                "Smluvní pokuta nesmí přesáhnout 0,1 % denně z dlužné částky (s výjimkou drobných paušálních pokut do 500 Kč za splátku a 3 000 Kč ročně). Souhrn všech smluvních pokut nesmí přesáhnout polovinu celkové výše úvěru, nejvýše 200 000 Kč. Při prodlení delším než 90 dnů má věřitel nárok už jen na úrok ve výši repo sazby ČNB + 8 p. b. (nebyl-li sjednán nižší).",
            },
          ],
          cites: [
            { law: "zsu", par: "122", odst: 1 },
            { law: "zsu", par: "122", odst: 2 },
            { law: "zsu", par: "122", odst: 3 },
            { law: "zsu", par: "122", odst: 4 },
            { law: "oz", par: "1970" },
          ],
        },
        {
          heading: "Zneužívající ujednání",
          blocks: [
            {
              type: "p",
              text:
                "Ujednání, které v rozporu s požadavkem poctivosti zakládá významnou nerovnováhu práv a povinností v neprospěch spotřebitele, je zneužívající a nepřihlíží se k němu (ledaže se jej spotřebitel sám dovolá). Typicky jde o nepřiměřené poplatky za upomínky, jednostranné změny podmínek nebo skryté pojištění.",
            },
          ],
          cites: [{ law: "oz", par: "1813", odst: 1 }, { law: "oz", par: "1815" }],
        },
        {
          heading: "Kam se obrátit: finanční arbitr",
          blocks: [
            {
              type: "p",
              text:
                "Spory spotřebitele s věřitelem nebo zprostředkovatelem spotřebitelského úvěru, ale i s bankou, pojišťovnou (životní pojištění), investiční společností nebo stavební spořitelnou, rozhoduje finanční arbitr. Řízení je bezplatné a nález je vykonatelný jako rozsudek.",
            },
          ],
          cites: [{ law: "zfa", par: "1", odst: 1 }],
        },
      ],
      situations: [
        {
          title: "Pokuta 1 % denně",
          story: "Smlouva o půjčce 20 000 Kč obsahuje smluvní pokutu 1 % denně z dlužné částky.",
          answer:
            "Smluvní pokuta nad 0,1 % denně odporuje zákonu o spotřebitelském úvěru. Uplatnit lze nejvýše zákonný limit; v případném sporu se lze obrátit na finančního arbitra.",
          cites: [{ law: "zsu", par: "122", odst: 2 }, { law: "zfa", par: "1", odst: 1 }],
        },
      ],
      takeaways: [
        "Za prodlení jen náklady, úrok z prodlení dle nařízení a smluvní pokuta.",
        "Pokuta max. 0,1 % denně, souhrnně max. polovina úvěru (strop 200 000 Kč).",
        "Spory řeší zdarma finanční arbitr.",
      ],
      quiz: [
        {
          q: "Jaký je denní strop smluvní pokuty u spotřebitelského úvěru?",
          options: ["0,05 %", "0,1 %", "0,5 %"],
          correct: 1,
          explain: "Uplatněná smluvní pokuta nesmí přesáhnout 0,1 % denně z dlužné částky.",
          cite: { law: "zsu", par: "122", odst: 2 },
        },
      ],
    },
  ],
};
