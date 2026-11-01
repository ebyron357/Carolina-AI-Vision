import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
export const metadata: Metadata = {
  title: 'AI consulting & automation',
  alternates: { canonical: '/consulting' },
}
export default function Consulting() {
  return (
    <main id="main" className="wrap section">
      <PageIntro
        eyebrow="AI CONSULTING & AUTOMATION"
        title="Practical AI. Human direction."
      >
        <p>
          Start with the work you want to improve — not a tool you feel you
          should buy.
        </p>
      </PageIntro>
      <div className="cards three">
        {[
          [
            'AI Growth Blueprint',
            'A focused strategy for your next stage.',
            'Review your current visibility, customer journey, and operational friction. Receive prioritized recommendations with dependencies and clear next steps.',
          ],
          [
            'Business Growth Systems',
            'Connect the moments that matter.',
            'Scope lead capture, response, follow-up, and handoffs. Integrations require a security and access review before activation.',
          ],
          [
            'Ongoing Growth Management',
            'Improve with intention.',
            'Agree on a recurring scope for content, visibility, website improvements, and system reviews. Measure observed changes without promising rankings or revenue.',
          ],
        ].map(([name, tag, body]) => (
          <article className="service-card" key={name}>
            <span className="number">{name}</span>
            <h2>{tag}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <section className="split section">
        <div>
          <h2>
            A consultation.
            <br />
            Not a sales trap.
          </h2>
          <p>
            Tell us your goals. We’ll use them to scope a conversation, not
            subscribe you to marketing.
          </p>
          <p>
            No automated booking, purchases, or privileged system access through
            this site.
          </p>
        </div>
        <div>
          <h3>What should we explore?</h3>
          <ul className="checklist">
            <li>Where customer enquiries get lost</li>
            <li>Which repeated tasks could be simplified</li>
            <li>What your team and customers actually need</li>
            <li>What data should never enter an AI workflow</li>
          </ul>
          <Link className="button" href="/consulting/request">
            Request a consultation →
          </Link>
        </div>
      </section>
    </main>
  )
}
