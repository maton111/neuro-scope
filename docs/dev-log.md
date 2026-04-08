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

---

## Fase 3 — Webcam pipeline ✅ COMPLETATA

**Data:** 2026-04-08

### Cosa è stato fatto

- `hooks/use-webcam.ts` — hook completo:
  - Stato: `idle | requesting | granted | denied | unavailable`
  - `start()`: `getUserMedia` con constraint video 1280×720, face-mode user
  - `stop()`: ferma tutti i tracks, libera `srcObject`, reset stato
  - Cleanup automatico su unmount (useEffect return)
  - Gestione errori tipizzata: `NotAllowedError` → denied, `NotFoundError` → unavailable
  - `videoRef` e `streamRef` interni, nessun memory leak

- `components/dashboard/WebcamPanel.tsx` — panel webcam completo:
  - `<video>` sempre montato (ref disponibile), visibile solo quando streaming
  - `<canvas>` overlay per i landmark (ref passato da fuori, usato dalla vision loop in Fase 4)
  - Video con `transform: scaleX(-1)` (mirror) per UX naturale
  - Corner brackets decorativi + scan line animata + status bar LIVE con timer
  - Overlay stati: idle (pulsante Start), requesting (spinner), denied/unavailable (errore + retry)
  - Stop button in overlay quando streaming

- `components/dashboard/DashboardShell.tsx` — shell dashboard:
  - Integra `useWebcam` + `WebcamPanel`
  - Timer sessione con `setInterval` legato a `isStreaming`
  - `canvasRef` pronto per la vision loop (Fase 4)
  - Placeholder metrics panel (Fase 6)

- `app/(product)/dashboard/page.tsx` — delega a `DashboardShell` (Server Component wrapper)

### Note tecniche

- `<video>` deve avere `playsInline` e `muted` per autoplay su Safari/mobile
- Il canvas va dimensionato uguale al video nel vision loop (Fase 4) tramite `videoRef.current.videoWidth/Height`
- Mirror con `scaleX(-1)` applicato sia a video che canvas per coerenza overlay

### Prossimo step

→ **Fase 4 — Vision engine (MediaPipe Face Landmarker)**

File da creare/modificare:
- `lib/vision/face-tracker.ts` — implementazione completa con MediaPipe
- `hooks/use-vision-loop.ts` — rAF loop che alimenta il face tracker
- `components/dashboard/WebcamPanel.tsx` — il canvas verrà disegnato dalla vision loop

---

## Fase 4 — Vision engine (MediaPipe) ✅ COMPLETATA

**Data:** 2026-04-09

### Cosa è stato fatto

- `lib/vision/face-tracker.ts` — adapter MediaPipe Face Landmarker:
  - Singleton module-level: init una volta sola per sessione
  - `initFaceTracker()`: carica WASM da CDN jsdelivr + model da storage.googleapis.com
  - `processFrame(video)`: chiama `detectForVideo()` con timestamp monotono, restituisce `FaceTrackingResult`
  - Confidence derivata dalla percentuale di landmark con `|z| < 0.2` (approssimazione ragionevole)
  - `destroyFaceTracker()`: cleanup con `close()`

- `lib/vision/canvas-draw.ts` — disegno landmark su canvas:
  - Landmark dots ogni 4 punti (performance)
  - Contorni occhi sinistro/destro con indici specifici
  - Contorno labbra esterno
  - Face oval tratteggiata da bounding box dei landmark
  - Palette `rgba(0,245,212,x)` coerente col design

- `hooks/use-vision-loop.ts` — loop rAF:
  - Throttle a 15 FPS (`FRAME_INTERVAL = 66ms`)
  - Stato: `idle → initializing → ready | error`
  - Import dinamici (`await import`) per tenere MediaPipe client-only
  - Canvas ridimensionato automaticamente a `video.videoWidth/Height` ogni frame
  - Stop pulito: cancella rAF, pulisce canvas
  - Cleanup su unmount: `destroyFaceTracker()`

- `DashboardShell.tsx` aggiornato:
  - Integra `useVisionLoop` con callback `onResult`
  - Debug panel: face present, confidence, numero landmark
  - `VisionStatusChip` in header: LOADING MODEL → TRACKING → VISION ERROR

### Note tecniche

