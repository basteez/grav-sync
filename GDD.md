# Game Design Document: Grav Sync

---

## 1. Game Overview

**Title:** Grav Sync  
**Genre:** Minimalist puzzle/rhythm game  
**Platform:** Web (p5.js) — playable in browser  
**Target audience:** Casual players and jam participants  
**Game length:** Short sessions (2–5 minutes)  
**Core experience:**  
The player tunes multiple gravitational waves to achieve resonance and stabilize the universe. The challenge is to synchronize the waves under time pressure while maintaining alignment.

---

## 2. Core Gameplay Mechanics

- The screen shows **2–3 sinusoidal waves** moving horizontally OR arranged as **circular waves wrapping around a central Earth**.
- One wave is fixed as the _target wave_.
- The player controls the parameters of the other wave(s):
  - **Amplitude** (height of the wave)
  - **Frequency** (wave density/stretch or number of oscillations around the circle)
  - **Phase** (horizontal or angular shift)
- When displayed circularly, waves are drawn as concentric, radially oscillating rings around the Earth at the center of the screen, with the wave radius defined by:

  \[
  r(\theta) = r_0 + A \cdot \sin(n \theta + \phi)
  \]

  where \(r_0\) is the base radius (distance from Earth), \(A\) the amplitude, \(n\) the number of wave oscillations around the circle, and \(\phi\) the phase shift.

- The goal is to adjust these parameters so the player-controlled wave(s) **align perfectly** with the target wave, achieving _interference constructive resonance_.
- **Synchronization metric:** average difference in wave height (linear) or radius (circular) across sampled points.
- **Win condition:** waves are sufficiently synchronized within a time limit.
- **Game over conditions:**
  - Time runs out before synchronization is achieved.
  - Waves remain out of sync beyond a threshold for too long (e.g., more than 5 seconds).

---

## 3. Controls

- Keyboard or mouse/slider inputs to adjust wave parameters:
  - For example:
    - Up/Down arrows: increase/decrease amplitude
    - Left/Right arrows: increase/decrease frequency or wave count
    - Spacebar: cycle phase shift
- Simple and intuitive interface with visual feedback on parameter changes.

---

## 4. User Interface (UI)

- **Main gameplay screen:**

  - Clear display of moving sinusoidal waves, either linear or circular, in contrasting colors (e.g., white target wave, blue controlled wave).
  - Central Earth graphic or circle.
  - Sliders or key icons showing current parameter values.
  - Timer countdown visible at the top or corner.
  - Synchronization meter indicating how close the player is to resonance.

- **Menu screen:**

  - Title and brief instructions.
  - Start button.

- **Game Over screen:**

  - Message indicating failure (“Time’s up!” or “Waves out of sync!”).
  - Option to retry or return to menu.

- **Victory screen:**
  - Message confirming resonance achieved.
  - Option to proceed to next level or restart.

---

## 5. Visual & Audio Style

- **Visuals:**

  - Minimalist, sleek, cosmic feel.
  - Dark background with glowing wave lines wrapping around the Earth at the center.
  - Smooth animations for waves and UI elements.
  - Subtle distortion effects when waves are out of sync.

- **Audio:**
  - Ambient cosmic tones, generated or looped.
  - Sound pitch and harmony reflect wave synchronization — more harmonious sounds when waves align.
  - Feedback sounds for parameter changes, synchronization success, and failure.

---

## 6. Levels and Progression

- Multiple levels with increasing difficulty:

  - Starting with 2 waves and basic adjustments.
  - Later levels introduce 3 waves, faster movement, less tolerance for error, or noise/disruptions on waves.

- Each level has a fixed time limit.

---

## 7. Scope and Technical Constraints

- Single-screen game with simple input and feedback loops.
- Code modularized to separate wave logic, input handling, UI, and game state management.
- Designed for rapid development (1–2 weeks) and easy iteration.
- p5.js used for rendering and input; possibly Tone.js for audio if time permits.

---

## 8. Possible Extensions (Post-Jam)

- More complex wave interactions, like introducing wave interference patterns visually.
- Additional parameter controls (wave speed, damping).
- Visual story or cosmic lore elements integrated.
- Multiplayer modes where players compete or cooperate to synchronize waves.

---
