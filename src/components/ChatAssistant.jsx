import { useEffect, useRef, useState } from 'react';
import { resume } from '../data/portfolio.js';
import PaulAssistantMascot from './PaulAssistantMascot.jsx';
import { boundedHistory, CHAT_URL, loadTurnstile, retrySeconds, SITE_KEY } from './chat-client.js';
import '../styles/chat.css';

const suggestions = ['What does Paul build?', 'Tell me about EduCredit', 'What services does Paul offer?'];

function Answer({ text }) {
  // React escapes all text; only HTTPS Markdown links become anchors, never raw HTML.
  return text.split(/(\[[^\]\n]+\]\(https:\/\/[^\s)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
    return link ? <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a> : part;
  });
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState('');
  const [token, setToken] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [error, setError] = useState('');
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [viewport, setViewport] = useState(null);
  const launcher = useRef(null);
  const input = useRef(null);
  const log = useRef(null);
  const challenge = useRef(null);
  const widget = useRef(null);
  const controller = useRef(null);
  const busy = useRef(false);

  function close() {
    setOpen(false);
    launcher.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const visible = window.visualViewport;
    const resize = () => setViewport(visible ? {
      height: visible.height,
      inset: Math.max(0, window.innerHeight - visible.height - visible.offsetTop),
    } : null);
    resize();
    visible?.addEventListener('resize', resize);
    visible?.addEventListener('scroll', resize);
    return () => {
      visible?.removeEventListener('resize', resize);
      visible?.removeEventListener('scroll', resize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const escape = event => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    const navigate = () => close();
    document.addEventListener('keydown', escape);
    window.addEventListener('portfolio:navigate', navigate);
    return () => {
      document.removeEventListener('keydown', escape);
      window.removeEventListener('portfolio:navigate', navigate);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setToken('');
    setVerificationError('');
    loadTurnstile().then(api => {
      if (!active) return;
      widget.current = api.render(challenge.current, {
        sitekey: SITE_KEY, action: 'portfolio-chat', theme: 'auto', size: 'flexible',
        callback: value => { if (active) { setToken(value); setVerificationError(''); } },
        'expired-callback': () => { if (active) { setToken(''); api.reset(widget.current); } },
        'error-callback': () => { if (active) { setToken(''); setVerificationError('Verification failed. Try the check again or contact Paul.'); } },
        'timeout-callback': () => { if (active) { setToken(''); setVerificationError('Verification timed out. Try the check again.'); } },
      });
    }).catch(reason => { if (active) setVerificationError(reason.message); });
    return () => {
      active = false;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
      controller.current?.abort();
    };
  }, [open, verificationAttempt]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, pending, open]);

  async function send(event) {
    event.preventDefault();
    const message = draft.trim();
    if (busy.current || cooldown || !token || !message || message.length > 1000) return;
    busy.current = true;
    setPending(message);
    setError('');
    setToken('');
    const abort = new AbortController();
    controller.current = abort;
    const timer = window.setTimeout(() => abort.abort(), 35000);
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: abort.signal,
        body: JSON.stringify({ message, history: boundedHistory(messages), turnstileToken: token }),
      });
      if (response.status === 429) setCooldown(retrySeconds(response.headers.get('Retry-After')));
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'AI replies are unavailable right now. Please try again later or contact Paul.');
      if (typeof data?.answer !== 'string' || !data.answer.trim()) throw new Error('No answer was received. Please try again or contact Paul.');
      setMessages(previous => [...previous, { role: 'user', content: message }, { role: 'assistant', content: data.answer }].slice(-40));
      setDraft('');
    } catch (reason) {
      setError(reason.name === 'AbortError' ? 'The request was interrupted or timed out. You can retry your message.' : reason instanceof TypeError ? 'Could not connect. Check your connection or contact Paul directly.' : reason.message);
    } finally {
      clearTimeout(timer);
      busy.current = false;
      controller.current = null;
      setPending('');
      if (widget.current !== null) window.turnstile?.reset(widget.current);
    }
  }

  const keyboard = open && viewport?.inset > 100;
  return <div className={'paul-chat' + (keyboard ? ' chat-keyboard' : '')} style={keyboard ? { bottom: viewport.inset + 12, '--chat-visible-height': `${Math.max(180, viewport.height - 24)}px` } : undefined}>
    {open && <section id="paul-chat-panel" className="chat-panel" role="dialog" aria-labelledby="chat-title" aria-describedby="chat-disclosure">
      <header className="chat-header"><div><span className="chat-eyebrow">ASK ABOUT PAUL</span><h2 id="chat-title">Paul’s AI Assistant</h2></div><button type="button" className="chat-close" onClick={close} aria-label="Close chat">×</button></header>
      <p id="chat-disclosure" className="chat-disclosure">AI answers from Paul’s portfolio. Details may need confirmation. Messages are sent to Cloudflare to generate replies.</p>
      <div ref={log} className="chat-log" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" tabIndex={0}>
        <div className="chat-welcome"><span className="chat-spark" aria-hidden="true">✦</span><h3>What would you like to know?</h3><p>Explore Paul’s projects, skills, and services.</p></div>
        {!messages.length && <div className="chat-suggestions">{suggestions.map(question => <button key={question} type="button" disabled={!!pending} onClick={() => { setDraft(question); setError(''); input.current?.focus(); }}>{question}<span aria-hidden="true">↗</span></button>)}</div>}
        {messages.map((message, index) => <div className={'chat-message chat-' + message.role} key={index}><span>{message.role === 'user' ? 'You' : 'Paul’s assistant'}</span><p><Answer text={message.content} /></p></div>)}
        {pending && <><div className="chat-message chat-user"><span>You</span><p>{pending}</p></div><p className="chat-thinking" role="status">Preparing an answer…</p></>}
      </div>
      <nav className="chat-links" aria-label="More about Paul"><a href="/projects">Projects</a><a href={resume} target="_blank" rel="noopener noreferrer">Résumé</a><a href="/contact">Contact Paul ↗</a><button type="button" disabled={!!pending || !messages.length} onClick={() => { setMessages([]); setError(''); setDraft(''); }}>Clear chat</button></nav>
      <form className="chat-form" onSubmit={send}>
        {error && <p className="chat-error" role="alert">{error} <a href="/contact">Contact Paul</a></p>}
        <div className="chat-verification" ref={challenge} />
        <div className="chat-verification-status" role="status">{verificationError ? <>{verificationError} <button type="button" disabled={!!pending} onClick={() => setVerificationAttempt(value => value + 1)}>Retry verification</button></> : token ? 'Verification complete' : 'Completing a quick security check…'}</div>
        <label className="chat-input-label" htmlFor="chat-message">Your question</label>
        <div className="chat-compose"><textarea id="chat-message" ref={input} rows={2} value={draft} maxLength={1000} disabled={!!pending} placeholder="Ask about projects, skills, or services…" onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} /><button type="submit" disabled={!!pending || !token || !draft.trim() || !!cooldown} aria-label="Send message">↑</button></div>
        <div className="chat-form-note"><span>{cooldown ? `Please wait ${cooldown}s before sending.` : 'Enter to send · Shift + Enter for a new line'}</span><span>{draft.length}/1000</span></div>
      </form>
    </section>}
    <PaulAssistantMascot buttonRef={launcher} state={pending ? 'thinking' : open ? 'greeting' : 'idle'} expanded={open} onClick={() => open ? close() : setOpen(true)} />
  </div>;
}
