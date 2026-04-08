"use client";

import { motion } from "framer-motion";
import type { SessionSnapshot } from "@/lib/types";
import { STATE_CONFIG } from "@/lib/vision/heuristics";

interface StateTimelineProps {
  snapshots: SessionSnapshot[];
}

interface Segment {
  state: string;
  pct: number;
  color: string;
  label: string;
}

function buildSegments(snapshots: SessionSnapshot[]): Segment[] {
  if (snapshots.length === 0) return [];

  const raw: Array<{ state: string; count: number }> = [];
  let current = snapshots[0].metrics.state;
  let count = 1;

  for (let i = 1; i < snapshots.length; i++) {
    const s = snapshots[i].metrics.state;
    if (s === current) {
      count++;
    } else {
      raw.push({ state: current, count });
      current = s;
      count = 1;
    }
  }
  raw.push({ state: current, count });

  const total = snapshots.length;
  return raw.map((seg) => ({
    state: seg.state,
    pct: (seg.count / total) * 100,
    color: STATE_CONFIG[seg.state as keyof typeof STATE_CONFIG]?.color ?? "#6b7280",
    label: STATE_CONFIG[seg.state as keyof typeof STATE_CONFIG]?.label ?? seg.state,
  }));
}

export function StateTimeline({ snapshots }: StateTimelineProps) {
  const segments = buildSegments(snapshots);

  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
      <p className="mb-4 font-mono text-[10px] text-muted-foreground">STATE TIMELINE</p>

      {segments.length === 0 ? (
        <p className="font-mono text-[11px] text-muted-foreground">No data recorded.</p>
      ) : (
        <>
          {/* Bar */}
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            {segments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                style={{ width: `${seg.pct}%`, background: seg.color }}
                className="h-full"
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {segments
              .filter((s, i, arr) => arr.findIndex((x) => x.state === s.state) === i)
              .map((seg) => (
                <div key={seg.state} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: seg.color }}
                  />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {seg.label}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}