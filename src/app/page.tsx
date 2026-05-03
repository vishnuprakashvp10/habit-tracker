"use client";
import { useState, useEffect } from "react";
import { useHabits } from "@/components/HabitContext";
import HabitCard from "@/components/HabitCard";
import AddHabitModal from "@/components/AddHabitModal";
import DateStrip from "@/components/DateStrip";
import StatsView from "@/components/StatsView";
import { Habit } from "@/lib/types";
import { Plus, LayoutGrid, BarChart2, Sparkles, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "today" | "stats";

export default function Home() {
  const { habits, today, reorderHabits } = useHabits();
  const [tab, setTab] = useState<Tab>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [filterCat, setFilterCat] = useState("All");

  // Keep selectedDate in sync with today (when app loads or day changes)
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setSelectedDate(today);
      setInitialized(true);
    }
  }, [today, initialized]);

  const categories = ["All", ...Array.from(new Set(habits.map((h) => h.category)))];

  const filtered = habits.filter((h) => filterCat === "All" || h.category === filterCat);

  const completedToday = habits.filter((h) => h.completions[selectedDate]).length;
  const total = habits.length;
  const allDone = total > 0 && completedToday === total;

  function openEdit(habit: Habit) {
    setEditingHabit(habit);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingHabit(null);
  }

  const dateObj = new Date(selectedDate + "T00:00:00");
  const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const [reordering, setReordering] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDragOver(overId: string) {
    if (!draggedId || draggedId === overId) return;
    const draggedIdx = habits.findIndex((h) => h.id === draggedId);
    const overIdx = habits.findIndex((h) => h.id === overId);
    if (draggedIdx === -1 || overIdx === -1 || draggedIdx === overIdx) return;
    reorderHabits(draggedIdx, overIdx);
  }

  function handleMoveUp(id: string) {
    const idx = habits.findIndex((h) => h.id === id);
    if (idx > 0) {
      reorderHabits(idx, idx - 1);
    }
  }

  function handleMoveDown(id: string) {
    const idx = habits.findIndex((h) => h.id === id);
    if (idx < habits.length - 1) {
      reorderHabits(idx, idx + 1);
    }
  }

  function handleDragEnd() {
    setDraggedId(null);
  }

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-md mx-auto px-4 pb-32">
        {/* Header */}
        <div className="pt-12 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-display uppercase tracking-widest" style={{ color: "#00ff88" }}>
                Habit Tracker
              </p>
              <h1 className="text-2xl font-display font-bold text-text mt-1">{dateLabel}</h1>
              {total > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)", maxWidth: 120 }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedToday / total) * 100}%`,
                        background: allDone
                          ? "linear-gradient(90deg, #00ff88, #00d4ff)"
                          : "linear-gradient(90deg, #00ff8888, #00ff8844)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-display" style={{ color: allDone ? "#00ff88" : "#6666aa" }}>
                    {allDone ? "🎉 All done!" : `${completedToday}/${total}`}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "linear-gradient(135deg, #00ff88, #00cc6a)",
                boxShadow: "0 4px 20px #00ff8844",
              }}
            >
              <Plus size={22} color="#000" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-2xl" style={{ background: "#12121a" }}>
          <TabBtn active={tab === "today"} onClick={() => setTab("today")} icon={<LayoutGrid size={15} />} label="Today" />
          <TabBtn active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart2 size={15} />} label="Stats" />
        </div>

        {tab === "today" && (
          <>
            {/* Date strip */}
            <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className="flex-shrink-0 px-3 py-1 rounded-xl text-xs font-display transition-all"
                    style={{
                      background: filterCat === cat ? "#00ff8822" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${filterCat === cat ? "#00ff88" : "#2a2a3d"}`,
                      color: filterCat === cat ? "#00ff88" : "#6666aa",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Reorder toggle */}
            {filtered.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setReordering(!reordering)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display transition-all"
                  style={{
                    background: reordering ? "#ff7b3522" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${reordering ? "#ff7b35" : "#2a2a3d"}`,
                    color: reordering ? "#ff7b35" : "#6666aa",
                  }}
                >
                  <GripVertical size={14} />
                  {reordering ? "Exit" : "Reorder"}
                </button>
              </div>
            )}

      {/* Habit list */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : (
          <AnimatePresence>
            {filtered.map((habit, i) => (
<motion.div
                 key={habit.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ delay: i * 0.04, duration: 0.3 }}
                 drag={reordering}
                 dragConstraints={{ top: 0, bottom: 0 }}
                 onDragStart={() => reordering && handleDragStart(habit.id)}
                 onDragEnd={handleDragEnd}
                 className={`animate-slide-up ${reordering ? "cursor-grab" : ""}`}
                 style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
               >
                  <HabitCard habit={habit} onEdit={openEdit} reordering={reordering} onDragOver={handleDragOver} selectedDate={selectedDate} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
               </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
          </>
        )}

        {tab === "stats" && (
          <div className="mt-4 animate-fade-in">
            <StatsView />
          </div>
        )}
      </div>

      <AddHabitModal open={modalOpen} onClose={closeModal} editingHabit={editingHabit} />
    </main>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-display transition-all"
      style={{
        background: active ? "#00ff8822" : "transparent",
        border: `1px solid ${active ? "#00ff8844" : "transparent"}`,
        color: active ? "#00ff88" : "#6666aa",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 animate-bounce">✨</div>
      <h3 className="font-display font-bold text-text mb-2">Start your journey</h3>
      <p className="text-sm text-text-dim mb-6">Add your first habit and start building streaks!</p>
      <button
        onClick={onAdd}
        className="px-6 py-3 rounded-2xl font-display text-sm font-bold transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #00ff88, #00cc6a)", color: "#000", boxShadow: "0 4px 20px #00ff8844" }}
      >
        Add First Habit
      </button>
    </div>
  );
}
