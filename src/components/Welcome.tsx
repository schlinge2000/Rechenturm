import type { GameState } from '../lib/gameState';
import type { Profile } from '../lib/profile';
import type { Mode } from '../lib/types';
import { TowerMark } from './Landing';
import { MedalBar } from './MedalBar';
import './Landing.css';
import './Welcome.css';

interface WelcomeProps {
  profile: Profile;
  game: GameState;
  lastMode: Mode;
  onStart: (mode: Mode) => void;
  onCustom: () => void;
  onSwitchPlayer: () => void;
  onResetProgress: () => void;
}

const MODES: { value: Mode; label: string; symbol: string }[] = [
  { value: 'plus', label: 'Plus', symbol: '+' },
  { value: 'minus', label: 'Minus', symbol: '−' },
  { value: 'mal', label: 'Mal', symbol: '×' },
  { value: 'gemischt', label: 'Gemischt', symbol: '?' },
];

// Startseite für bekannte Spieler: Begrüßung, Rechenart wählen, Medaillen.
// Ein Tipp auf eine Rechenart startet direkt den Rechen-Bildschirm.
export function Welcome({
  profile,
  game,
  lastMode,
  onStart,
  onCustom,
  onSwitchPlayer,
  onResetProgress,
}: WelcomeProps) {
  return (
    <div className="landing">
      <div className="landing-card welcome-card">
        <div className="landing-icon" aria-hidden>
          <TowerMark />
        </div>
        <h1 className="welcome-title">
          Hallo, {profile.name}
          <sup className="welcome-solved" title={`${game.solved} Aufgaben gelöst`}>
            {game.solved}
          </sup>
          !
        </h1>
        <p className="landing-tagline">Was möchtest du rechnen?</p>

        <div className="welcome-modes" role="group" aria-label="Rechenart">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`welcome-mode${m.value === lastMode ? ' welcome-mode--last' : ''}`}
              onClick={() => onStart(m.value)}
            >
              <span className="welcome-mode-symbol" aria-hidden>
                {m.symbol}
              </span>
              <span className="welcome-mode-label">{m.label}</span>
            </button>
          ))}
        </div>

        <button type="button" className="welcome-custom" onClick={onCustom}>
          <span aria-hidden>✏️</span> Eigene Aufgabe
        </button>

        <div className="welcome-medals">
          <MedalBar solved={game.solved} medals={game.medals} justEarnedMedal={false} />
        </div>

        <div className="welcome-links">
          <button type="button" className="welcome-link" onClick={onSwitchPlayer}>
            Anderer Spieler
          </button>
          {game.solved > 0 && (
            <button type="button" className="welcome-link" onClick={onResetProgress}>
              Fortschritt zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
