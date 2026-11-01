import { Suspense } from 'react'
import { PageIntro } from '@/components/page-intro'
import { IntakePanel } from '@/components/intake-panel'
export const metadata = {
  title: 'A clearer growth blueprint.',
  alternates: { canonical: '/blueprint' },
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="CAROLINA LOCAL AI"
          title="A clearer growth blueprint."
        >
          <p>
            Turn scattered ideas into a prioritized action plan: current
            customer journey, visibility evidence, practical improvements,
            dependencies, and a scoped roadmap. Request a conversation about fit
            and deliverables.
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
        <IntakePanel journey="consulting" service="blueprint" />
      </Suspense>
    </main>
  )
}
