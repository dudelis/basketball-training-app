---
mode: agent
description: Step 10 – Implement the useTimer hook with PWA persistence using timestamps, and the TimerDisplay component with +/- adjustment controls.
---

# Step 10 – Timer System

Implement the timer as a custom hook and display component. The timer must continue counting down even when the app is backgrounded, and recover correctly when the app is reopened.

---

## `src/hooks/useTimer.ts`

Create a custom `useTimer` hook that manages countdown timer state.

### Signature

```ts
function useTimer(initialSeconds: number): {
  state: TimerState;
  start: () => void;
  pause: () => void;
  reset: () => void;
  adjust: (deltaSeconds: number) => void;  // +60, -60, +300, -300
  restart: () => void;  // reset to initialSeconds and start immediately
}
```

### Timer Persistence Strategy

The timer must survive app minimization and screen lock using timestamps:

1. **On `start()`**: record `startedAt = Date.now()` in state and also persist it to `localStorage` along with `durationSeconds` and `remainingSeconds`.
2. **On each tick (setInterval every 1 second)**: compute `elapsed = Date.now() - startedAt`, then `remaining = storedRemaining - elapsed`. This avoids drift.
3. **On app resume / component mount**: if `localStorage` has an active timer entry, restore the state and recalculate `remainingSeconds` from the stored timestamps.
4. **On timer finish** (`remainingSeconds <= 0`): set `status: 'finished'`, clear `localStorage`, play a beep sound, and attempt to show a Web Notification.

### Sound

When the timer finishes, play an audio beep using the Web Audio API:
```ts
const ctx = new AudioContext();
const oscillator = ctx.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.setValueAtTime(880, ctx.currentTime);
oscillator.connect(ctx.destination);
oscillator.start();
oscillator.stop(ctx.currentTime + 0.5);
```

### Web Notifications

Request notification permission once (on first timer start). When the timer ends, show a notification: "Timer done! ✅ How did it go?"

### Constraints
- `remainingSeconds` cannot go below 0 or above 3600 (1 hour).
- Adjusting time while running keeps the timer running.
- `reset()` stops the timer, clears `localStorage`, and sets `remainingSeconds` back to `initialSeconds`.
- `restart()` is equivalent to `reset()` + `start()`.

---

## `src/components/TimerDisplay.tsx`

A reusable component that renders the timer.

### Props

```ts
type TimerDisplayProps = {
  initialSeconds: number;
  onComplete: (actualSeconds: number) => void; // called with time actually spent
};
```

### UI

- Large countdown display formatted as `MM:SS` (e.g. "05:00").
  - Font: very large (e.g. 72px), monospace or bold.
  - Color: green when running, orange when paused, red when under 10 seconds.
- Adjustment buttons in a row: `-5 min`, `-1 min`, `+1 min`, `+5 min` (MUI `Button`, small variant).
- Control buttons row: Start/Resume, Pause, Reset (MUI `Button`, icon + label).
- When `status === 'finished'`, show a completion banner and "Mark as Done" / "Skip" buttons that call `onComplete`.

---

## Acceptance Criteria

- Timer counts down accurately even after backgrounding the app.
- Timer state is restored from `localStorage` if the page is refreshed while running.
- Sound plays when the timer reaches 0.
- Web Notification appears when permitted.
- Adjust buttons work during idle, running, and paused states.
- No TypeScript errors.
