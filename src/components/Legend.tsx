import { STEP_COLORS } from '../lib/colors';
import './Legend.css';

export function Legend() {
  return (
    <div className="legend" aria-label="Farb-Legende für die Einerstellen">
      <div className="legend-title">Einer-Farben</div>
      <div className="legend-row">
        {STEP_COLORS.map((c, i) => (
          <div key={c} className="legend-chip">
            <span className="legend-swatch" style={{ background: c }} />
            <span className="legend-num">{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="legend-hint">
        +10 = eine Etage höher · gleiche Farbe!
      </p>
    </div>
  );
}
