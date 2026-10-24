/**
 * Pixelové postavičky 16 × 23 px. Každý znak = jeden pixel, „.“ = průhledný.
 * k obrys · h vlasy · s kůže · S strniště/vousy · e oči · m ústa · t oblečení nahoře · T stín
 * p kalhoty/sukně · b boty · w bílá · a doplněk · g brýle · c čepice
 */
export const SPRITE_W = 16;
export const SPRITE_H = 23;

const BASE = [
  "................",
  "....kkkkkkkk....",
  "...khhhhhhhhk...",
  "...khhhhhhhhk...",
  "...khsssssshk...",
  "...kssessessk...",
  "...kssssssssk...",
  "...ksssmmsssk...",
  "....kssssssk....",
  "......kssk......",
  "..kttttttttttk..",
  ".kttttttttttttk.",
  ".kttttttttttttk.",
  ".ktTttttttttTtk.",
  ".ktTttttttttTtk.",
  ".kskttttttttksk.",
  "...kppppppppk...",
  "...kppppppppk...",
  "...kpppkkpppk...",
  "...kpppkkpppk...",
  "...kpppkkpppk...",
  "..kbbbbkkbbbbk..",
  "..kkkkkkkkkkkk..",
];

type Sprite = { rows: string[]; palette: Record<string, string> };

function build(overrides: Record<number, string>): string[] {
  return BASE.map((r, i) => overrides[i] ?? r);
}

const OUTLINE = "#1f1d22";
const MOUTH = "#9a4b3c";
const EYE = "#1f1d22";

