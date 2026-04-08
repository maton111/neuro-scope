// Stub — implemented in Phase 4
// MediaPipe Face Landmarker adapter
// Will expose: init(), processFrame(), destroy()

import type { FaceTrackingResult } from "@/lib/types";

export async function initFaceTracker(): Promise<void> {
  throw new Error("initFaceTracker not yet implemented — Phase 4");
}

export function processFrame(_videoEl: HTMLVideoElement): FaceTrackingResult {
  throw new Error("processFrame not yet implemented — Phase 4");
}

export function destroyFaceTracker(): void {
  // noop stub
}
