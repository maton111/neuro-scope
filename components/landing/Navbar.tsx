"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/6 bg-background/80 px-6 py-4 backdrop-blur-xl"
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-[#00f5d4]">NEURO</span>
        <span className="font-mono text-sm font-bold text-foreground">SCOPE</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
        <a href="#features" className="transition-colors hover:text-foreground">
          Features
        </a>
        <a href="#how-it-works" className="transition-colors hover:text-foreground">
          How it works
        </a>
      </nav>

      <Link
        href="/dashboard"
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#00f5d4]/30 bg-[#00f5d4]/8 px-4 font-mono text-xs text-[#00f5d4] transition-all hover:bg-[#00f5d4]/15"
      >
        Launch app
      </Link>
    </motion.header>
  );
}