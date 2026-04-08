import type { FaceTrackingResult, RawMetrics } from "@/lib/types";

// Landmark indices (MediaPipe Face Landmarker 478-point model)
const NOSE_TIP = 4;
const LEFT_EYE_OUTER = 33;
const LEFT_EYE_INNER = 133;
const LEFT_EYE_TOP = 159;
const LEFT_EYE_BOTTOM = 145;
const RIGHT_EYE_OUTER = 362;
const RIGHT_EYE_INNER = 263;
const RIGHT_EYE_TOP = 386;
const RIGHT_EYE_BOTTOM = 374;
const LEFT_EYE_CENTER = 468; // iris center (if available, else fallback)
const RIGHT_EYE_CENTER = 473;

interface Point3D { x: number; y: number; z: number }

// Rolling average buffer
export class RollingAverage {
  private buf: number[] = [];
  constructor(private size: number) {}

  push(v: number): number {
    this.buf.push(v);
    if (this.buf.length > this.size) this.buf.shift();
    return this.buf.reduce((a, b) => a + b, 0) / this.buf.length;
  }

  get value(): number {
    if (this.buf.length === 0) return 0;
    return this.buf.reduce((a, b) => a + b, 0) / this.buf.length;
  }
}

// Per-session state (module-level, reset on new session via resetMetrics())
let prevNose: Point3D | null = null;
let prevGazeVec: { x: number; y: number } | null = null;

const smoothFocus = new RollingAverage(20);
const smoothMotion = new RollingAverage(15);
const smoothGaze = new RollingAverage(20);
const smoothFatigue = new RollingAverage(25);

export function resetMetrics(): void {
  prevNose = null;
  prevGazeVec = null;
  // Reset buffers
  Object.assign(smoothFocus, new RollingAverage(20));
  Object.assign(smoothMotion, new RollingAverage(15));
  Object.assign(smoothGaze, new RollingAverage(20));
  Object.assign(smoothFatigue, new RollingAverage(25));
}

function dist2D(a: Point3D, b: Point3D): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function eyeAspectRatio(
  outer: Point3D, inner: Point3D, top: Point3D, bottom: Point3D
): number {
  const vertical = dist2D(top, bottom);
  const horizontal = dist2D(outer, inner);
  if (horizontal < 0.001) return 0;
  return vertical / horizontal;
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function computeMetrics(result: FaceTrackingResult): RawMetrics {
  if (!result.facePresent || !result.landmarks) {
    // No face — drain metrics toward "bad" state gradually
    return {
      focusScore: smoothFocus.push(0),
      motionLevel: smoothMotion.push(100),
      gazeStability: smoothGaze.push(0),
      fatigueSignal: smoothFatigue.push(100),
      faceConfidence: 0,
      facePresent: false,
    };
  }

  const pts = result.landmarks.points;

  // --- Motion Level ---
  // Based on nose tip displacement between frames (normalized)
  const nose = pts[NOSE_TIP];
  let rawMotion = 0;
  if (prevNose) {
    const delta = Math.sqrt((nose.x - prevNose.x) ** 2 + (nose.y - prevNose.y) ** 2);
    rawMotion = clamp(delta * 2000); // scale: 0.05 delta → 100
  }
  prevNose = nose;
  const motionLevel = smoothMotion.push(rawMotion);

  // --- Gaze Stability ---
  // Gaze vector: nose tip relative to midpoint between eye centers
  const leftEyeC = pts[LEFT_EYE_CENTER] ?? pts[LEFT_EYE_OUTER];
  const rightEyeC = pts[RIGHT_EYE_CENTER] ?? pts[RIGHT_EYE_OUTER];
  const midX = (leftEyeC.x + rightEyeC.x) / 2;
  const midY = (leftEyeC.y + rightEyeC.y) / 2;
  const gazeVec = { x: nose.x - midX, y: nose.y - midY };

  let rawGazeChange = 0;
  if (prevGazeVec) {
    rawGazeChange = Math.sqrt((gazeVec.x - prevGazeVec.x) ** 2 + (gazeVec.y - prevGazeVec.y) ** 2);
  }
  prevGazeVec = gazeVec;
  // High stability = low change
  const rawGazeStability = clamp(100 - rawGazeChange * 3000);
  const gazeStability = smoothGaze.push(rawGazeStability);

  // --- Fatigue Signal (Eye Aspect Ratio) ---
  const earLeft = eyeAspectRatio(
    pts[LEFT_EYE_OUTER], pts[LEFT_EYE_INNER], pts[LEFT_EYE_TOP], pts[LEFT_EYE_BOTTOM]
  );
  const earRight = eyeAspectRatio(
    pts[RIGHT_EYE_OUTER], pts[RIGHT_EYE_INNER], pts[RIGHT_EYE_TOP], pts[RIGHT_EYE_BOTTOM]
  );
  const avgEar = (earLeft + earRight) / 2;
  // EAR normal ~0.25–0.35. Low EAR = eyes closed = fatigue
  // Map: EAR 0.10 → fatigue 100, EAR 0.30 → fatigue 0
  const rawFatigue = clamp((0.30 - avgEar) / 0.20 * 100);
  const fatigueSignal = smoothFatigue.push(rawFatigue);

  // --- Focus Score (composite) ---
  // Weights: gaze 40%, (100-motion) 30%, (100-fatigue) 20%, confidence 10%
  const rawFocus =
    gazeStability * 0.4 +
    (100 - motionLevel) * 0.3 +
    (100 - fatigueSignal) * 0.2 +
    result.confidence * 100 * 0.1;
  const focusScore = smoothFocus.push(clamp(rawFocus));

  return {
    focusScore: Math.round(focusScore),
    motionLevel: Math.round(motionLevel),
    gazeStability: Math.round(gazeStability),
    fatigueSignal: Math.round(fatigueSignal),
    faceConfidence: result.confidence,
    facePresent: true,
  };
}