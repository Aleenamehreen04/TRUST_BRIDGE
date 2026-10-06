// Small reusable pieces used by the screens in App.jsx.
export function Header({ onHome, onHow }) {
  return (
    <header className="header">
      <button className="logo" onClick={onHome} aria-label="TrustBridge home">
        <svg width="28" height="30" viewBox="0 0 28 30" aria-hidden="true">
          <path d="M14 2 L25 6 V14 C25 21 20 26 14 28 C8 26 3 21 3 14 V6 Z" fill="none" stroke="#3ddbc4" strokeWidth="2.2" />
          <path d="M8 17 Q14 9 20 17" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        TrustBridge
      </button>
      <button className="navlink" onClick={onHow}>How It Works</button>
    </header>
  )
}

export function Button({ variant = 'primary', ...props }) {
  return <button className={`btn btn-${variant}`} {...props} />
}

const LEVEL = { HIGH: ['🔴', 'HIGH RISK'], MEDIUM: ['🟠', 'MEDIUM RISK'], LOW: ['🟢', 'LOW RISK'] }
// The risk level is always shown as text too, never by colour alone.
export function RiskBadge({ level }) {
  return <div className={`risk-badge risk-${level}`}><span aria-hidden="true">{LEVEL[level][0]}</span> {LEVEL[level][1]}</div>
}

export function RiskFactor({ title, description }) {
  return <div className="factor"><h4>{title}</h4><p>{description}</p></div>
}

export function StepCard({ number, title, description }) {
  return (
    <li className="step">
      <span className="step-num">{number}</span>
      <div><h4>{title}</h4><p>{description}</p></div>
    </li>
  )
}

export function ActionList({ title, items, kind }) {
  return (
    <div className={kind}>
      <h4>{title}</h4>
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  )
}

export function DecisionOption({ option, selected, answered, onSelect }) {
  const state = answered && selected ? (option.correct ? 'right' : 'wrong') : ''
  return (
    <button className={`option ${state}`} onClick={onSelect} disabled={answered} aria-pressed={selected}>
      <strong>{option.id}.</strong> {option.text}
    </button>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose one (optional)</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

export function LoadingState() {
  return (
    <div className="center" role="status">
      <div className="spinner" aria-hidden="true" />
      <h2>Analyzing the request...</h2>
      <p>Looking for contextual warning signs and verification risks.</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  )
}