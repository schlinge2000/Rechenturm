import type { CellState, ClickAction, Problem } from './types';

export const TOWER_SIZE = 100;

function fill<T>(n: number, v: T): T[] {
  return Array.from({ length: n }, () => v);
}

// Wo das Kind startet (welche Zellen bereits gefüllt sind).
export function initialCount(p: Problem): number {
  switch (p.operation) {
    case 'plus':
      return p.a;
    case 'minus':
      return p.a;
    case 'mal':
      return 0;
  }
}

// Grenzen, innerhalb derer currentCount sich bewegen darf.
export function bounds(p: Problem): { min: number; max: number } {
  switch (p.operation) {
    case 'plus':
      // Basis (a) darf nicht abgebaut werden, oben Deckel bei 100
      return { min: p.a, max: TOWER_SIZE };
    case 'minus':
      // Startwert a ist Maximum, runter bis 0
      return { min: 0, max: p.a };
    case 'mal':
      return { min: 0, max: TOWER_SIZE };
  }
}

export function computeCellStates(p: Problem, currentCount: number): CellState[] {
  const cells: CellState[] = fill(TOWER_SIZE, { kind: 'empty' });

  if (p.operation === 'plus') {
    for (let i = 0; i < p.a; i++) cells[i] = { kind: 'base' };
    for (let i = p.a; i < currentCount && i < TOWER_SIZE; i++) {
      cells[i] = { kind: 'added' };
    }
    return cells;
  }

  if (p.operation === 'minus') {
    const remaining = Math.min(Math.max(currentCount, 0), p.a);
    for (let i = 0; i < remaining; i++) cells[i] = { kind: 'base' };
    for (let i = remaining; i < p.a; i++) cells[i] = { kind: 'removed' };
    return cells;
  }

  // mal — abwechselnde Gruppen-Farben, damit Wiederholungen sichtbar sind
  for (let i = 0; i < currentCount && i < TOWER_SIZE; i++) {
    const groupIndex = Math.floor(i / Math.max(p.a, 1));
    cells[i] = groupIndex % 2 === 0 ? { kind: 'base' } : { kind: 'added' };
  }
  return cells;
}

// Welche Aktion löst ein Klick auf Zelle n aus (n ist 1-basiert)?
export function clickAction(
  p: Problem,
  currentCount: number,
  n: number,
): ClickAction | null {
  const { min, max } = bounds(p);

  if (p.operation === 'minus') {
    // Topmost-vorhandene Zelle abräumen, oder die direkt darüber liegende
    // (zuletzt entfernte) wieder zurücklegen.
    if (n === currentCount && currentCount > min) return 'remove';
    if (n === currentCount + 1 && currentCount < max) return 'add';
    return null;
  }

  // plus & mal — nächste leere Zelle füllen, oder Topmost zurücknehmen.
  if (n === currentCount + 1 && currentCount < max) return 'add';
  if (n === currentCount && currentCount > min) return 'remove';
  return null;
}

// Welche Zelle ist die "primäre" Aktion (was leuchtet als Hinweis)?
export function nextActionCell(p: Problem, currentCount: number): number | null {
  const { min, max } = bounds(p);
  if (p.operation === 'minus') {
    return currentCount > min ? currentCount : null;
  }
  return currentCount < max ? currentCount + 1 : null;
}
