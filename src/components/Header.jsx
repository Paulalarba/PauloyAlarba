import { useEffect, useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (<header id="main-header" className={scrolled ? "scrolled" : ""}>
    <div className="nav-container">
        <a href="#top" className="logo" id="logo-link">
            <img src="https://images4.imgbox.com/29/71/FgDDriOW_o.png" alt="Paul Alarba" className="logo-img" />
        </a>
        <button className={`hamburger ${menuOpen ? "active" : ""}`} id="hamburger" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav className={`nav-menu ${menuOpen ? "active" : ""}`} id="nav-menu" onClick={() => setMenuOpen(false)}>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#education">Education</a>
            <a href="#contact">contact</a>
        </nav>
    </div>
</header>);
}
