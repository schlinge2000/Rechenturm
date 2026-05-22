// Eine Farbe pro Einer-Position (1..10) innerhalb einer Etage.
// Idee: Wer +10 rechnet, landet auf derselben Farbe eine Etage höher.
export const STEP_COLORS: readonly string[] = [
  '#ef4444', // 1 — Rot
  '#f97316', // 2 — Orange
  '#f59e0b', // 3 — Bernstein
  '#eab308', // 4 — Gelb
  '#84cc16', // 5 — Limette
  '#22c55e', // 6 — Grün
  '#14b8a6', // 7 — Türkis
  '#0ea5e9', // 8 — Hellblau
  '#a855f7', // 9 — Lila
  '#ec4899', // 10 — Magenta
];

export function colorForNumber(n: number): string {
  // n von 1..100, Einer-Position bestimmt die Farbe
  const stepIndex = ((n - 1) % 10 + 10) % 10;
  return STEP_COLORS[stepIndex];
}
