"use client";
import { useRef, useEffect } from "react";
import { useHabits } from "./HabitContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDates(count = 14) {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  return dates;
}

interface Props {
  selectedDate: string;
  onSelectDate: (d: string) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: Props) {
  const dates = getDates(14);
  const stripRef = useRef<HTMLDivElement>(null);
  const { habits } = useHabits();

  useEffect(() => {
    // Scroll to end (today)
    if (stripRef.current) {
      stripRef.current.scrollLeft = stripRef.current.scrollWidth;
    }
  }, []);

  return (
    <div ref={stripRef} className="flex gap-2 overflow-x-auto pb-1 scroll-smooth" style={{ scrollbarWidth: "none" }}>
      {dates.map((date) => {
        const key = date.toISOString().slice(0, 10);
        const isSelected = key === selectedDate;
        const isToday = key === new Date().toISOString().slice(0, 10);
        const completedCount = habits.filter((h) => h.completions[key]).length;
        const total = habits.length;
        const allDone = total > 0 && completedCount === total;

        return (
          <button
            key={key}
            onClick={() => onSelectDate(key)}
            className="flex-shrink-0 flex flex-col items-center rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-95 relative"
            style={{
              minWidth: 52,
              background: isSelected
                ? "linear-gradient(135deg, #00ff8833, #00ff8811)"
                : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${isSelected ? "#00ff88" : isToday ? "#3a3a5a" : "transparent"}`,
              boxShadow: isSelected ? "0 0 16px #00ff8822" : "none",
            }}
          >
            <span className="text-xs font-display" style={{ color: isSelected ? "#00ff88" : "#6666aa" }}>
              {DAYS[date.getDay()]}
            </span>
            <span
              className="text-base font-bold font-display mt-0.5"
              style={{ color: isSelected ? "#00ff88" : isToday ? "#e8e8f0" : "#8888aa" }}
            >
              {date.getDate()}
            </span>
            {total > 0 && (
              <div
                className="mt-1 w-5 h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(completedCount / total) * 100}%`,
                    background: allDone ? "#00ff88" : "#00ff8866",
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
