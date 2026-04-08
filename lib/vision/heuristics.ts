import type { CognitiveState, RawMetrics } from "@/lib/types";

export interface StateConfig {
  label: string;
  color: string;
  description: string;
}

export const STATE_CONFIG: Record<CognitiveState, StateConfig> = {
  locked_in: {
    label: "Locked In",
    color: "#00f5d4",
    description: "Peak cognitive performance. Minimal distraction signal.",
  },
  focused: {
    label: "Focused",
    color: "#00b4d8",
    description: "Sustained attention detected. Operating within parameters.",
  },
  confused_genius: {
    label: "Confused Genius",
    color: "#a855f7",
    description: "Elevated cognitive load. Deep problem-solving in progress.",
  },
  distracted: {
    label: "Distracted",
    color: "#f59e0b",
    description: "Attention fragmentation detected. Re-centering recommended.",
  },
  tired: {
    label: "Tired",
    color: "#ef4444",
    description: "Fatigue markers elevated. Blink rate and EAR declining.",
  },
  calibrating: {
    label: "Calibrating",
    color: "#6b7280",
    description: "Face signal lost. Awaiting stable tracking input.",
  },
};

export function resolveState(metrics: RawMetrics): CognitiveState {
  if (!metrics.facePresent || metrics.faceConfidence < 0.3) {
    return "calibrating";
  }

  const { focusScore, motionLevel, gazeStability, fatigueSignal } = metrics;

  // Priority order matters
  if (fatigueSignal > 65) return "tired";

  if (focusScore > 84 && motionLevel < 18 && gazeStability > 78) return "locked_in";

  if (motionLevel > 55 || gazeStability < 32) return "distracted";

  if (focusScore > 60 && motionLevel < 40) return "focused";

  if (focusScore >= 40 && focusScore <= 70 && motionLevel > 25) return "confused_genius";

  if (focusScore < 40) return "distracted";

  return "focused";
}