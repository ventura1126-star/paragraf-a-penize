/**
 * Hudba hry: vlastní 8bitové smyčky generované ve Web Audio (žádné nahrávky, žádná cizí autorská díla).
 * Každý svět má svůj motiv: Město dluhů (funky chiptune v moll), Daňový ráj (kalypso s ocelovými bubny),
 * Planeta investic (synthwave arpeggia). Intro má krátkou znělku. Prohlížeč pustí zvuk až po prvním kliknutí.
 */
export type MusicTheme = "mesto" | "ostrov" | "planeta" | "menu";

type Step = number | null;
type Theme = {
  bpm: number;
  /** Akordy po taktech (MIDI tóny), 16 šestnáctin na takt. */
  chords: number[][];
  /** Basa: posun od základního tónu akordu (půltóny) pro každou šestnáctinu, null = pauza. */
  bass: Step[];
  bassWave: OscillatorType;
  /** Arpeggio: index tónu akordu, null = pauza. */
  arp?: Step[];
  arpWave?: OscillatorType;
  arpGain?: number;
  /** Melodie přes celou smyčku (MIDI tóny), null = pauza. */
  lead: Step[];
  leadWave: OscillatorType | "steel";
  leadGain: number;
  kick: string;
  snare: string;
  hat: string;
  /** Tichý držený akord v pozadí. */
  pad?: OscillatorType;
};

const _ = null;
const PULSE = (s: string) => s; // čitelnost bicích vzorů: x = úder, . = pauza

const THEMES: Record<MusicTheme, Theme> = {
  // Město dluhů: A moll, funky basa, ostrá melodie – trochu napětí na ulici
  mesto: {
    bpm: 104,
    chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
    bass: [0, _, 12, _, 0, _, 7, 0, _, 0, 12, _, 10, _, 7, _],
    bassWave: "square",
    lead: [
      76, _, 74, 72, _, 69, _, 72, 74, _, _, _, 72, _, 69, _,
      72, _, 69, 65, _, 69, _, 72, 69, _, _, _, _, _, _, _,
      67, _, 69, 72, _, 74, _, 76, 79, _, 76, _, 74, _, 72, _,
      74, _, _, 71, _, 74, _, 79, 76, _, _, _, _, _, _, _,
    ],
    leadWave: "square",
    leadGain: 0.05,
    kick: PULSE("x.....x...x....."),
    snare: PULSE("....x.......x..."),
    hat: PULSE("x.x.x.x.x.x.x.xx"),
  },
  // Daňový ráj: C dur, kalypso – ocelové bubny a houpavá basa
  ostrov: {
    bpm: 116,
    chords: [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]],
    bass: [0, _, _, 7, _, _, 12, _, 0, _, _, 7, _, 12, 7, _],
    bassWave: "triangle",
    arp: [0, _, 1, 2, _, 1, _, 2, 0, _, 1, 2, _, 1, 2, _],
    arpWave: "triangle",
    arpGain: 0.025,
    lead: [
      79, _, 76, _, 79, 81, _, 79, 76, _, 72, _, 74, _, 76, _,
      77, _, 81, _, 84, _, 81, 77, 76, _, _, 74, 72, _, _, _,
      74, _, 79, _, 83, _, 81, 79, 77, _, 76, _, 74, _, 71, _,
      72, _, 76, 79, _, 76, _, 72, 74, _, 72, _, _, _, _, _,
    ],
    leadWave: "steel",
    leadGain: 0.07,
    kick: PULSE("x..x....x..x...."),
    snare: PULSE("......x.......x."),
    hat: PULSE("x.xxx.xxx.xxx.xx"),
  },
  // Planeta investic: D moll, synthwave – běžící arpeggio a široký pad
  planeta: {
    bpm: 112,
    chords: [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67]],
    bass: [0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 12, 0],
    bassWave: "sawtooth",
    arp: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3],
    arpWave: "square",
    arpGain: 0.022,
    lead: [
      81, _, _, _, 79, _, 77, _, 76, _, _, _, 74, _, _, _,
      77, _, _, _, 76, _, 74, _, 72, _, _, _, 74, _, 77, _,
      81, _, _, _, 84, _, 81, _, 79, _, 77, _, 76, _, 77, _,
      79, _, _, _, 76, _, _, _, 72, _, _, _, _, _, _, _,
    ],
    leadWave: "sawtooth",
    leadGain: 0.035,
    kick: PULSE("x...x...x...x..."),
    snare: PULSE("....x.......x..."),
    hat: PULSE("..x...x...x...x."),
    pad: "sawtooth",
  },
  // Hlavní menu: klidnější verze městského motivu (bez melodie a s jemnými bicími)
  menu: {
    bpm: 92,
    chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
    bass: [0, _, _, _, 7, _, _, _, 12, _, _, _, 7, _, _, _],
    bassWave: "triangle",
    arp: [0, _, 1, _, 2, _, 1, _, 0, _, 1, _, 2, _, 1, _],
    arpWave: "triangle",
    arpGain: 0.03,
    lead: [],
    leadWave: "square",
    leadGain: 0,
    kick: PULSE("x.......x......."),
    snare: PULSE("................"),
    hat: PULSE("....x.......x..."),
  },
};

const PREF_KEY = "pp-music";
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

