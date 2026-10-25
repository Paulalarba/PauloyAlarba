import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function useHeroMotion() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(heroRef, { amount: 0.01 });
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return { heroRef, reduceMotion, active: inView && visible && !reduceMotion, contentY };
}
