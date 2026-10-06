import { useState } from 'react'
import { Header, Button, RiskBadge, RiskFactor, StepCard, ActionList, DecisionOption, Select, LoadingState, ErrorState } from './components.jsx'
import { challenge, exampleRequest } from './data/challenge.js'

const PRINCIPLES = [
  ['Pause', "Don't let urgency make the decision for you."],
  ['Understand', 'Identify the warning signs in the request.'],
  ['Verify', 'Use a trusted channel outside the suspicious interaction.'],
]

export default function App() {
  // "screen" decides what is visible: landing, input, loading, analysis, plan, challenge
  const [screen, setScreen] = useState('landing')
  const [request, setRequest] = useState('')
  const [who, setWho] = useState('')
  const [channel, setChannel] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // validated analysis from the backend
  const [picked, setPicked] = useState(null)

  const go = (s) => { setScreen(s); window.scrollTo(0, 0) }

  // Sends the request to our own backend. The AI key never reaches the browser.
  const analyze = async () => {
    if (!request.trim()) { setError('Please paste or describe the suspicious request first.'); return }
    setError('')
    go('loading')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: request.trim(), claimedIdentity: who, channel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      go('analysis')
    } catch (e) {
      setError(e.message && e.message !== 'Failed to fetch' ? e.message : "We couldn't analyze this request right now. Please try again.")
      go('input')
    }
  }

  const restart = () => { setRequest(''); setWho(''); setChannel(''); setPicked(null); setResult(null); setError(''); go('input') }
  const chosen = challenge.options.find((o) => o.id === picked)
  const scrollToHow = () => { go('landing'); setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 50) }

  return (
    <>
      <Header onHome={() => go('landing')} onHow={scrollToHow} />
      <main className="page">
        {screen === 'landing' && (
          <section className="hero">
            <h1>Don’t trust the message. Verify the request.</h1>
            <p className="lead">Suspicious requests can look convincing — especially when someone is pretending to be a person you know. TrustBridge helps you understand the warning signs and decide how to verify safely.</p>
            <div className="row">
              <Button onClick={() => go('input')}>Check a suspicious request</Button>
              <Button variant="ghost" onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>How it works</Button>
            </div>
            <div id="how" className="bridge" aria-label="Suspicious Request, Understand the Risk, Verify Safely">
              <div className="bridge-node warn">Suspicious Request</div>
              <div className="bridge-line" aria-hidden="true" />
              <div className="bridge-node">Understand the Risk</div>
              <div className="bridge-line" aria-hidden="true" />
              <div className="bridge-node good">Verify Safely</div>
            </div>
            <div className="principles">
              {PRINCIPLES.map(([t, d]) => <div key={t} className="principle"><h3>{t}</h3><p>{d}</p></div>)}
            </div>
            <Button onClick={() => go('input')}>Check a suspicious request</Button>
          </section>
        )}

        {screen === 'loading' && <section className="panel"><LoadingState /></section>}

        {screen === 'input' && (
          <section className="panel">
            <h2>What happened?</h2>
            <p className="lead">Paste the message or describe the request you received. TrustBridge will help you identify warning signs and decide what to do next.</p>
            <textarea className="textarea" rows={8} maxLength={3000} value={request} onChange={(e) => setRequest(e.target.value)}
              placeholder={`Example:\n${exampleRequest}`} aria-label="The suspicious request" />
            <div className="fields">
              <Select label="Who is this person supposed to be?" value={who} onChange={setWho} options={['Manager', 'Friend', 'Family member', 'Company', 'Other']} />
              <Select label="How did they contact you?" value={channel} onChange={setChannel} options={['WhatsApp', 'SMS', 'Email', 'Phone', 'Other']} />
            </div>
            {error && <ErrorState message={error} />}
            <Button onClick={analyze}>Analyze Request</Button>
            <p className="note">TrustBridge provides decision support, not certainty about whether the sender is genuine.</p>
          </section>
        )}

        {screen === 'analysis' && result && (
          <section className="panel">
            <blockquote className="message">{request}</blockquote>
            <h2>Risk assessment</h2>
            <RiskBadge level={result.riskLevel} />
            <p className="lead">{result.summary}</p>
            <div className="factors">{result.riskFactors.map((f) => <RiskFactor key={f.title} {...f} />)}</div>
            <div className="why"><h3>Why this matters</h3><p>{result.whyItMatters}</p></div>
            <Button onClick={() => go('plan')}>Show me how to verify safely</Button>
          </section>
        )}

        {screen === 'plan' && result && (
          <section className="panel">
            <h2>How to verify safely</h2>
            <p className="lead">You don't need to prove whether the message is real. You need to verify the request through a trusted path.</p>
            <ol className="steps">{result.verificationPlan.map((s) => <StepCard key={s.step} number={s.step} {...s} />)}</ol>
            <h3>Until you've verified it:</h3>
            <div className="dodont">
              <ActionList kind="do" title="DO" items={result.doActions} />
              <ActionList kind="dont" title="DON'T" items={result.dontActions} />
            </div>
            <Button onClick={() => go('challenge')}>Test my decision</Button>
          </section>
        )}

        {screen === 'challenge' && (
          <section className="panel">
            <h2>What would you do?</h2>
            <p className="scenario">{challenge.scenario}</p>
            <div className="options">
              {challenge.options.map((o) => (
                <DecisionOption key={o.id} option={o} selected={picked === o.id} answered={!!picked} onSelect={() => setPicked(o.id)} />
              ))}
            </div>
            {chosen && (
              <div className={`feedback ${chosen.correct ? 'right' : 'wrong'}`} role="status">
                <h3>{chosen.correct ? 'Correct — this is the safest choice.' : "This isn't the safest option."}</h3>
                <p>{chosen.feedback}</p>
                {!chosen.correct && <p><strong>Safer action:</strong> {challenge.safestAction}</p>}
              </div>
            )}
            {chosen && (
              <>
                <p className="principle-line">When identity is uncertain, verify the request — not the message.</p>
                <Button onClick={restart}>Check another request</Button>
              </>
            )}
          </section>
        )}
      </main>
    </>
  )
}