- MediaPipe WASM CDN: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm`
- Il model URL di Google Storage è pubblico e non richiede auth
- `runningMode: "VIDEO"` obbligatorio (non `IMAGE`) per `detectForVideo()`
- Timestamp deve essere strettamente crescente — fix con `lastTimestamp + 1` se necessario
- Import dinamici in `useVisionLoop` evitano SSR issues con WebAssembly

### Prossimo step

→ **Fase 5 — Metrics engine**

File da creare/modificare:
- `lib/vision/metrics.ts` — `computeMetrics()` con rolling average
- `lib/vision/heuristics.ts` — `resolveState()` da metriche a `CognitiveState`
- `hooks/use-session-metrics.ts` — accumula `SmoothedMetrics` nel tempo

---

## Fase 5 — Metrics engine ✅ COMPLETATA

**Data:** 2026-04-09

### Cosa è stato fatto

- `lib/vision/metrics.ts` — `computeMetrics()`:
  - `RollingAverage` class (ring buffer, size configurabile)
  - **motionLevel**: delta posizione nose tip tra frame → scalato ×2000, smooth su 15 frame
  - **gazeStability**: variazione vettore (nose tip − midpoint occhi) → invertito, smooth su 20 frame
  - **fatigueSignal**: Eye Aspect Ratio (EAR) sinistra + destra → `(0.30 - avgEar) / 0.20 * 100`, smooth su 25 frame
  - **focusScore**: composito pesato (gaze 40% + motion_inv 30% + fatigue_inv 20% + confidence 10%), smooth su 20 frame
  - `resetMetrics()` per pulire stato tra sessioni
  - Usa landmark iris (468, 473) se disponibili, fallback su outer eye

- `lib/vision/heuristics.ts` — `resolveState()`:
  - `STATE_CONFIG` con label, colore hex, descrizione per ogni stato
  - Priority order: `calibrating → tired → locked_in → distracted → focused → confused_genius`
  - Soglie: locked_in (focus>84, motion<18, gaze>78), tired (fatigue>65), distracted (motion>55 || gaze<32)

- `hooks/use-session-metrics.ts` — `useSessionMetrics()`:
  - Import dinamici di metrics + heuristics (client-only)
  - Reset automatico a inizio/fine sessione
  - `processResult(FaceTrackingResult)` → aggiorna `current: SmoothedMetrics`
  - Snapshots ogni 1s, max 300 (5 minuti a 1fps)
  - Traccia `peakFocusScore`

- `DashboardShell.tsx` aggiornato con UI metriche completa:
  - State panel con colore dinamico per stato
  - 4 MetricCard (focus, gaze, motion, fatigue) con barre e colori semantici
  - Session stats: peak focus, avg focus, snapshot count, face confidence

### Note tecniche

- EAR normale ~0.25–0.35; valori < 0.10 indicano occhi chiusi
- La smoothing window alta su fatigue (25 frame) evita flickering da singoli blink normali
- `STATE_CONFIG` è importato direttamente (non dinamico) — non usa WASM, solo JS puro

### Prossimo step

→ **Fase 6 — Dashboard real-time** (live charts Recharts, layout dashboard completo, commentary feed)

File da creare:
- `components/charts/MetricChart.tsx` — line chart live con Recharts
- `components/dashboard/StatePanel.tsx` — panel stato con animazioni Framer Motion
- `components/dashboard/CommentaryFeed.tsx` — placeholder Phase 7
- Refactor layout `DashboardShell` a griglia 2-colonne con chart

---

## Fase 6 — Dashboard real-time ✅ COMPLETATA

**Data:** 2026-04-09

### Cosa è stato fatto

- `components/charts/MetricChart.tsx` — AreaChart Recharts live:
  - Dual area (focus + gaze) con gradient fill cyan/blue
  - `isAnimationActive={false}` per evitare lag su aggiornamenti rapidi
  - Tooltip custom glassmorphism
  - Finestra configurabile (default 60 snapshot = ~60s)
  - Empty state "Collecting data…" fino a 2+ punti

- `components/dashboard/StatePanel.tsx` — pannello stato principale:
  - Sfondo e bordo con colore dinamico per stato (transition 700ms)
  - `AnimatePresence mode="wait"` per transizione label stato
  - Icona stato con spring animation su cambio
  - Focus score bar animata con gradient matching stato
  - Peak score in linea con valore corrente

- `components/dashboard/MetricCards.tsx` — 4 card (gaze, motion, fatigue, confidence):
  - Colore semantico: verde/ambra/rosso in base a valore (con `invert` per metriche negative)
  - `motion.p` per transizione colore animata
  - Barra sottile con `motion.div` animate width

- `components/dashboard/CommentaryFeed.tsx` — feed commenti (UI pronta per Phase 7):
  - Mode switcher Roast/Coach/Corporate
  - `AnimatePresence` per entrate/uscite voci
  - Mostra ultime 5 voci in reverse order

- `DashboardShell.tsx` refactored — layout 2-colonne responsive:
  - `lg:grid-cols-[minmax(0,480px)_1fr]` con sticky header
  - Colonna sinistra: webcam + "End Session" link
  - Colonna destra: StatePanel → MetricCards → MetricChart → CommentaryFeed
  - Timer sessione in header, VisionChip semplificato (STANDBY/LOADING/LIVE/ERROR)

### Prossimo step

→ **Fase 7 — Commentary engine**

File da creare/modificare:
- `lib/ai/commentary.ts` — implementazione completa con set di frasi per stato × mode
- `DashboardShell.tsx` — integrare commentary con cooldown e feed

---

## Fase 7 — Commentary engine ✅ COMPLETATA

**Data:** 2026-04-09

### Cosa è stato fatto

- `lib/ai/commentary.ts` — motore commenti rule-based:
  - 6 stati × 3 modalità = 18 pool di frasi, 5 frasi per pool (90 totali)
  - Toni distinti: **Roast** (sarcastico/dark), **Coach** (motivazionale/actionable), **Corporate** (buzzword/absurdo)
  - Anti-repetition: traccia ultimo indice per evitare la stessa frase due volte di fila
  - `generateComment(state, mode)` → `CommentaryEntry` con id univoco

- `hooks/use-commentary.ts` — hook con logica di timing:
  - **Cooldown** 8 secondi tra un commento e il successivo
  - **Stability check** 2.5 secondi: lo stato deve essere stabile prima di sparare
  - Skip su `calibrating` (nessun commento quando la faccia non è visibile)
  - Reset entries a inizio/fine sessione
  - Import dinamico di `commentary.ts` (client-only)
  - `setInterval` ogni 1s per il tick check (leggero)

- `DashboardShell.tsx` aggiornato:
  - `useCommentary` integrato, entries passate a `CommentaryFeed`
  - Mode switcher Roast/Coach/Corporate funzionante (cambia il tono in real-time)

### Prossimo step

→ **Fase 8 — Session Summary**

File da creare:
- `app/(product)/summary/page.tsx` — pagina completa
- `components/summary/SummaryCard.tsx` — card con score finale
- `components/summary/StateBadge.tsx` — badge tipo "Tunnel Vision", "Sleep-Deprived Wizard"
- `components/summary/StateTimeline.tsx` — timeline stati sessione

---

## Fase 8 — Session Summary ✅ COMPLETATA

**Data:** 2026-04-09

### Cosa è stato fatto

- `lib/utils/session-storage.ts` — serializzazione sessione:
  - `saveSession()` / `loadSession()` via `localStorage` (client-only, no backend)
  - `deriveStats()` — calcola: avg/peak focus, dominant state, state breakdown %, duration
  - `StoredSession` e `SessionStats` tipizzati

- `lib/utils/badges.ts` — sistema badge:
  - 8 badge con condizione, label, icon, colore, descrizione
  - `assignBadges(stats)` → max 3 badge earned
  - `generateVerdict(stats, badges)` → frase finale contestuale (7 varianti)
  - Badge: Tunnel Vision, The Professional, Sleep-Deprived Wizard, Chaos Agent, Confused Genius, Ghost Mode, Peak Performer, Marathon Runner

- `components/summary/SummaryStats.tsx` — 4 stat card animate (avg focus, peak focus, duration, dominant state)

- `components/summary/BadgeDisplay.tsx` — badge con spring animation e glassmorphism

- `components/summary/StateTimeline.tsx` — barra timeline colorata per stato + legenda

- `app/(product)/summary/page.tsx` — pagina completa:
  - Legge da localStorage al mount
  - Title + verdict, SummaryStats, BadgeDisplay, StateTimeline, MetricChart full-session, StateBreakdown (barre %)
  - CTA "Start New Session" e "Back to Home"
  - Gestisce il caso "no session data" con redirect a /dashboard

- `DashboardShell.tsx` aggiornato:
  - Click "End Session" → `saveSession()` → webcam.stop() → navigate /summary

### Note tecniche

- `localStorage` usato perché il processing è già client-side; nessun bisogno di stato globale
- `summary/page.tsx` ha `"use client"` perché legge localStorage nell'`useEffect`
- TypeScript fix: tipo interno `{ state, count }[]` separato da `Segment` per buildSegments

### Prossimo step

→ **Fase 9 — Polish finale** (microinterazioni, skeleton, performance, metadata, og image)

## Fasi future

- Fase 9 — Polish finale
- Fase 4 — Vision engine (MediaPipe)
- Fase 5 — Metrics engine
- Fase 6 — Dashboard real-time
- Fase 7 — Commentary engine
- Fase 8 — Session summary
- Fase 9 — Polish finale
- Fase 10 — Packaging portfolio
