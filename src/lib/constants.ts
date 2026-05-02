export const HABIT_COLORS = [
  { id: "green", value: "#00ff88", bg: "rgba(0,255,136,0.15)" },
  { id: "cyan", value: "#00d4ff", bg: "rgba(0,212,255,0.15)" },
  { id: "purple", value: "#b06eff", bg: "rgba(176,110,255,0.15)" },
  { id: "orange", value: "#ff7b35", bg: "rgba(255,123,53,0.15)" },
  { id: "pink", value: "#ff4fa3", bg: "rgba(255,79,163,0.15)" },
  { id: "yellow", value: "#ffd700", bg: "rgba(255,215,0,0.15)" },
  { id: "red", value: "#ff4444", bg: "rgba(255,68,68,0.15)" },
  { id: "blue", value: "#4488ff", bg: "rgba(68,136,255,0.15)" },
];

export const HABIT_EMOJIS = [
  "💪", "🏃", "🧘", "🌅", "📚", "💧", "🥗", "😴",
  "🎯", "✍️", "🎸", "🧹", "💊", "🌿", "🏋️", "🚴",
  "🍎", "☕", "🎨", "🧠", "💡", "🔥", "⭐", "🌟",
];

export const CATEGORIES = ["Fitness", "Health", "Mind", "Learning", "Lifestyle", "Morning", "Evening", "Other"];

export const DEFAULT_HABITS: { name: string; emoji: string; category: string }[] = [
  { name: "Wake Up at 7 AM", emoji: "🌅", category: "Morning" },
  { name: "Go to Gym / Run", emoji: "🏋️", category: "Fitness" },
  { name: "Drink 2L Water", emoji: "💧", category: "Health" },
  { name: "Read 20 Pages", emoji: "📚", category: "Learning" },
  { name: "Meditate", emoji: "🧘", category: "Mind" },
];
