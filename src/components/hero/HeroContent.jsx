import { m } from 'framer-motion';
import AnimatedText from './AnimatedText.jsx';

export default function HeroContent({ reduceMotion, y }) {
  return (
    <m.div className="portfolio-hero__content relative w-full px-5" style={{ y: reduceMotion ? 0 : y }}>
      <AnimatedText reduceMotion={reduceMotion} />
      <m.p
        className="portfolio-hero__roles"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Web Developer, Blockchain Developer &{' '}
        <strong>AI Automation</strong>
      </m.p>
    </m.div>
  );
}
