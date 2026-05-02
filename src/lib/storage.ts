import { AppState, Habit } from "./types";

const STORAGE_KEY = "habittracker_v2";

export function loadState(): AppState {
  if (typeof window === "undefined") return { habits: [], lastUpdated: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [], lastUpdated: new Date().toISOString() };
    return JSON.parse(raw) as AppState;
  } catch {
    return { habits: [], lastUpdated: new Date().toISOString() };
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function computeStreak(completions: Record<string, boolean>): { streak: number; bestStreak: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Object.keys(completions)
    .filter((d) => completions[d])
    .sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) return { streak: 0, bestStreak: 0 };

  // Current streak
  let streak = 0;
  const check = new Date(today);
  for (let i = 0; ; i++) {
    const key = check.toISOString().slice(0, 10);
    if (completions[key]) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (i === 0) {
      // Didn't complete today — check yesterday
      check.setDate(check.getDate() - 1);
      const yKey = check.toISOString().slice(0, 10);
      if (completions[yKey]) {
        streak++;
        check.setDate(check.getDate() - 1);
        continue;
      }
      break;
    } else {
      break;
    }
  }

  // Best streak
  const sortedDates = [...dates].sort();
  let best = 0;
  let current = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
    } else {
      best = Math.max(best, current);
      current = 1;
    }
  }
  best = Math.max(best, current);

  return { streak, bestStreak: best };
}

export function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getLast60Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
