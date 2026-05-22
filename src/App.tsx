import { useEffect, useMemo, useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { Tower } from './components/Tower';
import { ProblemPanel } from './components/ProblemPanel';
import { Legend } from './components/Legend';
import { generateProblem } from './lib/problems';
import {
  bounds,
  clickAction,
  computeCellStates,
  initialCount,
  nextActionCell,
} from './lib/towerState';
import type { Mode } from './lib/types';
import './App.css';

interface Stats {
  correct: number;
  total: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export default function App() {
  const [mode, setMode] = useState<Mode>('plus');
  const [problem, setProblem] = useState(() => generateProblem('plus'));
  const [currentCount, setCurrentCount] = useState(() => initialCount(problem));
  const [solved, setSolved] = useState(false);
  const [stats, setStats] = useState<Stats>({ correct: 0, total: 0 });

  const { min, max } = useMemo(() => bounds(problem), [problem]);
  const cells = useMemo(
    () => computeCellStates(problem, currentCount),
    [problem, currentCount],
  );
  const nextCell = useMemo(
    () => (solved ? null : nextActionCell(problem, currentCount)),
    [problem, currentCount, solved],
  );

  useEffect(() => {
    if (!solved && currentCount === problem.result) {
      setSolved(true);
      setStats((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    }
  }, [currentCount, problem.result, solved]);

  function loadProblem(next: ReturnType<typeof generateProblem>) {
    setProblem(next);
    setCurrentCount(initialCount(next));
    setSolved(false);
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    loadProblem(generateProblem(next));
  }

  function handleNext() {
    loadProblem(generateProblem(mode));
  }

  function handleReveal() {
    setCurrentCount(problem.result);
    setStats((s) => ({ ...s, total: s.total + 1 }));
    // solved wird durch den useEffect oben gesetzt
  }

  function handleStep(delta: number) {
    if (solved) return;
    setCurrentCount((c) => clamp(c + delta, min, max));
  }

  function handleCellClick(n: number) {
    if (solved) return;
    const action = clickAction(problem, currentCount, n);
    if (action === 'add') setCurrentCount((c) => clamp(c + 1, min, max));
    if (action === 'remove') setCurrentCount((c) => clamp(c - 1, min, max));
  }

  function getAction(n: number) {
    if (solved) return null;
    return clickAction(problem, currentCount, n);
  }

  const canIncrease = !solved && currentCount < max;
  const canDecrease = !solved && currentCount > min;
  const groupSize = problem.operation === 'mal' ? problem.a : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rechenturm</h1>
        <p className="app-subtitle">Mathe zum Anschauen — eine Etage, zehn Stufen.</p>
      </header>

      <section className="app-controls">
        <ModeSelector mode={mode} onChange={handleModeChange} />
        <div className="app-stats" aria-label="Statistik">
          <span className="app-stats-value">{stats.correct}</span>
          <span className="app-stats-sep">/</span>
          <span className="app-stats-value">{stats.total}</span>
          <span className="app-stats-label">richtig</span>
        </div>
      </section>

      <main className="app-main">
        <div className="app-tower-col">
          <Tower
            cells={cells}
            nextCell={nextCell}
            groupSize={groupSize}
            onCellClick={handleCellClick}
            getAction={getAction}
            disabled={solved}
          />
        </div>
        <aside className="app-side-col">
          <ProblemPanel
            problem={problem}
            currentCount={currentCount}
            solved={solved}
            onStep={handleStep}
            onReveal={handleReveal}
            onNext={handleNext}
            canIncrease={canIncrease}
            canDecrease={canDecrease}
          />
          <Legend />
        </aside>
      </main>

      <footer className="app-footer">
        Tipp: +10 = eine Etage höher, gleiche Farbe! Probier den +10-Button.
      </footer>
    </div>
  );
}
