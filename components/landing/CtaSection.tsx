"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative px-6 py-40">
      {/* Top divider */}
      <div className="mx-auto mb-24 max-w-6xl border-t border-white/6" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-mono text-xs text-[#00f5d4]">BEGIN ANALYSIS</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to see
          <br />
          what you look like when you think?
        </h2>
        <p className="mt-5 text-muted-foreground">
          Webcam. Browser. Zero backend. The entire pipeline runs on your machine.
          Results may or may not reflect actual cognitive performance.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/dashboard"
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#00f5d4] px-10 text-base font-semibold text-black transition-all hover:bg-[#00d4b6] hover:shadow-[0_0_48px_rgba(0,245,212,0.25)]"
          >
            Launch NeuroScope
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Free · No account · Open source
        </p>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,245,212,0.02))" }}
      />
    </section>
  );
}