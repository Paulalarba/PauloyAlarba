import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './UI.jsx';
import { leadBranches, leadStages } from '../data/leadWorkflow.js';
import '../styles/workflow.css';

export function WorkflowNodeDetail({ node, id }) {
  return <div className="workflow-detail" id={id} role="region" aria-label="Selected workflow step" aria-live="polite" aria-atomic="true">
    <span className={'workflow-detail-icon tone-' + (node.tone || 'neutral')}><Icon name={node.icon} size={24} /></span>
    <div><p className="eyebrow">{node.title}</p><h3>{node.heading}</h3><p>{node.detail}</p></div>
  </div>;
}

export default function WorkflowCanvas() {
  const [selected, setSelected] = useState(leadStages[0]);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  const detailId = useId();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setRun(1); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!run) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { setActive(-1); setPlaying(false); return; }
    setPlaying(true);
    setActive(0);
    const timers = leadStages.slice(1).map((_, index) => setTimeout(() => setActive(index + 1), (index + 1) * 1000));
    timers.push(setTimeout(() => { setActive(-1); setPlaying(false); }, 5000));
    const stop = () => { if (motion.matches) { timers.forEach(clearTimeout); setActive(-1); setPlaying(false); } };
    motion.addEventListener('change', stop);
    return () => { timers.forEach(clearTimeout); motion.removeEventListener('change', stop); };
  }, [run]);
  function choose(node) { setSelected(node); }
  function arrowSelect(event, index, nodes) {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % nodes.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + nodes.length - 1) % nodes.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = nodes.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    const button = event.currentTarget.closest('ol, ul').querySelectorAll('button')[next];
    button.focus();
    choose(nodes[next]);
  }
  return <div className="workflow-experience" ref={ref}>
    <div className="workflow-window" id="lead-workflow" tabIndex={-1}>
      <div className="workflow-window-bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><h3>Lead Reactivation Workflow</h3><span className="workflow-window-note">PROCESS OVERVIEW</span></div>
      <div className={'workflow-canvas' + (playing ? ' is-playing' : '')}>
        <svg className="workflow-connections" viewBox="0 0 1000 383" preserveAspectRatio="none" aria-hidden="true">
          <path className="workflow-wire" d="M100 86H900" />
          <path className="workflow-wire workflow-wire-branch" d="M500 86V195Q500 210 485 210H125V258 M700 86V225Q700 240 685 240H375V258 M300 86V195Q300 210 315 210H625V258 M900 86V225Q900 240 885 240H875V258" />
          {playing && [0, 1, 2, 3].map(index => <circle key={run + '-' + index} className="workflow-signal" r="4" style={{ '--signal-delay': index + 's', '--signal-start': (100 + index * 200) + 'px', '--signal-end': (300 + index * 200) + 'px' }} cy="86" />)}
        </svg>
        <ol className="workflow-main" aria-label="Main lead reactivation journey">{leadStages.map((node, index) => <li key={node.id}>
          <button className={'workflow-node' + (selected.id === node.id ? ' is-selected' : '') + (active === index ? ' is-active' : '')} aria-pressed={selected.id === node.id} aria-controls={detailId} onClick={() => choose(node)} onKeyDown={event => arrowSelect(event, index, leadStages)}>
            <span className="workflow-node-icon"><Icon name={node.icon} size={25} /></span><span className="workflow-step-number">0{index + 1}</span><strong>{node.title}</strong><small>{node.summary}</small>
          </button>
        </li>)}</ol>
        <ul className="workflow-branches" aria-label="Other paths">{leadBranches.map((node, index) => <li key={node.id}>
          <button className={'workflow-branch tone-' + node.tone + (selected.id === node.id ? ' is-selected' : '')} aria-pressed={selected.id === node.id} aria-controls={detailId} onClick={() => choose(node)} onKeyDown={event => arrowSelect(event, index, leadBranches)}><span className="workflow-branch-icon"><Icon name={node.icon} size={20} /></span><strong>{node.title}</strong><small>{node.summary}</small></button>
        </li>)}</ul>
      </div>
      <div className="workflow-toolbar"><span><span className="illustration-dot" />Illustrative walkthrough · no live customer activity</span><button className="text-link" onClick={() => setRun(value => value + 1)}><Icon name="replay" size={15} />Replay walkthrough</button></div>
    </div>
    <p className="workflow-instruction">Select a step to explore it. Use Tab and Enter, or arrow keys within each path.</p>
    <WorkflowNodeDetail node={selected} id={detailId} />
  </div>;
}
