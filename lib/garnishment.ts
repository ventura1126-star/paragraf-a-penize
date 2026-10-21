/**
 * Výpočet srážek ze mzdy podle § 279 OSŘ a NV č. 595/2006 Sb. (znění od 1. 1. 2026).
 * Parametry jsou vstupem, aby šlo snadno přejít na další rok.
 */
export type GarnishmentParams = {
  /** Životní minimum jednotlivce. */
  zivotniMinimum: number;
  /** Normativní nájemné pro jednočlennou domácnost v obci nad 70 000 obyvatel. */
  normativniNajemne: number;
  /** Energetický paušál pro jednočlennou domácnost. */
  energetickyPausal: number;
};

export const PARAMS_2026: GarnishmentParams = {
  zivotniMinimum: 4860,
  normativniNajemne: 9430,
  energetickyPausal: 2300,
};

export type GarnishmentInput = {
  cistaMzda: number;
  /** Počet osob, kterým povinný platí výživné (manžel se nezapočítává). */
  vyzivovaneOsoby: number;
  /** Vymáhá se přednostní pohledávka (§ 279 odst. 2 OSŘ)? */
  prednostni: boolean;
};

export type GarnishmentResult = {
  zakladniCastka: number;
  nezabavitelna: number;
  hranice: number;
  zbytek: number;
  zbytekDo: number;
  nadHranici: number;
  tretina: number;
  srazka: number;
  zustane: number;
};

export function computeGarnishment(input: GarnishmentInput, p: GarnishmentParams = PARAMS_2026): GarnishmentResult {
  const soucet = p.zivotniMinimum + p.normativniNajemne + p.energetickyPausal;
  const zakladniCastka = 0.85 * soucet;
  // § 1 odst. 1 + § 3 NV 595/2006: čtvrtina na každou vyživovanou osobu, zaokrouhlení nahoru.
  const nezabavitelna = Math.ceil(zakladniCastka * (1 + 0.25 * Math.max(0, input.vyzivovaneOsoby)));
  // § 2 NV 595/2006: hranice 1,9násobku součtu.
  const hranice = Math.round(1.9 * soucet);

  const cista = Math.max(0, Math.floor(input.cistaMzda));
  const zbytek = Math.max(0, cista - nezabavitelna);
  // § 279 odst. 1 OSŘ: zaokrouhlení dolů na částku dělitelnou třemi.
  const zbytekDo = Math.min(zbytek, hranice);
  const nadHranici = zbytek - zbytekDo;
  const delitelny = zbytekDo - (zbytekDo % 3);
  const tretina = delitelny / 3;
  const srazka = (input.prednostni ? 2 * tretina : tretina) + nadHranici;

  return {
    zakladniCastka,
    nezabavitelna,
    hranice,
    zbytek,
    zbytekDo,
    nadHranici,
    tretina,
    srazka,
    zustane: cista - srazka,
  };
}
