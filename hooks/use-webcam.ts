"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface WebcamState {
  /** Ref to attach to <video> element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether the video stream is active and playing */
  isStreaming: boolean;
  permissionState: PermissionState;
  error: string | null;
  /** Request webcam access and start the stream */
  start: () => Promise<void>;
  /** Stop the stream and release the camera */
  stop: () => void;
}

export function useWebcam(): WebcamState {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>("idle");
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setPermissionState("idle");
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unavailable");
      setError("Webcam API not available in this browser.");
      return;
    }

    setPermissionState("requesting");
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setPermissionState("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      streamRef.current = null;
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setPermissionState("denied");
        setError("Camera access denied. Please allow access and try again.");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setPermissionState("unavailable");
        setError("No camera found on this device.");
      } else {
        setPermissionState("unavailable");
        setError("Failed to access camera.");
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { videoRef, isStreaming, permissionState, error, start, stop };
}