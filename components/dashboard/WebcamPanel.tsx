"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, AlertTriangle, Loader2 } from "lucide-react";
import { type WebcamState } from "@/hooks/use-webcam";

interface WebcamPanelProps {
  webcam: WebcamState;
  /** Optional ref for the canvas overlay (drawn by the vision loop) */
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  sessionDuration?: number;
}

export function WebcamPanel({ webcam, canvasRef, sessionDuration }: WebcamPanelProps) {
  const { videoRef, isStreaming, permissionState, error, start, stop } = webcam;

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-black">
      {/* Video element — always mounted so ref is available */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        style={{ display: isStreaming ? "block" : "none", transform: "scaleX(-1)" }}
      />

      {/* Canvas overlay for landmarks */}
      {canvasRef && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ display: isStreaming ? "block" : "none", transform: "scaleX(-1)" }}
        />
      )}

      {/* Corner brackets — visible when streaming */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0"
          >
            <CornerBrackets />
            <ScanLine />
            <StatusBar duration={sessionDuration} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle / requesting / error overlay */}
      <AnimatePresence>
        {!isStreaming && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm"
          >
            <OverlayContent
              permissionState={permissionState}
              error={error}
              onStart={start}
              onStop={stop}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stop button — visible when streaming */}
      <AnimatePresence>
        {isStreaming && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={stop}
            aria-label="Stop camera"
            className="absolute bottom-4 right-4 flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 font-mono text-[10px] text-white/60 backdrop-blur-sm transition-colors hover:border-red-400/40 hover:text-red-400"
          >
            <CameraOff className="h-3 w-3" />
            Stop
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverlayContent({
  permissionState,
  error,
  onStart,
}: {
  permissionState: WebcamState["permissionState"];
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}) {
  if (permissionState === "requesting") {
    return (
      <>
        <Loader2 className="h-8 w-8 animate-spin text-[#00f5d4]" />
        <p className="font-mono text-xs text-muted-foreground">Requesting camera access…</p>
      </>
    );
  }

  if (permissionState === "denied" || permissionState === "unavailable") {
    return (
      <>
        <AlertTriangle className="h-8 w-8 text-amber-400" />
        <p className="max-w-[240px] text-center font-mono text-xs text-muted-foreground">
          {error}
        </p>
        {permissionState === "denied" && (
          <button
            onClick={onStart}
            className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 font-mono text-xs text-white transition-colors hover:bg-white/10"
          >
            Try again
          </button>
        )}
      </>
    );
  }

  // idle
  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00f5d4]/20 bg-[#00f5d4]/8"
      >
        <Camera className="h-7 w-7 text-[#00f5d4]" />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">Enable camera</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          Processed locally · nothing is uploaded
        </p>
      </div>
      <button
        onClick={onStart}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#00f5d4] px-6 text-sm font-semibold text-black transition-all hover:bg-[#00d4b6] hover:shadow-[0_0_24px_rgba(0,245,212,0.3)]"
      >
        <Camera className="h-4 w-4" />
        Start Analysis
      </button>
    </>
  );
}

function CornerBrackets() {
  const cls = "absolute h-5 w-5 border-[#00f5d4]/50";
  return (
    <>
      <span className={`${cls} top-3 left-3 border-t border-l`} />
      <span className={`${cls} top-3 right-3 border-t border-r`} />
      <span className={`${cls} bottom-3 left-3 border-b border-l`} />
      <span className={`${cls} bottom-3 right-3 border-b border-r`} />
    </>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00f5d4]/30 to-transparent"
      animate={{ top: ["5%", "95%", "5%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  );
}

function StatusBar({ duration }: { duration?: number }) {
  const formatted = duration !== undefined ? formatDuration(duration) : null;
  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00f5d4]" />
      <span className="font-mono text-[9px] text-[#00f5d4]/70">
        LIVE{formatted ? ` · ${formatted}` : ""}
      </span>
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}