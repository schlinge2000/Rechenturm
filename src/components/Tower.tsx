import type { CellColor } from '../lib/colors';
import type { CellState, ClickAction, NextRange } from '../lib/types';
import './Tower.css';

interface TowerProps {
  cells: CellState[];
  cursorRange: NextRange | null;
  targetRange: NextRange | null;
  groupSize?: number;
  staircase: boolean;
  colorFor: (n: number) => CellColor;
  onCellClick: (n: number) => void;
  getAction: (n: number) => ClickAction | null;
  disabled?: boolean;
}

function inRange(n: number, r: NextRange | null): boolean {
  return r !== null && n >= r.from && n <= r.to;
}

export function Tower({
  cells,
  cursorRange,
  targetRange,
  groupSize,
  staircase,
  colorFor,
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
                  const isCursor = inRange(number, cursorRange);
                  const isTarget = !isCursor && inRange(number, targetRange);
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
                      color={colorFor(number)}
                      isCursor={isCursor}
                      cursorAction={isCursor && cursorRange ? cursorRange.action : null}
                      isTarget={isTarget}
                      targetAction={isTarget && targetRange ? targetRange.action : null}
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
  color: CellColor;
  isCursor: boolean;
  cursorAction: ClickAction | null;
  isTarget: boolean;
  targetAction: ClickAction | null;
  action: ClickAction | null;
  isGroupBoundary: boolean;
  onClick: () => void;
}

function Cell({
  number,
  step,
  state,
  color,
  isCursor,
  cursorAction,
  isTarget,
  targetAction,
  action,
  isGroupBoundary,
  onClick,
}: CellProps) {
  const className = [
    'tower-cell',
    `tower-cell--${state.kind}`,
    isCursor ? `tower-cell--cursor-${cursorAction ?? 'add'}` : '',
    isTarget ? `tower-cell--target-${targetAction ?? 'add'}` : '',
    action ? 'tower-cell--clickable' : '',
    isGroupBoundary ? 'tower-cell--group-boundary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    ['--step' as never]: step,
  };
  if (state.kind === 'base' || state.kind === 'added') {
    style.backgroundColor = color.bg;
    style.color = color.fg;
  } else if (state.kind === 'removed') {
    style.borderColor = color.bg;
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
