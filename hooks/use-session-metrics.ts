"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceTrackingResult, SessionSnapshot, SmoothedMetrics } from "@/lib/types";

const SNAPSHOT_INTERVAL_MS = 1000;

export interface SessionMetricsState {
  current: SmoothedMetrics | null;
  snapshots: SessionSnapshot[];
  peakFocusScore: number;
  sessionStartedAt: number | null;
}

export function useSessionMetrics(isStreaming: boolean) {
  const [state, setState] = useState<SessionMetricsState>({
    current: null,
    snapshots: [],
    peakFocusScore: 0,
    sessionStartedAt: null,
  });

  // Lazy-import to keep metrics/heuristics client-only
  const computeRef = useRef<typeof import("@/lib/vision/metrics").computeMetrics | null>(null);
  const resolveRef = useRef<typeof import("@/lib/vision/heuristics").resolveState | null>(null);
  const resetRef = useRef<typeof import("@/lib/vision/metrics").resetMetrics | null>(null);

  const lastSnapshotRef = useRef<number>(0);

  // Load modules once
  useEffect(() => {
    Promise.all([
      import("@/lib/vision/metrics"),
      import("@/lib/vision/heuristics"),
    ]).then(([metricsModule, heuristicsModule]) => {
      computeRef.current = metricsModule.computeMetrics;
      resetRef.current = metricsModule.resetMetrics;
      resolveRef.current = heuristicsModule.resolveState;
    });
  }, []);

  // Reset on session start/stop
  useEffect(() => {
    if (isStreaming) {
      resetRef.current?.();
      lastSnapshotRef.current = 0;
      setState({
        current: null,
        snapshots: [],
        peakFocusScore: 0,
        sessionStartedAt: Date.now(),
      });
    } else {
      setState((prev) => ({ ...prev, sessionStartedAt: null }));
    }
  }, [isStreaming]);

  const processResult = useCallback((result: FaceTrackingResult) => {
    if (!computeRef.current || !resolveRef.current) return;

    const raw = computeRef.current(result);
    const state_ = resolveRef.current(raw);
    const smoothed: SmoothedMetrics = { ...raw, state: state_ };

    const now = Date.now();
    const snap: SessionSnapshot = { timestamp: now, metrics: smoothed };

    setState((prev) => {
      const newSnapshots =
        now - lastSnapshotRef.current >= SNAPSHOT_INTERVAL_MS
          ? [...prev.snapshots.slice(-299), snap] // keep last 5 min at 1fps
          : prev.snapshots;

      if (now - lastSnapshotRef.current >= SNAPSHOT_INTERVAL_MS) {
        lastSnapshotRef.current = now;
      }

      return {
        current: smoothed,
        snapshots: newSnapshots,
        peakFocusScore: Math.max(prev.peakFocusScore, smoothed.focusScore),
        sessionStartedAt: prev.sessionStartedAt,
      };
    });
  }, []);

  return { ...state, processResult };
}