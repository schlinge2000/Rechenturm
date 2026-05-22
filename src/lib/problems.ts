import type { Mode, Operation, Problem } from './types';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlus(): Problem {
  // a, b > 0, a + b <= 100
  const a = randInt(1, 90);
  const b = randInt(1, 100 - a);
  return { operation: 'plus', a, b, result: a + b };
}

function generateMinus(): Problem {
  // a > b > 0, a <= 100
  const a = randInt(2, 100);
  const b = randInt(1, a - 1);
  return { operation: 'minus', a, b, result: a - b };
}

function generateMal(): Problem {
  // Kleines Einmaleins, Ergebnis <= 100
  while (true) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    if (a * b <= 100) {
      return { operation: 'mal', a, b, result: a * b };
    }
  }
}

export function generateProblem(mode: Mode): Problem {
  const op: Operation =
    mode === 'gemischt' ? pick(['plus', 'minus', 'mal'] as const) : mode;
  switch (op) {
    case 'plus':
      return generatePlus();
    case 'minus':
      return generateMinus();
    case 'mal':
      return generateMal();
  }
}

export function formatProblem(p: Problem, showResult: boolean): string {
  const sign = p.operation === 'plus' ? '+' : p.operation === 'minus' ? '−' : '×';
  const rhs = showResult ? String(p.result) : '?';
  return `${p.a} ${sign} ${p.b} = ${rhs}`;
}
