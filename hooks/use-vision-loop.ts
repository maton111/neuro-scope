"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceTrackingResult } from "@/lib/types";

const TARGET_FPS = 15;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export type VisionStatus = "idle" | "initializing" | "ready" | "error";

interface UseVisionLoopOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  onResult: (result: FaceTrackingResult) => void;
}

export interface VisionLoopState {
  status: VisionStatus;
  error: string | null;
}

export function useVisionLoop({
  videoRef,
  canvasRef,
  isStreaming,
  onResult,
}: UseVisionLoopOptions): VisionLoopState {
  const [status, setStatus] = useState<VisionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const activeRef = useRef(false);

  // Lazy-import vision modules to keep them client-only
  const processRef = useRef<typeof import("@/lib/vision/face-tracker").processFrame | null>(null);
  const drawRef = useRef<typeof import("@/lib/vision/canvas-draw").drawFaceLandmarks | null>(null);

  const init = useCallback(async () => {
    setStatus("initializing");
    setError(null);
    try {
      const [{ initFaceTracker, processFrame }, { drawFaceLandmarks }] = await Promise.all([
        import("@/lib/vision/face-tracker"),
        import("@/lib/vision/canvas-draw"),
      ]);
      await initFaceTracker();
      processRef.current = processFrame;
      drawRef.current = drawFaceLandmarks;
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Vision engine failed to load.");
    }
  }, []);

  const loop = useCallback(
    (now: number) => {
      if (!activeRef.current) return;

      if (now - lastFrameRef.current >= FRAME_INTERVAL) {
        lastFrameRef.current = now;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && video.readyState >= 2 && processRef.current) {
          const result = processRef.current(video);
          onResult(result);

          if (canvas && drawRef.current) {
            const w = video.videoWidth;
            const h = video.videoHeight;
            if (canvas.width !== w) canvas.width = w;
            if (canvas.height !== h) canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              if (result.landmarks) {
                drawRef.current(ctx, result.landmarks.points, w, h);
              } else {
                ctx.clearRect(0, 0, w, h);
              }
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [videoRef, canvasRef, onResult]
  );

  // Start / stop loop based on streaming state
  useEffect(() => {
    if (!isStreaming) {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      // Clear canvas on stop
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    if (status === "idle") {
      init();
      return;
    }

    if (status === "ready") {
      activeRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isStreaming, status, init, loop, canvasRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      import("@/lib/vision/face-tracker").then(({ destroyFaceTracker }) =>
        destroyFaceTracker()
      );
    };
  }, []);

  return { status, error };
}