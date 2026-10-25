import { useLayoutEffect, useRef, useState } from 'react';
import { HomeHeadline, Icon } from './UI.jsx';
import { getIntroPlacement, INTRO_STEPS, INTRO_TIMING } from './intro/introModel.js';
import { createIntroTimeline } from './intro/introTimeline.js';

export default function WorkflowIntro({ onComplete }) {
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const flowRef = useRef(null);
  const brandRef = useRef(null);
  const curtainRef = useRef(null);
  const finishRef = useRef(onComplete);
  const [completed, setCompleted] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const target = document.getElementById('home-title');
    if (!target || !titleRef.current || !overlayRef.current) { onComplete(); return; }
    let disposed = false;
    let exiting = false;
    let timeline;
    const animations = [];
    const imageCleanups = [];
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.intro = 'playing';
    window.scrollTo({ top: 0, behavior: 'instant' });

    function finish() { timeline?.finish(); }
    finishRef.current = finish;
    function measure() {
      const bounds = target.getBoundingClientRect();
      const style = getComputedStyle(target);
      const placement = getIntroPlacement(bounds, { width: window.innerWidth, height: window.innerHeight });
      Object.assign(titleRef.current.style, {
        left: bounds.left + 'px', top: bounds.top + 'px', width: bounds.width + 'px',
        fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
        lineHeight: style.lineHeight, letterSpacing: style.letterSpacing,
        transform: placement.transform,
      });
      overlayRef.current.style.setProperty('--intro-flow-top', placement.flowTop + 'px');
      overlayRef.current.dataset.ready = 'true';
    }
    function animate(element, keyframes, options) {
      if (!element?.animate) return null;
      const animation = element.animate(keyframes, { fill: 'forwards', ...options });
      animations.push(animation);
      // A cancelled animation rejects its finished promise.
      animation.finished.catch(() => {});
      return animation;
    }
    function reveal() {
      if (disposed || exiting) return;
      exiting = true;
      setReady(true);
      document.documentElement.dataset.intro = 'revealing';
      overlayRef.current.dataset.phase = 'revealing';
      const from = titleRef.current.style.transform;
      animate(titleRef.current, [{ transform: from }, { transform: 'translate(0px, 0px) scale(1)' }], {
        duration: INTRO_TIMING.transition, easing: 'cubic-bezier(.22,1,.36,1)',
      });
      animate(curtainRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 480, easing: 'ease-out' });
      for (const element of [flowRef.current, brandRef.current]) {
        animate(element, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -8px' }], { duration: 300, easing: 'ease-out' });
      }
      if (!titleRef.current.animate) titleRef.current.style.opacity = '0';
    }

    measure();
    overlayRef.current.focus({ preventScroll: true });
    timeline = createIntroTimeline({ onNode: setCompleted, onReveal: reveal, onFinish: onComplete });

    // Only the opening imagery matters here. A video or a below-fold image must not hold the intro.
    const images = [...document.querySelectorAll('.portrait-wrap img, .mobile-identity img, .bitcoin-poster')]
      .filter(image => image.getClientRects().length > 0);
    const imageReady = image => {
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        const settled = () => { image.removeEventListener('load', settled); image.removeEventListener('error', settled); resolve(); };
        image.addEventListener('load', settled, { once: true });
        image.addEventListener('error', settled, { once: true });
        imageCleanups.push(settled);
        // Recheck after installing listeners in case a cached image completed between the checks.
        if (image.complete) settled();
      });
    };
    Promise.all(images.map(imageReady)).then(() => {
      if (disposed) return;
      timeline.assetsSettled();
    });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => { if (media.matches) finish(); };
    media.addEventListener('change', motionChanged);
    const resize = () => { if (exiting || window.innerHeight < 480) finish(); else measure(); };
    const visibility = () => { if (document.hidden) finish(); };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    // Component readiness may be delayed until a tab is foregrounded.
    if (media.matches || document.hidden) finish();

    return () => {
      disposed = true;
      timeline.dispose();
      animations.forEach(animation => animation.cancel());
      imageCleanups.forEach(cleanup => cleanup());
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', motionChanged);
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.intro;
    };
  }, [onComplete]);

  return <div ref={overlayRef} className="workflow-intro" tabIndex={-1} role="dialog" aria-modal="true" aria-label="Paul Alarba portfolio introduction" onKeyDown={event => {
    if (event.key === 'Tab') { event.preventDefault(); overlayRef.current?.focus({ preventScroll: true }); }
    if (event.key === 'Escape') { event.preventDefault(); finishRef.current(); }
  }}>
    <div className="intro-curtain" ref={curtainRef} aria-hidden="true" />
    <p className="intro-brand" ref={brandRef} aria-hidden="true"><span>pa<span>.</span></span> PAUL ALARBA <i /> DEVELOPER & BUILDER</p>
    <div className="intro-headline" ref={titleRef} aria-hidden="true"><HomeHeadline /></div>
    <div className="intro-flow" ref={flowRef}>
      <div className="workflow-nodes" aria-hidden="true">{INTRO_STEPS.map((step, index) => <div className={'workflow-step ' + (completed > index ? 'is-done' : '')} style={{ '--step-index': index }} key={step.label}>
        {index < INTRO_STEPS.length - 1 && <span className="workflow-connector" style={{
          '--travel-delay': INTRO_TIMING.nodeCompletion[index] + 'ms',
          '--travel-duration': (INTRO_TIMING.nodeCompletion[index + 1] - INTRO_TIMING.nodeCompletion[index]) + 'ms',

        }}><span className="connector-track" /><span className="connector-fill" /><span className="connector-signal" /></span>}
        <div className={'workflow-node ' + (index === 0 ? 'workflow-trigger' : '')}>
          {index > 0 && <span className="workflow-port port-in" />}
          <Icon name={step.icon} size={25} />
          {index < INTRO_STEPS.length - 1 && <span className="workflow-port port-out" />}
          <span className="workflow-check"><Icon name="check" size={12} /></span>
        </div>
        <span className="workflow-label">{step.label}</span>
      </div>)}</div>
      <p className={'workflow-status ' + (ready ? 'is-ready' : '')} role="status" aria-live="polite" aria-atomic="true"><span />{ready ? 'Ready to explore' : 'Preparing your portfolio'}</p>
    </div>
  </div>;
}
