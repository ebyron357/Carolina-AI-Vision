import Link from 'next/link'
import { notFound } from 'next/navigation'
const concepts = {
  'home-services': {
    brand: 'Pine & Field',
    type: 'HOME SERVICES CONCEPT',
    title: 'Good work. Right at home.',
    copy: 'A clear, approachable website concept for a local home services team.',
    services: ['Repairs & upkeep', 'Seasonal maintenance', 'Project planning'],
  },
  professional: {
    brand: 'Oakline Advisory',
    type: 'PROFESSIONAL SERVICES CONCEPT',
    title: 'A clearer path forward.',
    copy: 'A considered digital presence for an independent professional services firm.',
    services: ['Business planning', 'Operational reviews', 'Ongoing advisory'],
  },
  hospitality: {
    brand: 'Gather & Grain',
    type: 'HOSPITALITY CONCEPT',
    title: 'A place to slow down.',
    copy: 'A welcoming website concept for a neighborhood café and gathering space.',
    services: [
      'Seasonal kitchen',
      'Coffee & conversation',
      'Private gatherings',
    ],
  },
}
export function generateStaticParams() {
  return Object.keys(concepts).map((industry) => ({ industry }))
}
export const metadata = {
  title: 'Industry design concept',
  robots: { index: false, follow: false },
}
export default async function Demo({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params
  if (!(industry in concepts)) notFound()
  const c = concepts[industry as keyof typeof concepts]
  return (
    <main id="main" className="wrap section">
      <p className="notice">
        Fictional design concept — not a real business, customer project, or
        operational service. All enquiries below go to Carolina Local AI for
        website scoping.
      </p>
      <div className="demo-page">
        <section className="demo-hero">
          <p className="eyebrow">
            {c.brand.toUpperCase()} / {c.type}
          </p>
          <h1>{c.title}</h1>
          <p className="lede">{c.copy}</p>
          <Link className="button" href="/studio/quote">
            Build a website like this →
          </Link>
        </section>
        <section className="section">
          <h2>Simple to explore. Easy to understand.</h2>
          <div className="cards three">
            {c.services.map((s, i) => (
              <article className="service-card" key={s}>
                <p>0{i + 1}</p>
                <h3>{s}</h3>
                <p>
                  A dedicated space to explain this service, the customer’s next
                  step, and what to expect.
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="section">
          <h2>Your questions, answered.</h2>
          <details>
            <summary>Can this concept fit my business?</summary>
            <p>
              Yes. The visual direction, pages, and enquiry journey can be
              scoped around your industry. This is an illustrative starting
              point, not a fixed template purchase.
            </p>
          </details>
          <details>
            <summary>Can I book or order through this demo?</summary>
            <p>
              No. This demonstration does not accept bookings or orders. Real
              integrations require separate implementation and verification.
            </p>
          </details>
          <details>
            <summary>Do I need an audit first?</summary>
            <p>No. You can request a website quote directly.</p>
          </details>
        </section>
      </div>
      <div className="actions">
        <Link className="button secondary" href="/studio">
          Back to Website Studio
        </Link>
        <Link className="button" href="/studio/quote">
          Request my website quote →
        </Link>
      </div>
    </main>
  )
}
