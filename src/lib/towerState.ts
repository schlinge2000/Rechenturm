import type { CellState, ClickAction, NextRange, Problem } from './types';

export const TOWER_SIZE = 100;

function fill<T>(n: number, v: T): T[] {
  return Array.from({ length: n }, () => v);
}

// Wieviel Zellen pro "Schritt"? Für Mal ist das eine ganze Gruppe.
export function stepSize(p: Problem): number {
  return p.operation === 'mal' ? p.a : 1;
}

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

export function bounds(p: Problem): { min: number; max: number } {
  switch (p.operation) {
    case 'plus':
      return { min: p.a, max: TOWER_SIZE };
    case 'minus':
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

  // mal — abwechselnde Gruppen, damit jeder gleiche Block sichtbar wird
  for (let i = 0; i < currentCount && i < TOWER_SIZE; i++) {
    const groupIndex = Math.floor(i / Math.max(p.a, 1));
    cells[i] = groupIndex % 2 === 0 ? { kind: 'base' } : { kind: 'added' };
  }
  return cells;
}

export function clickAction(
  p: Problem,
  currentCount: number,
  n: number,
): ClickAction | null {
  const { min, max } = bounds(p);
  const step = stepSize(p);

  if (p.operation === 'minus') {
    if (n === currentCount && currentCount > min) return 'remove';
    if (n === currentCount + 1 && currentCount < max) return 'add';
    return null;
  }

  if (p.operation === 'mal') {
    // Klick irgendwo in die nächste Gruppe → die ganze Gruppe legen.
    if (
      n >= currentCount + 1 &&
      n <= currentCount + step &&
      currentCount + step <= max
    ) {
      return 'add';
    }
    // Klick auf einen Stein in der zuletzt gelegten Gruppe → wegnehmen.
    if (n >= currentCount - step + 1 && n <= currentCount && currentCount > min) {
      return 'remove';
    }
    return null;
  }

  // plus
  if (n === currentCount + 1 && currentCount < max) return 'add';
  if (n === currentCount && currentCount > min) return 'remove';
  return null;
}

export function nextRange(p: Problem, currentCount: number): NextRange | null {
  const { min, max } = bounds(p);
  const step = stepSize(p);

  if (p.operation === 'minus') {
    if (currentCount > min) {
      return { from: currentCount, to: currentCount, action: 'remove' };
    }
    return null;
  }

  if (p.operation === 'mal') {
    if (currentCount + step <= max) {
      return {
        from: currentCount + 1,
        to: currentCount + step,
        action: 'add',
      };
    }
    return null;
  }

  // plus
  if (currentCount < max) {
    return { from: currentCount + 1, to: currentCount + 1, action: 'add' };
  }
  return null;
}
