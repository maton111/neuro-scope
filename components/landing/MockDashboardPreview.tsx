"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

function useOscillator(base: number, amplitude: number, freq: number) {
  const [value, setValue] = useState(base);
  const t = useRef(Math.random() * 100);
  useAnimationFrame((_, delta) => {
    t.current += delta * 0.001 * freq;
    setValue(Math.round(base + Math.sin(t.current) * amplitude));
  });
  return value;
}

function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-mono text-[10px]">
        <span className="text-white/40">{label}</span>
        <span className="text-[#00f5d4]">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/6">
        <motion.div
          className="h-full rounded-full bg-[#00f5d4]"
          style={{ width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const COMMENTS = [
  "Gaze stability optimal. Executing at capacity.",
  "Focus score exceeding baseline by 34%.",
  "Motion pattern suggests deep concentration.",
  "Blink rate normalized. Fatigue subsiding.",
  "Cognitive throughput: elevated.",
];

export function MockDashboardPreview() {
  const focus = useOscillator(82, 8, 0.4);
  const gaze = useOscillator(89, 6, 0.3);
  const motion_ = useOscillator(15, 10, 0.7);
  const fatigue = useOscillator(18, 7, 0.25);

  const commentIdx = Math.floor((focus / 100) * COMMENTS.length) % COMMENTS.length;

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 backdrop-blur-xl"
        >
          {/* Glow top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #00f5d4, transparent)" }}
          />

          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#00f5d4]" />
              <span className="font-mono text-xs text-[#00f5d4]">NEUROSCOPE / LIVE SESSION</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-white/30">00:04:37</span>
              <span className="rounded-full border border-[#00f5d4]/20 bg-[#00f5d4]/8 px-3 py-0.5 font-mono text-[10px] text-[#00f5d4]">
                LOCKED IN
              </span>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            {/* Left — webcam mock */}
            <div className="relative flex items-center justify-center border-r border-white/6 p-8">
              <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-white/3">
                {/* Simulated face outline */}
                <svg
                  viewBox="0 0 400 300"
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                >
                  {/* Face oval */}
                  <ellipse
                    cx="200"
                    cy="150"
                    rx="90"
                    ry="110"
                    stroke="#00f5d4"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    strokeDasharray="4 4"
                  />
                  {/* Eye left */}
                  <ellipse cx="165" cy="128" rx="14" ry="8" stroke="#00f5d4" strokeWidth="1" strokeOpacity="0.5" />
                  {/* Eye right */}
                  <ellipse cx="235" cy="128" rx="14" ry="8" stroke="#00f5d4" strokeWidth="1" strokeOpacity="0.5" />
                  {/* Nose */}
                  <path d="M200 140 L190 168 L210 168" stroke="#00f5d4" strokeWidth="0.8" strokeOpacity="0.3" strokeLinejoin="round" />
                  {/* Mouth */}
                  <path d="M180 190 Q200 200 220 190" stroke="#00f5d4" strokeWidth="1" strokeOpacity="0.4" />
                  {/* Corner brackets */}
                  <path d="M60 30 L60 60 L90 60" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M340 30 L340 60 L310 60" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M60 270 L60 240 L90 240" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M340 270 L340 240 L310 240" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.6" />
                  {/* Landmark dots scattered on face */}
                  {[
                    [165, 128],[235, 128],[200, 150],[190, 168],[210, 168],
                    [180, 190],[220, 190],[200, 110],[155, 110],[245, 110],
                    [170, 100],[230, 100],[200, 95],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2" fill="#00f5d4" fillOpacity="0.5" />
                  ))}
                </svg>

                {/* Scan line animation */}
                <motion.div
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00f5d4]/40 to-transparent"
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Bottom label */}
                <div className="absolute bottom-3 left-3 font-mono text-[9px] text-[#00f5d4]/60">
                  FACE DETECTED · 468 LANDMARKS · 15 FPS
                </div>
              </div>
            </div>

            {/* Right — metrics */}
            <div className="flex flex-col gap-6 p-6">
              {/* Focus score big */}
              <div className="rounded-xl border border-white/6 bg-white/3 p-4">
                <p className="font-mono text-[10px] text-white/40">FOCUS SCORE</p>
                <motion.p
                  key={focus}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 font-mono text-4xl font-bold text-[#00f5d4]"
                >
                  {focus}
                </motion.p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${focus}%`,
                      background: "linear-gradient(90deg, #00b4d8, #00f5d4)",
                    }}
                    animate={{ width: `${focus}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Other metrics */}
              <div className="flex flex-col gap-4 rounded-xl border border-white/6 bg-white/3 p-4">
                <MetricBar label="GAZE STABILITY" value={gaze} />
                <MetricBar label="MOTION LEVEL" value={motion_} />
                <MetricBar label="FATIGUE SIGNAL" value={fatigue} />
              </div>

              {/* Commentary */}
              <div className="rounded-xl border border-[#00f5d4]/10 bg-[#00f5d4]/4 p-4">
                <p className="font-mono text-[10px] text-[#00f5d4]/60">SYSTEM COMMENTARY</p>
                <motion.p
                  key={commentIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 text-xs leading-relaxed text-white/70"
                >
                  {COMMENTS[commentIdx]}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center font-mono text-xs text-muted-foreground"
        >
          Live preview — metrics are simulated
        </motion.p>
      </div>
    </section>
  );
}