import { Icon, IconTile, PageHeading } from './UI.jsx';
import { pageHref } from '../routing.js';

const method = [
  { number: '01', icon: 'spark', title: 'Understand', description: 'Start with the people, the problem, and the outcome you need.' },
  { number: '02', icon: 'code', title: 'Build', description: 'Shape the interface, data, and workflow into a working system.' },
  { number: '03', icon: 'check', title: 'Improve', description: 'Test the experience, refine the details, and make it useful.' },
];

const services = [
  { icon: 'code', title: 'Websites', description: 'Responsive sites that explain your work clearly and make it easy to get in touch.', tag: 'MADE FOR PEOPLE', points: ['Thoughtful, accessible layouts', 'Fast on desktop and mobile'] },
  { icon: 'work', title: 'Web applications', description: 'Custom tools with real workflows, accounts, data, and a clear path through the task.', tag: 'BUILT TO WORK', points: ['Front end and back end', 'Structured data and dashboards'] },
  { icon: 'layers', title: 'Connected workflows', description: 'Bring forms, records, and notifications into one coherent process.', tag: 'LESS MANUAL WORK', points: ['Map the steps first', 'Connect the parts that matter'] },
  { icon: 'cube', title: 'Blockchain prototypes', description: 'Explore practical Web3 ideas with interfaces and smart contract foundations.', tag: 'EXPLORE THE IDEA', points: ['Prototype the user journey', 'Connect web and contract logic'] },
  { icon: 'spark', title: 'AI-assisted tools', description: 'Find useful places for AI in an existing process and test the idea with a small tool.', tag: 'PRACTICAL BY DESIGN', points: ['Human review where it matters', 'Start small and learn quickly'] },
];

const flow = [
  { icon: 'mail', label: 'Request arrives', detail: 'A form captures the need' },
  { icon: 'layers', label: 'Details organized', detail: 'The right context is saved' },
  { icon: 'spark', label: 'Next step suggested', detail: 'A clear action is prepared' },
  { icon: 'check', label: 'Human review', detail: 'You choose what happens' },
];

export default function ServicesPage() {
  return <div className="services-page">
    <PageHeading eyebrow="WHAT I CAN BUILD" title="Services" description="Websites, applications, connected workflows, blockchain prototypes, and useful AI tools. Built around the problem you want to solve.">
      <a className="button button-primary" href={pageHref('contact')}>Start a conversation <Icon name="external" size={16} /></a>
    </PageHeading>

    <section className="service-method glass-panel" aria-labelledby="service-method-title">
      <div className="service-method-heading"><p className="eyebrow">THE BUILD METHOD</p><h2 id="service-method-title">Understand. Build. Improve.</h2><p>Three simple steps, in that order.</p></div>
      <ol className="service-method-steps">{method.map(step => <li key={step.number}><span className="method-node"><Icon name={step.icon} size={23} /></span><span className="method-number">{step.number} / 03</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </section>

    <section className="service-offerings" aria-labelledby="service-offerings-title">
      <div className="service-section-heading"><div><p className="eyebrow">WHAT I CAN DO FOR YOU</p><h2 id="service-offerings-title">Pick one, or connect a few.</h2></div><p>Each project starts with a useful first version and room to grow.</p></div>
      <div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.title}>
        <div className="service-card-top"><IconTile name={service.icon} /><span>{String(index + 1).padStart(2, '0')} / 05</span></div>
        <h3>{service.title}</h3><p>{service.description}</p><span className="service-tag">{service.tag}</span>
        <ul>{service.points.map(point => <li key={point}><Icon name="check" size={15} />{point}</li>)}</ul>
      </article>)}</div>
    </section>

    <section className="service-workflow" aria-labelledby="service-workflow-title">
      <div className="service-workflow-copy"><p className="eyebrow">WORKFLOW EXAMPLE</p><h2 id="service-workflow-title">One request. A clearer next step.</h2><p>A connected system can organize an incoming request, prepare a response, and leave the final decision with you.</p><div className="workflow-tags"><span>Form</span><span>App data</span><span>Notification</span><span>Human review</span></div></div>
      <ol className="service-flow" aria-label="Example request workflow">{flow.map((step, index) => <li key={step.label} style={{ '--flow-index': index }}><span className="service-flow-icon"><Icon name={step.icon} size={22} /></span><strong>{step.label}</strong><small>{step.detail}</small></li>)}</ol>
      <div className="service-outcomes" aria-label="Possible next steps">
        <div><span>READY TO TALK</span><strong>Plan a conversation</strong><small>Review the response and choose a time to connect.</small></div>
        <div><span>NEEDS MORE TIME</span><strong>Keep the context</strong><small>Save the details and decide when to follow up.</small></div>
      </div>
    </section>

    <div className="page-callout"><IconTile name="mail" /><div><h2>Have a project in mind?</h2><p>Tell me what you need, and we can shape the first step together.</p></div><a className="button button-primary" href={pageHref('contact')}>Get in touch <Icon name="external" size={16} /></a></div>
  </div>;
}
