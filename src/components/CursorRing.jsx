import { useEffect, useRef } from 'react';

const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"]';

export default function CursorRing() {
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;

    function hide() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      ring.dataset.visible = 'false';
      ring.dataset.interactive = 'false';
      ring.dataset.pressed = 'false';
    }
    function animate() {
      frame = 0;
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(animate);
      }
    }
    function move(event) {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (ring.dataset.visible !== 'true') {
        x = targetX;
        y = targetY;
      }
      ring.dataset.visible = 'true';
      ring.dataset.interactive = String(Boolean(event.target.closest?.(interactiveSelector)));
      if (!frame) frame = requestAnimationFrame(animate);
    }
    function press(event) {
      if (event.pointerType === 'mouse') ring.dataset.pressed = 'true';
    }
    function release() { ring.dataset.pressed = 'false'; }
    function visibility() { if (document.hidden) hide(); }
    function update() {
      const enabled = finePointer.matches && !reducedMotion.matches;
      hide();
      ring.hidden = !enabled;
      if (enabled) {
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerdown', press, { passive: true });
        window.addEventListener('pointerup', release, { passive: true });
        window.addEventListener('pointercancel', release, { passive: true });
        document.addEventListener('mouseleave', hide);
        document.addEventListener('visibilitychange', visibility);
        window.addEventListener('blur', hide);
      } else {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerdown', press);
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
        document.removeEventListener('mouseleave', hide);
        document.removeEventListener('visibilitychange', visibility);
        window.removeEventListener('blur', hide);
      }
    }
    finePointer.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    update();
    return () => {
      ring.hidden = true;
      finePointer.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', hide);
      hide();
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" data-visible="false" aria-hidden="true" hidden />;
}
