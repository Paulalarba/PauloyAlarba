export const CHAT_URL = import.meta.env?.VITE_CHAT_API_URL || 'https://paul-portfolio-assistant.paulnicoralarba13.workers.dev/chat';
export const SITE_KEY = import.meta.env?.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAF0rCDo7vRn_3OAv';

// Only complete successful turns are sent. Never truncate a pair or exceed the backend caps.
export function boundedHistory(messages) {
  const history = [];
  let size = 0;
  for (let i = messages.length - 2; i >= 0 && history.length < 6; i -= 2) {
    const pair = messages.slice(i, i + 2);
    if (pair[0]?.role !== 'user' || pair[1]?.role !== 'assistant') break;
    if (pair.some(item => typeof item.content !== 'string' || item.content.length > 2000)) break;
    const chars = pair.reduce((sum, item) => sum + item.content.length, 0);
    if (size + chars > 6000) break;
    size += chars;
    history.unshift(...pair.map(({ role, content }) => ({ role, content })));
  }
  return history;
}

export function retrySeconds(value) {
  if (!value) return 60;
  const seconds = /^\d+$/.test(value) ? Number(value) : Math.ceil((Date.parse(value) - Date.now()) / 1000);
  return Number.isFinite(seconds) ? Math.max(1, Math.min(seconds, 3600)) : 60;
}

let turnstilePromise;
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstilePromise) return turnstilePromise;
  turnstilePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = window.setTimeout(() => fail(), 15000);
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      turnstilePromise = undefined;
      reject(new Error('Verification could not load. Check your connection or contact Paul directly.'));
    };
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return turnstilePromise;
}
