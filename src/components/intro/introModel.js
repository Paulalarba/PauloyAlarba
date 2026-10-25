export const INTRO_SESSION_KEY = 'paul-portfolio-intro-v1';
export const INTRO_TIMING = Object.freeze({
  nodeCompletion: [650, 1050, 1500, 1950],
  reveal: 2200,
  assetDeadline: 3400,
  transition: 650,
  hardStop: 4800,
});
export const INTRO_STEPS = [
  { label: 'Idea', icon: 'spark' },
  { label: 'Build', icon: 'code' },
  { label: 'Connect', icon: 'cube' },
  { label: 'Ready', icon: 'check' },
];
export function shouldPlayIntro({ page, reducedMotion, sessionSeen, viewportHeight = Infinity }) {
  return page === 'home' && !reducedMotion && !sessionSeen && viewportHeight >= 480;
}
export function getIntroPlacement(target, viewport) {
  const margin = viewport.width < 540 ? 24 : Math.min(80, viewport.width * 0.07);
  const availableWidth = Math.max(1, viewport.width - margin * 2);
  const scale = Math.min(1.95, availableWidth / Math.max(1, target.width), (viewport.height * 0.25) / Math.max(1, target.height));
  const width = target.width * scale;
  const height = target.height * scale;
  const x = Math.max(margin, (viewport.width - width) / 2);
  const y = Math.max(80, Math.min(viewport.height * 0.33, viewport.height - height - 205));
  return {
    x, y, scale,
    flowTop: Math.min(y + height + (viewport.width < 540 ? 46 : 65), viewport.height - 145),
    transform: 'translate(' + (x - target.left) + 'px, ' + (y - target.top) + 'px) scale(' + scale + ')',
  };
}
