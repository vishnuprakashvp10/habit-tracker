"use client";
import { useHabits } from "./HabitContext";
import HeatmapGrid from "./HeatmapGrid";
import { Flame, Trophy, BarChart2, CheckCircle } from "lucide-react";

export default function StatsView() {
  const { habits, today } = useHabits();

  const totalStreaks = habits.reduce((s, h) => s + h.streak, 0);
  const totalCompletions = habits.reduce((s, h) => s + h.totalCompletions, 0);
  const bestStreak = Math.max(0, ...habits.map((h) => h.bestStreak));
  const todayCompleted = habits.filter((h) => h.completions[today]).length;

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📊</div>
        <p className="font-display text-text-dim">No habits yet.<br />Add some to see stats!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame size={20} />} label="Active Streaks" value={totalStreaks} color="#ff7b35" />
        <StatCard icon={<Trophy size={20} />} label="Best Streak" value={`${bestStreak}d`} color="#ffd700" />
        <StatCard icon={<CheckCircle size={20} />} label="Today Done" value={`${todayCompleted}/${habits.length}`} color="#00ff88" />
        <StatCard icon={<BarChart2 size={20} />} label="All Time" value={totalCompletions} color="#00d4ff" />
      </div>

      {/* Per-habit heatmaps */}
      <h3 className="font-display text-xs text-text-dim uppercase tracking-wider pt-2">Habit Histories</h3>
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="rounded-2xl p-4"
          style={{ background: "#1a1a26", border: "1px solid #2a2a3d" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{habit.emoji}</span>
            <div>
              <p className="text-sm font-display font-bold text-text">{habit.name}</p>
              <p className="text-xs" style={{ color: "#6666aa" }}>
                {habit.totalCompletions} completions · {habit.streak}d streak
              </p>
            </div>
          </div>
          <HeatmapGrid habit={habit} />
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#1a1a26", border: "1px solid #2a2a3d" }}
    >
      <div style={{ color }} className="mb-1">{icon}</div>
      <p className="font-display text-xl font-bold text-text">{value}</p>
      <p className="text-xs" style={{ color: "#6666aa" }}>{label}</p>
    </div>
  );
}
