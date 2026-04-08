import type { CognitiveState, SessionSnapshot } from "@/lib/types";

const KEY = "neuroscope_session";

export interface StoredSession {
  startedAt: number;
  endedAt: number;
  snapshots: SessionSnapshot[];
  peakFocusScore: number;
}

export function saveSession(data: StoredSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — silently skip
  }
}

export function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

// ── Derived stats ──────────────────────────────────────────────

export interface SessionStats {
  durationSeconds: number;
  averageFocusScore: number;
  peakFocusScore: number;
  dominantState: CognitiveState;
  stateBreakdown: Record<CognitiveState, number>; // percentage 0-100
  snapshotCount: number;
}

export function deriveStats(session: StoredSession): SessionStats {
  const { snapshots, startedAt, endedAt, peakFocusScore } = session;
  const durationSeconds = Math.round((endedAt - startedAt) / 1000);

  if (snapshots.length === 0) {
    return {
      durationSeconds,
      averageFocusScore: 0,
      peakFocusScore,
      dominantState: "calibrating",
      stateBreakdown: emptyBreakdown(),
      snapshotCount: 0,
    };
  }

  const averageFocusScore = Math.round(
    snapshots.reduce((a, s) => a + s.metrics.focusScore, 0) / snapshots.length
  );

  // State counts
  const counts: Record<CognitiveState, number> = emptyBreakdown() as Record<CognitiveState, number>;
  for (const s of snapshots) counts[s.metrics.state]++;

  const dominantState = (Object.entries(counts) as [CognitiveState, number][]).reduce(
    (best, [state, count]) => (count > best[1] ? [state, count] : best),
    ["calibrating", 0] as [CognitiveState, number]
  )[0];

  const total = snapshots.length;
  const stateBreakdown = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)])
  ) as Record<CognitiveState, number>;

  return {
    durationSeconds,
    averageFocusScore,
    peakFocusScore,
    dominantState,
    stateBreakdown,
    snapshotCount: snapshots.length,
  };
}

function emptyBreakdown(): Record<string, number> {
  return {
    locked_in: 0,
    focused: 0,
    distracted: 0,
    tired: 0,
    confused_genius: 0,
    calibrating: 0,
  };
}