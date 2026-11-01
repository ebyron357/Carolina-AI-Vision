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
        <h2>Concept portfolio. Real possibilities.</h2>
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
              <i aria-hidden="true">→</i>
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
                Request this scope →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">AFTER LAUNCH, TOO</p>
        <h2>A website you can keep building on.</h2>
        <div className="cards three">
          {[
            [
              'Maintenance & care',
              'Scope software updates, backups, accessibility reviews, and content changes. Agree on responsibilities and response windows before subscribing.',
            ],
            [
              'CRM & automation',
              'Explore enquiry routing and follow-up with an approved CRM. Connections need verified APIs, consent handling, and least-privilege access.',
            ],
            [
              'Service upgrades',
              'Add service pages, content, and new enquiry journeys as your business changes. Quote each change before work begins.',
            ],
          ].map(([title, copy]) => (
            <article className="service-card" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="actions">
          <Link className="button secondary" href="/studio/inquire">
            Ask about Website Studio →
          </Link>
          <Link className="button secondary" href="/studio/onboarding">
            Explore project onboarding →
          </Link>
        </div>
      </section>
      <section>
        <h2>Compare the shape of your project.</h2>
        <div
          className="table-scroll"
          role="region"
          aria-label="Website scope comparison"
          tabIndex={0}
        >
          <table className="comparison">
            <caption>
              Illustrative scope — final deliverables are agreed in writing.
            </caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">Essential</th>
                <th scope="col">Showcase</th>
                <th scope="col">Growth-ready</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Core business presence',
                  'Included in scope',
                  'Included in scope',
                  'Included in scope',
                ],
                [
                  'Dedicated service pages',
                  'Optional upgrade',
                  'Planned in scope',
                  'Expanded scope',
                ],
                [
                  'CRM & automation',
                  'Discovery optional',
                  'Discovery optional',
                  'Integration discovery',
                ],
                [
                  'Maintenance',
                  'Separately scoped',
                  'Separately scoped',
                  'Separately scoped',
                ],
              ].map(([feature, ...values]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  {values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <aside className="notice">
        Every proposal defines pages, content responsibilities, integrations,
        revisions, hosting, maintenance, and delivery milestones before work
        begins. No payment is collected here.
      </aside>
      <div className="actions">
        <Link className="button" href="/studio/quote">
          Tell us about your website →
        </Link>
      </div>
    </main>
  )
}
