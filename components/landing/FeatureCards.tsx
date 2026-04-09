"use client";

import { motion } from "framer-motion";
import { Brain, Eye, MessageSquare, BarChart3, Layers } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Face Tracking",
    description:
      "MediaPipe Face Landmarker processes 468 facial landmarks per frame, entirely in your browser. No server. No upload.",
    tag: " Computer Vision",
  },
  {
    icon: Brain,
    title: "Cognitive State Engine",
    description:
      "Heuristic algorithms translate raw signals into recognizable states: Focused, Locked In, Distracted, Fatigued, Confused Genius.",
    tag: " Signal Processing",
  },
  {
    icon: BarChart3,
    title: "Synthetic Metrics",
    description:
      "Focus Score, Gaze Stability, Motion Level, Fatigue Signal — smoothed over time with rolling averages to avoid noise.",
    tag: " Analytics",
  },
  {
    icon: MessageSquare,
    title: "Commentary Engine",
    description:
      "Rule-based feedback system with three distinct tones: Roast, Coach, and Corporate. Always contextual. Never random.",
    tag: " AI-Adjacent",
  },
  {
    icon: Layers,
    title: "Session Summary",
    description:
      "At the end of each session, a shareable recap: your peak focus, dominant state, timeline, and a verdict badge.",
    tag: " Reporting",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeatureCards() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-[#00f5d4]">CAPABILITIES</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built to look like it works.
            <br />
            <span className="text-muted-foreground">It actually does.</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className="group relative rounded-2xl border border-white/8 bg-white/3 p-6 backdrop-blur-sm transition-colors hover:border-[#00f5d4]/20 hover:bg-white/5"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,245,212,0.04) 0%, transparent 70%)" }}
              />

              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#00f5d4]/15 bg-[#00f5d4]/8">
                <f.icon className="h-5 w-5 text-[#00f5d4]" />
              </div>

              <span className="font-mono text-[10px] text-muted-foreground">{f.tag}</span>
              <h3 className="mt-1 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}

          {/* Last card — CTA */}
          <motion.div
            variants={cardVariants}
            className="relative flex flex-col items-start justify-between rounded-2xl border border-[#00f5d4]/20 bg-[#00f5d4]/5 p-6"
          >
            <div>
              <p className="font-mono text-[10px] text-[#00f5d4]">LIVE NOW</p>
              <h3 className="mt-1 text-base font-semibold">Try it yourself</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                No install. No account. Just your face and a browser.
              </p>
            </div>
            <a
              href="/dashboard"
              className="mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-[#00f5d4] px-5 text-sm font-semibold text-black transition-all hover:bg-[#00d4b6]"
            >
              Open Dashboard
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}