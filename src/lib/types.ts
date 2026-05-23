export type Operation = 'plus' | 'minus' | 'mal';

export type Mode = Operation | 'gemischt';

export interface Problem {
  operation: Operation;
  a: number;
  b: number;
  result: number;
}

export type CellState =
  | { kind: 'empty' }
  | { kind: 'base' }
  | { kind: 'added' }
  | { kind: 'removed' };

export type ClickAction = 'add' | 'remove';

// Range von Zellen, die als nächstes geklickt werden können.
// from/to sind 1-basierte Zellnummern, beide inklusiv.
export interface NextRange {
  from: number;
  to: number;
  action: ClickAction;
}
