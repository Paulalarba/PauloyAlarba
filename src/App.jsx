import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import PortfolioContent from './components/PortfolioContent.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  useEffect(() => {
    const elements = document.querySelectorAll('.section-reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <><Header /><main><Hero /><PortfolioContent /></main><Footer /></>;
}
