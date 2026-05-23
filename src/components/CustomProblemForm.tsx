import { useState } from 'react';
import type { Operation, Problem } from '../lib/types';
import './CustomProblemForm.css';

interface CustomProblemFormProps {
  onSubmit: (p: Problem) => void;
  onCancel: () => void;
}

const OPS: { value: Operation; label: string; symbol: string }[] = [
  { value: 'plus', label: 'Plus', symbol: '+' },
  { value: 'minus', label: 'Minus', symbol: '−' },
  { value: 'mal', label: 'Mal', symbol: '×' },
];

export function CustomProblemForm({ onSubmit, onCancel }: CustomProblemFormProps) {
  const [aStr, setAStr] = useState('');
  const [bStr, setBStr] = useState('');
  const [op, setOp] = useState<Operation>('plus');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const a = Number.parseInt(aStr, 10);
    const b = Number.parseInt(bStr, 10);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setError('Bitte zwei Zahlen eintragen.');
      return;
    }
    if (a < 0 || b < 0) {
      setError('Nur positive Zahlen (0 ist auch ok).');
      return;
    }
    if (a > 100 || b > 100) {
      setError('Höchstens 100 — der Turm hat nur 100 Stufen.');
      return;
    }

    let result: number;
    if (op === 'plus') {
      result = a + b;
      if (result > 100) {
        setError(`${a} + ${b} = ${result} — passt nicht auf den Turm (max. 100).`);
        return;
      }
    } else if (op === 'minus') {
      if (b > a) {
        setError(`${a} − ${b} würde unter 0 fallen — die erste Zahl muss größer sein.`);
        return;
      }
      result = a - b;
    } else {
      result = a * b;
      if (result > 100) {
        setError(`${a} × ${b} = ${result} — passt nicht auf den Turm (max. 100).`);
        return;
      }
    }

    onSubmit({ operation: op, a, b, result });
  }

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="custom-form-title">Eigene Aufgabe</div>
      <div className="custom-form-row">
        <input
          type="number"
          inputMode="numeric"
          className="custom-input"
          value={aStr}
          onChange={(e) => {
            setAStr(e.target.value);
            setError(null);
          }}
          placeholder="0"
          min={0}
          max={100}
          aria-label="Erste Zahl"
          autoFocus
        />
        <div className="custom-op-group" role="radiogroup" aria-label="Rechenart">
          {OPS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={op === o.value}
              className={`custom-op ${op === o.value ? 'custom-op--active' : ''}`}
              onClick={() => {
                setOp(o.value);
                setError(null);
              }}
              title={o.label}
            >
              {o.symbol}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="numeric"
          className="custom-input"
          value={bStr}
          onChange={(e) => {
            setBStr(e.target.value);
            setError(null);
          }}
          placeholder="0"
          min={0}
          max={100}
          aria-label="Zweite Zahl"
        />
        <span className="custom-equals">=&nbsp;?</span>
      </div>
      {error && (
        <div className="custom-error" role="alert">
          {error}
        </div>
      )}
      <div className="custom-form-actions">
        <button type="button" className="custom-btn custom-btn--ghost" onClick={onCancel}>
          Abbrechen
        </button>
        <button type="submit" className="custom-btn custom-btn--primary">
          Aufgabe starten
        </button>
      </div>
    </form>
  );
}
