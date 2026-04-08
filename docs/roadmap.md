# NeuroScope — Roadmap

## Status: MVP Complete ✅

All 10 phases completed. The project is deployable.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Product framing — name, scope, concept | ✅ Done |
| 1 | Setup — Next.js, Tailwind, shadcn, folder structure, types | ✅ Done |
| 2 | Landing page — Hero, MockDashboard, FeatureCards, HowItWorks, CTA | ✅ Done |
| 3 | Webcam pipeline — `useWebcam`, canvas overlay, permission states | ✅ Done |
| 4 | Vision engine — MediaPipe Face Landmarker, `useVisionLoop`, canvas draw | ✅ Done |
| 5 | Metrics engine — EAR, motion delta, gaze vector, rolling averages, state resolver | ✅ Done |
| 6 | Dashboard — StatePanel, MetricCards, MetricChart, CommentaryFeed layout | ✅ Done |
| 7 | Commentary engine — 90 phrases, 3 modes, cooldown + stability gating | ✅ Done |
| 8 | Session summary — localStorage, badges, timeline, state breakdown, verdict | ✅ Done |
| 9 | Polish — OG image, favicon, 404, loading skeleton, metadata, a11y, CORS | ✅ Done |
| 10 | Portfolio packaging — README, case study, `.env.example`, package name | ✅ Done |

---

## V2 Backlog

- [ ] LLM commentary (Claude API streaming)
- [ ] Session history with Supabase
- [ ] Shareable recap image (html2canvas or Satori)
- [ ] Voice feedback (Web Speech API)
- [ ] Daily leaderboard / ranking
- [ ] Theme switcher (cyberpunk · minimal · corporate)
- [ ] Multiplayer comparison view
- [ ] Advanced MediaPipe features (iris tracking, face blendshapes)