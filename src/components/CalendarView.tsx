"use client";
import { Habit } from "@/lib/types";
import { useState, useMemo } from "react";
import { getDateKey, getNext100Days } from "@/lib/storage";

interface CalendarViewProps {
  habit: Habit;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarView({ habit }: CalendarViewProps) {
  const [view, setView] = useState<"month" | "year">("month");
  const today = getDateKey(new Date());

  const last30Days = useMemo(() => {
    const days: string[] = [];
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(current);
      d.setDate(current.getDate() - i);
      days.push(getDateKey(d));
    }
    return days;
  }, []);

  const allDays = useMemo(() => getNext100Days(), []);

  const getWeeks = (days: string[]) => {
    const weeks: string[][] = [];
    let week: string[] = [];
    const firstDate = new Date(days[0]);
    const startPad = firstDate.getDay();
    for (let i = 0; i < startPad; i++) week.push("");
    for (const day of days) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push("");
      weeks.push(week);
    }
    return weeks;
  };

  const monthWeeks = useMemo(() => getWeeks(last30Days), [last30Days]);
  const yearWeeks = useMemo(() => getWeeks(allDays), [allDays]);

  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = "";
  yearWeeks.forEach((w, i) => {
    const firstReal = w.find((d) => d !== "");
    if (firstReal) {
      const month = new Date(firstReal).toLocaleString("default", { month: "short" });
      if (month !== lastMonth) {
        monthLabels.push({ label: month, colIndex: i });
        lastMonth = month;
      }
    }
  });

  const renderGrid = (weeks: string[][], showLabel: boolean) => (
    <div className="overflow-x-auto pb-1">
      <div style={{ minWidth: `${weeks.length * 24 + 28}px` }}>
        {showLabel && (
          <div className="flex mb-1 ml-7">
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.colIndex === i);
              return (
                <div key={i} style={{ width: 24, fontSize: 9, color: "#6666aa", flexShrink: 0, textAlign: "center" }}>
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex">
          <div className="flex flex-col mr-1" style={{ gap: 2 }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ width: 10, height: showLabel ? 24 : 16, fontSize: 7, color: "#6666aa", textAlign: "center", lineHeight: showLabel ? "24px" : "16px" }}>
                {d}
              </div>
            ))}
          </div>
          <div className="flex" style={{ gap: 2 }}>
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: 2 }}>
                {w.map((dateKey, di) => {
                  if (!dateKey) return <div key={di} style={{ width: 24, height: showLabel ? 24 : 16 }} />;
                  const done = habit.completions[dateKey];
                  const isToday = dateKey === today;
                  return (
                    <div key={di} title={`${dateKey} - ${done ? "Completed" : "Not complete"}`} style={{ width: 24, height: showLabel ? 24 : 16, borderRadius: 4, backgroundColor: done ? habit.color : isToday ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: isToday && !done ? "1px solid rgba(255,255,255,0.2)" : "none", boxShadow: done ? `0 0 8px ${habit.color}88` : "none", transition: "all 0.2s ease", flexShrink: 0, position: "relative" }}>
                      {isToday && <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: "#00ff88", opacity: 0.8 }} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg" style={{ background: "#1a1a26", padding: 2 }}>
          <button onClick={() => setView("month")} className={`px-3 py-1.5 rounded-md text-xs font-display transition-all ${view === "month" ? "bg-white/10 text-text" : "text-text-dim hover:bg-white/5"}`}>Month</button>
          <button onClick={() => setView("year")} className={`px-3 py-1.5 rounded-md text-xs font-display transition-all ${view === "year" ? "bg-white/10 text-text" : "text-text-dim hover:bg-white/5"}`}>100 Days</button>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "#6666aa" }}>
          <div className="flex items-center gap-1"><div style={{ width: 10, height: 10, borderRadius: 2, background: habit.color, boxShadow: `0 0 6px ${habit.color}88` }}></div>Completed</div>
          <div className="flex items-center gap-1"><div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}></div>Today</div>
        </div>
      </div>
      {view === "month" ? renderGrid(monthWeeks, false) : renderGrid(yearWeeks, true)}
      <div className="flex gap-3 pt-2 border-t border-white/5">
        <div className="flex-1 text-center">
          <div className="text-lg font-display font-bold text-text">{habit.streak}</div>
          <div className="text-xs" style={{ color: "#6666aa" }}>Day Streak</div>
        </div>
        <div className="w-px" style={{ background: "#2a2a3d" }} />
        <div className="flex-1 text-center">
          <div className="text-lg font-display font-bold text-text">{habit.totalCompletions}</div>
          <div className="text-xs" style={{ color: "#6666aa" }}>Total Completed</div>
        </div>
        <div className="w-px" style={{ background: "#2a2a3d" }} />
        <div className="flex-1 text-center">
          <div className="text-lg font-display font-bold text-text">{habit.bestStreak}</div>
          <div className="text-xs" style={{ color: "#6666aa" }}>Best Streak</div>
        </div>
      </div>
    </div>
  );
}
