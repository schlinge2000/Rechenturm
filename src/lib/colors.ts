// Zwei Farb-Modelle:
// 1) Etagen-Farbe (für Plus/Minus): pro Zehner-Etage eine Hue,
//    innerhalb der Etage geht es von hell (Einer 1) bis kräftig (Einer 10).
//    → "ich bin im blauen Stockwerk, hell hinten links, kräftig vorne rechts"
// 2) Block-Farbe (für Mal): jeder Block (Gruppe à a Steine) bekommt
//    eine eigene Hue → die Blöcke sind klar voneinander unterscheidbar.

export const DECADE_COLORS: readonly string[] = [
  '#ef4444', // 1–10   Rot
  '#f97316', // 11–20  Orange
  '#eab308', // 21–30  Gold
  '#22c55e', // 31–40  Grün
  '#14b8a6', // 41–50  Türkis
  '#3b82f6', // 51–60  Blau
  '#6366f1', // 61–70  Indigo
  '#a855f7', // 71–80  Lila
  '#ec4899', // 81–90  Pink
  '#78716c', // 91–100 Steingrau
];

export const BLOCK_COLORS: readonly string[] = [
  '#ef4444', // Rot
  '#f97316', // Orange
  '#eab308', // Gold
  '#22c55e', // Grün
  '#14b8a6', // Türkis
  '#3b82f6', // Blau
  '#a855f7', // Lila
  '#ec4899', // Pink
  '#0ea5e9', // Sky
  '#78716c', // Stein
];

export interface CellColor {
  bg: string;
  fg: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function rgbToHex(r: number, g: number, b: number): string {
  const hex = (v: number) => clamp255(v).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// 0 = unverändert, 1 = vollständig Weiß
function mixWithWhite(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * factor,
    g + (255 - g) * factor,
    b + (255 - b) * factor,
  );
}

function textColorForHex(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // Wahrgenommene Helligkeit (Rec. 601)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 155 ? '#1e293b' : '#ffffff';
}

// Helle Variante (für Legenden-Vorschau einer Schattierung)
export function shadeForStep(hex: string, step: number): string {
  // step 0..9: 0 = hellste Schattierung (54% weiß), 9 = volle Farbe
  const factor = ((9 - step) * 0.06);
  return mixWithWhite(hex, factor);
}

export function colorForDecade(n: number): CellColor {
  const floor = Math.floor((n - 1) / 10);
  const step = (n - 1) % 10;
  const base = DECADE_COLORS[floor] ?? DECADE_COLORS[DECADE_COLORS.length - 1];
  const bg = shadeForStep(base, step);
  return { bg, fg: textColorForHex(bg) };
}

export function colorForBlock(n: number, groupSize: number): CellColor {
  const blockIndex = Math.floor((n - 1) / Math.max(groupSize, 1));
  const bg = BLOCK_COLORS[blockIndex % BLOCK_COLORS.length];
  return { bg, fg: textColorForHex(bg) };
}
