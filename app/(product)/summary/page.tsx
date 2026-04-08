"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { loadSession, deriveStats, type StoredSession, type SessionStats } from "@/lib/utils/session-storage";
import { assignBadges, generateVerdict, type Badge } from "@/lib/utils/badges";
import { SummaryStats } from "@/components/summary/SummaryStats";
import { StateTimeline } from "@/components/summary/StateTimeline";
import { BadgeDisplay } from "@/components/summary/BadgeDisplay";
import { MetricChart } from "@/components/charts/MetricChart";

export default function SummaryPage() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [verdict, setVerdict] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadSession();
    if (!stored) { setReady(true); return; }

    const s = deriveStats(stored);
    const b = assignBadges(s);
    const v = generateVerdict(s, b);

    setSession(stored);
    setStats(s);
    setBadges(b);
    setVerdict(v);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!session || !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
        <p className="font-mono text-sm text-muted-foreground">No session data found.</p>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#00f5d4] px-6 text-sm font-semibold text-black"
        >
          Start a Session
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-[#00f5d4]">NEURO</span>
          <span className="font-mono text-sm font-bold">SCOPE</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-[#00f5d4]"
        >
          <RotateCcw className="h-3 w-3" />
          New session
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <AnimatePresence>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <p className="font-mono text-xs text-[#00f5d4]">SESSION COMPLETE</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Analysis Report
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {verdict}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-6">
          {/* Key stats */}
          <SummaryStats stats={stats} />

          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <p className="mb-3 font-mono text-[10px] text-muted-foreground">
                SESSION BADGES
              </p>
              <BadgeDisplay badges={badges} />
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <StateTimeline snapshots={session.snapshots} />
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <MetricChart snapshots={session.snapshots} window={session.snapshots.length} />
          </motion.div>

          {/* State breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <StateBreakdown stats={stats} />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#00f5d4] px-8 font-semibold text-black transition-all hover:bg-[#00d4b6] hover:shadow-[0_0_32px_rgba(0,245,212,0.25)]"
            >
              <RotateCcw className="h-4 w-4" />
              Start New Session
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/4 px-8 font-semibold transition-colors hover:bg-white/8"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function StateBreakdown({ stats }: { stats: SessionStats }) {
  const entries = Object.entries(stats.stateBreakdown)
    .filter(([, pct]) => pct > 0)
    .sort(([, a], [, b]) => b - a);

  const STATE_COLORS: Record<string, string> = {
    locked_in: "#00f5d4",
    focused: "#00b4d8",
    confused_genius: "#a855f7",
    distracted: "#f59e0b",
    tired: "#ef4444",
    calibrating: "#6b7280",
  };

  const STATE_LABELS: Record<string, string> = {
    locked_in: "Locked In",
    focused: "Focused",
    confused_genius: "Confused Genius",
    distracted: "Distracted",
    tired: "Tired",
    calibrating: "Calibrating",
  };

  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
      <p className="mb-4 font-mono text-[10px] text-muted-foreground">STATE BREAKDOWN</p>
      <div className="flex flex-col gap-3">
        {entries.map(([state, pct]) => (
          <div key={state} className="flex items-center gap-3">
            <span className="w-28 font-mono text-[10px] text-muted-foreground">
              {STATE_LABELS[state] ?? state}
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-white/6 h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: STATE_COLORS[state] ?? "#6b7280" }}
              />
            </div>
            <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}