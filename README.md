# Paragraf a peníze

Webová aplikace pro finanční gramotnost s důrazem na legislativu: srozumitelný výklad českých předpisů,
u každého tvrzení konkrétní paragraf s odkazem na aktuální znění, modelové situace a krátké testy.

Obsah odpovídá právnímu stavu k **21. 10. 2026** (`LEGAL_STATE_DATE` v `content/index.ts`).

## Spuštění

```bash
npm install
npm run dev
```

Aplikace poběží na http://localhost:3000. Produkční build: `npm run build && npm start`.

## Nasazení (GitHub Pages)

Celý web je statický – hra běží v prohlížeči a ukládá postup do `localStorage`, server není potřeba.
Workflow `.github/workflows/pages.yml` při každém pushi do `main` postaví statický export
(`STATIC_EXPORT=1`, `BASE_PATH=/<název-repozitáře>`) a zveřejní ho na `https://<uživatel>.github.io/<repozitář>/`.
V nastavení repozitáře je potřeba jednou zapnout **Settings → Pages → Source: GitHub Actions**.

Statický export lokálně: `STATIC_EXPORT=1 npm run build` (výstup ve složce `out/`).

## Struktura

- `content/laws.ts` – registr předpisů (zkratka, číslo, odkazy na zakonyprolidi.cz a e-Sbírku)
- `content/topics/*.ts` – oblasti a lekce: sekce, citace (`{ law, par, odst?, pism?, quote? }`), situace, test
- `content/glossary.ts` – slovník pojmů
- `lib/garnishment.ts` – výpočet srážek ze mzdy (§ 279 OSŘ, NV 595/2006 Sb.), parametry pro rok 2026
- `app/` – stránky (Next.js App Router), vše se generuje staticky

## Hra (MVP: Dlužnická čtvrť)

Na `/hra`. Smyčka případ → rozhodnutí → verdikt s paragrafem → karta do alba, ilustrativní peněženka postavy,
opakování chybných karet za 1, 3 a 7 dní a režim „Lhůta běží“ (kalendářní hádanky podle § 57 a § 49 OSŘ,
včetně českých svátků).

- `content/game/cards.ts` – karty paragrafů (doslovné citace)
- `content/game/cases.ts` – čtvrti a případy (kola, možnosti, verdikty, peněžní dopady)
- `lib/game/store.ts` – herní stav v `localStorage` (XP, peněženka, karty, opakování)
- `lib/game/dates.ts`, `lib/game/deadlines.ts` – svátky ČR, posun konce lhůty, generátor zadání

## Město dluhů (pohled shora)

`/hra` po výběru postavy otevře město vykreslené v canvasu (`components/game/CityCanvas.tsx`, kresba
`lib/game/render.ts`, geometrie a budovy `content/game/city.ts`). Ovládání: šipky / WASD, klepnutí na budovu
nebo do minimapy, E / Enter u dveří. Každá nástraha posune čas o měsíc, špatná rozhodnutí plánují dopisy
(`LETTER_RULES`), vysoká dluhová zátěž přivolá exekutora.

Vývoj a testování:

- `NEXT_DIST_DIR=.next-build npm run build` – kontrolní build bez přepsání běžícího `npm run dev`
- ve vývojovém režimu `window.__city.step(n)` posune hru o n snímků (užitečné ve skrytém okně, kde neběží
  `requestAnimationFrame`) a `window.__city.state()` vrátí pozici postavy

## Přidání lekce

Přidejte objekt `Lesson` do příslušného souboru v `content/topics/`. Každé ustanovení uvádějte jako `Citation`,
doslovné citace (`quote`) přebírejte přesně ze zákona. Rejstřík zákonů a hledání se doplní automaticky.

## Údržba

Čísla, která se mění každý rok (nezabavitelná částka, státní příspěvek, slevy na dani), jsou v textu lekcí
a v `PARAMS_2026` v `lib/garnishment.ts`. Sledujte hlavně:

- novelu zákona o spotřebitelském úvěru (transpozice směrnice CCD2, použitelná od 20. 11. 2026),
- valorizaci životního minima, normativního nájemného a energetického paušálu k 1. 1.
