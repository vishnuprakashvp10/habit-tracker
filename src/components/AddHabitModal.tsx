"use client";
import { useState, useEffect } from "react";
import { Habit, HabitFrequency } from "@/lib/types";
import { useHabits } from "./HabitContext";
import { HABIT_COLORS, HABIT_EMOJIS, CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  editingHabit?: Habit | null;
}

  type FormState = Omit<Habit, "id" | "completions" | "streak" | "bestStreak" | "totalCompletions" | "createdAt"> & { customDays: number[]; order: number };

  const DEFAULT: FormState = {
    name: "",
    emoji: "💪",
    color: HABIT_COLORS[0].value,
    frequency: "daily" as HabitFrequency,
    category: "Health",
    customDays: [] as number[],
    order: 0,
  };

export default function AddHabitModal({ open, onClose, editingHabit }: Props) {
  const { habits, addHabit, updateHabit } = useHabits();
  const [form, setForm] = useState<FormState>(() => ({ ...DEFAULT, order: habits.length }));
  const [emojiSearch, setEmojiSearch] = useState("");

  useEffect(() => {
    if (editingHabit) {
      setForm({
        name: editingHabit.name,
        emoji: editingHabit.emoji,
        color: editingHabit.color,
        frequency: editingHabit.frequency,
        category: editingHabit.category,
        customDays: editingHabit.customDays || [],
        order: editingHabit.order,
      });
    } else {
      setForm({ ...DEFAULT, order: habits.length });
    }
  }, [editingHabit, open, habits.length]);

  function handleSubmit() {
    if (!form.name.trim()) return;
    if (editingHabit) {
        updateHabit(editingHabit.id, {
          name: form.name,
          emoji: form.emoji,
          color: form.color,
          frequency: form.frequency,
          category: form.category,
          customDays: form.customDays,
          order: editingHabit.order,
        });
    } else {
       addHabit({
         name: form.name,
         emoji: form.emoji,
         color: form.color,
         frequency: form.frequency,
         category: form.category,
         customDays: form.customDays,
       });
    }
    onClose();
  }

  const filteredEmojis = emojiSearch
    ? HABIT_EMOJIS.filter((e) => e.includes(emojiSearch))
    : HABIT_EMOJIS;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden animate-slide-up"
        style={{ background: "#12121a", border: "1px solid #2a2a3d", borderBottom: "none", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4">
          <h2 className="font-display text-lg font-bold text-text">
            {editingHabit ? "Edit Habit" : "New Habit"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-dim hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Emoji picker */}
          <div>
            <label className="block text-xs text-text-dim mb-2 font-display uppercase tracking-wider">Icon</label>
            <div className="flex flex-wrap gap-2">
              {HABIT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setForm({ ...form, emoji })}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all"
                  style={{
                    background: form.emoji === emoji ? `${form.color}22` : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${form.emoji === emoji ? form.color : "#2a2a3d"}`,
                    transform: form.emoji === emoji ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-text-dim mb-2 font-display uppercase tracking-wider">Habit Name</label>
            <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "#1a1a26", border: "1px solid #2a2a3d" }}>
              <span className="text-xl">{form.emoji}</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Wake up at 7 AM"
                className="flex-1 bg-transparent text-text text-sm outline-none placeholder:text-muted"
                maxLength={40}
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-text-dim mb-2 font-display uppercase tracking-wider">Color</label>
            <div className="flex gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background: c.value,
                    boxShadow: form.color === c.value ? `0 0 12px ${c.value}` : "none",
                    transform: form.color === c.value ? "scale(1.25)" : "scale(1)",
                    border: form.color === c.value ? `2px solid white` : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-text-dim mb-2 font-display uppercase tracking-wider">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className="px-3 py-1.5 rounded-lg text-xs font-display transition-all"
                  style={{
                    background: form.category === cat ? `${form.color}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.category === cat ? form.color : "#2a2a3d"}`,
                    color: form.category === cat ? form.color : "#8888aa",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs text-text-dim mb-2 font-display uppercase tracking-wider">Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              {(["daily", "weekdays", "weekends", "custom"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setForm({ ...form, frequency: f })}
                  className="py-2 rounded-xl text-xs font-display capitalize transition-all"
                  style={{
                    background: form.frequency === f ? `${form.color}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.frequency === f ? form.color : "#2a2a3d"}`,
                    color: form.frequency === f ? form.color : "#8888aa",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {form.frequency === "custom" && (
              <div className="mt-2 flex gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const days = form.customDays.includes(i)
                        ? form.customDays.filter((x) => x !== i)
                        : [...form.customDays, i];
                      setForm({ ...form, customDays: days });
                    }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-display transition-all"
                    style={{
                      background: form.customDays.includes(i) ? `${form.color}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.customDays.includes(i) ? form.color : "#2a2a3d"}`,
                      color: form.customDays.includes(i) ? form.color : "#8888aa",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="w-full py-4 rounded-2xl font-display font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: form.name.trim() ? `linear-gradient(135deg, ${form.color}, ${form.color}99)` : "#2a2a3d",
              color: form.name.trim() ? "#000" : "#6666aa",
              boxShadow: form.name.trim() ? `0 4px 20px ${form.color}44` : "none",
            }}
          >
            {editingHabit ? "Save Changes" : "Add Habit"}
          </button>
        </div>
      </div>
    </div>
  );
}
