import { Icon, PageHeading } from './UI.jsx';
import { pageHref } from '../routing.js';
import '../styles/automation.css';

export default function AutomationPage() {
  return <div className="automation-page">
    <PageHeading eyebrow="AI AUTOMATION / WORKFLOW LAB" title="Your old inquiries deserve a follow-up." description="Reconnect with eligible past leads, prepare thoughtful responses, and coordinate appointments—with human approval where it matters.">
      <a className="button button-primary" href={pageHref('contact')}>Discuss your follow-up process <Icon name="arrow" size={16} /></a>
    </PageHeading>
    <div className="automation-caption"><span className="prototype-label">Prototype · Pilot testing</span><span>Lead Reactivation Workflow · Interactive simulation</span></div>
    <iframe className="automation-frame" src={import.meta.env.BASE_URL + 'ai-outbox-automation.html'} title="Lead Reactivation Workflow — interactive AI Outbox Automation" />
    <div className="automation-caption"><p>Illustrative walkthrough with fictional data. The complete live journey is still unverified.</p><a className="text-link" href={import.meta.env.BASE_URL + 'ai-outbox-automation.html'} target="_blank" rel="noopener noreferrer">Open full canvas <Icon name="external" size={16} /></a></div>
    <div className="automation-principles">{[
      ['01', 'Claim one job', 'A durable outbox keeps pending work organized and prevents overlapping workers.'],
      ['02', 'Check, then approve', 'Eligibility checks and versioned human review guard every simulated send.'],
      ['03', 'Record the outcome', 'Accepted operations are recorded. Uncertain writes stop for human review.'],
    ].map(([number, title, detail]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{detail}</p></article>)}</div>
  </div>;
}
