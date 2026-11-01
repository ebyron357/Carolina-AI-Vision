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
const descriptions: Record<string, string> = {
  'Repairs & upkeep':
    'Explain the repairs you handle, service area, and how customers can request an estimate before scheduling.',
  'Seasonal maintenance':
    'Outline preventive maintenance visits, what each visit includes, and how customers prepare.',
  'Project planning':
    'Help customers describe the project, priorities, and preferred timing for a scoped conversation.',
  'Business planning':
    'Make your approach and planning deliverables clear so prospective clients can assess fit.',
  'Operational reviews':
    'Show how a structured review identifies friction and leads to practical next steps.',
  'Ongoing advisory':
    'Explain recurring review meetings, responsibilities, and the scope of continuing support.',
  'Seasonal kitchen':
    'Create a readable place for a seasonal menu, dietary notes, and availability updates.',
  'Coffee & conversation':
    'Give visitors the essentials: what to expect, where to find you, and how to plan a visit.',
  'Private gatherings':
    'Explain gathering formats and the details needed to request an event discussion.',
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
  if (!Object.hasOwn(concepts, industry)) notFound()
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
                <p>{descriptions[s]}</p>
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
