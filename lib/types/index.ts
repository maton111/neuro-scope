// Core domain types for NeuroScope

export type CognitiveState =
  | "focused"
  | "distracted"
  | "tired"
  | "locked_in"
  | "confused_genius"
  | "calibrating";

export interface RawMetrics {
  /** 0–100 composite focus score */
  focusScore: number;
  /** 0–100 amount of head/body movement detected */
  motionLevel: number;
  /** 0–100 steadiness of gaze direction */
  gazeStability: number;
  /** 0–100 fatigue signal derived from blink patterns */
  fatigueSignal: number;
  /** 0–1 face detection confidence from MediaPipe */
  faceConfidence: number;
  /** Whether a face is present in the frame */
  facePresent: boolean;
}

export interface SmoothedMetrics extends RawMetrics {
  /** Dominant cognitive state derived from metrics */
  state: CognitiveState;
}

export interface SessionSnapshot {
  timestamp: number;
  metrics: SmoothedMetrics;
}

export interface SessionData {
  startedAt: number;
  snapshots: SessionSnapshot[];
  dominantState: CognitiveState;
  peakFocusScore: number;
  averageFocusScore: number;
}

export type CommentaryMode = "roast" | "coach" | "corporate";

export interface CommentaryEntry {
  id: string;
  message: string;
  state: CognitiveState;
  mode: CommentaryMode;
  timestamp: number;
}

export interface FaceLandmarks {
  /** Normalized [x, y, z] for each landmark (468 points) */
  points: Array<{ x: number; y: number; z: number }>;
  /** 0–1 overall detection confidence */
  confidence: number;
}

export interface FaceTrackingResult {
  facePresent: boolean;
  confidence: number;
  landmarks: FaceLandmarks | null;
}
