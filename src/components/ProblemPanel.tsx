import { useEffect, useRef } from 'react';
import type { Problem } from '../lib/types';
import './ProblemPanel.css';

interface ProblemPanelProps {
  problem: Problem;
  currentCount: number;
  solved: boolean;
  onStep: (delta: number) => void;
  onReveal: () => void;
  onNext: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

export function ProblemPanel({
  problem,
  currentCount,
  solved,
  onStep,
  onReveal,
  onNext,
  canIncrease,
  canDecrease,
}: ProblemPanelProps) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (solved) nextRef.current?.focus();
  }, [solved]);

  const symbol =
    problem.operation === 'plus' ? '+' : problem.operation === 'minus' ? '−' : '×';

  return (
    <div className="problem-panel">
      <div className="problem-equation" aria-live="polite">
        <span className="problem-operand">{problem.a}</span>
        <span className="problem-operator">{symbol}</span>
        <span className="problem-operand">{problem.b}</span>
        <span className="problem-equals">=</span>
        <span className={`problem-result ${solved ? 'problem-result--shown' : ''}`}>
          {solved ? problem.result : '?'}
        </span>
      </div>

      <div className="counter" aria-live="polite">
        <span className="counter-label">Du bist bei</span>
        <span className={`counter-value ${solved ? 'counter-value--solved' : ''}`}>
          {currentCount}
        </span>
      </div>

      {renderStepButtons(problem, onStep, canIncrease, canDecrease)}

      <p className="hint">
        {problem.operation === 'plus' && (
          <>Tippe auf die nächste leuchtende Stufe — leg <strong>{problem.b}</strong> Steine drauf.</>
        )}
        {problem.operation === 'minus' && (
          <>Tippe auf den obersten Stein — nimm <strong>{problem.b}</strong> Steine weg.</>
        )}
        {problem.operation === 'mal' && (
          <>Stapele <strong>{problem.b}</strong> Blöcke à <strong>{problem.a}</strong> Steinen — ein Tipp = ein Block.</>
        )}
      </p>

      <div className="problem-feedback" aria-live="polite">
        {solved && <span className="feedback feedback--correct">Richtig! 🎉</span>}
      </div>

      <div className="problem-actions">
        {solved ? (
          <button
            ref={nextRef}
            type="button"
            className="action action--primary"
            onClick={onNext}
          >
            Nächste Aufgabe →
          </button>
        ) : (
          <button type="button" className="action action--ghost" onClick={onReveal}>
            Lösung zeigen
          </button>
        )}
      </div>
    </div>
  );
}

function renderStepButtons(
  problem: Problem,
  onStep: (delta: number) => void,
  canIncrease: boolean,
  canDecrease: boolean,
) {
  const isMinus = problem.operation === 'minus';
  const isMal = problem.operation === 'mal';

  if (isMal) {
    const step = problem.a;
    return (
      <div className="step-buttons step-buttons--two" role="group" aria-label="Block-Buttons">
        <button
          type="button"
          className="step step--undo"
          onClick={() => onStep(-step)}
          disabled={!canDecrease}
        >
          − Block
        </button>
        <button
          type="button"
          className="step step--primary"
          onClick={() => onStep(step)}
          disabled={!canIncrease}
        >
          + Block
        </button>
      </div>
    );
  }

  // Plus / Minus — vier Buttons, primär ist die Vorwärts-Richtung
  const primarySign = isMinus ? -1 : 1;
  const primaryLabel = isMinus ? '−' : '+';
  const undoSign = isMinus ? 1 : -1;
  const undoLabel = isMinus ? '+' : '−';
  const forwardEnabled = isMinus ? canDecrease : canIncrease;
  const undoEnabled = isMinus ? canIncrease : canDecrease;

  return (
    <div className="step-buttons" role="group" aria-label="Schritt-Buttons">
      <button
        type="button"
        className="step step--undo"
        onClick={() => onStep(undoSign * 10)}
        disabled={!undoEnabled}
      >
        {undoLabel}10
      </button>
      <button
        type="button"
        className="step step--undo"
        onClick={() => onStep(undoSign * 1)}
        disabled={!undoEnabled}
      >
        {undoLabel}1
      </button>
      <button
        type="button"
        className="step step--primary"
        onClick={() => onStep(primarySign * 1)}
        disabled={!forwardEnabled}
      >
        {primaryLabel}1
      </button>
      <button
        type="button"
        className="step step--primary"
        onClick={() => onStep(primarySign * 10)}
        disabled={!forwardEnabled}
      >
        {primaryLabel}10
      </button>
    </div>
  );
}
