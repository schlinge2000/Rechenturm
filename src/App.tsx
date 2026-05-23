import { useEffect, useMemo, useRef, useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { Tower } from './components/Tower';
import { ProblemPanel } from './components/ProblemPanel';
import { Legend } from './components/Legend';
import { MedalBar } from './components/MedalBar';
import { CustomProblemForm } from './components/CustomProblemForm';
import { Landing } from './components/Landing';
import { generateProblem } from './lib/problems';
import {
  bounds,
  clickAction,
  computeCellStates,
  initialCount,
  nextRange,
  stepSize,
} from './lib/towerState';
import {
  loadGameState,
  MEDAL_INTERVAL,
  saveGameState,
  type GameState,
} from './lib/gameState';
import {
  clearProfile,
  loadProfile,
  saveProfile,
  type Profile,
} from './lib/profile';
import type { Mode, Problem } from './lib/types';
import './App.css';

type SolvedVia = 'won' | 'revealed' | null;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export default function App() {
  const [mode, setMode] = useState<Mode>('plus');
  const [problem, setProblem] = useState<Problem>(() => generateProblem('plus'));
  const [currentCount, setCurrentCount] = useState<number>(() => initialCount(problem));
  const [solvedVia, setSolvedVia] = useState<SolvedVia>(null);
  const [game, setGame] = useState<GameState>(() => loadGameState());
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [showCustom, setShowCustom] = useState(false);
  const [justEarnedMedal, setJustEarnedMedal] = useState(false);

  const medalTimerRef = useRef<number | null>(null);

  // Persistenz: Game-State und Profil synchron halten
  useEffect(() => {
    saveGameState(game);
  }, [game]);

  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);

  const { min, max } = useMemo(() => bounds(problem), [problem]);
  const cells = useMemo(
    () => computeCellStates(problem, currentCount),
    [problem, currentCount],
  );
  const nextR = useMemo(
    () => (solvedVia ? null : nextRange(problem, currentCount)),
    [problem, currentCount, solvedVia],
  );
  const solved = solvedVia !== null;

  // Auto-Erkennung: Treffer durch eigenes Tippen
  useEffect(() => {
    if (solvedVia !== null) return;
    if (currentCount !== problem.result) return;

    setSolvedVia('won');
    setGame((g) => {
      const newSolved = g.solved + 1;
      const newMedals = Math.floor(newSolved / MEDAL_INTERVAL);
      const earned = newMedals > g.medals;
      if (earned) {
        setJustEarnedMedal(true);
        if (medalTimerRef.current !== null) {
          window.clearTimeout(medalTimerRef.current);
        }
        medalTimerRef.current = window.setTimeout(() => {
          setJustEarnedMedal(false);
          medalTimerRef.current = null;
        }, 2500);
      }
      return { ...g, solved: newSolved, medals: newMedals };
    });
  }, [currentCount, problem.result, solvedVia]);

  useEffect(() => {
    return () => {
      if (medalTimerRef.current !== null) {
        window.clearTimeout(medalTimerRef.current);
      }
    };
  }, []);

  function loadProblem(next: Problem) {
    setProblem(next);
    setCurrentCount(initialCount(next));
    setSolvedVia(null);
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    loadProblem(generateProblem(next));
    setShowCustom(false);
  }

  function handleNext() {
    loadProblem(generateProblem(mode));
  }

  function handleReveal() {
    setSolvedVia('revealed');
    setCurrentCount(problem.result);
  }

  function handleStep(delta: number) {
    if (solved) return;
    setCurrentCount((c) => clamp(c + delta, min, max));
  }

  function handleCellClick(n: number) {
    if (solved) return;
    const action = clickAction(problem, currentCount, n);
    const step = stepSize(problem);
    if (action === 'add') setCurrentCount((c) => clamp(c + step, min, max));
    if (action === 'remove') setCurrentCount((c) => clamp(c - step, min, max));
  }

  function getAction(n: number) {
    if (solved) return null;
    return clickAction(problem, currentCount, n);
  }

  function handleCustomSubmit(p: Problem) {
    loadProblem(p);
    setShowCustom(false);
  }

  function handleStaircaseToggle() {
    setGame((g) => ({ ...g, staircase: !g.staircase }));
  }

  function handleResetProgress() {
    if (
      window.confirm(
        'Fortschritt zurücksetzen? Aufgaben-Zähler und Medaillen werden gelöscht.',
      )
    ) {
      setGame((g) => ({ ...g, solved: 0, medals: 0 }));
    }
  }

  function handleLogout() {
    if (window.confirm('Anderer Spieler? Dein Fortschritt bleibt gespeichert.')) {
      clearProfile();
      setProfile(null);
    }
  }

  if (!profile) {
    return <Landing onStart={setProfile} />;
  }

  const canIncrease = !solved && currentCount < max;
  const canDecrease = !solved && currentCount > min;
  const groupSize = problem.operation === 'mal' ? problem.a : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-title">
          <h1>Rechenturm</h1>
          <p className="app-subtitle">Mathe zum Anschauen — eine Etage, zehn Stufen.</p>
        </div>
        <button
          type="button"
          className="profile-chip"
          onClick={handleLogout}
          title="Anderer Spieler"
        >
          <span className="profile-chip-name">Hi, {profile.name}!</span>
          <span className="profile-chip-age">{profile.age}</span>
        </button>
      </header>

      <section className="app-controls">
        <ModeSelector mode={mode} onChange={handleModeChange} />
        <div className="app-controls-right">
          <button
            type="button"
            className={`toggle-button ${game.staircase ? 'toggle-button--active' : ''}`}
            onClick={handleStaircaseToggle}
            aria-pressed={game.staircase}
            title="Stufen innerhalb einer Etage als Treppe anzeigen"
          >
            🪜 Treppe
          </button>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowCustom((s) => !s)}
            aria-expanded={showCustom}
          >
            ✏️ Eigene Aufgabe
          </button>
        </div>
      </section>

      {showCustom && (
        <CustomProblemForm
          onSubmit={handleCustomSubmit}
          onCancel={() => setShowCustom(false)}
        />
      )}

      <main className="app-main">
        <div className="app-tower-col">
          <Tower
            cells={cells}
            nextRange={nextR}
            groupSize={groupSize}
            staircase={game.staircase}
            onCellClick={handleCellClick}
            getAction={getAction}
            disabled={solved}
          />
        </div>
        <aside className="app-side-col">
          <MedalBar
            solved={game.solved}
            medals={game.medals}
            justEarnedMedal={justEarnedMedal}
          />
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

      {justEarnedMedal && (
        <div className="medal-celebration" role="status" aria-live="polite">
          <div className="medal-celebration-card">
            <div className="medal-celebration-icon">🏅</div>
            <div className="medal-celebration-text">
              Neue Medaille!
              <small>{game.medals} insgesamt</small>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <span>Tipp: +10 = eine Etage höher, gleiche Farbe!</span>
        {game.solved > 0 && (
          <button
            type="button"
            className="reset-link"
            onClick={handleResetProgress}
            title="Fortschritt zurücksetzen"
          >
            Fortschritt zurücksetzen
          </button>
        )}
      </footer>
    </div>
  );
}
