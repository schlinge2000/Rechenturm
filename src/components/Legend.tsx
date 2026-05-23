import { DECADE_COLORS, shadeForStep } from '../lib/colors';
import './Legend.css';

interface LegendProps {
  variant: 'decade' | 'block';
}

export function Legend({ variant }: LegendProps) {
  if (variant === 'block') {
    return (
      <div className="legend" aria-label="Farb-Legende für Blöcke">
        <div className="legend-title">Mal-Modus</div>
        <p className="legend-hint legend-hint--center">
          Jeder Block bekommt seine <strong>eigene Farbe</strong>, damit du sie
          beim Stapeln gut auseinanderhalten kannst.
        </p>
      </div>
    );
  }

  return (
    <div className="legend" aria-label="Farb-Legende für Etagen">
      <div className="legend-title">Etagen-Farben</div>
      <div className="legend-decades">
        {DECADE_COLORS.map((c, i) => (
          <div key={c} className="legend-decade">
            <span
              className="legend-decade-swatch"
              style={{ background: c }}
              aria-hidden
            />
            <span className="legend-decade-label">
              {i * 10 + 1}–{(i + 1) * 10}
            </span>
          </div>
        ))}
      </div>
      <div className="legend-shading">
        <span className="legend-shading-label">hell → kräftig</span>
        <div className="legend-shading-row" aria-hidden>
          {Array.from({ length: 10 }).map((_, step) => (
            <span
              key={step}
              className="legend-shading-swatch"
              style={{ background: shadeForStep(DECADE_COLORS[5], step) }}
              title={`Einer ${step + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
