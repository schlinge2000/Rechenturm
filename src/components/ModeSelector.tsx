import type { Mode } from '../lib/types';
import './ModeSelector.css';

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const MODES: { value: Mode; label: string; symbol: string }[] = [
  { value: 'plus', label: 'Plus', symbol: '+' },
  { value: 'minus', label: 'Minus', symbol: '−' },
  { value: 'mal', label: 'Mal', symbol: '×' },
  { value: 'gemischt', label: 'Gemischt', symbol: '?' },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector" role="radiogroup" aria-label="Rechenart">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          role="radio"
          aria-checked={mode === m.value}
          className={`mode-button${mode === m.value ? ' mode-button--active' : ''}`}
          onClick={() => onChange(m.value)}
        >
          <span className="mode-symbol" aria-hidden>
            {m.symbol}
          </span>
          <span className="mode-label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
