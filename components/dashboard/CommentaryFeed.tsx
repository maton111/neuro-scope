"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CommentaryEntry } from "@/lib/types";

interface CommentaryFeedProps {
  entries: CommentaryEntry[];
  mode: "roast" | "coach" | "corporate";
  onModeChange: (mode: "roast" | "coach" | "corporate") => void;
}

const MODE_LABELS = {
  roast: "Roast",
  coach: "Coach",
  corporate: "Corporate",
};

export function CommentaryFeed({ entries, mode, onModeChange }: CommentaryFeedProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/6 bg-white/3 p-5">
      {/* Header + mode switcher */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-muted-foreground">COMMENTARY</p>
        <div className="flex gap-1">
          {(["roast", "coach", "corporate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className="rounded-full px-2.5 py-0.5 font-mono text-[9px] transition-all"
              style={{
                background: mode === m ? "rgba(0,245,212,0.12)" : "transparent",
                color: mode === m ? "#00f5d4" : "rgba(255,255,255,0.3)",
                border: mode === m ? "1px solid rgba(0,245,212,0.25)" : "1px solid transparent",
              }}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex min-h-[100px] flex-col gap-2">
        <AnimatePresence initial={false}>
          {entries.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] text-muted-foreground"
            >
              Commentary activates once tracking begins.
            </motion.p>
          ) : (
            entries
              .slice()
              .reverse()
              .slice(0, 5)
              .map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2"
                >
                  <span className="mt-0.5 font-mono text-[9px] text-[#00f5d4]/50">›</span>
                  <p className="font-mono text-[11px] leading-relaxed text-foreground/80">
                    {e.message}
                  </p>
                </motion.div>
              ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}