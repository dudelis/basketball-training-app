import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerState } from '../types';

const STORAGE_KEY = 'bball_timer_v1';
const MAX_SECONDS = 3600;

interface StoredTimer {
  status: 'running' | 'paused';
  durationSeconds: number;
  baseRemaining: number; // remaining at time of last start/resume
  startedAt: number;
}

function clamp(val: number): number {
  return Math.min(MAX_SECONDS, Math.max(0, val));
}

function getRemaining(baseRemaining: number, startedAt: number, now: number): number {
  return clamp(baseRemaining - Math.floor((now - startedAt) / 1000));
}

function saveToStorage(data: StoredTimer): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function clearStorage(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

function loadFromStorage(): StoredTimer | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredTimer) : null;
  } catch { return null; }
}

function playBeep(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* ignore */ }
}

function showNotification(): void {
  if (!('Notification' in window)) return;
  const show = () => {
    try { new Notification('Timer done! ✅ How did it go?'); } catch { /* ignore */ }
  };
  if (Notification.permission === 'granted') {
    show();
  } else if (Notification.permission !== 'denied') {
    void Notification.requestPermission().then((p) => { if (p === 'granted') show(); });
  }
}

function buildIdleState(initialSeconds: number): TimerState {
  return { status: 'idle', durationSeconds: initialSeconds, remainingSeconds: initialSeconds };
}

export function useTimer(initialSeconds: number) {
  const baseRemainingRef = useRef<number>(initialSeconds);
  const finishedRef = useRef(false);
  const notifRequestedRef = useRef(false);

  const [state, setState] = useState<TimerState>(() => {
    const saved = loadFromStorage();
    if (!saved) return buildIdleState(initialSeconds);

    const now = Date.now();
    if (saved.status === 'running') {
      const remaining = getRemaining(saved.baseRemaining, saved.startedAt, now);
      baseRemainingRef.current = saved.baseRemaining;
      if (remaining <= 0) {
        clearStorage();
        return { status: 'finished', durationSeconds: saved.durationSeconds, remainingSeconds: 0 };
      }
      return { status: 'running', durationSeconds: saved.durationSeconds, remainingSeconds: remaining, startedAt: saved.startedAt };
    }
    if (saved.status === 'paused') {
      baseRemainingRef.current = saved.baseRemaining;
      return { status: 'paused', durationSeconds: saved.durationSeconds, remainingSeconds: saved.baseRemaining };
    }
    return buildIdleState(initialSeconds);
  });

  // Reset when initialSeconds changes and timer is idle
  useEffect(() => {
    setState((prev) => {
      if (prev.status === 'idle') {
        baseRemainingRef.current = initialSeconds;
        return buildIdleState(initialSeconds);
      }
      return prev;
    });
  }, [initialSeconds]);

  const triggerFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearStorage();
    playBeep();
    showNotification();
    setState((prev) => ({ ...prev, status: 'finished', remainingSeconds: 0, startedAt: undefined }));
  }, []);

  // Interval
  useEffect(() => {
    if (state.status !== 'running') return;
    finishedRef.current = false;

    const id = setInterval(() => {
      setState((prev) => {
        if (prev.status !== 'running' || !prev.startedAt) return prev;
        const remaining = getRemaining(baseRemainingRef.current, prev.startedAt, Date.now());
        if (remaining <= 0) {
          triggerFinish();
          return prev; // triggerFinish updates state separately
        }
        return { ...prev, remainingSeconds: remaining };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [state.status, triggerFinish]);

  const start = useCallback(() => {
    if (!notifRequestedRef.current) {
      notifRequestedRef.current = true;
      if ('Notification' in window && Notification.permission === 'default') {
        void Notification.requestPermission();
      }
    }
    setState((prev) => {
      if (prev.status === 'finished' || prev.remainingSeconds <= 0) return prev;
      const now = Date.now();
      baseRemainingRef.current = prev.remainingSeconds;
      saveToStorage({
        status: 'running',
        durationSeconds: prev.durationSeconds,
        baseRemaining: prev.remainingSeconds,
        startedAt: now,
      });
      return { ...prev, status: 'running', startedAt: now };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'running' || !prev.startedAt) return prev;
      const remaining = getRemaining(baseRemainingRef.current, prev.startedAt, Date.now());
      baseRemainingRef.current = remaining;
      saveToStorage({
        status: 'paused',
        durationSeconds: prev.durationSeconds,
        baseRemaining: remaining,
        startedAt: prev.startedAt,
      });
      return { ...prev, status: 'paused', remainingSeconds: remaining, startedAt: undefined };
    });
  }, []);

  const reset = useCallback(() => {
    clearStorage();
    finishedRef.current = false;
    baseRemainingRef.current = initialSeconds;
    setState(buildIdleState(initialSeconds));
  }, [initialSeconds]);

  const restart = useCallback(() => {
    finishedRef.current = false;
    const now = Date.now();
    baseRemainingRef.current = initialSeconds;
    const next: TimerState = {
      status: 'running',
      durationSeconds: initialSeconds,
      remainingSeconds: initialSeconds,
      startedAt: now,
    };
    saveToStorage({ status: 'running', durationSeconds: initialSeconds, baseRemaining: initialSeconds, startedAt: now });
    setState(next);
  }, [initialSeconds]);

  const adjust = useCallback((deltaSeconds: number) => {
    setState((prev) => {
      if (prev.status === 'finished') return prev;

      const currentRemaining = prev.status === 'running' && prev.startedAt
        ? getRemaining(baseRemainingRef.current, prev.startedAt, Date.now())
        : prev.remainingSeconds;

      const newRemaining = clamp(currentRemaining + deltaSeconds);

      if (newRemaining <= 0 && (prev.status === 'running' || prev.status === 'paused')) {
        triggerFinish();
        return prev;
      }

      const now = Date.now();
      baseRemainingRef.current = newRemaining;
      const newDuration = clamp(prev.durationSeconds + deltaSeconds);
      if (prev.status === 'running') {
        saveToStorage({
          status: 'running',
          durationSeconds: newDuration,
          baseRemaining: newRemaining,
          startedAt: now,
        });
        return { ...prev, remainingSeconds: newRemaining, durationSeconds: newDuration, startedAt: now };
      }
      saveToStorage({
          status: prev.status as 'running' | 'paused',
          durationSeconds: newDuration,
          baseRemaining: newRemaining,
          startedAt: prev.startedAt ?? now,
        });
      return { ...prev, remainingSeconds: newRemaining, durationSeconds: newDuration };
    });
  }, [triggerFinish]);

  return { state, start, pause, reset, adjust, restart };
}
