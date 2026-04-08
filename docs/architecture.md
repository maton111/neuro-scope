# NeuroScope — Architecture

## Pipeline

```
Webcam → Face Tracker → Metrics Engine → State Resolver → Commentary Engine → UI
```

Tutto il processing avviene nel browser. Nessun backend necessario per l'MVP.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Computer Vision | MediaPipe Tasks Vision (Face Landmarker) |
| Deploy | Vercel |

## Routing

```
/ → app/(marketing)/page.tsx          — Landing page
/dashboard → app/(product)/dashboard/ — Dashboard real-time
/summary → app/(product)/summary/     — Session recap
```

## Component tree (target)

```
app/layout.tsx
├── (marketing)/page.tsx
│   ├── components/landing/Hero
│   ├── components/landing/FeatureCards
│   ├── components/landing/HowItWorks
│   ├── components/landing/MockDashboardPreview
│   └── components/landing/CtaSection
└── (product)/dashboard/page.tsx
    ├── components/dashboard/WebcamPanel
    ├── components/dashboard/MetricCards
    ├── components/dashboard/StatePanel
    ├── components/dashboard/CommentaryFeed
    └── components/charts/MetricChart
```

## Data flow

```
useWebcam → stream → useVisionLoop → FaceTrackingResult
         → computeMetrics → SmoothedMetrics
         → resolveState → CognitiveState
         → generateComment → CommentaryEntry
         → UI components
         → useSessionMetrics → SessionData → /summary
```

## Principi tecnici

- **Browser-first:** processing nel browser via WebAssembly (MediaPipe)
- **Deterministic:** nessuna randomicità nelle metriche, solo euristica stabile
- **Smoothing:** rolling average su 10–30 frame per evitare flickering
- **No memory leak:** cleanup esplicito su stream webcam e rAF loop

## Scelte librerie

- **MediaPipe Tasks Vision** invece di face-api.js: API più moderna, WASM ottimizzato, meno dipendenze
- **Recharts** invece di D3: più veloce da implementare per chart live, API React-first
- **Framer Motion** invece di CSS animations: spring physics, layout animations, exit animations
- **shadcn/ui** invece di componenti custom: accelera lo scaffold UI mantenendo pieno controllo

## Rischi tecnici

1. **Performance MediaPipe:** throttle a 15fps per il face tracking, non 60fps
2. **Permission UX:** gestire gracefully rifiuto webcam e browser senza getDisplayMedia
3. **Re-render storm:** usare `useRef` per metriche raw, `useState` solo per valori visualizzati
