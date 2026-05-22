import { colorForNumber } from '../lib/colors';
import type { CellState, ClickAction } from '../lib/types';
import './Tower.css';

interface TowerProps {
  cells: CellState[];
  nextCell: number | null;
  groupSize?: number; // für Mal-Modus optische Gruppengrenzen
  onCellClick: (n: number) => void;
  getAction: (n: number) => ClickAction | null;
  disabled?: boolean;
}

export function Tower({
  cells,
  nextCell,
  groupSize,
  onCellClick,
  getAction,
  disabled,
}: TowerProps) {
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
              const action = disabled ? null : getAction(number);
              const groupBoundary =
                groupSize && groupSize > 0 && number > 1 && (number - 1) % groupSize === 0;
              return (
                <Cell
                  key={number}
                  number={number}
                  state={cell}
                  isNext={number === nextCell}
                  action={action}
                  isGroupBoundary={Boolean(groupBoundary)}
                  onClick={() => action && onCellClick(number)}
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
  isNext: boolean;
  action: ClickAction | null;
  isGroupBoundary: boolean;
  onClick: () => void;
}

function Cell({ number, state, isNext, action, isGroupBoundary, onClick }: CellProps) {
  const color = colorForNumber(number);
  const className = [
    'tower-cell',
    `tower-cell--${state.kind}`,
    isNext ? `tower-cell--next-${action ?? 'none'}` : '',
    action ? 'tower-cell--clickable' : '',
    isGroupBoundary ? 'tower-cell--group-boundary' : '',
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
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      disabled={!action}
      aria-label={`Stufe ${number}`}
      tabIndex={action ? 0 : -1}
    >
      <span className="tower-cell-num">{number}</span>
    </button>
  );
}
