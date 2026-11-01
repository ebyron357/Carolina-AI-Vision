import { connection } from 'next/server'
import { Suspense } from 'react'
import { LeadForm } from '@/components/lead-form'
import { PageIntro } from '@/components/page-intro'
export const metadata = {
  title: 'Website Quote Request',
  alternates: { canonical: '/studio/quote' },
}
async function Intake() {
  await connection()
  return (
    <LeadForm
      journey="website"
      enabled={Boolean(
        process.env.LEAD_INTAKE_URL && process.env.LEAD_INTAKE_TOKEN
      )}
    />
  )
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="WEBSITE QUOTE REQUEST"
          title="Let’s scope your next website."
        >
          <p>
            Tell us about your business, pages, and goals. A request is not a
            purchase. No audit is required, and pricing is agreed only after
            scope review.
          </p>
        </PageIntro>
        <h2>What happens next</h2>
        <ol>
          <li>Provide only the details needed to understand your business.</li>
          <li>Review the consent and privacy notice.</li>
          <li>
            When connected, requests are acknowledged only after storage is
            confirmed.
          </li>
        </ol>
        <aside className="notice">
          No guaranteed rankings or AI recommendations. Research findings must
          include sources, dates, and limitations. Self-reported answers are not
          independent evidence.
        </aside>
      </div>
      <Suspense fallback={<p>Checking intake availability…</p>}>
        <Intake />
      </Suspense>
    </main>
  )
}
