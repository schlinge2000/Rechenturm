import { MEDAL_INTERVAL, nextMedalProgress } from '../lib/gameState';
import './MedalBar.css';

interface MedalBarProps {
  solved: number;
  medals: number;
  justEarnedMedal: boolean;
}

export function MedalBar({ solved, medals, justEarnedMedal }: MedalBarProps) {
  const { current, needed } = nextMedalProgress(solved);
  const pct = (current / needed) * 100;

  return (
    <div className="medal-bar" aria-label="Fortschritt">
      <div className="medal-stats">
        <div className="medal-stats-row">
          <span className="medal-count">
            <span className="medal-icon">🏅</span>
            <span className={`medal-num ${justEarnedMedal ? 'medal-num--celebrate' : ''}`}>
              {medals}
            </span>
          </span>
          <span className="medal-solved">
            <strong>{solved}</strong> gelöst
          </span>
        </div>
        <div
          className="medal-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={needed}
          aria-valuenow={current}
          aria-label={`Noch ${needed - current} Aufgaben bis zur nächsten Medaille`}
        >
          <div className="medal-progress-fill" style={{ width: `${pct}%` }} />
          <span className="medal-progress-label">
            {current === 0 && medals > 0
              ? `${needed} bis zur nächsten 🏅`
              : `${needed - current} bis zur nächsten 🏅`}
          </span>
        </div>
      </div>

      {medals > 0 && (
        <div className="medal-row" aria-label={`${medals} Medaillen verdient`}>
          {Array.from({ length: Math.min(medals, MEDAL_INTERVAL * 2) }).map((_, i) => (
            <span
              key={i}
              className={`medal-chip ${
                justEarnedMedal && i === medals - 1 ? 'medal-chip--new' : ''
              }`}
            >
              🏅
            </span>
          ))}
          {medals > MEDAL_INTERVAL * 2 && (
            <span className="medal-chip-overflow">+{medals - MEDAL_INTERVAL * 2}</span>
          )}
        </div>
      )}
    </div>
  );
}
