import BitcoinCard from './BitcoinCard.jsx';
import { asset, expertise, projects, resume, tools } from '../data/portfolio.js';
import { HomeHeadline, Icon, IconTile, PageHeading, ProjectImage } from './UI.jsx';
import { pageHref } from '../routing.js';
function ToolItem({ tool }) {
  return <span className="tool-item"><span className="tool-mark"><img src={tool.logo} alt="" width="22" height="22" /></span><span>{tool.name}</span></span>;
}
export default function HomePage({ introActive = false }) {
  return <div className="home-page">
    <PageHeading titleId="home-title" eyebrow="THE PORTFOLIO OF PAUL ALARBA" title={<HomeHeadline />} description="Web development, blockchain & AI automation. From curiosity to working code.">
      <a href={pageHref('contact')} className="button button-primary">Get in touch <Icon name="external" size={17} /></a>
    </PageHeading>
    <section className="tools-panel glass-panel" aria-labelledby="tools-title"><div className="tools-heading"><span className="eyebrow">MY TOOLKIT</span><h2 id="tools-title">Tools I build with</h2></div><div className="tools-window"><div className="tools-track" ><div className="tools-set">{tools.map(tool => <ToolItem key={tool.name} tool={tool} />)}</div><div className="tools-set" aria-hidden="true">{tools.map(tool => <ToolItem key={tool.name} tool={tool} />)}</div></div></div></section>
    <section className="showcase-panel glass-panel" aria-label="Explore my portfolio">
      <div className="home-bento">
        <BitcoinCard introActive={introActive} />
        <a className="bento-card projects-preview" href={pageHref('projects')}>
          <div className="card-heading"><IconTile name="work" /><h2>Selected projects</h2><span className="card-arrow"><Icon name="external" size={18} /></span></div>
          <p>Real problems. Thoughtful solutions.<br />A closer look at what I’m building.</p>
          <div className="mini-projects">{projects.slice(0, 3).map((project, index) => <div className={'mini-project mini-project-' + index} key={project.id}><div className="mini-browser"><span /><span /><span /><small>{project.name}</small></div><ProjectImage project={project} /></div>)}</div>
          <div className="card-foot"><span>EXPLORE THE WORK</span><span>04 projects <Icon name="arrow" size={16} /></span></div>
        </a>
        <a className="bento-card expertise-preview" href={pageHref('expertise')}><div className="card-heading"><IconTile name="layers" /><h2>What I do</h2><span className="card-arrow"><Icon name="external" size={18} /></span></div><p>Different tools. One builder’s mindset.</p><div className="expertise-rows">{expertise.map(item => <div key={item.number}><span className="row-icon"><Icon name={item.icon} size={17} /></span><span>{item.title}</span><small>{item.number}</small></div>)}</div></a>
        <a className="bento-card about-preview" href={pageHref('about')}><div className="card-heading"><IconTile name="user" /><h2>The person</h2><span className="card-arrow"><Icon name="external" size={18} /></span></div><p>Hi, I’m Paul.<br />Always curious. Always building.</p><div className="about-mini"><div className="about-mini-avatar"><img src={asset('Profile.png')} alt="" /></div><span><strong>University of Cebu</strong><small>Student & developer</small></span></div><span className="location-label"><Icon name="location" size={14} /> Cebu, Philippines</span></a>
      </div>
    </section>
    <div className="home-bottom"><p><span className="blue-spark"><Icon name="spark" size={17} /></span>Have a role or a project in mind? <a href={pageHref('contact')}>Let’s talk <Icon name="external" size={14} /></a></p><a href={resume} download className="text-link"><Icon name="download" size={16} /> Download résumé</a></div>
  </div>;
}
