import { asset, email, pages, resume, social } from '../data/portfolio.js';
import { Icon } from './UI.jsx';
import { pageHref } from '../routing.js';
export default function PortfolioShell({ page, theme, toggleTheme, children }) {
  const toggle = <button className="social-button theme-button" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} /></button>;
  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to main content</a>
    <div className="ambient-lines" aria-hidden="true"><i /><i /><i /></div>
    <aside className="profile-rail" aria-label="Profile and navigation">
      <a href={pageHref('home')} className="portrait-wrap" aria-label="Paul Alarba — Home"><img src={asset('Profile.png')} alt="Paul Alarba" width="1188" height="916" /><span className="portrait-caption">THE PERSON BEHIND THE CODE</span></a>
      <div className="profile-name"><h2>Paul Alarba</h2><span className="profile-mark" title="Developer"><Icon name="code" size={14} /></span></div>
      <p className="profile-handle">@paulalarba <span>· Cebu, Philippines</span></p>
      <p className="profile-role">Web Developer<br />Blockchain & AI Automation</p>
      <div className="social-row" aria-label="Social profiles">
        <a className="social-button" href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" size={18} /></a>
        <a className="social-button" href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={18} /></a>
        <a className="social-button" href={'mailto:' + email} aria-label="Email Paul"><Icon name="mail" size={18} /></a>{toggle}
      </div>
      <nav className="side-navigation" aria-label="Main navigation">{pages.map(item => <a key={item.id} href={pageHref(item.id)} className={'side-link ' + (page === item.id ? 'is-active' : '')} aria-current={page === item.id ? 'page' : undefined}><Icon name={item.icon} /><span>{item.label}</span>{page === item.id && <span className="nav-indicator" />}</a>)}</nav>
      <a className="rail-resume" href={resume} target="_blank" rel="noopener noreferrer"><Icon name="download" size={18} /><span>Download résumé</span><Icon name="external" size={16} /></a>
      <div className="rail-bottom"><span className="rail-monogram">pa<span>.</span></span><p>Curiosity into code.<br /><span>© {new Date().getFullYear()} Paul Alarba</span></p></div>
    </aside>
    <header className="mobile-header"><a href={pageHref('home')} className="mobile-identity"><img src={asset('Profile.png')} alt="" /><span><strong>Paul Alarba</strong><small>Web · Blockchain · AI</small></span></a>{toggle}</header>
    {children}
    <nav className="mobile-dock" aria-label="Mobile navigation">{['home', 'projects', 'services', 'contact', 'expertise', 'about'].map(id => { const item = pages.find(item => item.id === id); return <a key={id} href={pageHref(id)} className={'dock-link ' + (id === 'contact' ? 'dock-contact ' : '') + (page === id ? 'is-active' : '')} aria-current={page === id ? 'page' : undefined}><span><Icon name={item.icon} size={21} /></span><small>{item.label}</small></a>; })}</nav>
  </>;
}
