import type { FaceTrackingResult } from "@/lib/types";

// MediaPipe is loaded dynamically (client-only, WASM)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let faceLandmarker: any = null;
let lastTimestamp = -1;

const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// MediaPipe WASM (Emscripten) writes internal logs via console.error/warn at module
// load time — these are bound before our code runs and trigger the Next.js dev overlay.
// Filter known-harmless patterns so they don't surface as overlay errors.
const MEDIAPIPE_LOG_RE =
  /XNNPACK|TensorFlow Lite|Feedback manager|FaceBlendshapes|gl_context|OpenGL|inference_feedback/i;

if (typeof window !== "undefined") {
  const _error = console.error.bind(console);
  const _warn = console.warn.bind(console);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (msg: any, ...args: any[]) => {
    if (typeof msg === "string" && MEDIAPIPE_LOG_RE.test(msg)) return;
    _error(msg, ...args);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.warn = (msg: any, ...args: any[]) => {
    if (typeof msg === "string" && MEDIAPIPE_LOG_RE.test(msg)) return;
    _warn(msg, ...args);
  };
}

export async function initFaceTracker(): Promise<void> {
  if (faceLandmarker) return;

  const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");

  const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
    runningMode: "VIDEO",
    numFaces: 1,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });
}

export function processFrame(videoEl: HTMLVideoElement): FaceTrackingResult {
  // readyState >= 2 (HAVE_CURRENT_DATA) and actual dimensions required
  if (
    !faceLandmarker ||
    videoEl.readyState < 2 ||
    videoEl.videoWidth === 0 ||
    videoEl.videoHeight === 0
  ) {
    return { facePresent: false, confidence: 0, landmarks: null };
  }

  // MediaPipe requires monotonically increasing timestamps
  const now = performance.now();
  const ts = now <= lastTimestamp ? lastTimestamp + 1 : now;
  lastTimestamp = ts;

  let result: { faceLandmarks?: Array<Array<{ x: number; y: number; z: number }>> };
  try {
    result = faceLandmarker.detectForVideo(videoEl, ts);
  } catch {
    return { facePresent: false, confidence: 0, landmarks: null };
  }

  const face = result.faceLandmarks?.[0];

  if (!face || face.length === 0) {
    return { facePresent: false, confidence: 0, landmarks: null };
  }

  // Derive confidence from how many landmarks are in a reasonable z-range
  const validPoints = face.filter((p: { z: number }) => Math.abs(p.z) < 0.2).length;
  const confidence = Math.min(1, validPoints / face.length);

  return {
    facePresent: true,
    confidence,
    landmarks: { points: face, confidence },
  };
}

export function destroyFaceTracker(): void {
  if (faceLandmarker) {
    faceLandmarker.close?.();
    faceLandmarker = null;
    lastTimestamp = -1;
  }
}