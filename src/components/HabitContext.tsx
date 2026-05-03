"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Habit, AppState } from "@/lib/types";
import { loadState, saveState, computeStreak, getDateKey } from "@/lib/storage";
import { HABIT_COLORS } from "@/lib/constants";

interface HabitContextType {
  habits: Habit[];
  today: string;
  addHabit: (h: Omit<Habit, "id" | "completions" | "streak" | "bestStreak" | "totalCompletions" | "createdAt" | "order">) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
  getCompletionRate: (habit: Habit) => number;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = getDateKey(new Date());

  useEffect(() => {
    const state = loadState();
    // Sort by order on load
    state.habits.sort((a, b) => a.order - b.order);
    setHabits(state.habits);
  }, []);

  const persist = useCallback((updated: Habit[]) => {
    setHabits(updated);
    saveState({ habits: updated, lastUpdated: new Date().toISOString() });
  }, []);

  const addHabit = useCallback(
    (h: Omit<Habit, "id" | "completions" | "streak" | "bestStreak" | "totalCompletions" | "createdAt" | "order">) => {
      const newHabit: Habit = {
        ...h,
        id: crypto.randomUUID(),
        order: habits.length,
        completions: {},
        streak: 0,
        bestStreak: 0,
        totalCompletions: 0,
        createdAt: new Date().toISOString(),
      };
      persist([...habits, newHabit]);
    },
    [habits, persist]
  );

  const deleteHabit = useCallback(
    (id: string) => persist(habits.filter((h) => h.id !== id)),
    [habits, persist]
  );

  const toggleHabit = useCallback(
    (id: string, date: string) => {
      const updated = habits.map((h) => {
        if (h.id !== id) return h;
        const completions = { ...h.completions };
        if (completions[date]) {
          delete completions[date];
        } else {
          completions[date] = true;
        }
        const { streak, bestStreak } = computeStreak(completions);
        const totalCompletions = Object.values(completions).filter(Boolean).length;
        return { ...h, completions, streak, bestStreak, totalCompletions };
      });
      persist(updated);
    },
    [habits, persist]
  );

  const updateHabit = useCallback(
    (id: string, updates: Partial<Habit>) => {
      persist(habits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    },
    [habits, persist]
  );

  const reorderHabits = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updated = [...habits];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      // Re-assign order values
      const reordered = updated.map((h, idx) => ({ ...h, order: idx }));
      persist(reordered);
    },
    [habits, persist]
  );

  const getCompletionRate = useCallback(
    (habit: Habit) => {
      const days = Object.keys(habit.completions).length;
      const created = new Date(habit.createdAt);
      const now = new Date();
      const totalDays = Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return Math.round((days / totalDays) * 100);
    },
    []
  );

  return (
    <HabitContext.Provider value={{ habits, today, addHabit, deleteHabit, toggleHabit, updateHabit, reorderHabits, getCompletionRate }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitProvider");
  return ctx;
}
