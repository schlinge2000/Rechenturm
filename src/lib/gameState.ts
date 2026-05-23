export interface GameState {
  solved: number; // selbst gelöste Aufgaben (ohne "Lösung zeigen")
  medals: number; // Medaillen = floor(solved / MEDAL_INTERVAL)
  staircase: boolean;
}

export const MEDAL_INTERVAL = 10;
const STORAGE_KEY = 'rechenturm.gamestate.v1';

function defaultState(): GameState {
  return { solved: 0, medals: 0, staircase: false };
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return {
      solved: typeof parsed.solved === 'number' ? parsed.solved : 0,
      medals: typeof parsed.medals === 'number' ? parsed.medals : 0,
      staircase: typeof parsed.staircase === 'boolean' ? parsed.staircase : false,
    };
  } catch {
    return defaultState();
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Speicher voll oder nicht verfügbar — ignorieren
  }
}

export function nextMedalProgress(solved: number): {
  current: number;
  needed: number;
} {
  const current = solved % MEDAL_INTERVAL;
  return { current, needed: MEDAL_INTERVAL };
}
