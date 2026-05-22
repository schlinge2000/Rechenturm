export type Operation = 'plus' | 'minus' | 'mal';

export type Mode = Operation | 'gemischt';

export interface Problem {
  operation: Operation;
  a: number;
  b: number;
  result: number;
}

export type Phase = 'asking' | 'revealed';

export type CellState =
  | { kind: 'empty' }
  | { kind: 'base' }
  | { kind: 'added' }
  | { kind: 'removed' };
