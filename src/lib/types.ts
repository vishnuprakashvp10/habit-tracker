export type HabitFrequency = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  frequency: HabitFrequency;
  customDays?: number[]; // 0=Sun, 1=Mon...6=Sat
  createdAt: string; // ISO date string
  order: number; // For reordering habits
  completions: Record<string, boolean>; // "YYYY-MM-DD" -> true
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  category: string;
}

export interface AppState {
  habits: Habit[];
  lastUpdated: string;
}
