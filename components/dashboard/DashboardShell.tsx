"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useWebcam } from "@/hooks/use-webcam";
import { useVisionLoop } from "@/hooks/use-vision-loop";
import { useSessionMetrics } from "@/hooks/use-session-metrics";
import { useCommentary } from "@/hooks/use-commentary";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import { StatePanel } from "@/components/dashboard/StatePanel";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { MetricChart } from "@/components/charts/MetricChart";
import { CommentaryFeed } from "@/components/dashboard/CommentaryFeed";
import type { CommentaryMode, FaceTrackingResult } from "@/lib/types";

export function DashboardShell() {
  const webcam = useWebcam();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [commentaryMode, setCommentaryMode] = useState<CommentaryMode>("coach");

  const { current, snapshots, peakFocusScore, processResult } =
    useSessionMetrics(webcam.isStreaming);

  const commentaryEntries = useCommentary(
    current?.state ?? null,
    commentaryMode,
    webcam.isStreaming
  );

  const handleResult = useCallback(
    (result: FaceTrackingResult) => processResult(result),
    [processResult]
  );

  const vision = useVisionLoop({
    videoRef: webcam.videoRef,
    canvasRef,
    isStreaming: webcam.isStreaming,
    onResult: handleResult,
  });

  useEffect(() => {
    if (!webcam.isStreaming) { setDuration(0); return; }
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [webcam.isStreaming]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/6 bg-background/90 px-6 py-3 backdrop-blur-xl">
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← NeuroScope
        </Link>

        <div className="flex items-center gap-3">
          {webcam.isStreaming && (
            <span className="font-mono text-xs text-muted-foreground">
              {formatDuration(duration)}
            </span>
          )}
          <VisionChip status={vision.status} isStreaming={webcam.isStreaming} />
        </div>
      </header>

      {/* ── Main grid ── */}
      <main className="flex flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[minmax(0,480px)_1fr] lg:items-start lg:gap-6 lg:p-6">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">
          <WebcamPanel
            webcam={webcam}
            canvasRef={canvasRef}
            sessionDuration={duration}
          />
          {vision.error && (
            <p className="font-mono text-[10px] text-amber-400">{vision.error}</p>
          )}
          {webcam.isStreaming && snapshots.length > 0 && (
            <Link
              href="/summary"
              onClick={webcam.stop}
              className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/4 font-mono text-xs text-muted-foreground transition-colors hover:border-[#00f5d4]/20 hover:text-[#00f5d4]"
            >
              End Session → View Summary
            </Link>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">
          <StatePanel
            state={current?.state ?? null}
            focusScore={current?.focusScore ?? null}
            peakFocusScore={peakFocusScore}
          />
          <MetricCards metrics={current} />
          <MetricChart snapshots={snapshots} window={60} />
          <CommentaryFeed
            entries={commentaryEntries}
            mode={commentaryMode}
            onModeChange={setCommentaryMode}
          />
        </div>
      </main>
    </div>
  );
}

function VisionChip({ status, isStreaming }: { status: string; isStreaming: boolean }) {
  if (!isStreaming)
    return <span className="font-mono text-xs text-muted-foreground">STANDBY</span>;
  if (status === "initializing")
    return (
      <span className="flex items-center gap-1.5 font-mono text-xs text-[#00f5d4]/70">
        <Loader2 className="h-3 w-3 animate-spin" />
        LOADING
      </span>
    );
  if (status === "error")
    return <span className="font-mono text-xs text-amber-400">ERROR</span>;
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-[#00f5d4]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00f5d4]" />
      LIVE
    </span>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}