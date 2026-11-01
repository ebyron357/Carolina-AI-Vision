import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
export const metadata: Metadata = {
  title: 'Website Studio',
  alternates: { canonical: '/studio' },
}
export default function Studio() {
  return (
    <main id="main" className="wrap section">
      <PageIntro
        eyebrow="WEBSITE STUDIO"
        title="Local character. Digital confidence."
      >
        <p>
          Give customers a clear reason to choose you. Start with a website
          project directly — no audit purchase required.
        </p>
      </PageIntro>
      <div className="section-head">
        <h2>See the possibilities.</h2>
        <p>
          Fictional design concepts, not client projects. No bookings or orders
          are processed.
        </p>
      </div>
      <div className="cards three">
        {[
          [
            'home-services',
            '01',
            'Home services',
            'Clear services. A confident next step.',
          ],
          [
            'professional',
            '02',
            'Professional services',
            'A considered first impression.',
          ],
          [
            'hospitality',
            '03',
            'Food & hospitality',
            'A warm welcome before the first visit.',
          ],
        ].map(([slug, n, title, copy]) => (
          <Link
            className={'demo-card demo-' + slug}
            key={slug}
            href={'/studio/demos/' + slug}
          >
            <div className="demo-art">
              <span>{n} / INDUSTRY CONCEPT</span>
              <strong>{title}</strong>
              <i aria-hidden="true">↗</i>
            </div>
            <h3>{copy}</h3>
            <p>Explore interactive design concept →</p>
          </Link>
        ))}
      </div>
      <section className="section">
        <p className="eyebrow">COMPARE YOUR OPTIONS</p>
        <h2>The right scope, not a forced package.</h2>
        <div className="cards three">
          {[
            [
              'Essential presence',
              'A focused home for your business.',
              'Core service information',
              'Mobile-friendly enquiry journey',
              'Search metadata foundation',
            ],
            [
              'Service showcase',
              'More room for your expertise.',
              'Dedicated service pages',
              'Industry-specific content structure',
              'Lead enquiry integration scoping',
            ],
            [
              'Growth-ready website',
              'A foundation for connected operations.',
              'Expanded information architecture',
              'CRM & automation discovery',
              'Measurement and handover planning',
            ],
          ].map(([name, desc, ...items]) => (
            <article className="service-card" key={name}>
              <h3>{name}</h3>
              <p>{desc}</p>
              <ul>
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="micro">
                Quote after scope review. No published package pricing.
              </p>
              <Link className="text-link" href="/studio/quote">
                Request this scope ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
      <aside className="notice">
        Every proposal defines pages, content responsibilities, integrations,
        revisions, hosting, maintenance, and delivery milestones before work
        begins. No payment is collected here.
      </aside>
      <div className="actions">
        <Link className="button" href="/studio/quote">
          Tell us about your website ↗
        </Link>
      </div>
    </main>
  )
}