class Music {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private theme: MusicTheme | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;
  private listeners = new Set<() => void>();
  on = true;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this.on = window.localStorage.getItem(PREF_KEY) !== "off";
    } catch {
      // ignorovat
    }
    // prohlížeč povolí zvuk až po interakci uživatele
    const unlock = () => this.unlock();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) void this.ctx.suspend();
      else if (this.on) void this.ctx.resume();
    });
  }

  subscribe(l: () => void) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private unlock() {
    if (this.ctx) {
      if (this.on && this.ctx.state === "suspended" && !document.hidden) void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.on ? 0.9 : 0;
    this.master.connect(this.ctx.destination);
    // šum pro bicí
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    if (this.theme) this.start();
  }

  /** Přepne motiv (null = ticho). */
  setTheme(t: MusicTheme | null) {
    if (t === this.theme) return;
    this.theme = t;
    this.stopLoop();
    if (t && this.ctx) this.start();
  }

  toggle() {
    this.on = !this.on;
    try {
      window.localStorage.setItem(PREF_KEY, this.on ? "on" : "off");
    } catch {
      // ignorovat
    }
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.on ? 0.9 : 0, this.ctx.currentTime, 0.05);
    if (this.on) this.unlock();
    this.emit();
  }

  /** Krátká znělka (logo Ventura Games). */
  jingle() {
    if (!this.ctx || !this.on) return;
    const t0 = this.ctx.currentTime + 0.05;
    [64, 67, 71, 76, 79].forEach((n, i) => this.tone(midi(n), t0 + i * 0.11, 0.18, "square", 0.06));
    this.tone(midi(88), t0 + 0.6, 0.6, "triangle", 0.06);
    this.tone(midi(76), t0 + 0.6, 0.6, "square", 0.035);
  }

  private start() {
    if (!this.ctx || !this.theme) return;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 25);
  }

  private stopLoop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private schedule() {
    const ctx = this.ctx;
    const th = this.theme ? THEMES[this.theme] : null;
    if (!ctx || !th) return;
    const stepDur = 60 / th.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.15) {
      this.playStep(th, this.step, this.nextTime, stepDur);
      this.nextTime += stepDur;
      this.step++;
    }
  }

  private playStep(th: Theme, step: number, t: number, sd: number) {
    if (!this.on) return; // ztlumeno: smyčka běží dál, ale netvoří tóny
    const bar = Math.floor(step / 16) % th.chords.length;
    const s = step % 16;
    const chord = th.chords[bar];
    const root = chord[0] - 24;
    // basa
    const b = th.bass[s];
    if (b !== null && b !== undefined) this.tone(midi(root + b), t, sd * 0.9, th.bassWave, th.bassWave === "sawtooth" ? 0.045 : 0.07, 900);
    // arpeggio (4. tón = oktáva základu)
    const a = th.arp?.[s];
    if (a !== null && a !== undefined && th.arpWave) {
      const n = a === 3 ? chord[0] + 12 : chord[a % chord.length];
      this.tone(midi(n + 12), t, sd * 0.8, th.arpWave, th.arpGain ?? 0.03, th.arpWave === "square" ? 2400 : undefined);
    }
    // pad na začátku taktu
    if (th.pad && s === 0) for (const n of chord) this.tone(midi(n), t, sd * 15.5, th.pad, 0.012, 1200, 0.3);
    // melodie
    if (th.lead.length) {
      const l = th.lead[step % th.lead.length];
      if (l !== null && l !== undefined) {
        let len = 1;
        while (len < 4 && th.lead[(step + len) % th.lead.length] === null) len++;
        if (th.leadWave === "steel") this.steel(midi(l), t, sd * len, th.leadGain);
        else this.tone(midi(l), t, sd * len * 0.9, th.leadWave, th.leadGain, th.leadWave === "sawtooth" ? 2000 : undefined);
      }
    }
    // bicí
    if (th.kick[s] === "x") this.kick(t);
    if (th.snare[s] === "x") this.hit(t, 0.12, 1800, 0.08);
    if (th.hat[s] === "x") this.hit(t, 0.03, 7000, 0.03);
  }

  private tone(f: number, t: number, dur: number, wave: OscillatorType, gain: number, lowpass?: number, attack = 0.005) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = wave;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.setTargetAtTime(0, t + Math.max(attack, dur * 0.7), dur * 0.25 + 0.01);
    let node: AudioNode = o;
    if (lowpass) {
      const f2 = ctx.createBiquadFilter();
      f2.type = "lowpass";
      f2.frequency.value = lowpass;
      o.connect(f2);
      node = f2;
    }
    node.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + dur + 0.3);
  }

  /** Ocelový buben: základ + vyšší alikvoty s rychlým doznějí. */
  private steel(f: number, t: number, dur: number, gain: number) {
    const ctx = this.ctx!;
    for (const [mul, gmul] of [[1, 1], [2.01, 0.45], [3.98, 0.18]]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * mul;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain * gmul, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.9, dur + 0.35));
      o.connect(g).connect(this.master!);
      o.start(t);
      o.stop(t + 1);
    }
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + 0.2);
  }

  private hit(t: number, dur: number, hp: number, gain: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.master!);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  }
}

let instance: Music | null = null;
/** Jediný přehrávač hudby pro celou hru (jen v prohlížeči). */
export function music(): Music | null {
  if (typeof window === "undefined") return null;
  if (!instance) instance = new Music();
  return instance;
}
