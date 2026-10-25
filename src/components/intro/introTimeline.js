import { INTRO_TIMING } from './introModel.js';

// The timeline advances only while the introduction can be seen.
export function createIntroTimeline({
  schedule = (callback, delay) => window.setTimeout(callback, delay),
  cancel = timer => window.clearTimeout(timer),
  now = () => performance.now(),
  onNode, onReveal, onFinish,
}) {
  const started = now();
  const timers = new Set();
  let disposed = false;
  let finished = false;
  let revealing = false;
  let assetsReady = false;
  let paused = false;
  let pausedAt = 0;
  let pausedDuration = 0;

  function arm(timer) {
    timer.due = now() + timer.remaining;
    timer.id = schedule(() => {
      timer.id = null;
      timers.delete(timer);
      if (!disposed && !finished && !paused) timer.callback();
    }, timer.remaining);
  }
  function later(callback, delay) {
    const timer = { callback, remaining: delay, due: 0, id: null };
    timers.add(timer);
    if (!paused) arm(timer);
  }
  function clear() {
    timers.forEach(timer => { if (timer.id !== null) cancel(timer.id); });
    timers.clear();
  }
  function finish() {
    if (disposed || finished) return;
    finished = true;
    clear();
    onFinish();
  }
  function reveal() {
    if (disposed || finished || revealing) return;
    revealing = true;
    // Schedule release before animation setup so a visual error cannot hold the overlay.
    later(finish, INTRO_TIMING.transition + 220);
    try { onReveal(); } catch { finish(); }
  }
  function visibleElapsed() { return now() - started - pausedDuration; }

  INTRO_TIMING.nodeCompletion.forEach((delay, index) => later(() => onNode(index + 1), delay));
  later(() => { if (assetsReady) reveal(); }, INTRO_TIMING.reveal);
  later(reveal, INTRO_TIMING.assetDeadline);
  later(finish, INTRO_TIMING.hardStop);
  return {
    assetsSettled() {
      if (disposed || finished) return;
      assetsReady = true;
      if (!paused && visibleElapsed() >= INTRO_TIMING.reveal) reveal();
    },
    pause() {
      if (disposed || finished || paused) return;
      paused = true;
      pausedAt = now();
      timers.forEach(timer => {
        if (timer.id !== null) cancel(timer.id);
        timer.id = null;
        timer.remaining = Math.max(0, timer.due - pausedAt);
      });
    },
    resume() {
      if (disposed || finished || !paused) return;
      pausedDuration += now() - pausedAt;
      paused = false;
      timers.forEach(arm);
      if (assetsReady && visibleElapsed() >= INTRO_TIMING.reveal) reveal();
    },
    finish,
    get revealing() { return revealing; },
    dispose() { disposed = true; clear(); },
  };
}
