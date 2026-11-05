import '../styles/mascot.css';

/** Put assets/ in public/mascot/. Connect onClick to your existing chat toggle. */
export default function PaulAssistantMascot({
  state = 'idle',
  onClick,
  expanded = false,
  assetBase = `${import.meta.env.BASE_URL}mascot`,
  size = 80,
  buttonRef,
}) {
  const mode = ['idle', 'thinking', 'greeting'].includes(state) ? state : 'idle';
  const label = expanded ? 'Close AI assistant' : 'Open AI assistant';
  return (
    <button
      type="button"
      ref={buttonRef}
      className={`chat-launcher paul-assistant paul-assistant--${mode}`}
      style={{ '--mascot-size': `${size}px` }}
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      aria-controls="paul-chat-panel"
    >
      <span className="paul-assistant__art" aria-hidden="true">
        <img className="paul-assistant__animated" src={`${assetBase}/${mode}.webp`} alt="" />
        <img className="paul-assistant__still" src={`${assetBase}/${mode}.png`} alt="" />
      </span>
      <span className="paul-assistant__status" aria-hidden="true" />
      {mode === 'thinking' && <span className="paul-assistant__dots" aria-hidden="true"><i /><i /><i /></span>}
    </button>
  );
}
