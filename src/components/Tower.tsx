import { colorForNumber } from '../lib/colors';
import type { CellState, ClickAction, NextRange } from '../lib/types';
import './Tower.css';

interface TowerProps {
  cells: CellState[];
  nextRange: NextRange | null;
  groupSize?: number; // optische Gruppengrenzen für Mal
  staircase: boolean;
  onCellClick: (n: number) => void;
  getAction: (n: number) => ClickAction | null;
  disabled?: boolean;
}

export function Tower({
  cells,
  nextRange,
  groupSize,
  staircase,
  onCellClick,
  getAction,
  disabled,
}: TowerProps) {
  const floors: number[] = [];
  for (let f = 9; f >= 0; f--) floors.push(f);

  const towerClass = ['tower', staircase ? 'tower--staircase' : ''].filter(Boolean).join(' ');

  return (
    <div className={towerClass} aria-label="Rechenturm mit 10 Etagen à 10 Stufen">
      <div className="tower-roof" aria-hidden>
        <div className="tower-roof-peak" />
        <div className="tower-roof-base" />
      </div>
      <div className="tower-body">
        <div className="tower-pillar tower-pillar--left" aria-hidden />
        <div className="tower-floors">
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
                  const inNext =
                    nextRange !== null &&
                    number >= nextRange.from &&
                    number <= nextRange.to;
                  const groupBoundary =
                    groupSize &&
                    groupSize > 0 &&
                    step > 0 &&
                    (number - 1) % groupSize === 0;
                  return (
                    <Cell
                      key={number}
                      number={number}
                      step={step}
                      state={cell}
                      isNext={inNext}
                      nextAction={inNext && nextRange ? nextRange.action : null}
                      action={action}
                      isGroupBoundary={Boolean(groupBoundary)}
                      onClick={() => action && onCellClick(number)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="tower-pillar tower-pillar--right" aria-hidden />
      </div>
      <div className="tower-ground" aria-hidden>
        <div className="tower-ground-grass" />
      </div>
    </div>
  );
}

interface CellProps {
  number: number;
  step: number;
  state: CellState;
  isNext: boolean;
  nextAction: ClickAction | null;
  action: ClickAction | null;
  isGroupBoundary: boolean;
  onClick: () => void;
}

function Cell({
  number,
  step,
  state,
  isNext,
  nextAction,
  action,
  isGroupBoundary,
  onClick,
}: CellProps) {
  const color = colorForNumber(number);
  const className = [
    'tower-cell',
    `tower-cell--${state.kind}`,
    isNext ? `tower-cell--next-${nextAction ?? 'none'}` : '',
    action ? 'tower-cell--clickable' : '',
    isGroupBoundary ? 'tower-cell--group-boundary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    // Treppen-Versatz: jede Stufe innerhalb der Etage einen Tick höher
    ['--step' as never]: step,
  };
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
