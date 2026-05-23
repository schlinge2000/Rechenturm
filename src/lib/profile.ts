export interface Profile {
  name: string;
  age: number;
}

const STORAGE_KEY = 'rechenturm.profile.v1';

export function loadProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    if (
      typeof parsed.name === 'string' &&
      parsed.name.length > 0 &&
      typeof parsed.age === 'number' &&
      parsed.age > 0
    ) {
      return { name: parsed.name, age: parsed.age };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