export const SPRITES: Record<string, Sprite> = {
  ondrej: {
    rows: build({
      0: "......hh.h......",
      4: "...khhsssshhk...",
      10: "..ktttwttwtttk..",
      11: ".kttttwttwttttk.",
    }),
    palette: { k: OUTLINE, h: "#6b4a2b", s: "#f1c7a1", e: EYE, m: MOUTH, t: "#2e8b8b", T: "#21696a", w: "#f4f4f4", p: "#3b4a6b", b: "#2a2a2a" },
  },
  jana: {
    rows: build({
      3: "..khhhhhhhhhhk..",
      4: "..khhsssssshhk..",
      5: "..khssessesshk..",
      6: "..khsssssssshk..",
      7: "..khsssmmssshk..",
      8: "..khkssssssk" + "hk..",
      9: "..kh..kssk..hk..",
      10: "..kttttaattttk..",
    }),
    palette: { k: OUTLINE, h: "#3a2416", s: "#e8b48f", e: EYE, m: MOUTH, t: "#b03a7a", T: "#86295c", a: "#f2c94c", p: "#3a3a52", b: "#2a2a2a" },
  },
  marie: {
    rows: build({
      0: "......kkkk......",
      1: "....kkhhhhkk....",
      5: "...kgegssgegk...",
      13: ".ktTtttwwtttTtk.",
      14: ".ktTttttttttTtka",
      15: ".kskttttttttkska",
      16: "..kppppppppppk.a",
      17: "..kppppppppppk.a",
      18: ".kppppppppppppka",
      19: "....kssk.kssk..a",
      20: "....kssk.kssk..a",
      21: "...kbbbk.kbbbk.a",
      22: "...kkkkk.kkkkk.a",
    }),
    palette: { k: OUTLINE, h: "#c9c9c9", s: "#f3d0b5", e: EYE, m: MOUTH, g: "#333333", t: "#7a5aa6", T: "#5d4383", w: "#e8e0d0", p: "#4a3b5c", b: "#5a3a2a", a: "#8a5a2b" },
  },
  radek: {
    rows: build({
      2: "...kcccccccck...",
      3: "..kccccccccccck.",
      4: "...khsssssshk...",
      7: "...ksSSmmSSsk...",
      8: "....kSSSSSSk....",
      11: ".ktttpttttptttk.",
      12: ".ktttpttttptttk.",
      13: ".ktTppppppppTtk.",
      14: ".ktTppppppppTtk.",
      15: ".kskppppppppksk.",
    }),
    palette: { k: OUTLINE, c: "#c0392b", h: "#333333", s: "#d9a07a", S: "#a97a5c", e: EYE, m: MOUTH, t: "#d8d2c4", T: "#b8b1a2", p: "#2f5d8a", b: "#5a3a1e" },
  },
  petr: {
    rows: build({
      4: "...khhssssssk...",
      7: "...kSssmmssSk...",
      8: "....kSSSSSSk....",
      10: "..ktttwwwwtttk..",
      11: ".kttttwaawttttk.",
      12: ".kttttwaawttttk.",
      13: ".ktTttwaawttTtk.",
      14: ".ktTttwaawttTtk.",
    }),
    palette: { k: OUTLINE, h: "#5a5650", s: "#c98d66", S: "#6b5a4a", e: EYE, m: MOUTH, t: "#4a4f5a", T: "#363a43", w: "#e8eef5", a: "#2c6e9b", p: "#2b2f36", b: "#1e1e1e" },
  },
  // maskot studia Ventura Games: vysoký účes a havajská košile
  ventura: {
    rows: build({
      0: "....kkkkkkk.....",
      1: "...khhhhhhhk....",
      2: "..khhhhhhhhhk...",
      7: "...ksmwwwwmsk...",
      10: "..ktatttatttak..",
      11: ".kttattwwttattk.",
      12: ".katttwwwwtttak.",
      13: ".ktTattwwttaTtk.",
      14: ".ktTttawwattTtk.",
    }),
    palette: { k: OUTLINE, h: "#5a3418", s: "#f1c7a1", e: EYE, m: MOUTH, w: "#f4f4f4", t: "#2bb3c0", T: "#1f8a94", a: "#f2c94c", p: "#e8dcc0", b: "#2a2a2a" },
  },
  // učitelé škol (Střední škola finanční a další)
  gros: {
    rows: build({
      1: "....kkkkkkkk....",
      2: "...khsssssshk...",
      3: "...khsssssshk...",
      5: "...kgegssgegk...",
      7: "...ksSSmmSSsk...",
      8: "....kSSSSSSk....",
      10: "..kttwwaawwttk..",
      11: ".ktttwwaawwtttk.",
      12: ".kttttwwwwttttk.",
    }),
    palette: { k: OUTLINE, h: "#d9d9d9", s: "#f0c8a8", S: "#cfcfcf", e: EYE, m: MOUTH, g: "#333333", t: "#6b4a2b", T: "#4d3520", w: "#f4f4f4", a: "#b33939", p: "#3b3b42", b: "#2a2a2a" },
  },
  odvodova: {
    rows: build({
      0: "......kkkk......",
      1: "....kkhhhhkk....",
      5: "...kgegssgegk...",
      10: "..ktttwwwwtttk..",
      11: ".kttttwwwwttttk.",
    }),
    palette: { k: OUTLINE, h: "#a0522d", s: "#f1c7a1", e: EYE, m: MOUTH, g: "#333333", t: "#ee8a5e", T: "#bb5f38", w: "#f4f4f4", p: "#2a2a35", b: "#1e1e1e" },
  },
  vynosova: {
    rows: build({
      0: "......kkkk......",
      1: "....kkhhhhkk....",
      5: "...kgegssgegk...",
      10: "..ktttwwwwtttk..",
      11: ".kttttwwwwttttk.",
    }),
    palette: { k: OUTLINE, h: "#2b1d14", s: "#f1c7a1", e: EYE, m: MOUTH, g: "#333333", t: "#2a4a7a", T: "#1d3559", w: "#f4f4f4", p: "#2a2a35", b: "#1e1e1e" },
  },
};

/** Vodorovné úseky stejné barvy – méně obdélníků v SVG. */
export function spriteRuns(id: string, palette?: Record<string, string>): { x: number; y: number; w: number; fill: string }[] {
  const base = SPRITES[id];
  if (!base) return [];
  const sp = palette ? { rows: base.rows, palette: { ...base.palette, ...palette } } : base;
  const runs: { x: number; y: number; w: number; fill: string }[] = [];
  sp.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      const fill = sp.palette[ch];
      if (ch !== "." && fill) runs.push({ x, y, w, fill });
      x += w;
    }
  });
  return runs;
}
