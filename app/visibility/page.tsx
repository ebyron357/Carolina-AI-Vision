import { connection } from 'next/server'
import { Suspense } from 'react'
import { LeadForm } from '@/components/lead-form'
import { PageIntro } from '@/components/page-intro'
export const metadata = {
  title: 'Free Ai Visibility Check',
  alternates: { canonical: '/visibility' },
}
async function Intake() {
  await connection()
  return (
    <LeadForm
      journey="visibility"
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
          eyebrow="FREE AI VISIBILITY CHECK"
          title="Your next step starts with clarity."
        >
          <p>
            Start with a self-check based on your own answers. Request human
            review when intake is connected. No invented visibility scores, no
            credit card, and no paid audit prerequisite.
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
