"use client";
import { getLast60Days } from "@/lib/storage";
import { Habit } from "@/lib/types";
import { useMemo } from "react";

interface Props {
  habit: Habit;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function HeatmapGrid({ habit }: Props) {
  const days = useMemo(() => getLast60Days(), []);

  // Group into weeks (columns)
  const weeks: string[][] = [];
  let week: string[] = [];

  // Pad start to align with day of week
  const firstDate = new Date(days[0]);
  const startPad = firstDate.getDay(); // 0=Sun
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

  // Month labels
  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = "";
  weeks.forEach((w, i) => {
    const firstReal = w.find((d) => d !== "");
    if (firstReal) {
      const month = new Date(firstReal).toLocaleString("default", { month: "short" });
      if (month !== lastMonth) {
        monthLabels.push({ label: month, colIndex: i });
        lastMonth = month;
      }
    }
  });

  const color = habit.color;

  return (
    <div className="overflow-x-auto pb-1">
      <div style={{ minWidth: `${weeks.length * 14 + 24}px` }}>
        {/* Month row */}
        <div className="flex mb-1 ml-6">
          {weeks.map((_, i) => {
            const label = monthLabels.find((m) => m.colIndex === i);
            return (
              <div key={i} style={{ width: 14, fontSize: 9, color: "#6666aa", flexShrink: 0 }}>
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-1" style={{ gap: 2 }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ width: 10, height: 10, fontSize: 7, color: "#6666aa", textAlign: "center", lineHeight: "10px" }}>
                {i % 2 === 0 ? d : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex" style={{ gap: 2 }}>
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: 2 }}>
                {w.map((dateKey, di) => {
                  if (!dateKey) {
                    return <div key={di} style={{ width: 10, height: 10 }} />;
                  }
                  const done = habit.completions[dateKey];
                  return (
                    <div
                      key={di}
                      title={dateKey}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        backgroundColor: done ? color : "rgba(255,255,255,0.06)",
                        boxShadow: done ? `0 0 6px ${color}66` : "none",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
