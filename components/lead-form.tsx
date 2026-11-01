'use client'
import { useState } from 'react'
import Link from 'next/link'
import { preliminaryFindings, type Journey } from '@/lib/leads'
export function LeadForm({
  journey,
  enabled,
}: {
  journey: Journey
  enabled: boolean
}) {
  const [startedAt] = useState(() => Date.now())
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [received, setReceived] = useState('')
  const [findings, setFindings] = useState<
    ReturnType<typeof preliminaryFindings>
  >([])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const data = new FormData(event.currentTarget)
    const payload = {
      ...Object.fromEntries(data),
      journey,
      consent: data.get('consent') === 'on',
      startedAt,
    }
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.message || 'Unable to submit. Please try later.')
        return
      }
      setReceived(result.id)
    } catch {
      setError(
        'Connection interrupted. Delivery is unconfirmed. Please try again later.'
      )
    } finally {
      setBusy(false)
    }
  }
  if (received)
    return (
      <section className="lead-form" role="status">
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h2>Thank you. Your next step is in motion.</h2>
        <p>
          We have received your{' '}
          {journey === 'website'
            ? 'website quote'
            : journey === 'consulting'
              ? 'consultation'
              : 'visibility review'}{' '}
          request. This is not a booked appointment, purchase, or completed
          assessment.
        </p>
        <p>Reference: {received}</p>
        <Link href="/">Back to home →</Link>
      </section>
    )
  return (
    <form className="lead-form" onSubmit={submit}>
      <h2>
        {journey === 'visibility'
          ? 'Your business, in focus.'
          : journey === 'website'
            ? 'Tell us what you want to build.'
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
      <div className="field">
        <label htmlFor="goal">
          {journey === 'website'
            ? 'What pages, features, and goals do you have?'
            : journey === 'consulting'
              ? 'What process or business goal should we explore?'
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
            ? 'Send my request ↗︎'
            : 'Request submission unavailable'}
      </button>
      {error && (
        <p role="alert" className="form-status">
          {error}
        </p>
      )}
    </form>
  )
}
