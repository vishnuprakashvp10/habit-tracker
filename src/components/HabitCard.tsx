"use client";
import { useState } from "react";
import { Habit } from "@/lib/types";
import { useHabits } from "./HabitContext";
import CalendarView from "./CalendarView";
import { MoreVertical, Trash2, Edit3, ChevronDown, ChevronUp, Flame, Trophy, BarChart2, GripVertical } from "lucide-react";

interface Props {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  reordering?: boolean;
  onDragOver?: (id: string) => void;
}

export default function HabitCard({ habit, onEdit, reordering = false, onDragOver }: Props) {
  const { today, toggleHabit, deleteHabit, getCompletionRate } = useHabits();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  const isDone = !!habit.completions[today];
  const rate = getCompletionRate(habit);

  function handleToggle() {
    toggleHabit(habit.id, today);
    if (!isDone) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 600);
    }
  }

  const color = habit.color;
  const bgColor = `${color}18`;

  const handleDragStart = (e: React.DragEvent) => {
    if (!reordering) return;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    const target = e.currentTarget as HTMLDivElement;
    target.style.opacity = "0.8";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.opacity = "1";
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, #1a1a26 0%, #15151f 100%)`,
        border: reordering
          ? `2px dashed ${color}44`
          : `1px solid ${isDone ? color + "44" : "#2a2a3d"}`,
        boxShadow: reordering
          ? `0 0 20px ${color}33`
          : isDone
          ? `0 0 20px ${color}22, inset 0 0 20px ${color}08`
          : "none",
      }}
      draggable={reordering}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        if (reordering && onDragOver) onDragOver(habit.id);
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 pb-3">
        {/* Reorder handle */}
        {reordering && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center opacity-50">
            <GripVertical size={24} />
          </div>
        )}

        {/* Emoji badge */}
        {!reordering && (
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: bgColor, border: `1px solid ${color}33` }}
          >
            {habit.emoji}
          </div>
        )}

        {/* Name + streak */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-text truncate">{habit.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: habit.streak > 0 ? "#ff7b35" : "#6666aa" }}>
              {habit.streak > 0 ? "🔥" : "○"} Streak: {habit.streak}
            </span>
            {habit.bestStreak > 0 && (
              <span className="text-xs" style={{ color: "#ffd700" }}>
                · Best: {habit.bestStreak}
              </span>
            )}
          </div>
        </div>

        {!reordering && (
          <>
            {/* Check button */}
            <button
              onClick={handleToggle}
              className="relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
              style={{
                background: isDone ? color : "rgba(255,255,255,0.06)",
                border: `2px solid ${isDone ? color : "#3a3a5a"}`,
                boxShadow: isDone ? `0 0 16px ${color}88` : "none",
              }}
            >
              {justChecked && (
                <div
                  className="absolute inset-0 rounded-xl animate-pulse-ring"
                  style={{ border: `2px solid ${color}` }}
                />
              )}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDone ? "#000" : "#6666aa"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-dim hover:bg-white/5 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-9 z-50 rounded-xl overflow-hidden shadow-xl"
                  style={{ background: "#1e1e2e", border: "1px solid #2a2a3d", minWidth: 140 }}
                >
                  <button
                    onClick={() => { onEdit(habit); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-dim hover:bg-white/5 transition-colors"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => { deleteHabit(habit.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                    style={{ color: "#ff4444" }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-0 px-4 pb-3">
        <StatPill icon={<Flame size={11} />} value={`${habit.streak}d`} label="streak" color={habit.streak > 0 ? "#ff7b35" : undefined} />
        <StatPill icon={<Trophy size={11} />} value={`${habit.bestStreak}d`} label="best" color={habit.bestStreak > 0 ? "#ffd700" : undefined} />
        <StatPill icon={<BarChart2 size={11} />} value={`${rate}%`} label="rate" color={color} />
        <StatPill icon={<span style={{ fontSize: 10 }}>✓</span>} value={`${habit.totalCompletions}`} label="total" />
      </div>

      {/* Expand toggle */}
      {!reordering && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 pb-2 text-xs transition-colors"
          style={{ color: "#4a4a6a" }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "hide history" : "show history"}
        </button>
      )}

      {/* Calendar view */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-fade-in">
          <CalendarView habit={habit} />
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-1 px-1">
      <div className="flex items-center gap-0.5" style={{ color: color || "#6666aa" }}>
        {icon}
        <span className="text-xs font-display font-bold text-text">{value}</span>
      </div>
      <span style={{ fontSize: 9, color: "#6666aa" }}>{label}</span>
    </div>
  );
}
