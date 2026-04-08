# NeuroScope — Dev Log

## Fase 1 — Setup repo e design system ✅ COMPLETATA

**Data:** 2026-04-08

### Cosa è stato fatto

- Bootstrap Next.js 15 (App Router) con TypeScript + Tailwind CSS v4
- shadcn/ui inizializzato (tema dark, stile default)
- Componenti shadcn installati: `button`, `card`, `badge`, `progress`, `separator`
- Dipendenze aggiuntive: `framer-motion`, `recharts`, `lucide-react`, `@mediapipe/tasks-vision`
- Dark theme forzato via `className="dark"` su `<html>` in `layout.tsx`
- Custom tokens NeuroScope in `globals.css`:
  - Background profondo: `oklch(0.08 0 0)` (#0a0a0a circa)
  - Accent primario: primario a 175 hue (cyan-verde, ~#00f5d4)
  - Variabili CSS custom: `--ns-cyan`, `--ns-cyan-dim`, `--ns-card-glass`
- Struttura cartelle creata:
  - `app/(marketing)/page.tsx` → route `/` (landing, stub)
  - `app/(product)/dashboard/page.tsx` → route `/dashboard` (stub)
  - `app/(product)/summary/page.tsx` → route `/summary` (stub)
  - `components/landing/`, `components/dashboard/`, `components/charts/`
  - `lib/vision/`, `lib/ai/`, `lib/types/`
  - `hooks/`
- File stub creati con API pubblica definita:
  - `lib/types/index.ts` — tutti i tipi: `CognitiveState`, `RawMetrics`, `SmoothedMetrics`, `SessionData`, `CommentaryEntry`, `FaceTrackingResult`
  - `lib/vision/face-tracker.ts` — stub Phase 4
  - `lib/vision/metrics.ts` — stub Phase 5
  - `lib/vision/heuristics.ts` — stub Phase 5
  - `lib/ai/commentary.ts` — stub Phase 7
  - `hooks/use-webcam.ts` — stub Phase 3
  - `hooks/use-vision-loop.ts` — stub Phase 4
  - `hooks/use-session-metrics.ts` — stub Phase 5
- Metadata app aggiornati (titolo + description NeuroScope)

### Note tecniche

- Tailwind CSS v4 usa `@import "tailwindcss"` invece di `@tailwind base/components/utilities`
- shadcn v4 usa CSS variables in formato `oklch` — ho ricalibrato il dark theme sui toni di NeuroScope
- Route group `(marketing)` serve `/`, `(product)` serve `/dashboard` e `/summary` — nessun conflitto con `app/page.tsx` (rimosso)

### Prossimo step

→ **Fase 2 — Landing page wow**

File da creare/modificare:
- `app/(marketing)/page.tsx` — layout completo
- `components/landing/Hero.tsx`
- `components/landing/FeatureCards.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/MockDashboardPreview.tsx`
- `components/landing/CtaSection.tsx`

---

---

## Fase 2 — Landing page wow ✅ COMPLETATA

**Data:** 2026-04-08

### Cosa è stato fatto

- `components/landing/Navbar.tsx` — navbar fixed con backdrop-blur, logo NEURO|SCOPE, link "Launch app"
- `components/landing/Hero.tsx` — hero fullscreen con:
  - Grid background CSS + radial glow cyan
  - Badge animato con Framer Motion (stagger `custom` index)
  - Headline con gradient text cyan→blue
  - Subline + CTA button + "no signup" label
  - 4 floating metric chips decorativi (FOCUS SCORE, GAZE STABILITY, STATE, FATIGUE)
- `components/landing/MockDashboardPreview.tsx` — preview interattiva animata:
  - `useAnimationFrame` per oscillare le metriche in real-time
  - SVG face tracking mock con landmark dots e scan line animation
  - MetricBar animati, focus score grande, commentary feed
- `components/landing/FeatureCards.tsx` — 5 feature card + 1 CTA card, scroll-triggered con stagger
- `components/landing/HowItWorks.tsx` — 4 step layout a 2 colonne, sticky label su desktop
- `components/landing/CtaSection.tsx` — finale con headline forte e CTA primario

### Note tecniche

- Framer Motion v12: `ease: number[]` (bezier) non accettato nei `Variants` — usare `"easeOut"` string o `as const`
- `useAnimationFrame` funziona solo in Client Components (`"use client"`)
- Landing è Server Component (no `"use client"`) — i componenti animati hanno la direttiva al loro interno

### Prossimo step

→ **Fase 3 — Webcam pipeline**

File da creare:
- `hooks/use-webcam.ts` — implementazione completa
- `components/dashboard/WebcamPanel.tsx` — video + canvas overlay

## Fasi future

- Fase 3 — Webcam pipeline
- Fase 3 — Webcam pipeline
- Fase 4 — Vision engine (MediaPipe)
- Fase 5 — Metrics engine
- Fase 6 — Dashboard real-time
- Fase 7 — Commentary engine
- Fase 8 — Session summary
- Fase 9 — Polish finale
- Fase 10 — Packaging portfolio
