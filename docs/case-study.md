# NeuroScope — Case Study

## The brief

Build a portfolio project that looks technically impressive and visually premium — but without overengineering the backend, training ML models, or pretending to be a scientific product.

The constraint was intentional: **the illusion of intelligence is more interesting than the intelligence itself** as a design problem.

## The concept

A real-time "cognitive presence monitor" that watches you work via webcam and returns live feedback: focus scores, cognitive states, and commentary. The metrics are synthetic. The states are heuristic. The commentary is hand-crafted rule-based text. None of it is scientifically valid — but the pipeline is real, the processing is genuinely happening in your browser, and the UI is designed to make it feel like something more.

## Key decisions

### Browser-first, no backend

MediaPipe's WebAssembly runtime makes it possible to run a face landmark model at 15fps entirely client-side. This eliminates backend infrastructure, reduces latency, and makes a strong privacy argument: *no video frame ever leaves your machine*.

Technically, this also means the app deploys as a static/edge site with zero server costs.

### Synthetic metrics over fake precision

Rather than pretending to measure "real" cognitive states, the metrics are designed to be:
- **Deterministic** — same input always produces the same output
- **Stable** — rolling averages prevent flickering on noisy input
- **Plausible** — derived from signals that actually correlate with the claimed states (EAR for fatigue, nose delta for motion, etc.)

The goal was metrics that feel true without claiming to be.

### Commentary as personality

A system that shows numbers is a dashboard. A system that talks back to you is a character.

The commentary engine adds personality through 90 handcrafted phrases in three distinct tones (Roast, Coach, Corporate), fired with a cooldown and state stability check. The user can switch modes live — changing the entire emotional tone of the session without restarting.

### State machine over threshold soup

Cognitive states are resolved through a priority-ordered condition chain, not a weighted average. This means:
- The most important states (tired, locked_in) fire first
- States are mutually exclusive and well-defined
- Adding a new state is a single block of conditions

## Architecture choices

**MediaPipe over face-api.js** — More modern API, smaller bundle, better GPU delegate support, actively maintained.

**Recharts over D3** — For live-updating charts in React, Recharts is faster to wire up with far less boilerplate. The tradeoff (less control) doesn't matter at this fidelity.

**localStorage over Zustand/Context for session data** — The session summary is a separate route. The simplest bridge is serializing to localStorage on "End Session" and deserializing on load. No global state manager needed.

**`useRef` for raw metrics, `useState` for display** — Metric computation runs every frame. Storing in state would cause 15 re-renders/second across the tree. Raw values live in refs; only smoothed, display-ready values are committed to state on each rAF tick.

## What this demonstrates

- **Real-time browser systems** — MediaPipe + rAF loop at 15fps with controlled re-renders
- **Computer vision integration** — Adapting a third-party WASM library behind a clean API
- **Frontend architecture** — Separation between pipeline hooks (vision, metrics, commentary) and display components
- **UI/UX polish** — Dark futuristic aesthetic, Framer Motion transitions, animated metrics, state-reactive color system
- **Product thinking** — Defined MVP scope, deliberate non-goals, UX flow from landing to summary
- **Shipping** — A complete, deployable product with OG image, favicon, 404 page, metadata

## What it deliberately isn't

- A scientific tool
- A surveillance system
- A heavy backend service
- An over-engineered ML pipeline

The point of NeuroScope is that you don't need all of that to build something that feels technically sophisticated.