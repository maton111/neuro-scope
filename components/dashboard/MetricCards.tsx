"use client";

import { motion } from "framer-motion";
import type { SmoothedMetrics } from "@/lib/types";

interface MetricCardsProps {
  metrics: SmoothedMetrics | null;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="GAZE STABILITY"
        value={metrics?.gazeStability ?? null}
        color={scoreColor(metrics?.gazeStability ?? null, false)}
      />
      <MetricCard
        label="MOTION LEVEL"
        value={metrics?.motionLevel ?? null}
        color={scoreColor(metrics?.motionLevel ?? null, true)}
      />
      <MetricCard
        label="FATIGUE SIGNAL"
        value={metrics?.fatigueSignal ?? null}
        color={scoreColor(metrics?.fatigueSignal ?? null, true)}
      />
      <MetricCard
        label="FACE CONFIDENCE"
        value={metrics ? Math.round(metrics.faceConfidence * 100) : null}
        color={scoreColor(metrics ? Math.round(metrics.faceConfidence * 100) : null, false)}
      />
    </div>
  );
}

function scoreColor(value: number | null, invert: boolean): string {
  if (value === null) return "#6b7280";
  const v = invert ? 100 - value : value;
  if (v > 70) return "#00f5d4";
  if (v > 40) return "#f59e0b";
  return "#ef4444";
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/3 p-4">
      <p className="font-mono text-[9px] text-muted-foreground">{label}</p>
      <motion.p
        className="mt-0.5 font-mono text-xl font-bold"
        style={{ color }}
        animate={{ color }}
        transition={{ duration: 0.4 }}
      >
        {value !== null ? value : "—"}
      </motion.p>
      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/6">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: value !== null ? `${value}%` : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}