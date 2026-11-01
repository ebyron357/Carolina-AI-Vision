import { Suspense } from 'react'
import { PageIntro } from '@/components/page-intro'
import { IntakePanel } from '@/components/intake-panel'
export const metadata = {
  title: 'Plan a confident project handoff.',
  alternates: { canonical: '/studio/onboarding' },
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="WEBSITE STUDIO"
          title="Plan a confident project handoff."
        >
          <p>
            Prepare your public business details, service priorities, existing
            website, content ownership, accessibility needs, and launch goals.
            This planning intake does not open a client account or start paid
            work. Never send passwords or customer records.
          </p>
        </PageIntro>
        <h2>Clear scope before commitment.</h2>
        <p>
          Requests are acknowledged only after confirmed storage. No purchase,
          audit prerequisite, or guaranteed outcome. Intake availability is
          shown on the form.
        </p>
        <h2>Before a website project starts</h2>
        <ol>
          <li>
            Agree on deliverables, revisions, accessibility goals, and content
            responsibilities.
          </li>
          <li>Approve a written scope and any third-party costs.</li>
          <li>
            Arrange least-privilege account invitations through an agreed secure
            channel.
          </li>
          <li>Confirm testing, handover, maintenance, and ownership.</li>
        </ol>
      </div>
      <Suspense fallback={<p role="status">Checking intake availability…</p>}>
        <IntakePanel journey="website" service="website-inquiry" />
      </Suspense>
    </main>
  )
}
