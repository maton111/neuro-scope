"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,245,212,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Badge */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#00f5d4]/20 bg-[#00f5d4]/5 px-4 py-1.5 font-mono text-xs text-[#00f5d4]">
          <Zap className="h-3 w-3" />
          Real-time cognitive presence analysis
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
      >
        Your brain on a{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #00f5d4 0%, #00b4d8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          dashboard
        </span>
        .
      </motion.h1>

      {/* Subline */}
      <motion.p
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
      >
        NeuroScope watches you work. It reads your face, scores your focus, and
        delivers real-time cognitive telemetry with the confidence of something
        that knows what it&apos;s doing.
      </motion.p>

      {/* CTA */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Link
          href="/dashboard"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#00f5d4] px-8 font-semibold text-black transition-all hover:bg-[#00d4b6] hover:shadow-[0_0_32px_rgba(0,245,212,0.3)]"
        >
          Start Analysis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          No signup. No data leaves your browser.
        </span>
      </motion.div>

      {/* Floating metric chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <FloatingChip label="FOCUS SCORE" value="87" top="22%" left="8%" delay={0} />
        <FloatingChip label="GAZE STABILITY" value="94" top="35%" right="7%" delay={0.3} />
        <FloatingChip label="STATE" value="LOCKED IN" top="65%" left="6%" delay={0.6} />
        <FloatingChip label="FATIGUE" value="12%" top="72%" right="9%" delay={0.9} />
      </motion.div>
    </section>
  );
}

function FloatingChip({
  label,
  value,
  top,
  left,
  right,
  delay,
}: {
  label: string;
  value: string;
  top: string;
  left?: string;
  right?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      style={{ top, left, right }}
      className="absolute rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 backdrop-blur-md"
    >
      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-bold text-[#00f5d4]">{value}</p>
    </motion.div>
  );
}