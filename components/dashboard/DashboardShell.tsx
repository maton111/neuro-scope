"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWebcam } from "@/hooks/use-webcam";
import { useVisionLoop } from "@/hooks/use-vision-loop";
import { WebcamPanel } from "@/components/dashboard/WebcamPanel";
import type { FaceTrackingResult } from "@/lib/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function DashboardShell() {
  const webcam = useWebcam();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [lastResult, setLastResult] = useState<FaceTrackingResult | null>(null);

  const handleResult = useCallback((result: FaceTrackingResult) => {
    setLastResult(result);
  }, []);

  const vision = useVisionLoop({
    videoRef: webcam.videoRef,
    canvasRef,
    isStreaming: webcam.isStreaming,
    onResult: handleResult,
  });

  // Session timer
  useEffect(() => {
    if (!webcam.isStreaming) { setDuration(0); return; }
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [webcam.isStreaming]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <Link href="/" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-[#00f5d4]">NEURO</span>
          <span className="font-mono text-sm font-bold">SCOPE</span>
        </div>
        <VisionStatusChip status={vision.status} isStreaming={webcam.isStreaming} />
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Webcam panel */}
        <div className="w-full lg:max-w-xl">
          <WebcamPanel webcam={webcam} canvasRef={canvasRef} sessionDuration={duration} />

          {/* Vision error */}
          {vision.error && (
            <p className="mt-2 font-mono text-[11px] text-amber-400">{vision.error}</p>
          )}
        </div>

        {/* Debug / placeholder panel */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
            <p className="font-mono text-[10px] text-muted-foreground">FACE TRACKING DEBUG</p>
            {lastResult ? (
              <div className="mt-3 flex flex-col gap-2 font-mono text-xs">
                <Row label="Face present" value={lastResult.facePresent ? "YES" : "NO"} accent={lastResult.facePresent} />
                <Row label="Confidence" value={`${(lastResult.confidence * 100).toFixed(0)}%`} />
                <Row label="Landmarks" value={lastResult.landmarks ? `${lastResult.landmarks.points.length} pts` : "—"} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {webcam.isStreaming ? "Waiting for first frame…" : "Start the camera to begin."}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
            <p className="font-mono text-[10px] text-muted-foreground">METRICS PANEL</p>
            <p className="mt-2 text-sm text-muted-foreground">Coming in Phase 5 & 6.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function VisionStatusChip({
  status,
  isStreaming,
}: {
  status: string;
  isStreaming: boolean;
}) {
  if (!isStreaming) return <span className="font-mono text-xs text-muted-foreground">READY</span>;
  if (status === "initializing") {
    return (
      <span className="flex items-center gap-1.5 font-mono text-xs text-[#00f5d4]/70">
        <Loader2 className="h-3 w-3 animate-spin" /> LOADING MODEL
      </span>
    );
  }
  if (status === "error") {
    return <span className="font-mono text-xs text-amber-400">VISION ERROR</span>;
  }
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-[#00f5d4]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00f5d4]" />
      TRACKING
    </span>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-[#00f5d4]" : "text-foreground"}>{value}</span>
    </div>
  );
}