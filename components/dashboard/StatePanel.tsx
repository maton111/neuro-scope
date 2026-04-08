"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CognitiveState } from "@/lib/types";
import { STATE_CONFIG } from "@/lib/vision/heuristics";

const STATE_ICONS: Record<CognitiveState, string> = {
  locked_in: "◈",
  focused: "◉",
  confused_genius: "⟁",
  distracted: "◌",
  tired: "◎",
  calibrating: "◯",
};

interface StatePanelProps {
  state: CognitiveState | null;
  focusScore: number | null;
  peakFocusScore: number;
}

export function StatePanel({ state, focusScore, peakFocusScore }: StatePanelProps) {
  const cfg = state ? STATE_CONFIG[state] : null;
  const icon = state ? STATE_ICONS[state] : "◯";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-700"
      style={{
        borderColor: cfg ? `${cfg.color}30` : "rgba(255,255,255,0.06)",
        background: cfg ? `${cfg.color}06` : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl transition-all duration-700"
        style={{ background: cfg ? `${cfg.color}12` : "transparent" }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-mono text-[10px] text-muted-foreground">COGNITIVE STATE</p>

          <AnimatePresence mode="wait">
            <motion.p
              key={state ?? "none"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-1 text-2xl font-bold tracking-tight"
              style={{ color: cfg?.color ?? "#6b7280" }}
            >
              {cfg?.label ?? "—"}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={cfg?.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-1.5 max-w-xs font-mono text-[10px] leading-relaxed text-muted-foreground"
            >
              {cfg?.description ?? "Start the camera to begin analysis."}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* State icon */}
        <motion.div
          key={state}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border text-2xl"
          style={{
            borderColor: cfg ? `${cfg.color}25` : "rgba(255,255,255,0.06)",
            background: cfg ? `${cfg.color}10` : "rgba(255,255,255,0.03)",
            color: cfg?.color ?? "#6b7280",
          }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Focus score bar */}
      <div className="relative mt-6">
        <div className="mb-1.5 flex justify-between font-mono text-[10px]">
          <span className="text-muted-foreground">FOCUS SCORE</span>
          <span style={{ color: cfg?.color ?? "#6b7280" }}>
            {focusScore !== null ? focusScore : "—"}
            {peakFocusScore > 0 && (
              <span className="ml-2 text-muted-foreground">peak {peakFocusScore}</span>
            )}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: focusScore !== null ? `${focusScore}%` : "0%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: cfg
                ? `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`
                : "#374151",
            }}
          />
        </div>
      </div>
    </div>
  );
}