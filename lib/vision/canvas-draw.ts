// Draws face landmarks onto a canvas element

// MediaPipe face landmark indices for key features
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
const LIPS_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];

interface Point { x: number; y: number; z: number }

export function drawFaceLandmarks(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);

  const toScreen = (p: Point) => ({ x: p.x * width, y: p.y * height });

  // Draw sparse landmark dots (every 4th point for performance)
  ctx.fillStyle = "rgba(0, 245, 212, 0.25)";
  for (let i = 0; i < points.length; i += 4) {
    const { x, y } = toScreen(points[i]);
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw eye contours
  drawContour(ctx, points, LEFT_EYE, width, height, "rgba(0, 245, 212, 0.6)", true);
  drawContour(ctx, points, RIGHT_EYE, width, height, "rgba(0, 245, 212, 0.6)", true);

  // Draw lips
  drawContour(ctx, points, LIPS_OUTER, width, height, "rgba(0, 245, 212, 0.35)", true);

  // Face bounding box (loose oval via min/max)
  drawFaceOval(ctx, points, width, height);
}

function drawContour(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  indices: number[],
  w: number,
  h: number,
  color: string,
  close: boolean
): void {
  const valid = indices.filter((i) => i < points.length);
  if (valid.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const first = points[valid[0]];
  ctx.moveTo(first.x * w, first.y * h);
  for (let i = 1; i < valid.length; i++) {
    const p = points[valid[i]];
    ctx.lineTo(p.x * w, p.y * h);
  }
  if (close) ctx.closePath();
  ctx.stroke();
}

function drawFaceOval(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  w: number,
  h: number
): void {
  if (points.length === 0) return;
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const cx = ((minX + maxX) / 2) * w;
  const cy = ((minY + maxY) / 2) * h;
  const rx = ((maxX - minX) / 2) * w * 1.1;
  const ry = ((maxY - minY) / 2) * h * 1.05;

  ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}