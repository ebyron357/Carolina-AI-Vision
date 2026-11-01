import { intakeEnabled } from '@/lib/lead-storage'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { LeadForm } from '@/components/lead-form'
import { PageIntro } from '@/components/page-intro'
export const metadata = {
  title: 'Consultation Request',
  alternates: { canonical: '/consulting/request' },
}
async function Intake() {
  await connection()
  return <LeadForm journey="consulting" enabled={intakeEnabled()} />
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="CONSULTATION REQUEST"
          title="Find the right work to simplify."
        >
          <p>
            Share your goals and the workflow you want to improve. This requests
            a conversation; it does not automatically book an appointment.
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
