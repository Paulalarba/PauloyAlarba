import { useEffect, useRef, useState } from 'react';
import { asset } from '../data/portfolio.js';
import { Icon } from './UI.jsx';
import { pageHref } from '../routing.js';
export default function BitcoinCard({ introActive = false }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [inView, setInView] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const visible = inView && documentVisible;
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    const visibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 }) : null;
    observer?.observe(cardRef.current);
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); observer?.disconnect(); };
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (introActive || reduced || !visible || failed) video.pause();
    else video.play().catch(() => { /* The poster remains visible if autoplay is blocked. */ });
  }, [introActive, reduced, visible, failed]);
  return <article className="bitcoin-card" ref={cardRef} aria-labelledby="bitcoin-title">
    <div className="bitcoin-card-top"><span className="micro-label"><span className="tiny-dot" /> CREATIVE EXPLORATIONS</span></div>
    <div className="bitcoin-stage" role="img" aria-label="A stationary robotic hand holding a spinning Bitcoin coin">
      <img src={asset('bitcoin-spinning-static-hand-poster.webp')} alt="" className="bitcoin-poster" fetchPriority="high" width="1600" height="900" />
      {!reduced && !failed && <video ref={videoRef} className={ready ? 'is-ready' : ''} src={import.meta.env.BASE_URL + 'Public/video/bitcoin-spinning-static-hand.mp4'} poster={asset('bitcoin-spinning-static-hand-poster.webp')} muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={() => setReady(true)} onError={() => setFailed(true)} />}
    </div>
    <div className="bitcoin-copy"><span className="eyebrow">CODE. CONNECT. CREATE.</span><h2 id="bitcoin-title">A little curiosity.<br />A world of possibility.</h2><p>Exploring where web development,<br className="desktop-break" /> blockchain, and AI come together.</p><a href={pageHref('expertise')} className="bitcoin-link">Explore my expertise <Icon name="external" size={18} /></a></div>
    <div className="bitcoin-bottom"><span>PAUL ALARBA</span><span>DEVELOPER & BUILDER <Icon name="spark" size={13} /></span></div>
  </article>;
}
