import { useEffect, useRef, useState } from 'react';
import ContactForm from './ContactForm.jsx';
import { asset, education, email, expertise, logo, projects, resume, skillLogos, social } from '../data/portfolio.js';
import { Icon, IconTile, PageHeading, ProjectImage } from './UI.jsx';
import { pageHref } from '../routing.js';
function initialProject() {
  const query = window.location.search || window.location.hash.split('?')[1] || '';
  const id = new URLSearchParams(query).get('project');
  return projects.find(project => project.id === id) || null;
}
function ProjectDialog({ project, close }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, []);
  return <dialog className="project-dialog" ref={ref} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="dialog-content"><button className="dialog-close social-button" onClick={close} aria-label="Close project details"><Icon name="close" /></button><div className="dialog-image"><ProjectImage project={project} /></div><div className="dialog-copy"><span className="eyebrow">{project.category}</span><h2 id="dialog-title">{project.name}</h2><p className="dialog-intro">{project.description}</p><h3>The problem</h3><p>{project.problem}</p><h3>What the system does</h3><ul className="feature-list">{project.features.map(feature => <li key={feature}><Icon name="check" size={16} />{feature}</li>)}</ul><h3>Built with</h3><div className="tag-list">{project.tech.map(tech => <span className="tag" key={tech}>{tech}</span>)}</div><a className="button button-primary" href={project.github} target="_blank" rel="noopener noreferrer"><Icon name="github" size={18} /> View on GitHub <Icon name="external" size={16} /></a></div></div>
  </dialog>;
}
export function ProjectsPage() {
  const [selected, setSelected] = useState(initialProject);
  const trigger = useRef(null);
  useEffect(() => {
    const update = () => setSelected(initialProject());
    window.addEventListener('portfolio:navigate', update);
    return () => window.removeEventListener('portfolio:navigate', update);
  }, []);
  function open(project, event) { trigger.current = event.currentTarget; window.history.pushState(null, '', pageHref('projects') + '?project=' + encodeURIComponent(project.id)); setSelected(project); }
  function close() {
    setSelected(null);
    if (window.location.search) window.history.replaceState(null, '', pageHref('projects'));
    requestAnimationFrame(() => trigger.current?.focus());
  }
  return <>
    <PageHeading eyebrow="SELECTED WORK" title="Built to solve something." description="Web applications with real workflows, thoughtful interfaces, and a purpose behind every feature." />
    <section className="project-gallery glass-panel" aria-label="Project gallery">{projects.map((project, index) => <article className="project-card" key={project.id}>
      <button className={'project-visual project-visual-' + index} aria-label={'View ' + project.name + ' project details'} onClick={event => open(project, event)}><span className="project-number">0{index + 1} / 04</span><ProjectImage project={project} /><span className="visual-open"><Icon name="external" size={22} /></span></button>
      <div className="project-card-copy"><p className="eyebrow">{project.category}</p><h2>{project.name}</h2><p>{project.summary}</p><div className="tag-list">{project.tech.slice(0, 3).map(tech => <span className="tag" key={tech}>{tech}</span>)}</div><div className="project-actions"><button className="text-link" onClick={event => open(project, event)}>View project <Icon name="arrow" size={16} /></button><a className="text-link" href={project.github} target="_blank" rel="noopener noreferrer"><Icon name="github" size={17} /> GitHub <Icon name="external" size={14} /></a></div></div>
    </article>)}</section>
    <div className="page-callout"><IconTile name="spark" /><div><h2>Have something in mind?</h2><p>I’d love to hear about your team or your next project.</p></div><a className="button button-primary" href={pageHref('contact')}>Let’s talk <Icon name="external" size={16} /></a></div>
    {selected && <ProjectDialog key={selected.id} project={selected} close={close} />}
  </>;
}
export function ExpertisePage() {
  return <>
    <PageHeading eyebrow="WHAT I DO" title="One curious mind. Different possibilities." description="My technical toolkit spans the web, decentralized systems, and the possibilities of AI." />
    <section className="expertise-intro glass-panel"><div><span className="eyebrow">THE WAY I THINK</span><h2>Understand the problem.<br /><span>Then build the system.</span></h2></div><p>I enjoy transforming complex logic into simple, useful experiences. The tools change. The goal stays the same: make something that works for the people using it.</p></section>
    <section className="expertise-grid" aria-label="Areas of expertise">{expertise.map(item => <article className="expertise-card" key={item.number}><div className="expertise-card-top"><IconTile name={item.icon} /><span>{item.number}</span></div><h2>{item.title}</h2><h3>{item.subtitle}</h3><p>{item.description}</p>{item.groups.map(group => <div className="skill-group" key={group.title}><h4>{group.title}</h4><ul>{group.items.map(skill => <li key={skill}><span className="skill-logo"><img src={logo(skillLogos[skill])} alt="" width="22" height="22" loading="lazy" /></span><span>{skill}</span></li>)}</ul></div>)}<div className="expertise-practices" aria-label="Related experience">{item.practices.map(practice => <span key={practice}>{practice}</span>)}</div></article>)}</section>
    <div className="page-callout"><IconTile name="work" /><div><h2>See the thinking in practice.</h2><p>Explore the systems and interfaces I’ve built.</p></div><a className="button button-primary" href={pageHref('projects')}>View projects <Icon name="external" size={16} /></a></div>
  </>;
}
export function AboutPage() {
  return <>
    <PageHeading eyebrow="A LITTLE ABOUT ME" title="Hi, I’m Paul." description="A developer from Cebu, turning curiosity into working code." />
    <section className="about-main glass-panel"><div className="about-story"><span className="eyebrow">THE PERSON BEHIND THE PROJECTS</span><h2>I like figuring out<br />how things work.<br /><span>Then making them better.</span></h2><p>I’m a student at the University of Cebu. Since I began my journey in tech, I’ve enjoyed transforming complex logic into simple, beautiful, and intuitive systems.</p><p>My interests bring together web development, blockchain, and AI automation. I’m building my skills by making things, solving problems, and staying curious.</p><a className="button button-primary" href={resume} download><Icon name="download" size={17} /> Download résumé</a><span className="location-label"><Icon name="location" size={16} /> Based in Cebu, Philippines</span></div><div className="about-portrait"><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /><img src={asset('Profile.png')} alt="Paul Alarba" width="1188" height="916" /><span className="portrait-signature">Paul Alarba<span>DEVELOPER · STUDENT · BUILDER</span></span></div></section>
    <div className="section-label"><span className="eyebrow">THE JOURNEY SO FAR</span><h2>Learning, one chapter at a time.</h2></div>
    <section className="education-panel" aria-label="Educational background">{education.map((item, index) => <article className="education-row" key={item.level}><span className="education-index">0{index + 1}</span><IconTile name="book" /><div><span className="eyebrow">{item.level}</span><h3>{item.school}</h3>{item.note && <p>{item.note}</p>}</div>{item.years && <span className="education-years">{item.years}</span>}</article>)}</section>
    <section className="outside-code"><IconTile name="spark" /><div><h2>When the laptop closes.</h2><p>You’ll find me cooking, playing chess, working out, or relaxing on the beach at Bantayan Island.</p></div><div className="interest-tags"><span>Cooking</span><span>Chess</span><span>Fitness</span><span>Island days</span></div></section>
  </>;
}
export function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return <>
    <PageHeading eyebrow="LET’S CONNECT" title="Good things start with a conversation." description="An opportunity, a project, or just a hello. I’d be happy to hear from you." />
    <div className="contact-layout glass-panel"><section className="contact-form-panel" aria-labelledby="contact-form-title"><IconTile name="mail" /><h2 id="contact-form-title">What are you working on?</h2><p className="form-help">Write a message below. Your email app will open with a draft ready for you to send.</p><ContactForm /></section><aside className="contact-direct"><span className="eyebrow">THE DIRECT ROUTE</span><h2>Let’s make<br />something useful.</h2><p>For teams looking for a developer and people with an idea worth building.</p><div className="email-block"><span>Email me</span><a href={'mailto:' + email}>{email}</a><button className="text-link" onClick={copyEmail}>{copied ? 'Email copied' : 'Copy email address'} <Icon name={copied ? 'check' : 'arrow'} size={15} /></button><span className="sr-only" role="status">{copied ? 'Email address copied to clipboard.' : copyError ? 'Could not copy. Please select the email address above.' : ''}</span>{copyError && <small>Select the address above to copy it.</small>}</div><div className="contact-socials"><a href={social.github} target="_blank" rel="noopener noreferrer"><Icon name="github" />GitHub<Icon name="external" size={16} /></a><a href={social.linkedin} target="_blank" rel="noopener noreferrer"><Icon name="linkedin" />LinkedIn<Icon name="external" size={16} /></a><a href={social.x} target="_blank" rel="noopener noreferrer"><span className="x-mark">𝕏</span>X / Twitter<Icon name="external" size={16} /></a><a href={resume} download><Icon name="download" />My résumé<Icon name="external" size={16} /></a></div><span className="location-label"><Icon name="location" size={16} /> Cebu, Philippines · GMT+8</span></aside></div>
  </>;
}
