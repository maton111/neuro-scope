"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CognitiveState, CommentaryEntry, CommentaryMode } from "@/lib/types";

const COOLDOWN_MS = 8000;
const STABILITY_MS = 2500; // state must be stable this long before firing

export function useCommentary(
  state: CognitiveState | null,
  mode: CommentaryMode,
  isStreaming: boolean
) {
  const [entries, setEntries] = useState<CommentaryEntry[]>([]);

  const lastFiredRef = useRef<number>(0);
  const stableStateRef = useRef<CognitiveState | null>(null);
  const stableSinceRef = useRef<number>(0);
  const generateRef = useRef<typeof import("@/lib/ai/commentary").generateComment | null>(null);

  // Load commentary module lazily
  useEffect(() => {
    import("@/lib/ai/commentary").then((m) => {
      generateRef.current = m.generateComment;
    });
  }, []);

  // Track state stability
  useEffect(() => {
    if (state !== stableStateRef.current) {
      stableStateRef.current = state;
      stableSinceRef.current = Date.now();
    }
  }, [state]);

  // Reset on session stop
  useEffect(() => {
    if (!isStreaming) {
      setEntries([]);
      lastFiredRef.current = 0;
    }
  }, [isStreaming]);

  const tick = useCallback(() => {
    if (!isStreaming || !state || state === "calibrating") return;
    if (!generateRef.current) return;

    const now = Date.now();
    if (now - lastFiredRef.current < COOLDOWN_MS) return;
    if (now - stableSinceRef.current < STABILITY_MS) return;

    lastFiredRef.current = now;
    const entry = generateRef.current(state, mode);
    setEntries((prev) => [...prev.slice(-29), entry]); // keep last 30
  }, [isStreaming, state, mode]);

  // Fire on interval
  useEffect(() => {
    if (!isStreaming) return;
    // Initial comment after stability settles
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isStreaming, tick]);

  return entries;
}