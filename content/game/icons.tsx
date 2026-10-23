import type { JSX } from "react";
import type { LawId } from "@/content/laws";

/** Symboly karet – jednoduché tahové ikony 24 × 24 (barva z `currentColor`). */
export const ICONS: Record<string, JSX.Element> = {
  hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 10 6 10 9s-10 4-10 9M17 3c0 5-10 6-10 9s10 4 10 9" />,
  gavel: <path d="M14 3l7 7M11 6l7 7M12.5 4.5l-7 7 4 4 7-7M7.5 13.5L2 19l2 2 5.5-5.5M11 21h10" />,
  sign: <path d="M6 2h9l4 4v16H6zM15 2v4h4M9 10h7M9 14h4M8.5 19c1.5-2 2.5 1 4-.5s2 1 3.5 0" />,
  envelope: <path d="M3 6h18v12H3zM3 6l9 7 9-7" />,
  calendar: <path d="M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h3v3H8z" />,
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4M5 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" />
    </>
  ),
  bank: <path d="M3 9l9-5 9 5zM5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  percent: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M19 5L5 19" />
    </>
  ),
  phone: <path d="M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 19h2" />,
  package: <path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M7.5 5l9 4" />,
  wrench: <path d="M15 3a5 5 0 0 0-4.6 6.9L3 17.3 6.7 21l7.4-7.4A5 5 0 0 0 21 9l-3.2 1.6-3.2-3.2z" />,
  door: <path d="M6 21V3h11v18M4 21h16M14 12h.5M19 7c1 1 1 3 0 4M21 5c2 2 2 6 0 8" />,
  bus: <path d="M5 3h14a1 1 0 0 1 1 1v13H4V4a1 1 0 0 1 1-1zM4 10h16M7 20v-3M17 20v-3M7.5 13.5h1M15.5 13.5h1" />,
  chart: <path d="M3 21h18M6 17l4-5 3 3 6-8M19 7v4M19 7h-4" />,
  card: <path d="M3 6h18v12H3zM3 10h18M6 15h5" />,
  lock: <path d="M6 11h12v10H6zM9 11V7a3 3 0 0 1 6 0v4M12 15v2" />,
  family: (
    <>
      <circle cx="8" cy="6" r="2.5" />
      <circle cx="17" cy="10" r="2" />
      <path d="M4 21v-5a4 4 0 0 1 8 0v5M14 21v-3a3 3 0 0 1 6 0v3" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path d="M8 6l1-3 1 3M14 6l1-3 1 3" />
    </>
  ),
  house: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5" />,
  receipt: <path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h3" />,
  stamp: <path d="M9 3h6v5l2 3H7l2-3zM5 14h14v3H5zM5 21h14" />,
  scale: <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6c0 1.5 6 1.5 6 0zM19 7l-3 6c0 1.5 6 1.5 6 0z" />,
  chain: <path d="M9 15l-2 2a3 3 0 0 1-4.2-4.2l3-3a3 3 0 0 1 4.2 0M15 9l2-2a3 3 0 0 1 4.2 4.2l-3 3a3 3 0 0 1-4.2 0M8 2v3M2 8h3M16 22v-3M22 16h-3" />,
  warning: <path d="M12 3l10 18H2zM12 9v5M12 17.5v.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  no: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </>
  ),
  down: <path d="M3 6l6 6 4-4 8 8M21 10v6h-6" />,
  refund: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4M12 8v8M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6c0 2-5 1-5 3 0 1 1 1.6 2.5 1.6s2.5-.5 2.5-1.5" />,
};

export const CARD_ICON: Record<string, keyof typeof ICONS> = {
  "oz-610-1": "hourglass",
  "oz-639": "sign",
  "oz-640": "gavel",
  "er-46-6": "clock",
  "er-55-1": "shield",
  "osr-279-1": "coins",
  "osr-279-2": "family",
  "nv595-1-1": "shield",
  "osr-304b-1": "bank",
  "iz-412-1": "sign",
  "iz-3-1": "down",
  "iz-390a-1": "stamp",
  "iz-412a-1": "calendar",
  "iz-416-1": "warning",
  "osr-57-2": "calendar",
  "osr-49-4": "envelope",
  "zsu-3-2": "percent",
  "zsu-118-1": "refund",
  "zsu-118-4": "coins",
  "zek-63b-8": "phone",
  "oz-1829-2": "package",
  "zsu-119-1": "chain",
  "zsu-87-1": "no",
  "zsu-122-2": "percent",
  "zsu-112-1": "no",
  "zek-63b-1": "calendar",
  "er-37-4": "family",
  "zfa-1-1": "scale",
  "oz-1828-2": "bus",
  "znv-3": "family",
  "znv-4-1": "coins",
  "oz-2161-5": "wrench",
  "zos-19-3": "clock",
  "zsu-122-4": "clock",
  "oz-1829-1": "door",
  "zos-20b-1": "no",
  "zpkt-130-9": "shield",
  "osr-299-1": "coins",
  "oz-2018-2": "sign",
  "oz-2021-1": "envelope",
  "oz-2023-1": "shield",
  "dr-136-2": "calendar",
  "dr-251-4": "receipt",
  "oz-629-1": "hourglass",
  "oz-1970": "percent",
  "iz-389-2": "chain",
  "zsu-117-3": "house",
  "oz-710": "rings",
  "oz-731": "rings",
  "oz-732": "no",
  "oz-741": "hourglass",
  "zfa-10-1": "envelope",
  "zfa-18-1": "scale",
  "zfa-17a": "gavel",
  "zps-165": "lock",
  "zps-182-1": "card",
  "zps-181-1": "refund",
  "oz-923-1": "family",
  "oz-923-2": "family",
  "dr-250-3": "receipt",
  "dr-250-1": "clock",
};

/** Barva karty podle zákona (vlastní paleta sběratelských karet). */
export const LAW_COLOR: Record<LawId, [string, string]> = {
  oz: ["#7d4fb3", "#b48be6"],
  osr: ["#2f6db3", "#7fb0ea"],
  er: ["#b33939", "#ec8a8a"],
  iz: ["#2f8f5a", "#7fd3a2"],
  zsu: ["#c2721e", "#f2b36b"],
  zdp: ["#1f8a8a", "#73d1d1"],
  dr: ["#1f8a8a", "#73d1d1"],
  zpkt: ["#2a4a7a", "#7f9ccc"],
  zdps: ["#2a4a7a", "#7f9ccc"],
  zob: ["#2a4a7a", "#7f9ccc"],
  zfa: ["#6b7a2a", "#bccb76"],
  zos: ["#b3407a", "#eb93c0"],
  nv595: ["#5d6470", "#aab1bd"],
  zek: ["#5a3db3", "#a592ea"],
  znv: ["#b34d63", "#ec9aab"],
  zps: ["#3a46a8", "#8f99e6"],
};

export function CardIcon({ id, size = 40 }: { id: string; size?: number }) {
  const icon = ICONS[CARD_ICON[id] ?? "scale"];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icon}
    </svg>
  );
}
