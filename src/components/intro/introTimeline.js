import { INTRO_TIMING } from './introModel.js';

// Scheduling is separate from the DOM so skip, slow-loading, and cleanup behavior can be tested.
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

  function later(callback, delay) {
    const timer = schedule(() => {
      timers.delete(timer);
      if (!disposed && !finished) callback();
    }, delay);
    timers.add(timer);
  }
  function clear() { timers.forEach(cancel); timers.clear(); }
  function finish() {
    if (disposed || finished) return;
    finished = true;
    clear();
    onFinish();
  }
  function reveal() {
    if (disposed || finished || revealing) return;
    revealing = true;
    // Schedule the release before animation setup, so an animation error cannot hold the overlay.
    later(finish, INTRO_TIMING.transition + 220);
    try { onReveal(); } catch { finish(); }
  }
  INTRO_TIMING.nodeCompletion.forEach((delay, index) => later(() => onNode(index + 1), delay));
  later(() => { if (assetsReady) reveal(); }, INTRO_TIMING.reveal);
  later(reveal, INTRO_TIMING.assetDeadline);
  later(finish, INTRO_TIMING.hardStop);
  return {
    assetsSettled() {
      if (disposed || finished) return;
      assetsReady = true;
      if (now() - started >= INTRO_TIMING.reveal) reveal();
    },
    finish,
    get revealing() { return revealing; },
    dispose() { disposed = true; clear(); },
  };
}
