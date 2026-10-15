import { useEffect, useRef, useState } from 'react';
import type { Mode } from '../lib/types';
import { ModeSelector } from './ModeSelector';
import './AppMenu.css';

interface AppMenuProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  showCustom: boolean;
  onCustomToggle: () => void;
  showStaircaseToggle: boolean;
  staircase: boolean;
  onStaircaseToggle: () => void;
  onHome: () => void;
}

// Hamburger-Menü oben links: Rechenart, eigene Aufgabe, Treppe, Startseite.
// Schließt nach jeder Auswahl, bei Klick daneben und mit Escape.
export function AppMenu({
  mode,
  onModeChange,
  showCustom,
  onCustomToggle,
  showStaircaseToggle,
  staircase,
  onStaircaseToggle,
  onHome,
}: AppMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function choose(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <div className="app-menu" ref={rootRef}>
      <button
        type="button"
        className={`app-menu-button${open ? ' app-menu-button--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Menü"
        aria-expanded={open}
        aria-controls="app-menu-panel"
      >
        <span className="app-menu-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div id="app-menu-panel" className="app-menu-panel">
          <div className="app-menu-title">Rechenart</div>
          <ModeSelector mode={mode} onChange={(m) => choose(() => onModeChange(m))} />

          <div className="app-menu-divider" />

          <button
            type="button"
            className="app-menu-item"
            onClick={() => choose(onCustomToggle)}
            aria-pressed={showCustom}
          >
            <span aria-hidden>✏️</span> Eigene Aufgabe
          </button>
          {showStaircaseToggle && (
            <button
              type="button"
              className="app-menu-item"
              onClick={() => choose(onStaircaseToggle)}
              aria-pressed={staircase}
              title="Stufen innerhalb einer Etage als Treppe anzeigen"
            >
              <span aria-hidden>🪜</span> Treppe
              <span
                className={`app-menu-switch${staircase ? ' app-menu-switch--on' : ''}`}
                aria-hidden
              />
            </button>
          )}

          <div className="app-menu-divider" />

          <button type="button" className="app-menu-item" onClick={() => choose(onHome)}>
            <span aria-hidden>🏠</span> Startseite
          </button>
        </div>
      )}
    </div>
  );
}
