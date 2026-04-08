# NeuroScope

> Real-time cognitive presence analysis powered by computer vision.

---

## 🧠 Overview

NeuroScope is a browser-based, real-time system that analyzes your *apparent cognitive state* while you work.

Using your webcam, it detects facial signals and transforms them into stylized productivity metrics, live feedback, and dynamic commentary.

It does not aim to be scientifically accurate.

It aims to feel **convincingly intelligent**.

---

## ✨ Demo Concept

* Real-time face tracking
* Live "focus score"
* Simulated cognitive states
* AI-generated commentary (roast / coach / corporate modes)
* Cinematic dashboard
* Session recap with shareable results

---

## 🚀 Why this project exists

This is a **portfolio project** designed to demonstrate:

* real-time systems in the browser
* computer vision integration
* UI/UX polish and motion design
* modular frontend architecture
* product thinking and execution

It intentionally prioritizes:

> perception, design, and experience over real-world utility

---

## 🧩 Core Features

### 🎥 Webcam Analysis

* Face detection via MediaPipe
* Landmark extraction
* Frame-by-frame processing

### 📊 Synthetic Metrics Engine

Transforms raw signals into believable metrics:

* Focus Score
* Motion Level
* Gaze Stability
* Fatigue Signal

### 🧠 Cognitive State Simulation

Maps metrics into states like:

* Focused
* Distracted
* Locked In
* Fatigued
* Confused Genius

### 💬 Commentary Engine

Dynamic feedback system with multiple modes:

* Roast Mode
* Coach Mode
* Corporate Mode

### 📈 Real-Time Dashboard

* Live updating charts
* Status panels
* Animated metric cards

### 🧾 Session Summary

* Final score
* Timeline of states
* Highlight moments
* Shareable output

---

## 🏗️ Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

### Computer Vision

* MediaPipe (Face Landmarker / Vision Tasks)

### Data Visualization

* Recharts / D3

### Backend (lightweight)

* Next.js API routes

### Deployment

* Vercel

---

## 🧠 How it works

1. The user enables webcam access
2. Frames are processed in real-time in the browser
3. Facial landmarks are extracted
4. Signals are converted into synthetic metrics
5. Metrics are smoothed over time
6. A dominant "state" is derived
7. Commentary is generated
8. UI updates continuously

---

## ⚙️ Architecture

```
Webcam → Face Tracker → Metrics Engine → State Resolver → Commentary Engine → UI
```

### Key Principles

* Browser-first processing
* No heavy backend dependency
* Deterministic logic + perception design
* Modular components

---

## 📁 Project Structure

```
/app
  /(marketing)
  /(product)
/components
/lib
/hooks
/docs
```

---

## 🛠️ Getting Started

### 1. Clone repo

```
git clone https://github.com/your-username/neuroscope
cd neuroscope
```

### 2. Install dependencies

```
npm install
```

### 3. Run dev server

```
npm run dev
```

### 4. Open

```
http://localhost:3000
```

---

## 🧪 Notes on Accuracy

NeuroScope is **not a scientific tool**.

All metrics are:

* heuristic-based
* intentionally stylized
* optimized for UX rather than correctness

---

## 🎨 Design Philosophy

The goal is to create something that feels:

* intelligent
* premium
* slightly intimidating
* visually satisfying

Even when the underlying logic is simple.

---

## 📦 Future Improvements

* Voice feedback
* Session history
* Exportable reports
* Multiplayer comparison (leaderboard)
* More advanced LLM integration
* Theme system (cyberpunk / corporate / minimal)

---

## 📸 Screenshots

*(add here)*

---

## 🎥 Demo

*(add video link here)*

---

## 🧑‍💻 Author

Mattia Archina

---

## 📄 License

MIT

---

## 💡 Final Note

This project is less about measuring reality and more about designing a convincing illusion of intelligence.

And sometimes, that’s exactly what makes something memorable.
