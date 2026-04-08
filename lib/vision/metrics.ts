// Stub — implemented in Phase 5
// Derives SmoothedMetrics from FaceTrackingResult using rolling averages

import type { FaceTrackingResult, SmoothedMetrics } from "@/lib/types";

export function computeMetrics(
  _result: FaceTrackingResult,
  _previous: SmoothedMetrics | null
): SmoothedMetrics {
  throw new Error("computeMetrics not yet implemented — Phase 5");
}
