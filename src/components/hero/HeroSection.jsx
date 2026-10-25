import { LazyMotion, m } from 'framer-motion';
import HeroContent from './HeroContent.jsx';
import HeroVideo from './HeroVideo.jsx';
import useHeroMotion from './useHeroMotion.js';

const loadMotionFeatures = () => import('./motionFeatures.js').then((module) => module.default);

export default function HeroSection() {
  const { heroRef, reduceMotion, active, contentY } = useHeroMotion();

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <section
        ref={heroRef}
        id="top"
        className="portfolio-hero relative isolate flex min-h-svh flex-col items-center bg-black text-center text-white"
        aria-labelledby="hero-title"
      >
        <div className="portfolio-hero__composition flex w-full flex-col items-center">
          <div className="portfolio-hero__visual-wrap relative w-full">
            <HeroVideo active={active} reduceMotion={reduceMotion} />
          </div>
          <HeroContent reduceMotion={reduceMotion} y={contentY} />
        </div>
        <m.a
          href="#work"
          className="portfolio-hero__scroll inline-flex items-center justify-center gap-3"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          aria-label="Scroll to featured works"
        >
          <span className="portfolio-hero__scroll-line" aria-hidden="true" />
          Scroll to explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </m.a>
      </section>
    </LazyMotion>
  );
}
