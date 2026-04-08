import type { CognitiveState } from "@/lib/types";
import type { SessionStats } from "@/lib/utils/session-storage";

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const ALL_BADGES: Array<Badge & { condition: (s: SessionStats) => boolean }> = [
  {
    id: "tunnel_vision",
    label: "Tunnel Vision",
    icon: "◈",
    color: "#00f5d4",
    description: "Spent over 40% of the session in Locked In state.",
    condition: (s) => s.stateBreakdown.locked_in >= 40,
  },
  {
    id: "the_professional",
    label: "The Professional",
    icon: "◉",
    color: "#00b4d8",
    description: "Focused for the majority of the session with minimal distraction.",
    condition: (s) => s.stateBreakdown.focused >= 50,
  },
  {
    id: "sleep_deprived_wizard",
    label: "Sleep-Deprived Wizard",
    icon: "◎",
    color: "#a855f7",
    description: "Fatigued but still at your desk. Respect.",
    condition: (s) => s.stateBreakdown.tired >= 35,
  },
  {
    id: "chaos_agent",
    label: "Chaos Agent",
    icon: "◌",
    color: "#f59e0b",
    description: "Distracted for over 40% of the session. Bold strategy.",
    condition: (s) => s.stateBreakdown.distracted >= 40,
  },
  {
    id: "confused_genius",
    label: "Confused Genius",
    icon: "⟁",
    color: "#a855f7",
    description: "Deep in the problem space. Results may vary.",
    condition: (s) => s.stateBreakdown.confused_genius >= 30,
  },
  {
    id: "ghost_mode",
    label: "Ghost Mode",
    icon: "◯",
    color: "#6b7280",
    description: "Spent significant time outside the camera frame. Mysterious.",
    condition: (s) => s.stateBreakdown.calibrating >= 30,
  },
  {
    id: "peak_performer",
    label: "Peak Performer",
    icon: "⬡",
    color: "#00f5d4",
    description: "Achieved a focus score above 90. The system is impressed.",
    condition: (s) => s.peakFocusScore >= 90,
  },
  {
    id: "marathon_runner",
    label: "Marathon Runner",
    icon: "▶",
    color: "#00b4d8",
    description: "Worked for over 15 minutes without stopping.",
    condition: (s) => s.durationSeconds >= 900,
  },
];

export function assignBadges(stats: SessionStats): Badge[] {
  const earned = ALL_BADGES.filter((b) => b.condition(stats)).map(
    ({ condition: _c, ...badge }) => badge
  );
  // Return max 3 most relevant badges
  return earned.slice(0, 3);
}

export function generateVerdict(stats: SessionStats, badges: Badge[]): string {
  const { averageFocusScore, dominantState, durationSeconds } = stats;
  const minutes = Math.round(durationSeconds / 60);

  if (dominantState === "locked_in" && averageFocusScore >= 80) {
    return `${minutes} minutes of elite-level focus. The system has nothing more to teach you today.`;
  }
  if (dominantState === "tired") {
    return `${minutes} minutes completed on willpower alone. Sleep is a performance tool. Use it.`;
  }
  if (dominantState === "distracted") {
    return `${minutes} minutes of valiant effort against a formidable opponent: your own attention span.`;
  }
  if (dominantState === "confused_genius") {
    return `${minutes} minutes of deep cognitive wrestling. Whether you solved anything is between you and your compiler.`;
  }
  if (badges.find((b) => b.id === "peak_performer")) {
    return `Focus peaked at ${stats.peakFocusScore}. For a moment, the system believed you were a different person.`;
  }
  if (averageFocusScore >= 70) {
    return `Solid ${minutes}-minute session. Average focus of ${averageFocusScore}. You showed up and did the work.`;
  }
  return `${minutes} minutes logged. Average focus: ${averageFocusScore}. The important thing is you tried.`;
}