"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Grant webcam access",
    description:
      "One click. Your stream stays local — processed entirely in the browser via WebAssembly.",
  },
  {
    number: "02",
    title: "System initializes",
    description:
      "Face Landmarker loads, calibrates baseline metrics, and begins tracking 468 facial points per frame.",
  },
  {
    number: "03",
    title: "Live analysis begins",
    description:
      "Synthetic metrics update in real-time. Your cognitive state shifts. Commentary fires. The dashboard reacts.",
  },
  {
    number: "04",
    title: "Session recap",
    description:
      "End the session and receive a full breakdown: peak focus, state timeline, and a verdict badge worth screenshotting.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-6 py-32">
      {/* Divider line */}
      <div className="mx-auto mb-24 max-w-6xl border-t border-white/6" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          {/* Left label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <p className="font-mono text-xs text-[#00f5d4]">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Four steps
              <br />
              <span className="text-muted-foreground">to cognitive clarity.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The full pipeline runs client-side. No backend. No data at rest.
              The illusion of intelligence, delivered locally.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex gap-8 border-t border-white/6 py-8 first:border-t-0"
              >
                <span className="font-mono text-3xl font-bold text-white/8 transition-colors group-hover:text-[#00f5d4]/30">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}