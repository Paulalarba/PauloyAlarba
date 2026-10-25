import { m } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedText({ reduceMotion }) {
  return (
    <m.h1
      id="hero-title"
      className="portfolio-hero__title font-black tracking-tight"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      transition={{ delayChildren: 0.2, staggerChildren: 0.12 }}
      aria-label="Paul Alarba"
    >
      <m.span className="portfolio-hero__first-name" aria-hidden="true" variants={variants} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>Paul</m.span>
      {' '}
      <m.span className="portfolio-hero__last-name" aria-hidden="true" variants={variants} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>Alarba</m.span>
    </m.h1>
  );
}
