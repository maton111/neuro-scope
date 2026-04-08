import type { CognitiveState, CommentaryEntry, CommentaryMode } from "@/lib/types";

// Phrase pools: state × mode
const PHRASES: Record<CognitiveState, Record<CommentaryMode, string[]>> = {
  locked_in: {
    roast: [
      "Finally. The neurons decided to show up.",
      "Peak performance detected. Enjoy it. It won't last.",
      "You're in the zone. Which is ironic, given your git history.",
      "Locked in. Probably because there's nothing else going on in your life.",
      "Maximum focus achieved. Someone alert the press.",
    ],
    coach: [
      "You're in flow state. Protect this window — it's your most valuable resource.",
      "Peak cognitive alignment. Stay hydrated and don't break the streak.",
      "This is what optimal looks like. Anchor this feeling.",
      "Deep work mode active. You're operating at full capacity.",
      "Elite focus level. Channel it into the hardest task on your list.",
    ],
    corporate: [
      "Synergy metrics are off the charts. Stakeholders would be impressed.",
      "Your cognitive KPIs are exceeding Q4 projections.",
      "Full alignment between focus vectors and deliverable throughput.",
      "This level of engagement is a core competency in action.",
      "Bandwidth fully utilized. Zero context-switching overhead detected.",
    ],
  },

  focused: {
    roast: [
      "Not bad. For someone who spent 20 minutes choosing a font earlier.",
      "Decent focus. Still not enough to fix that bug from last week.",
      "You're focused. Sort of. In a 'I'm trying' kind of way.",
      "Focus score above average. The bar was underground, but still.",
      "Look at you, concentrating. Cute.",
    ],
    coach: [
      "Solid attention signal. You're building momentum — keep going.",
      "Focus is holding steady. Avoid notifications for the next 20 minutes.",
      "Good engagement pattern. Pair this with your highest-priority task.",
      "Cognitive presence confirmed. You're doing the work.",
      "Steady output detected. This is how progress actually happens.",
    ],
    corporate: [
      "Attention resources are being deployed efficiently.",
      "Focus metrics align with projected cognitive output targets.",
      "Your engagement dashboard is trending positive.",
      "Task-to-attention ratio is within acceptable parameters.",
      "Cognitive throughput is meeting baseline SLA requirements.",
    ],
  },

  distracted: {
    roast: [
      "You just looked away. Again. What are you even doing?",
      "Distraction level: impressive. Unproductively impressive.",
      "Your attention span is having a separate meeting without you.",
      "Something caught your eye? Let me guess — not your work.",
      "Focus score tanking. Blame the algorithm, not yourself. Wait — no, blame yourself.",
    ],
    coach: [
      "Attention drift detected. Try the 4-7-8 breathing technique and refocus.",
      "Distraction signal rising. Close one tab. Just one.",
      "Re-centering prompt: what's the single next action that matters?",
      "Your focus is fragmented. Write down the distraction and come back.",
      "Attention reset recommended. Stand up, breathe, sit back down.",
    ],
    corporate: [
      "Attention resource allocation is suboptimal at this juncture.",
      "Focus KPIs are underperforming against projected benchmarks.",
      "Cognitive engagement is not aligned with current sprint priorities.",
      "Recommend immediate re-prioritization of attention assets.",
      "Distraction vectors are impacting deliverable velocity.",
    ],
  },

  tired: {
    roast: [
      "You look like a JPEG that's been compressed one too many times.",
      "Blink rate analysis suggests you're running on caffeine and spite.",
      "Fatigue detected. Your face is doing its best, which isn't much.",
      "You might want to sleep. Just a thought. A very loud thought.",
      "Cognitive battery at 12%. Please plug in to a bed.",
    ],
    coach: [
      "Fatigue markers are elevated. A 15-minute rest would pay compound interest.",
      "Your eyes are telling us something your calendar is ignoring.",
      "Tired is a signal, not a character flaw. Rest is part of the work.",
      "If you can, step away for 10 minutes. You'll come back 40% sharper.",
      "Fatigue reduces output quality faster than speed. Slow down to speed up.",
    ],
    corporate: [
      "Human resource fatigue detected. Performance optimization requires downtime.",
      "Cognitive asset depreciation is occurring at an accelerated rate.",
      "Recommend scheduling a recovery sprint into today's capacity plan.",
      "Sustained output without recharge cycles reduces ROI on cognitive capital.",
      "Fatigue is a risk vector. Escalate to self-care protocols immediately.",
    ],
  },

  confused_genius: {
    roast: [
      "You look like you're solving P=NP. You're not, but the expression is convincing.",
      "That thousand-yard stare means either deep thought or total system failure.",
      "Confused Genius mode. Heavy on the confused, light on the genius.",
      "You have the look of someone who just read their own code from six months ago.",
      "Classic big-brain energy. Results pending.",
    ],
    coach: [
      "Elevated cognitive load detected — you're working through something complex. Good.",
      "Deep problem-solving mode active. Trust the process, not the discomfort.",
      "Confusion is often the step right before clarity. Stay with it.",
      "Your brain is working harder than your face suggests. That's fine.",
      "Hard problems require looking like you're in pain. You're on track.",
    ],
    corporate: [
      "Exploratory ideation phase detected. Divergent thinking in progress.",
      "Cognitive load suggests active problem decomposition — a high-value activity.",
      "Blue-sky thinking mode engaged. Ideas pipeline is pressurized.",
      "Complex reasoning cycles detected. This is where innovation happens.",
      "You appear to be in a deep-dive analysis loop. Continue to iterate.",
    ],
  },

  calibrating: {
    roast: [
      "Where'd you go? The system can't roast what it can't see.",
      "Face not detected. Are you even at your desk, or just vibes?",
      "Signal lost. Much like your productivity.",
      "NeuroScope is searching for your face. And your motivation.",
      "No face found. Can't tell if that's a you problem or a lighting problem.",
    ],
    coach: [
      "Face signal lost — make sure you're in frame and well-lit.",
      "Tracking paused. Center your face in the camera for best results.",
      "Awaiting stable input. Adjust your position and we'll resume.",
      "Signal interrupted. Move closer to the camera if possible.",
      "Calibrating. Good lighting helps — avoid backlighting from windows.",
    ],
    corporate: [
      "Input signal degradation detected. Recalibrating tracking infrastructure.",
      "Facial telemetry temporarily unavailable. System in standby mode.",
      "Awaiting stable biometric input to resume cognitive performance monitoring.",
      "Tracking SLA cannot be met without a clear line of sight to subject.",
      "Re-establishing data pipeline. Please ensure face visibility.",
    ],
  },
};

// Per-session tracking to avoid immediate repetition
const lastIndices: Partial<Record<`${CognitiveState}_${CommentaryMode}`, number>> = {};

export function generateComment(
  state: CognitiveState,
  mode: CommentaryMode
): CommentaryEntry {
  const pool = PHRASES[state][mode];
  const key = `${state}_${mode}` as const;
  const last = lastIndices[key] ?? -1;

  // Pick a different index than last time
  let idx = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && idx === last) {
    idx = (idx + 1) % pool.length;
  }
  lastIndices[key] = idx;

  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    message: pool[idx],
    state,
    mode,
    timestamp: Date.now(),
  };
}