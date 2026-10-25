import { useCallback, useEffect, useRef, useState } from 'react';
import PortfolioShell from './components/PortfolioShell.jsx';
import HomePage from './components/HomePage.jsx';
import ServicesPage from './components/ServicesPage.jsx';
import WorkflowIntro from './components/WorkflowIntro.jsx';
import CursorRing from './components/CursorRing.jsx';
import { ProjectsPage, ExpertisePage, AboutPage, ContactPage } from './components/PortfolioPages.jsx';
import { shouldPlayIntro } from './components/intro/introModel.js';
import { pages } from './data/portfolio.js';
import { canonicalizeLegacyRoute, isInternalRoute, routePage } from './routing.js';

function initialIntro() {
  return shouldPlayIntro({
    page: routePage(),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    viewportHeight: window.innerHeight,
  });
}
export default function App() {
  const [page, setPage] = useState(routePage);
  const [introActive, setIntroActive] = useState(initialIntro);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('paul-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  });
  const mainRef = useRef(null);
  const hadIntro = useRef(introActive);
  const navigated = useRef(false);
  const pageRef = useRef(page);
  pageRef.current = page;
  const completeIntro = useCallback(() => {
    const restoreFocus = document.activeElement?.closest?.('.workflow-intro');
    setIntroActive(false);
    if (restoreFocus) requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  }, []);
  useEffect(() => {
    window.dispatchEvent(new Event('portfolio:mounted'));
    canonicalizeLegacyRoute();
    const navigate = () => { canonicalizeLegacyRoute(); navigated.current = true; setPage(routePage()); window.dispatchEvent(new Event('portfolio:navigate')); };
    const click = event => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || !isInternalRoute(anchor, event)) return;
      event.preventDefault();
      if (window.location.href !== anchor.href) window.history.pushState(null, '', anchor.href);
      navigate();
      if (pageRef.current === routePage()) { window.scrollTo({ top: 0, behavior: 'instant' }); mainRef.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('click', click);
    window.addEventListener('popstate', navigate);
    window.addEventListener('hashchange', navigate);
    return () => { document.removeEventListener('click', click); window.removeEventListener('popstate', navigate); window.removeEventListener('hashchange', navigate); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#070B14' : '#F4F4ED');
    try { localStorage.setItem('paul-theme', theme); } catch { /* Storage is optional. */ }
  }, [theme]);
  useEffect(() => {
    document.title = pages.find(item => item.id === page).label + ' \u00b7 Paul Alarba';
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (navigated.current) mainRef.current?.focus({ preventScroll: true });
    if (page !== 'home' && introActive) completeIntro();
  }, [page, introActive, completeIntro]);
  const content = {
    home: <HomePage introActive={introActive} />, projects: <ProjectsPage />, services: <ServicesPage />,
    expertise: <ExpertisePage />, about: <AboutPage />, contact: <ContactPage />,
  };
  return <>
    <div className="portfolio-surface" data-intro-active={introActive} data-intro-played={hadIntro.current} inert={introActive ? true : undefined} aria-hidden={introActive ? true : undefined}>
      <PortfolioShell page={page} theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        <main id="main-content" tabIndex={-1} ref={mainRef} className="main-panel">
          <div key={page} className="page-content" data-page={page}>{content[page]}</div>
          <footer className="page-footer"><span>Thoughtfully built. Always learning.</span><span>&copy; {new Date().getFullYear()} Paul Alarba</span></footer>
        </main>
      </PortfolioShell>
    </div>
    {introActive && <WorkflowIntro onComplete={completeIntro} />}
    <CursorRing />
  </>;
}
