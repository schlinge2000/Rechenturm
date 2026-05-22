import { useMemo, useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { Tower } from './components/Tower';
import { ProblemPanel } from './components/ProblemPanel';
import { Legend } from './components/Legend';
import { generateProblem } from './lib/problems';
import { computeCellStates } from './lib/towerState';
import type { Mode, Phase } from './lib/types';
import './App.css';

interface Stats {
  correct: number;
  total: number;
}

export default function App() {
  const [mode, setMode] = useState<Mode>('plus');
  const [problem, setProblem] = useState(() => generateProblem('plus'));
  const [phase, setPhase] = useState<Phase>('asking');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [stats, setStats] = useState<Stats>({ correct: 0, total: 0 });
  const [counted, setCounted] = useState(false);

  const cells = useMemo(() => computeCellStates(problem, phase), [problem, phase]);
  const highlightTop = phase === 'revealed' ? problem.result : problem.a;

  function handleModeChange(next: Mode) {
    setMode(next);
    setProblem(generateProblem(next));
    setPhase('asking');
    setUserAnswer('');
    setFeedback(null);
    setCounted(false);
  }

  function handleCheck() {
    const parsed = Number.parseInt(userAnswer, 10);
    if (Number.isNaN(parsed)) {
      setFeedback('wrong');
      return;
    }
    if (parsed === problem.result) {
      setFeedback('correct');
      setPhase('revealed');
      if (!counted) {
        setStats((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
        setCounted(true);
      }
    } else {
      setFeedback('wrong');
      if (!counted) {
        // erste Falscheingabe zählt als Versuch
        setStats((s) => ({ ...s, total: s.total + 1 }));
        setCounted(true);
      }
    }
  }

  function handleReveal() {
    setPhase('revealed');
    if (!counted) {
      setStats((s) => ({ ...s, total: s.total + 1 }));
      setCounted(true);
    }
  }

  function handleNext() {
    setProblem(generateProblem(mode));
    setPhase('asking');
    setUserAnswer('');
    setFeedback(null);
    setCounted(false);
  }

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
          <Tower cells={cells} highlightTop={highlightTop} />
        </div>
        <aside className="app-side-col">
          <ProblemPanel
            problem={problem}
            phase={phase}
            userAnswer={userAnswer}
            feedback={feedback}
            onAnswerChange={(v) => {
              setUserAnswer(v);
              if (feedback === 'wrong') setFeedback(null);
            }}
            onCheck={handleCheck}
            onReveal={handleReveal}
            onNext={handleNext}
          />
          <Legend />
        </aside>
      </main>

      <footer className="app-footer">
        Tipp: Schau, wo die neuen Bausteine landen — die Farbe sagt dir die Einerstelle.
      </footer>
    </div>
  );
}
