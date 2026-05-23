import { useState } from 'react';
import type { Profile } from '../lib/profile';
import './Landing.css';

interface LandingProps {
  onStart: (p: Profile) => void;
}

export function Landing({ onStart }: LandingProps) {
  const [name, setName] = useState('');
  const [ageStr, setAgeStr] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError('Trag deinen Namen ein.');
      return;
    }
    if (trimmed.length > 30) {
      setError('Bitte einen kürzeren Namen (höchstens 30 Zeichen).');
      return;
    }
    const age = Number.parseInt(ageStr, 10);
    if (!Number.isFinite(age) || age < 4 || age > 14) {
      setError('Trag dein Alter ein (zwischen 4 und 14).');
      return;
    }
    onStart({ name: trimmed, age });
  }

  return (
    <div className="landing">
      <div className="landing-card">
        <div className="landing-icon" aria-hidden>
          <TowerMark />
        </div>
        <h1 className="landing-title">Rechenturm</h1>
        <p className="landing-tagline">
          Mathe zum Anschauen — bau dir den Turm Stein für Stein.
        </p>

        <ul className="landing-features">
          <li>
            <span className="landing-feature-icon">➕</span>
            Plus, Minus und Mal von 0 bis 100
          </li>
          <li>
            <span className="landing-feature-icon">🧱</span>
            Bausteine tippen statt Antworten eintippen
          </li>
          <li>
            <span className="landing-feature-icon">🏅</span>
            Alle 10 Aufgaben gibt es eine Medaille
          </li>
        </ul>

        <form className="landing-form" onSubmit={handleSubmit}>
          <label className="landing-field">
            <span className="landing-field-label">Wie heißt du?</span>
            <input
              type="text"
              className="landing-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Dein Name"
              autoComplete="given-name"
              maxLength={30}
              autoFocus
            />
          </label>
          <label className="landing-field">
            <span className="landing-field-label">Wie alt bist du?</span>
            <input
              type="number"
              inputMode="numeric"
              className="landing-input"
              value={ageStr}
              onChange={(e) => {
                setAgeStr(e.target.value);
                setError(null);
              }}
              placeholder="Jahre"
              min={4}
              max={14}
            />
          </label>

          {error && (
            <div className="landing-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="landing-start">
            Los geht&apos;s →
          </button>
        </form>

        <p className="landing-foot">
          Dein Name und Alter bleiben nur auf deinem Gerät.
        </p>
      </div>
    </div>
  );
}

function TowerMark() {
  // Schlankes SVG-Logo passend zum App-Icon
  return (
    <svg width="84" height="84" viewBox="0 0 100 100" role="img" aria-label="Rechenturm-Logo">
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="lg-brown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#lg-bg)" />
      <rect x="6" y="14" width="2" height="6" fill="#1e293b" transform="translate(44 0)" />
      <polygon points="20,30 50,15 80,30" fill="#ef4444" />
      <rect x="20" y="30" width="60" height="50" fill="#f8fafc" />
      <rect x="14" y="30" width="6" height="50" fill="url(#lg-brown)" />
      <rect x="80" y="30" width="6" height="50" fill="url(#lg-brown)" />
      {[
        { y: 70, count: 10, colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9', '#a855f7', '#ec4899'] },
        { y: 60, count: 10, colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9', '#a855f7', '#ec4899'] },
        { y: 50, count: 6, colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'] },
        { y: 40, count: 3, colors: ['#ef4444', '#f97316', '#f59e0b'] },
      ].map((floor, fi) =>
        floor.colors.map((c, i) => (
          <rect
            key={`${fi}-${i}`}
            x={21 + i * 5.8}
            y={floor.y}
            width="5"
            height="9"
            rx="1"
            fill={c}
          />
        )),
      )}
      <rect x="10" y="82" width="80" height="6" rx="2" fill="#65a30d" />
    </svg>
  );
}
