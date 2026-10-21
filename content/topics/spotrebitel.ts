import type { Topic } from "@/lib/types";

export const spotrebitel: Topic = {
  slug: "spotrebitel-a-smlouvy",
  title: "Spotřebitel a smlouvy",
  short: "Nákupy a pojištění",
  description:
    "Odstoupení od smlouvy na dálku, reklamace vad, zneužívající ujednání ve smlouvách a jak (a kdy) vypovědět pojistnou smlouvu.",
  laws: ["oz", "zos", "zfa"],
  lessons: [
    {
      slug: "nakup-a-reklamace",
      title: "Nákup na dálku a reklamace",
      lead:
        "Dva roky na vytknutí vady, první rok s obrácenou důkazní povinností, 30 dní na vyřízení reklamace a 14 dní na odstoupení od nákupu přes internet.",
      minutes: 9,
      sections: [
        {
          heading: "Odstoupení od smlouvy uzavřené na dálku",
          blocks: [
            {
              type: "p",
              text:
                "Od smlouvy uzavřené distančním způsobem (e-shop, telefon) nebo mimo obchodní prostory (předváděcí akce, podomní prodej) můžete odstoupit do 14 dnů bez udání důvodu. U koupě zboží běží lhůta od převzetí – u více kusů dodávaných zvlášť od převzetí posledního.",
            },
          ],
          cites: [
            {
              law: "oz",
              par: "1829",
              odst: 1,
              quote:
                "Spotřebitel může odstoupit od smlouvy uzavřené distančním způsobem nebo od smlouvy uzavřené mimo obchodní prostory ve lhůtě čtrnácti dnů.",
            },
            { law: "oz", par: "1829", odst: 2 },
          ],
        },
        {
          heading: "Vady zboží: dva roky a obrácené důkazní břemeno",
          blocks: [
            {
              type: "p",
              text:
                "Prodávající odpovídá, že věc při převzetí nemá vady – odpovídá popisu, je vhodná k obvyklému účelu a má sjednané vlastnosti. Vadu můžete vytknout, projeví-li se do dvou let od převzetí.",
            },
            {
              type: "p",
              text:
                "Projeví-li se vada během prvního roku, má se za to, že věc byla vadná už při převzetí. Prodávající tedy musí prokázat opak, ne vy.",
            },
          ],
          cites: [
            { law: "oz", par: "2161", odst: 1 },
            {
              law: "oz",
              par: "2161",
              odst: 5,
              quote:
                "Projeví-li se vada v průběhu jednoho roku od převzetí, má se za to, že věc byla vadná již při převzetí…",
            },
            { law: "oz", par: "2165", odst: 1 },
          ],
        },
        {
          heading: "Jak reklamace probíhá",
          blocks: [
            {
              type: "steps",
              items: [
                "Vytkněte vadu prodávajícímu (nebo osobě určené k opravě). Zvolte, zda chcete opravu, nebo novou věc.",
                "Prodávající vám musí vydat písemné potvrzení o uplatnění reklamace.",
                "Reklamace musí být vyřízena do 30 dnů, pokud se nedohodnete na delší lhůtě.",
                "Uplyne-li lhůta marně, můžete odstoupit od smlouvy nebo žádat přiměřenou slevu.",
              ],
            },
            {
              type: "p",
              text:
                "Dokud prodávající nesplní povinnosti z vadného plnění, nemusíte doplácet zbývající část ceny.",
            },
          ],
          cites: [
            { law: "oz", par: "2169", odst: 1 },
            { law: "oz", par: "2172" },
            { law: "oz", par: "2173" },
            { law: "zos", par: "19", odst: 2 },
            { law: "zos", par: "19", odst: 3 },
            { law: "zos", par: "19", odst: 4 },
          ],
        },
      ],
      situations: [
        {
          title: "Pračka po 10 měsících",
          story: "Pračka přestala ždímat po 10 měsících. Prodejce tvrdí, že jste ji přetížili.",
          answer:
            "Vada se projevila v prvním roce, takže se předpokládá, že byla přítomna už při převzetí. Prodejce musí prokázat, že vadu způsobilo vaše užívání. Trvejte na písemném potvrzení a vyřízení do 30 dnů.",
          cites: [{ law: "oz", par: "2161", odst: 5 }, { law: "zos", par: "19", odst: 3 }],
        },
        {
          title: "Reklamace trvá 45 dní",
          story: "Reklamaci jste uplatnili před 45 dny, o prodloužení jste se nedohodli.",
          answer: "Lhůta 30 dnů marně uplynula – můžete od smlouvy odstoupit a žádat vrácení peněz, nebo požadovat přiměřenou slevu.",
          cites: [{ law: "zos", par: "19", odst: 4 }],
        },
      ],
      takeaways: [
        "14 dní na odstoupení od nákupu na dálku, od převzetí zboží.",
        "2 roky na vytknutí vady, v 1. roce dokazuje prodávající.",
        "Reklamace do 30 dnů, jinak odstoupení nebo sleva.",
      ],
      quiz: [
        {
          q: "Vada se projeví 8 měsíců po koupi. Kdo musí dokazovat její původ?",
          options: ["Kupující", "Prodávající", "Nezávislý znalec vždy"],
          correct: 1,
          explain: "V prvním roce se má za to, že věc byla vadná již při převzetí.",
          cite: { law: "oz", par: "2161", odst: 5 },
        },
      ],
    },
    {
      slug: "pojisteni-a-ujednani",
      title: "Pojistné smlouvy a zneužívající ujednání",
      lead:
        "Pojistku lze do dvou měsíců od uzavření vypovědět s osmidenní výpovědní dobou. Jinak zpravidla ke konci pojistného období – výpověď ale musí dorazit nejméně šest týdnů předem.",
      minutes: 7,
      sections: [
        {
          heading: "Kdy a jak vypovědět pojištění",
          blocks: [
            {
              type: "list",
              items: [
                "do dvou měsíců od uzavření smlouvy – s osmidenní výpovědní dobou,",
                "do tří měsíců od oznámení pojistné události – s měsíční výpovědní dobou,",
                "u běžného pojistného ke konci pojistného období – výpověď musí být doručena alespoň 6 týdnů předem, jinak pojištění zanikne až ke konci následujícího období.",
              ],
            },
            {
              type: "note",
              tone: "warn",
              text: "Pozdní výpověď (méně než 6 týdnů před koncem období) neznamená neplatnost – jen posouvá zánik o celé další období.",
            },
          ],
          cites: [
            { law: "oz", par: "2805", quote: "a) s osmidenní výpovědní dobou do dvou měsíců ode dne uzavření smlouvy" },
            { law: "oz", par: "2807" },
          ],
        },
        {
          heading: "Zneužívající ujednání ve spotřebitelských smlouvách",
          blocks: [
            {
              type: "p",
              text:
                "Ujednání, které v rozporu s požadavkem poctivosti zakládá významnou nerovnováhu práv a povinností v neprospěch spotřebitele, je zneužívající. Netýká se hlavního předmětu smlouvy ani přiměřenosti ceny, pokud byly sděleny jasně a srozumitelně. Ke zneužívajícímu ujednání se nepřihlíží, ledaže se jej spotřebitel sám dovolá.",
            },
          ],
          cites: [{ law: "oz", par: "1813", odst: 1 }, { law: "oz", par: "1815" }],
        },
        {
          heading: "Spory o životní pojištění",
          blocks: [
            {
              type: "p",
              text:
                "Spory spotřebitele s pojistitelem nebo zprostředkovatelem při distribuci životního pojištění a ze životního pojištění rozhoduje bezplatně finanční arbitr. U neživotního pojištění (auto, majetek, odpovědnost) do působnosti arbitra spor nespadá.",
            },
          ],
          cites: [{ law: "zfa", par: "1", odst: 1, pism: "e" }],
        },
      ],
      situations: [
        {
          title: "Investiční životko od „poradce“",
          story: "Před měsícem jste na schůzce podepsali investiční životní pojištění, které vám nedává smysl.",
          answer:
            "Jste ve lhůtě dvou měsíců od uzavření – můžete vypovědět s osmidenní výpovědní dobou. Výpověď pošlete prokazatelně (doporučeně nebo datovou schránkou). Spory řeší finanční arbitr.",
          cites: [{ law: "oz", par: "2805" }, { law: "zfa", par: "1", odst: 1, pism: "e" }],
        },
      ],
      takeaways: [
        "Do 2 měsíců od uzavření: výpověď s 8denní lhůtou.",
        "Ke konci období: doručit min. 6 týdnů předem.",
        "Ke zneužívajícímu ujednání se nepřihlíží.",
      ],
      quiz: [
        {
          q: "Pojistné období končí 31. 12. Výpověď doručíte 1. 12. Kdy pojištění zanikne?",
          options: ["31. 12. tohoto roku", "Ke konci následujícího pojistného období", "Okamžitě"],
          correct: 1,
          explain: "Výpověď doručená později než 6 týdnů před koncem období působí až ke konci následujícího období.",
          cite: { law: "oz", par: "2807" },
        },
      ],
    },
  ],
};
