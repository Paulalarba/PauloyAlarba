import { Fragment, useState } from 'react';
import { asset } from '../data/portfolio.js';
const paths = {
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  work: 'M8 6V4h8v2M3 7h18v13H3ZM3 12c5 3 13 3 18 0M10 13h4',
  layers: 'm12 3 10 5-10 5L2 8Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  mail: 'M3 5h18v14H3Zm0 1 9 7 9-7', arrow: 'M5 12h14m-6-6 6 6-6 6', external: 'M7 17 17 7M7 7h10v10',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5', code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
  cube: 'm12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5m-9 5v10', spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM20 2v4m-2-2h4',
  moon: 'M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  github: 'M9 19c-4 1-4-2-6-2m13 5v-4c0-1-.4-2-1-2.5 3-.4 6-1.5 6-6 0-1.4-.5-2.5-1.3-3.5.2-1 .2-2-.2-3-1 0-2 .5-3 1a13 13 0 0 0-7 0c-1-.5-2-1-3-1-.4 1-.4 2-.2 3A5 5 0 0 0 5 9.5c0 4.5 3 5.6 6 6-.6.5-1 1.5-1 2.5v4',
  linkedin: 'M4 9v12M4 3v1M9 21V9h5v2c2-4 7-2 7 2v8M9 14c0-5 6-5 6 0v7',
  location: 'M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0ZM15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  book: 'M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15',
  check: 'm5 12 4 4L19 6', close: 'm6 6 12 12M6 18 18 6', pause: 'M8 5v14M16 5v14', play: 'm8 4 12 8-12 8Z',
};
export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.spark} /></svg>;
}
export function IconTile({ name, className = '' }) { return <span className={'icon-tile ' + className}><Icon name={name} /></span>; }
export function PageHeading({ eyebrow, title, titleId, description, children }) {
  return <header className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1 id={titleId}>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{children}</header>;
}
export function ProjectImage({ project, ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="image-placeholder"><Icon name="code" size={36} /><span>{project.name}</span></div>;
  return <img src={project.remoteImage || asset(project.image)} alt={project.imageAlt || project.name + ' project interface'} loading="lazy" {...props} onError={() => setFailed(true)} />;
}

export function HomeHeadline() {
  return ['Ideas', 'into', 'systems.', 'Built', 'with', 'purpose.'].map((word, index) => <Fragment key={word}>
    {index > 0 && ' '}{index === 3 && <br className="small-break" />}
    <span className="headline-word"><span className="headline-word-in" style={{ '--word-index': index }}>{word}</span></span>
  </Fragment>);
}
