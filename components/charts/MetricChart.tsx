"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SessionSnapshot } from "@/lib/types";

interface MetricChartProps {
  snapshots: SessionSnapshot[];
  /** Max number of data points to display */
  window?: number;
}

interface ChartPoint {
  t: number;
  focus: number;
  gaze: number;
}

function toChartData(snapshots: SessionSnapshot[], window: number): ChartPoint[] {
  const slice = snapshots.slice(-window);
  return slice.map((s, i) => ({
    t: i,
    focus: s.metrics.focusScore,
    gaze: s.metrics.gazeStability,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 font-mono text-[10px] backdrop-blur">
      <p className="text-[#00f5d4]">Focus {payload[0]?.value}</p>
      <p className="text-[#00b4d8]">Gaze {payload[1]?.value}</p>
    </div>
  );
}

export function MetricChart({ snapshots, window = 60 }: MetricChartProps) {
  const data = toChartData(snapshots, window);
  const hasData = data.length > 1;

  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] text-muted-foreground">SIGNAL HISTORY</p>
        <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-3 rounded-full bg-[#00f5d4]" />
            FOCUS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-3 rounded-full bg-[#00b4d8]" />
            GAZE
          </span>
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00f5d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gazeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="focus"
              stroke="#00f5d4"
              strokeWidth={1.5}
              fill="url(#focusGrad)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="gaze"
              stroke="#00b4d8"
              strokeWidth={1}
              fill="url(#gazeGrad)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[140px] items-center justify-center">
          <p className="font-mono text-[11px] text-muted-foreground">
            Collecting data…
          </p>
        </div>
      )}
    </div>
  );
}