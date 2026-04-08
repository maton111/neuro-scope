# NeuroScope — Product Spec

## Obiettivo

Web app portfolio con impatto visivo massimo. Usa computer vision per simulare l'analisi del focus cognitivo dell'utente in tempo reale. Non è uno strumento scientifico: è uno strumento di storytelling tecnico.

## Target

Recruiter tecnici, developer curiosi, portfolio viewer.

## Non-obiettivi

- Accuratezza scientifica delle metriche
- Backend complesso o storage persistente
- Supporto mobile ottimizzato (laptop-first)
- Autenticazione utente

## Features MVP

### Webcam & Vision
- Accesso webcam con gestione permessi
- Face detection via MediaPipe Face Landmarker
- Canvas overlay con landmark visualization
- Frame loop a ~15fps

### Metriche sintetiche
- **Focus Score** (0–100): metrica composita principale
- **Motion Level** (0–100): movimento testa/corpo
- **Gaze Stability** (0–100): stabilità direzione sguardo
- **Fatigue Signal** (0–100): segnale stanchezza da blink pattern

### Stati cognitivi simulati
| Stato | Trigger |
|-------|---------|
| Focused | focus alto, motion basso |
| Distracted | gaze instabile, motion elevato |
| Tired | fatigue alto, focus basso |
| Locked In | focus molto alto, motion minimo, gaze stabile |
| Confused Genius | focus medio, motion erratico |

### Dashboard
- Metric cards con valori live animati
- Line chart aggiornato in tempo reale (ultimi 60s)
- Status panel dominante con stato corrente
- Commentary feed con commenti contestuali

### Commentary engine (regole)
- Modalità: Roast / Coach / Corporate
- Cooldown tra commenti: ~8 secondi
- Set di frasi per ogni (stato × modalità)

### Session summary
- Focus score medio e picco
- Timeline stati
- Badge sessione (es. "Tunnel Vision", "Sleep-Deprived Wizard")
- Verdict finale

## Features V2

- Voice commentary
- Session history con Supabase
- Export recap come immagine
- LLM per commentary dinamico
- Theme switching (cyberpunk / minimal / corporate)
- Daily ranking

## UX flow

1. Landing → CTA "Start Analysis"
2. Richiesta permesso webcam
3. Dashboard live (analisi in corso)
4. Pulsante "End Session" → summary
5. Summary → "Start again" o share

## Criteri di successo

- Un recruiter vede la demo e percepisce: interfaccia premium, real-time complexity, product thinking
- Build e deploy funzionante su Vercel
- Nessun crash in sessione 5 minuti
- UI coerente e dark futuristic
