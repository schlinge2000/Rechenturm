import { colorForNumber } from '../lib/colors';
import type { CellState } from '../lib/types';
import { TOWER_SIZE } from '../lib/towerState';
import './Tower.css';

interface TowerProps {
  cells: CellState[];
  highlightTop: number | null;
}

export function Tower({ cells, highlightTop }: TowerProps) {
  // Etagen von oben (9) nach unten (0) rendern, damit Etage 0 visuell unten liegt.
  const floors: number[] = [];
  for (let f = 9; f >= 0; f--) floors.push(f);

  return (
    <div className="tower" aria-label="Rechenturm mit 10 Etagen à 10 Stufen">
      {floors.map((floor) => (
        <div className="tower-floor" key={floor}>
          <div className="tower-floor-label" aria-hidden>
            {floor * 10 + 1}–{floor * 10 + 10}
          </div>
          <div className="tower-floor-cells">
            {Array.from({ length: 10 }, (_, step) => {
              const number = floor * 10 + step + 1;
              const cell = cells[number - 1] ?? { kind: 'empty' };
              return (
                <Cell
                  key={number}
                  number={number}
                  state={cell}
                  isHighlight={number === highlightTop}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="tower-ground" aria-hidden />
    </div>
  );
}

interface CellProps {
  number: number;
  state: CellState;
  isHighlight: boolean;
}

function Cell({ number, state, isHighlight }: CellProps) {
  const color = colorForNumber(number);
  const className = [
    'tower-cell',
    `tower-cell--${state.kind}`,
    isHighlight ? 'tower-cell--highlight' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {};
  if (state.kind === 'base' || state.kind === 'added') {
    style.backgroundColor = color;
  } else if (state.kind === 'removed') {
    style.borderColor = color;
  }

  return (
    <div className={className} style={style} title={String(number)}>
      <span className="tower-cell-num">{number}</span>
    </div>
  );
}

// kleiner sanity-check, falls jemand TOWER_SIZE manipuliert
if (TOWER_SIZE !== 100 && typeof console !== 'undefined') {
  console.warn('Tower erwartet TOWER_SIZE === 100');
}
