import { useEffect, useRef } from 'react';
import type { Phase, Problem } from '../lib/types';
import { formatProblem } from '../lib/problems';
import './ProblemPanel.css';

interface ProblemPanelProps {
  problem: Problem;
  phase: Phase;
  userAnswer: string;
  feedback: 'correct' | 'wrong' | null;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  onReveal: () => void;
  onNext: () => void;
}

export function ProblemPanel({
  problem,
  phase,
  userAnswer,
  feedback,
  onAnswerChange,
  onCheck,
  onReveal,
  onNext,
}: ProblemPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase === 'asking') inputRef.current?.focus();
    else nextRef.current?.focus();
  }, [phase, problem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase === 'asking') onCheck();
    else onNext();
  }

  const inputClass = [
    'answer-input',
    feedback === 'wrong' ? 'answer-input--wrong' : '',
    feedback === 'correct' ? 'answer-input--correct' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form className="problem-panel" onSubmit={handleSubmit}>
      <div className="problem-equation" aria-live="polite">
        <span className="problem-operand">{problem.a}</span>
        <span className="problem-operator">
          {problem.operation === 'plus' ? '+' : problem.operation === 'minus' ? '−' : '×'}
        </span>
        <span className="problem-operand">{problem.b}</span>
        <span className="problem-equals">=</span>
        {phase === 'revealed' ? (
          <span className="problem-result">{problem.result}</span>
        ) : (
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            className={inputClass}
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="?"
            aria-label={`Ergebnis von ${formatProblem(problem, false)}`}
            min={0}
            max={100}
          />
        )}
      </div>

      <div className="problem-feedback" aria-live="polite">
        {feedback === 'correct' && phase === 'asking' && (
          <span className="feedback feedback--correct">Richtig! 🎉</span>
        )}
        {feedback === 'wrong' && phase === 'asking' && (
          <span className="feedback feedback--wrong">Noch nicht ganz — probier es noch mal.</span>
        )}
        {phase === 'revealed' && feedback === 'correct' && (
          <span className="feedback feedback--correct">Super, das war richtig!</span>
        )}
        {phase === 'revealed' && feedback !== 'correct' && (
          <span className="feedback feedback--neutral">Das Ergebnis ist {problem.result}.</span>
        )}
      </div>

      <div className="problem-actions">
        {phase === 'asking' ? (
          <>
            <button type="submit" className="action action--primary">
              Prüfen
            </button>
            <button type="button" className="action action--ghost" onClick={onReveal}>
              Lösung zeigen
            </button>
          </>
        ) : (
          <button
            ref={nextRef}
            type="submit"
            className="action action--primary"
          >
            Nächste Aufgabe →
          </button>
        )}
      </div>
    </form>
  );
}
