"use client";

import { motion } from "framer-motion";
import type { SessionStats } from "@/lib/utils/session-storage";
import { STATE_CONFIG } from "@/lib/vision/heuristics";

interface SummaryStatsProps {
  stats: SessionStats;
}

function formatDuration(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
}

export function SummaryStats({ stats }: SummaryStatsProps) {
  const domCfg = STATE_CONFIG[stats.dominantState];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="AVG FOCUS"
        value={`${stats.averageFocusScore}`}
        sub="out of 100"
        color="#00f5d4"
        delay={0}
      />
      <StatCard
        label="PEAK FOCUS"
        value={`${stats.peakFocusScore}`}
        sub="highest recorded"
        color="#00b4d8"
        delay={0.08}
      />
      <StatCard
        label="DURATION"
        value={formatDuration(stats.durationSeconds)}
        sub="session length"
        color="#a855f7"
        delay={0.16}
      />
      <StatCard
        label="DOMINANT STATE"
        value={domCfg.label}
        sub={`${stats.stateBreakdown[stats.dominantState]}% of session`}
        color={domCfg.color}
        delay={0.24}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-white/6 bg-white/3 p-5"
    >
      <p className="font-mono text-[9px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{sub}</p>
    </motion.div>
  );
}