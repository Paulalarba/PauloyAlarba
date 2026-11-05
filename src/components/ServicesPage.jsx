import { Icon, IconTile, PageHeading } from './UI.jsx';
import { pageHref } from '../routing.js';
import { logo, skillLogos } from '../data/portfolio.js';

const services = [
  { icon: 'code', title: 'Websites', description: 'A clear, responsive home for your business. Built to explain what you do and help people get in touch.', toolkit: ['HTML5', 'CSS', 'JavaScript'] },
  { icon: 'work', title: 'Web applications', description: 'Custom portals, dashboards, and everyday tools that bring your team, accounts, and data together.', toolkit: ['React', 'ASP.NET Core', 'PostgreSQL'] },
  { icon: 'layers', title: 'Connected workflows', description: 'Connect forms, records, and notifications to keep work moving with fewer manual steps.', toolkit: ['n8n', 'PostgreSQL', 'ASP.NET Core'] },
  { icon: 'cube', title: 'Blockchain prototypes', description: 'Test a Web3 idea with a usable interface and the smart contract foundations to support it.', toolkit: ['Solidity', 'Ethereum', 'Ethers.js'] },
  { icon: 'spark', title: 'AI-assisted tools', description: 'Put AI to work on drafts, questions, and repetitive tasks, with your team in control of the decisions.', toolkit: ['Ollama', 'Codex', 'React'] },
];
const method = [
  { title: 'Understand', description: 'Define the problem, the people, and a useful first outcome.' },
  { title: 'Build', description: 'Turn the agreed scope into a working interface and workflow.' },
  { title: 'Improve', description: 'Test with real use, refine the details, and plan what comes next.' },
];

export default function ServicesPage() {
  return <div className="services-page">
    <PageHeading eyebrow="WHAT I CAN BUILD" title="Services" description="Websites, applications, and automation. Thoughtfully built around the way you work.">
      <a className="button button-primary" href={pageHref('contact')}>Start a conversation <Icon name="arrow" size={16} /></a>
    </PageHeading>
    <section className="service-offerings" aria-label="Development services">
      <div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.title}>
        <div className="service-card-top"><IconTile name={service.icon} /><span>0{index + 1}</span></div>
        <h2>{service.title}</h2><p>{service.description}</p>
        <div className="service-toolkit" aria-label={service.title + ' tools'}>{service.toolkit.map(tool => <span className="service-tool" key={tool}><img src={logo(skillLogos[tool])} alt="" width="16" height="16" loading="lazy" />{tool}</span>)}</div>
      </article>)}
        <div className="service-start"><span className="eyebrow">LET’S FIGURE IT OUT</span><h2>Have a problem<br />in mind?</h2><p>Tell me what’s slowing you down. We can find a practical place to start.</p><a className="text-link" href={pageHref('contact')}>Talk about your project <Icon name="arrow" size={16} /></a></div>
      </div>
    </section>
    <section className="service-feature" aria-labelledby="reactivation-title">
      <div className="service-feature-copy"><p className="eyebrow">IN THE WORKFLOW LAB</p><h2 id="reactivation-title">Your old inquiries<br />deserve a follow-up.</h2><p>Reconnect with eligible past leads, review replies, and coordinate appointments—with human approval at each important step.</p><a className="text-link" href={pageHref('ai-automation')}>Explore the workflow <Icon name="arrow" size={17} /></a></div>
      <div className="service-feature-preview"><div className="service-preview-heading"><span>Lead Reactivation Workflow</span><span className="service-prototype"><i />Prototype</span></div>
        <ol className="service-preview-flow" aria-label="Workflow overview">{[['layers', 'Check eligibility'], ['user', 'Human review'], ['calendar', 'Coordinate booking']].map(([icon, label]) => <li key={label}><IconTile name={icon} /><span>{label}</span></li>)}</ol>
        <p>Illustrative walkthrough · Pilot testing<br /><span>The complete live journey is still unverified.</span></p>
      </div>
    </section>
    <section className="service-method" aria-labelledby="service-method-title"><div className="service-method-heading"><p className="eyebrow">HOW WE WORK</p><h2 id="service-method-title">Understand. Build. Improve.</h2></div>
      <ol className="service-method-steps">{method.map((step, index) => <li key={step.title}><span className="method-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
    </section>
  </div>;
}
