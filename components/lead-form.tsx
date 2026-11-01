'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { preliminaryFindings, type Journey, type Service } from '@/lib/leads'
export function LeadForm({
  journey,
  enabled,
  initialService,
  initialPackage,
}: {
  journey: Journey
  enabled: boolean
  initialService?: Service
  initialPackage?: 'essential' | 'showcase' | 'growth'
}) {
  const requestId = useRef('')
  const lastPayload = useRef('')
  const receipt = useRef<HTMLHeadingElement>(null)
  const errorBox = useRef<HTMLParagraphElement>(null)
  const pending = useRef(false)
  const [startedAt] = useState(() => Date.now())
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [received, setReceived] = useState('')
  const [findings, setFindings] = useState<
    ReturnType<typeof preliminaryFindings>
  >([])
  useEffect(() => {
    if (received) receipt.current?.focus()
    else if (error) errorBox.current?.focus()
  }, [received, error])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!enabled || pending.current) return
    pending.current = true
    setError('')
    setBusy(true)
    const data = new FormData(event.currentTarget)
    const payload = {
      ...Object.fromEntries(data),
      journey,
      consent: data.get('consent') === 'on',
      startedAt,
      upgrades: data.getAll('upgrades'),
    }
    try {
      const canonical = JSON.stringify(payload)
      if (!requestId.current || canonical !== lastPayload.current) {
        requestId.current = crypto.randomUUID()
        lastPayload.current = canonical
      }
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requestId: requestId.current }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.message || 'Unable to submit. Please try later.')
        return
      }
      if (typeof result.id !== 'string') throw new Error('Unconfirmed receipt')
      setReceived(result.id)
    } catch {
      setError(
        'Connection interrupted. Delivery is unconfirmed. Please try again later.'
      )
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  if (received)
    return (
      <section className="lead-form" role="status">
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h2 ref={receipt} tabIndex={-1} className="receipt-heading">
          Thank you. Your request is stored.
        </h2>
        <p>
          We have stored your{' '}
          {journey === 'website'
            ? 'website quote'
            : journey === 'consulting'
              ? 'consultation'
              : journey === 'contact'
                ? 'contact'
                : 'visibility review'}{' '}
          request. This is not a booked appointment, purchase, or completed
          assessment.
        </p>
        <p>Reference: {received}</p>
        <p>
          Queued for human review. CRM delivery and an assigned appointment have
          not been confirmed.
        </p>
        <Link href="/">Back to home →</Link>
      </section>
    )
  return (
    <form
      className="lead-form"
      onSubmit={submit}
      onChange={() => setFindings([])}
      aria-busy={busy}
    >
      <h2>
        {journey === 'visibility'
          ? 'Your business, in focus.'
          : journey === 'website'
            ? 'Tell us what you want to build.'
            : journey === 'contact'
              ? 'How can we help?'
              : 'What could work better?'}
      </h2>
      {!enabled && (
        <p className="notice">
          Intake is not connected yet. You can explore this form, but requests
          cannot be sent or saved.{' '}
          {journey === 'visibility' &&
            'The self-check below works locally without submitting your details.'}
        </p>
      )}
      <div className="field">
        <label htmlFor="service">What can we help with?</label>
        <select
          id="service"
          name="service"
          defaultValue={
            initialService ||
            (journey === 'visibility'
              ? 'visibility'
              : journey === 'website'
                ? 'website-quote'
                : journey === 'contact'
                  ? 'contact'
                  : 'automation')
          }
        >
          {journey === 'visibility' && (
            <option value="visibility">Free AI Visibility Check</option>
          )}
          {journey === 'website' && (
            <>
              <option value="website-inquiry">Website Studio inquiry</option>
              <option value="website-quote">Website quote request</option>
            </>
          )}
          {journey === 'consulting' && (
            <>
              <option value="blueprint">AI Growth Blueprint</option>
              <option value="automation">
                Business Growth Systems / automation
              </option>
              <option value="management">Ongoing Growth Management</option>
            </>
          )}
          {journey === 'contact' && (
            <option value="contact">General contact inquiry</option>
          )}
        </select>
      </div>
      <div className="field">
        <label htmlFor="name">Your name (required)</label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
        />
      </div>
      <div className="field">
        <label htmlFor="business">Business name (required)</label>
        <input
          id="business"
          name="business"
          autoComplete="organization"
          required
          maxLength={160}
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email (required)</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <div className="field">
        <label htmlFor="website">Website (optional)</label>
        <input
          id="website"
          name="website"
          type="url"
          autoComplete="url"
          placeholder="https://example.com"
          maxLength={500}
        />
        <small>We do not automatically scan or fetch this address.</small>
      </div>
      {journey === 'visibility' && (
        <>
          <div className="field">
            <label htmlFor="profile">
              Do you maintain a Google Business Profile?
            </label>
            <select name="profile" id="profile">
              <option value="unsure">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="followup">
              Do you have a defined enquiry follow-up process?
            </label>
            <select name="followup" id="followup">
              <option value="unsure">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <button
            className="button secondary"
            type="button"
            onClick={(event) => {
              const f = new FormData(event.currentTarget.form!)
              setFindings(
                preliminaryFindings({
                  website: String(f.get('website') || ''),
                  profile: String(f.get('profile') || ''),
                  followup: String(f.get('followup') || ''),
                })
              )
            }}
          >
            View my preliminary self-check
          </button>
          {findings.length > 0 && (
            <section className="notice" aria-live="polite">
              <h3>Preliminary observations</h3>
              <p>
                Evidence source: your answers in this form only. Not an AI
                search test, ranking report, website inspection, or independent
                verification.
              </p>
              {findings.map((f) => (
                <div key={f.evidence}>
                  <strong>{f.evidence}</strong>
                  <p>{f.recommendation}</p>
                </div>
              ))}
            </section>
          )}
        </>
      )}
      {journey === 'website' && (
        <>
          <div className="field">
            <label htmlFor="package">Project scope</label>
            <select
              id="package"
              name="package"
              defaultValue={initialPackage || 'unsure'}
            >
              <option value="unsure">Help me choose</option>
              <option value="essential">Essential presence</option>
              <option value="showcase">Service showcase</option>
              <option value="growth">Growth-ready website</option>
            </select>
          </div>
          <fieldset className="fieldset">
            <legend>Options to discuss (optional)</legend>
            {[
              ['maintenance', 'Maintenance & updates'],
              ['crm', 'CRM integration'],
              ['automation', 'Follow-up automation'],
              ['content', 'Content & service-page upgrades'],
            ].map(([value, label]) => (
              <label key={value}>
                <input type="checkbox" name="upgrades" value={value} />
                {label}
              </label>
            ))}
          </fieldset>
        </>
      )}
      <div className="field">
        <label htmlFor="timeline">When are you looking to start?</label>
        <select id="timeline" name="timeline">
          <option value="unsure">Not sure yet</option>
          <option value="soon">As soon as scope is agreed</option>
          <option value="quarter">In the next few months</option>
          <option value="exploring">Just exploring</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="goal">
          {journey === 'website'
            ? 'What pages, features, and goals do you have?'
            : journey === 'consulting'
              ? 'What process or business goal should we explore?'
              : journey === 'contact'
                ? 'What would you like to discuss?'
                : 'What would you like us to review?'}{' '}
          (required)
        </label>
        <textarea id="goal" name="goal" rows={4} required maxLength={2000} />
        <small>
          Do not include passwords, customer records, or sensitive information.
        </small>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="companyFax">Leave blank</label>
        <input
          id="companyFax"
          name="companyFax"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="check-label">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that Carolina Local AI may use these details to respond to
          this request, as described in the{' '}
          <Link href="/privacy">privacy notice</Link>. This does not subscribe
          me to marketing.
        </span>
      </label>
      <button className="button" disabled={busy || !enabled} type="submit">
        {busy
          ? 'Sending…'
          : enabled
            ? 'Send my request →'
            : 'Request submission unavailable'}
      </button>
      {error && (
        <p role="alert" ref={errorBox} tabIndex={-1} className="form-status">
          {error}
        </p>
      )}
    </form>
  )
}
