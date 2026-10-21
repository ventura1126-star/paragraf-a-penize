import type { Topic } from "@/lib/types";

export const vymahani: Topic = {
  slug: "pohledavky-exekuce-insolvence",
  title: "Pohledávky, exekuce, insolvence a oddlužení",
  short: "Vymáhání dluhů",
  description:
    "Jak dlouho může věřitel dluh vymáhat, co se děje při exekuci, kolik vám smí srazit ze mzdy a kdy (a jak) se z dluhů dostat oddlužením.",
  laws: ["oz", "osr", "er", "iz", "nv595"],
  lessons: [
    {
      slug: "promlceni",
      title: "Promlčení a uznání dluhu",
      lead:
        "Promlčený dluh nezaniká, jen ho věřitel u soudu nevymůže – pokud se ovšem bráníte. Jedním podpisem si ale můžete lhůtu sami prodloužit na deset let.",
      minutes: 8,
      sections: [
        {
          heading: "Co promlčení skutečně znamená",
          blocks: [
            {
              type: "p",
              text:
                "Promlčením právo věřitele nezaniká – oslabí se. Dlužník „není povinen plnit“, ale dluh dál existuje jako tzv. naturální obligace. Když dlužník po promlčení zaplatí, nemůže peníze chtít zpátky.",
            },
            {
              type: "p",
              text:
                "Klíčové je, že soud k promlčení nepřihlíží sám od sebe. Musíte ho výslovně namítnout („vznáším námitku promlčení“). Kdo mlčí, prohraje i s promlčeným dluhem.",
            },
            {
              type: "note",
              tone: "warn",
              text:
                "Vzdát se námitky promlčení předem nelze – taková klauzule ve smlouvě se nepoužije. Ale pozor na uznání dluhu (viz níže), to je něco jiného.",
            },
          ],
          cites: [
            {
              law: "oz",
              par: "609",
              quote:
                "Nebylo-li právo vykonáno v promlčecí lhůtě, promlčí se a dlužník není povinen plnit.",
            },
            {
              law: "oz",
              par: "610",
              odst: 1,
              quote: "K promlčení soud přihlédne, jen namítne-li dlužník, že je právo promlčeno.",
            },
          ],
        },
        {
          heading: "Jak dlouhé jsou lhůty",
          blocks: [
            {
              type: "list",
              items: [
                "Obecná (subjektivní) lhůta: 3 roky. Běží ode dne, kdy věřitel mohl právo uplatnit poprvé – tedy kdy se o rozhodných okolnostech dozvěděl nebo dozvědět měl a mohl.",
                "Objektivní strop: nejpozději 10 let ode dne, kdy právo dospělo (u majetkových práv), pokud zákon nestanoví jinak.",
                "Uznání dluhu: nová lhůta 10 let ode dne uznání.",
                "Právo přiznané rozhodnutím (rozsudek, platební rozkaz, rozhodčí nález): 10 let ode dne, kdy se mělo podle rozhodnutí plnit.",
              ],
            },
            {
              type: "p",
              text:
                "V praxi to znamená: jakmile věřitel získá rozsudek, má na zahájení exekuce deset let. Promlčení „po třech letech“ se tak týká jen dluhů, které věřitel včas nežaloval.",
            },
          ],
          cites: [
            { law: "oz", par: "629", quote: "(1) Promlčecí lhůta trvá tři roky." },
            { law: "oz", par: "619" },
            { law: "oz", par: "639" },
            {
              law: "oz",
              par: "640",
              quote:
                "Právo přiznané rozhodnutím orgánu veřejné moci se promlčí za deset let ode dne, kdy mělo být podle rozhodnutí plněno.",
            },
          ],
        },
        {
          heading: "Uznání dluhu – podpis, který prodlužuje dluh",
          blocks: [
            {
              type: "p",
              text:
                "Uznáte-li dluh písemně co do důvodu i výše, zákon předpokládá, že dluh v té výši trvá – důkazní břemeno se přesouvá na vás. A promlčecí lhůta začíná znovu, tentokrát na deset let.",
            },
            {
              type: "p",
              text:
                "Vymáhací agentury proto často posílají „splátkové kalendáře“ nebo „dohody o narovnání“, jejichž součástí je uznání dluhu. Před podpisem si ověřte, zda dluh není už promlčený.",
            },
          ],
          cites: [
            {
              law: "oz",
              par: "2053",
              quote:
                "Uzná-li někdo svůj dluh co do důvodu i výše prohlášením učiněným v písemné formě, má se za to, že dluh v rozsahu uznání v době uznání trvá.",
            },
            { law: "oz", par: "639" },
          ],
        },
        {
          heading: "Příslušenství: úroky z prodlení a smluvní pokuta",
          blocks: [
            {
              type: "p",
              text:
                "Při prodlení s peněžitým dluhem může věřitel chtít úrok z prodlení. Jeho výši stanoví nařízení vlády (č. 351/2013 Sb.): repo sazba ČNB platná k prvnímu dni kalendářního pololetí + 8 procentních bodů. Smluvní pokutu lze žádat, jen pokud byla sjednána – a to bez ohledu na to, zda věřiteli vznikla škoda.",
            },
          ],
          cites: [{ law: "oz", par: "1970" }, { law: "oz", par: "2048", odst: 1 }],
        },
      ],
      situations: [
        {
          title: "Dopis od agentury po pěti letech",
          story:
            "Před pěti lety jste nezaplatili fakturu za mobil. Věřitel nikdy nežaloval. Teď vám agentura posílá výzvu a „výhodný splátkový kalendář“ k podpisu.",
          answer:
            "Pokud nebyla podána žaloba, tříletá lhůta pravděpodobně uplynula. Dluh trvá, ale u soudu byste mohli vznést námitku promlčení. Podpisem splátkového kalendáře s uznáním dluhu byste si lhůtu obnovili na 10 let. Pozor: zaplacenou částku zpět nedostanete.",
          cites: [
            { law: "oz", par: "609" },
            { law: "oz", par: "610", odst: 1 },
            { law: "oz", par: "639" },
          ],
        },
        {
          title: "Platební rozkaz z roku 2019",
          story: "Soud vydal v roce 2019 platební rozkaz, který nabyl právní moci. Věřitel teď zahajuje exekuci.",
          answer:
            "Právo přiznané rozhodnutím se promlčuje za 10 let od splatnosti podle rozhodnutí. Exekuce zahájená dnes je tedy zpravidla včas.",
          cites: [{ law: "oz", par: "640" }],
        },
      ],
      takeaways: [
        "Promlčení musíte u soudu výslovně namítnout.",
        "Obecná lhůta 3 roky, po rozsudku nebo uznání 10 let.",
        "Písemné uznání dluhu přesouvá důkazní břemeno a restartuje lhůtu.",
      ],
      quiz: [
        {
          q: "Věřitel žaluje promlčený dluh a dlužník se k žalobě nevyjádří. Co udělá soud?",
          options: [
            "Žalobu zamítne, protože dluh je promlčený",
            "Může žalobě vyhovět – k promlčení přihlíží jen na námitku",
            "Řízení zastaví",
          ],
          correct: 1,
          explain: "Soud k promlčení přihlédne, jen namítne-li ho dlužník.",
          cite: { law: "oz", par: "610", odst: 1 },
        },
        {
          q: "Jak dlouhá je promlčecí lhůta po písemném uznání dluhu?",
          options: ["3 roky", "5 let", "10 let"],
          correct: 2,
          explain: "Uznal-li dlužník dluh, promlčí se právo za deset let ode dne uznání.",
          cite: { law: "oz", par: "639" },
        },
      ],
    },
    {
      slug: "exekuce",
      title: "Exekuce a srážky ze mzdy",
      lead:
        "Co přijde po vyrozumění o zahájení exekuce, proč je prvních 30 dní nejdůležitějších, kolik vám smí zaměstnavatel srazit a co vám zůstane na účtu.",
      minutes: 12,
      sections: [
        {
          heading: "Výzva ke splnění: 30 dní na levnější konec",
          blocks: [
            {
              type: "p",
              text:
                "Součástí vyrozumění o zahájení exekuce je výzva ke splnění vymáhané povinnosti. Exekutor v ní vyčíslí dluh, zálohu na snížené náklady exekuce a náklady oprávněného.",
            },
            {
              type: "p",
              text:
                "Zaplatíte-li do 30 dnů od doručení dluh a zálohu, exekutor vydá příkaz k úhradě nákladů a exekuce je tím provedena – s výrazně nižšími náklady. Současně zanikají zákazy nakládat s majetkem.",
            },
            {
              type: "note",
              tone: "info",
              text:
                "Lhůta 30 dní se počítá od doručení – včetně fikce doručení do datové schránky nebo uložením na poště. Nevyzvednutá obálka lhůtu nezastaví.",
            },
          ],
          cites: [{ law: "er", par: "46", odst: 6 }],
        },
        {
          heading: "Obrana: návrh na zastavení exekuce",
          blocks: [
            {
              type: "p",
              text:
                "Pokud je exekuce nepřípustná (např. dluh byl zaplacen, titul byl zrušen, pohledávka je promlčená a vy jste to namítli), můžete podat návrh na zastavení exekuce. Podává se u exekutora, a to do 15 dnů ode dne, kdy jste se o důvodu dozvěděli. Musí obsahovat skutečnosti, ze kterých je vidět, že jste lhůtu dodrželi, a listinné důkazy.",
            },
          ],
          cites: [{ law: "er", par: "55", odst: 1 }, { law: "er", par: "55", odst: 2 }],
        },
        {
          heading: "Jeden věřitel – jeden exekutor",
          blocks: [
            {
              type: "p",
              text:
                "Zahájí-li tentýž oprávněný proti témuž povinnému další řízení u stejného exekutora, spojuje se s předchozí exekucí ke společnému řízení. Exekuční soud může spojit i řízení vedená různými exekutory a určit, kdo je povede. Cílem je, aby dlužník neplatil několikery náklady.",
            },
          ],
          cites: [{ law: "er", par: "37", odst: 5 }, { law: "er", par: "37", odst: 7 }],
        },
        {
          heading: "Srážky ze mzdy: jak se počítají",
          blocks: [
            {
              type: "steps",
              items: [
                "Vychází se z čisté mzdy (mzda minus záloha na daň a pojistné).",
                "Odečte se nezabavitelná částka – ta vám zůstane vždy.",
                "Zbytek se zaokrouhlí dolů na částku dělitelnou třemi.",
                "Pro běžné pohledávky lze srazit 1/3 zbytku; pro přednostní (výživné, daně, pojistné, náhrada újmy na zdraví…) až 2/3.",
                "Pokud zbytek (po odečtení nezabavitelné částky) přesahuje zákonnou hranici, část nad hranicí se sráží bez omezení.",
              ],
            },
            {
              type: "note",
              tone: "change",
              text:
                "Od 1. 1. 2026 se nezabavitelná částka počítá jako 85 % součtu životního minima jednotlivce, normativního nájemného a energetického paušálu (dříve 2/3 součtu životního minima a normativních nákladů na bydlení). Pro rok 2026 vychází na povinného 14 101,50 Kč a na každou osobu, které platí výživné, čtvrtina této částky; výsledek se zaokrouhluje nahoru na celé koruny. Manžel/partner se nezapočítává (výjimkou jsou případy pobírání starobního, invalidního 2./3. stupně či sirotčího důchodu). Hranice, nad kterou se sráží bez omezení, činí 1,9násobek součtu (cca 31 521 Kč). Ověřte v aktuálním znění nařízení vlády č. 595/2006 Sb.",
            },
          ],
          cites: [
            { law: "osr", par: "277", odst: 1 },
            { law: "osr", par: "278" },
            {
              law: "osr",
              par: "279",
              odst: 1,
              quote:
                "…lze srazit k vydobytí pohledávky oprávněného jen jednu třetinu. Pro přednostní pohledávky uvedené v odstavci 2 se srážejí dvě třetiny.",
            },
            { law: "osr", par: "279", odst: 2 },
            { law: "osr", par: "279", odst: 3 },
            { law: "nv595", par: "1" },
            { law: "nv595", par: "2" },
            { law: "nv595", par: "3" },
          ],
        },
        {
          heading: "Účet: chráněná částka",
          blocks: [
            {
              type: "p",
              text:
                "Při exekuci přikázáním pohledávky z účtu banka účet zablokuje. Je-li povinný fyzickou osobou, nevztahuje se blokace na prostředky do výše trojnásobku životního minima jednotlivce. Na žádost vám je banka vyplatí – nejvýše jednou v průběhu jednoho řízení.",
            },
          ],
          cites: [{ law: "osr", par: "304b", odst: 1 }, { law: "osr", par: "304b", odst: 2 }],
        },
        {
          heading: "Bezvýsledné exekuce se zastavují",
          blocks: [
            {
              type: "p",
              text:
                "Nedošlo-li po dobu posledních 6 let (po vyznačení doložky provedení exekuce) ani k částečnému uspokojení a není postižena nemovitost, exekutor vyzve oprávněného, zda souhlasí se zastavením. Pokud souhlasí nebo do 30 dnů neodpoví, exekutor exekuci zastaví.",
            },
            {
              type: "note",
              tone: "warn",
              text: "Zastavení exekuce neznamená zánik dluhu. Věřitel může dluh vymáhat znovu, pokud ještě není promlčen.",
            },
          ],
          cites: [{ law: "er", par: "55", odst: 7 }],
        },
      ],
      situations: [
        {
          title: "Exekuce na 8 000 Kč za nezaplacený internet",
          story: "Přišlo vám vyrozumění o zahájení exekuce. Dluh je 8 000 Kč, náklady ve výzvě jsou několik tisíc.",
          answer:
            "Pokud dluh uznáváte, je nejvýhodnější zaplatit dluh i zálohu do 30 dnů od doručení – exekuce tím skončí se sníženými náklady. Pokud dluh neuznáváte (zaplaceno, promlčeno), podejte do 15 dnů od zjištění důvodu návrh na zastavení u exekutora.",
          cites: [{ law: "er", par: "46", odst: 6 }, { law: "er", par: "55", odst: 1 }],
        },
        {
          title: "Kolik mi zůstane z výplaty?",
          story: "Čistá mzda 30 000 Kč, jedno dítě, dluh u banky (nepřednostní).",
          answer:
            "Nezabavitelná částka 2026 = 14 101,50 + 3 525,38 = 17 626,88 → zaokrouhleno nahoru 17 627 Kč. Zbytek 12 373 Kč se zaokrouhlí dolů na 12 372 Kč (dělitelné třemi); 1/3 = 4 124 Kč. Sraženo bude 4 124 Kč, zůstane 25 876 Kč. Hranice 31 521 Kč není překročena.",
          cites: [{ law: "osr", par: "279", odst: 1 }, { law: "nv595", par: "1" }],
        },
      ],
      takeaways: [
        "Prvních 30 dní od doručení vyrozumění rozhoduje o výši nákladů.",
        "Návrh na zastavení exekuce do 15 dnů od zjištění důvodu.",
        "Nezabavitelná částka 2026 se počítá nově (85 % součtu tří složek).",
        "Na účtu je chráněn trojnásobek životního minima – výplata jednou za řízení.",
      ],
      quiz: [
        {
          q: "Jakou část zbytku čisté mzdy lze srazit pro běžnou (nepřednostní) pohledávku?",
          options: ["Jednu třetinu", "Dvě třetiny", "Polovinu"],
          correct: 0,
          explain: "Pro běžné pohledávky 1/3, pro přednostní pohledávky 2/3.",
          cite: { law: "osr", par: "279", odst: 1 },
        },
        {
          q: "Do kdy musíte zaplatit, aby exekuce skončila se sníženými náklady?",
          options: [
            "Do 15 dnů od zahájení exekuce",
            "Do 30 dnů od doručení vyrozumění o zahájení exekuce",
            "Kdykoli před dražbou",
          ],
          correct: 1,
          explain: "Výzva ke splnění dává lhůtu 30 dnů od doručení vyrozumění.",
          cite: { law: "er", par: "46", odst: 6 },
        },
      ],
    },
    {
      slug: "oddluzeni",
      title: "Insolvence a oddlužení (osobní bankrot)",
      lead:
        "Kdy jste podle zákona v úpadku, kdo vám smí sepsat návrh, jak dlouho oddlužení trvá po novele z roku 2024 a které dluhy ani oddlužení nesmaže.",
      minutes: 14,
      sections: [
        {
          heading: "Úpadek: tři podmínky současně",
          blocks: [
            {
              type: "list",
              items: [
                "více věřitelů (alespoň dva),",
                "peněžité závazky déle než 30 dnů po splatnosti,",
                "a tyto závazky nejste schopni plnit.",
              ],
            },
            {
              type: "p",
              text:
                "Neschopnost plnit se předpokládá např. tehdy, když jste zastavili platby podstatné části závazků, neplníte je déle než 3 měsíce po splatnosti nebo je nelze uspokojit exekucí. Oddlužení lze řešit i hrozící úpadek.",
            },
          ],
          cites: [
            { law: "iz", par: "3", odst: 1 },
            { law: "iz", par: "3", odst: 2 },
          ],
        },
        {
          heading: "Kdo může oddlužení navrhnout a kdo návrh sepíše",
          blocks: [
            {
              type: "p",
              text:
                "Oddlužení může navrhnout jen dlužník sám – fyzická osoba nebo nepodnikající právnická osoba bez dluhů z podnikání. Dluhy z podnikání oddlužení nebrání např. tehdy, když věřitel nevysloví nesouhlas nebo jde o zajištěného věřitele.",
            },
            {
              type: "p",
              text:
                "Návrh musí za dlužníka sepsat a podat advokát, notář, exekutor, insolvenční správce, nebo akreditovaná osoba (nezisková organizace s akreditací Ministerstva spravedlnosti – zpravidla zdarma). Bez prostředníka smí návrh podat jen osoba s magisterským právním či ekonomickým vzděláním nebo se zkouškou insolvenčního správce.",
            },
            {
              type: "note",
              tone: "warn",
              text:
                "„Oddlužovací agentury“ bez akreditace návrh podat nesmí. Seznam akreditovaných osob vede Ministerstvo spravedlnosti.",
            },
          ],
          cites: [
            { law: "iz", par: "389" },
            { law: "iz", par: "390a", odst: 1 },
            { law: "iz", par: "390a", odst: 2 },
          ],
        },
        {
          heading: "Kdy soud návrh zamítne",
          blocks: [
            {
              type: "list",
              items: [
                "lze-li důvodně předpokládat nepoctivý záměr,",
                "nebudete-li schopni hradit ani odměnu insolvenčního správce, výživné a minimum pro ostatní věřitele ve stejné výši,",
                "pokud jste v posledních 12 letech již osvobození v oddlužení dostali,",
                "při lehkomyslném nebo nedbalém přístupu k povinnostem v řízení.",
              ],
            },
          ],
          cites: [
            { law: "iz", par: "395", odst: 1 },
            { law: "iz", par: "395", odst: 2 },
            { law: "iz", par: "395", odst: 3 },
          ],
        },
        {
          heading: "Jak oddlužení probíhá a jak dlouho trvá",
          blocks: [
            {
              type: "p",
              text:
                "Oddlužení se provádí buď zpeněžením majetkové podstaty, nebo plněním splátkového kalendáře se zpeněžením majetkové podstaty. U splátkového kalendáře odevzdáváte měsíčně tolik, kolik by šlo srazit v exekuci pro přednostní pohledávky.",
            },
            {
              type: "note",
              tone: "change",
              text:
                "Novela č. 252/2024 Sb. (účinná od 1. 10. 2024) sjednotila délku oddlužení na 3 roky pro všechny fyzické osoby. Pokud vám bylo osvobození přiznáno v posledních 20 letech, trvá opakované oddlužení 5 let.",
            },
            {
              type: "p",
              text:
                "Osvobození získáte, pokud po 3 letech nebylo oddlužení zrušeno a plnili jste podstatné povinnosti (nebo jste věřitelům splatili vše). Zákon předpokládá, že povinnosti plníte, dosáhnete-li míry uspokojení, kterou soud určil při schválení oddlužení.",
            },
          ],
          cites: [
            { law: "iz", par: "398", odst: 1 },
            { law: "iz", par: "398", odst: 3 },
            { law: "iz", par: "412a", odst: 1 },
            { law: "iz", par: "412a", odst: 3 },
          ],
        },
        {
          heading: "Povinnosti v průběhu oddlužení",
          blocks: [
            {
              type: "list",
              items: [
                "vykonávat přiměřenou výdělečnou činnost, a jste-li bez práce, usilovat o příjem,",
                "dědictví, dary a mimořádné příjmy použít na mimořádné splátky,",
                "hlásit soudu a správci změny bydliště a zaměstnání,",
                "nepřijímat nové závazky, které nebudete schopni splnit.",
              ],
            },
            {
              type: "p",
              text:
                "Soud oddlužení zruší a prohlásí konkurs, pokud neplníte podstatné povinnosti, vznikne vám zaviněně nový dluh více než 30 dní po splatnosti (nařízená exekuce = předpoklad zavinění) nebo nejste schopni splácet ani minimum.",
            },
          ],
          cites: [{ law: "iz", par: "412", odst: 1 }, { law: "iz", par: "418", odst: 1 }, { law: "iz", par: "418", odst: 2 }],
        },
        {
          heading: "Co oddlužení nesmaže",
          blocks: [
            {
              type: "list",
              items: [
                "peněžité tresty a majetkové sankce za úmyslný trestný čin,",
                "náhradu škody způsobené úmyslným porušením povinnosti,",
                "zákonné výživné,",
                "náhradu škody na zdraví,",
                "pohledávky vzniklé po rozhodnutí o úpadku.",
              ],
            },
          ],
          cites: [{ law: "iz", par: "414", odst: 1 }, { law: "iz", par: "416", odst: 1 }],
        },
      ],
      situations: [
        {
          title: "Pět exekucí a minimální mzda",
          story: "Máte pět exekucí od různých věřitelů, příjem jen málo nad nezabavitelnou částkou.",
          answer:
            "Splňujete znaky úpadku (více věřitelů, prodlení > 30 dní, neschopnost plnit). Pokud soud uzná, že dokážete hradit alespoň odměnu správce a stejnou částku ostatním věřitelům, lze žádat oddlužení. Zahájením insolvenčního řízení se exekuce nesmí provádět. Návrh vám zdarma sepíše akreditovaná osoba.",
          cites: [{ law: "iz", par: "3", odst: 1 }, { law: "iz", par: "395", odst: 1 }, { law: "iz", par: "109", odst: 1 }],
        },
        {
          title: "Dědictví během oddlužení",
          story: "Ve druhém roce oddlužení zdědíte 200 000 Kč.",
          answer:
            "Hodnoty získané dědictvím musíte vydat insolvenčnímu správci a použít na mimořádné splátky. Zatajení je porušením podstatné povinnosti a může vést ke zrušení oddlužení.",
          cites: [{ law: "iz", par: "412", odst: 1, pism: "b" }, { law: "iz", par: "418", odst: 1 }],
        },
      ],
      takeaways: [
        "Oddlužení od 1. 10. 2024 trvá zpravidla 3 roky, opakované 5 let.",
        "Návrh zdarma sepíše akreditovaná osoba – nikoli „agentura“ bez akreditace.",
        "Výživné, úmyslné škody a trestní sankce oddlužení nesmaže.",
      ],
      quiz: [
        {
          q: "Jak dlouho trvá standardní oddlužení splátkovým kalendářem po novele 2024?",
          options: ["3 roky", "5 let", "7 let"],
          correct: 0,
          explain: "Osvobození lze získat po 3 letech plnění povinností; opakované oddlužení trvá 5 let.",
          cite: { law: "iz", par: "412a", odst: 1 },
        },
        {
          q: "Který dluh oddlužením nezanikne?",
          options: ["Spotřebitelský úvěr", "Výživné ze zákona", "Dluh za energie"],
          correct: 1,
          explain: "Osvobození se nedotýká mj. pohledávek na zákonném výživném.",
          cite: { law: "iz", par: "416", odst: 1 },
        },
      ],
    },
  ],
};
