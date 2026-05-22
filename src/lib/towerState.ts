import type { CellState, Phase, Problem } from './types';

export const TOWER_SIZE = 100;

function fill<T>(n: number, v: T): T[] {
  return Array.from({ length: n }, () => v);
}

export function computeCellStates(p: Problem, phase: Phase): CellState[] {
  const cells: CellState[] = fill(TOWER_SIZE, { kind: 'empty' });

  if (p.operation === 'plus') {
    for (let i = 0; i < p.a; i++) cells[i] = { kind: 'base' };
    if (phase === 'revealed') {
      for (let i = p.a; i < p.result; i++) cells[i] = { kind: 'added' };
    }
    return cells;
  }

  if (p.operation === 'minus') {
    if (phase === 'asking') {
      for (let i = 0; i < p.a; i++) cells[i] = { kind: 'base' };
    } else {
      for (let i = 0; i < p.result; i++) cells[i] = { kind: 'base' };
      for (let i = p.result; i < p.a; i++) cells[i] = { kind: 'removed' };
    }
    return cells;
  }

  // mal: a × b — als b Gruppen à a Stück, abwechselnd eingefärbt
  if (phase === 'asking') {
    for (let i = 0; i < p.a; i++) cells[i] = { kind: 'base' };
  } else {
    for (let g = 0; g < p.b; g++) {
      const start = g * p.a;
      const end = start + p.a;
      const kind: CellState['kind'] = g % 2 === 0 ? 'base' : 'added';
      for (let i = start; i < end && i < TOWER_SIZE; i++) {
        cells[i] = { kind };
      }
    }
  }
  return cells;
}
