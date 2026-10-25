import { pages } from './data/portfolio.js';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const ids = new Set(pages.map(page => page.id));
const legacy = { top: 'home', work: 'projects', education: 'about' };

export function pageHref(page) {
  return base + (page === 'home' ? '/' : '/' + page);
}

export function routePage() {
  const hash = window.location.hash.slice(1).split('?')[0];
  const fromHash = legacy[hash] || hash;
  if (ids.has(fromHash)) return fromHash;
  const path = window.location.pathname;
  const part = path.startsWith(base + '/') ? path.slice(base.length + 1).replace(/\/$/, '') : '';
  return ids.has(part) ? part : 'home';
}

export function canonicalizeLegacyRoute() {
  const hash = window.location.hash.slice(1);
  const name = hash.split('?')[0];
  const page = legacy[name] || name;
  if (!ids.has(page)) return;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const query = page === 'projects' && params.has('project') ? '?project=' + encodeURIComponent(params.get('project')) : '';
  window.history.replaceState(null, '', pageHref(page) + query);
}

export function isInternalRoute(anchor, event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return false;
  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin || url.hash || url.search) return false;
  return pages.some(page => url.pathname === pageHref(page.id));
}
