export const metadata = {
  title: 'Privacy',
  alternates: { canonical: '/privacy' },
}
export default function Privacy() {
  return (
    <main id="main" className="wrap section prose">
      <p className="eyebrow">PRIVACY / REVIEW DRAFT · NOVEMBER 1, 2026</p>
      <h1>Your details deserve a clear purpose.</h1>
      <h2>What this site collects</h2>
      <p>
        Forms request your name, business, email, optional website, goals,
        selected service, project scope, optional upgrades, timeline, and
        consent. The visibility self-check runs in your browser and is based
        only on your answers; it does not scan your site or AI platforms.
      </p>
      <h2>Submission status</h2>
      <p>
        While intake is unconfigured, submission is unavailable and form details
        are not stored by the application. Once an approved database is
        configured and intake is explicitly enabled, submissions are stored
        server-side with consent time, notice version, service classification,
        audit record, and a pending CRM handoff. A receipt confirms storage, not
        CRM delivery. A keyed one-way digest of the request IP is kept
        temporarily for abuse limits; raw IP addresses are not stored by this
        application. Request fingerprints support duplicate prevention. A failed
        response may leave storage uncertain; retrying the same form reuses its
        request reference.
      </p>
      <h2>Use and access</h2>
      <p>
        Details are intended only for reviewing and responding to your request,
        not automatic marketing enrollment. Do not send passwords or sensitive
        personal information. No privileged CRM access is provided by this site.
      </p>
      <h2>Hosting and analytics</h2>
      <p>
        Vercel hosts this site and may process technical request data for
        delivery and security. Optional Vercel Web Analytics is disabled unless
        explicitly configured; its collection has not been verified. No payment
        information is collected.
      </p>
      <h2>Before intake opens</h2>
      <p>
        The owner must approve the storage provider, retention and deletion
        schedule, authorized access, and a working privacy contact. Those
        details are not yet confirmed. This draft must receive legal and owner
        review before production launch or real lead collection.
      </p>
    </main>
  )
}
