import { Suspense } from 'react'
import { PageIntro } from '@/components/page-intro'
import { IntakePanel } from '@/components/intake-panel'
export const metadata = {
  title: 'Find the right website direction.',
  alternates: { canonical: '/studio/inquire' },
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="WEBSITE STUDIO"
          title="Find the right website direction."
        >
          <p>
            Not ready for a quote? Explore scope, maintenance, CRM, and
            automation options without purchasing an assessment.
          </p>
        </PageIntro>
        <h2>Clear scope before commitment.</h2>
        <p>
          Requests are acknowledged only after confirmed storage. No purchase,
          audit prerequisite, or guaranteed outcome. Intake availability is
          shown on the form.
        </p>
      </div>
      <Suspense fallback={<p role="status">Checking intake availability…</p>}>
        <IntakePanel journey="website" service="website-inquiry" />
      </Suspense>
    </main>
  )
}
