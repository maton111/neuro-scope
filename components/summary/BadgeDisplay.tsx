"use client";

import { motion } from "framer-motion";
import type { Badge } from "@/lib/utils/badges";

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
          className="relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3"
          style={{
            borderColor: `${badge.color}25`,
            background: `${badge.color}08`,
          }}
        >
          {/* Subtle glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 0% 50%, ${badge.color}20 0%, transparent 70%)`,
            }}
          />
          <span className="text-xl" style={{ color: badge.color }}>
            {badge.icon}
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: badge.color }}>
              {badge.label}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {badge.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}