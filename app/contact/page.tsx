import { Suspense } from 'react'
import { PageIntro } from '@/components/page-intro'
import { IntakePanel } from '@/components/intake-panel'
export const metadata = {
  title: 'Let’s start a conversation.',
  alternates: { canonical: '/contact' },
}
export default function Page() {
  return (
    <main id="main" className="wrap section form-layout">
      <div>
        <PageIntro
          eyebrow="CAROLINA LOCAL AI"
          title="Let’s start a conversation."
        >
          <p>
            Ask a question about your business or the right service. No
            marketing subscription and no appointment is booked automatically.
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
        <IntakePanel journey="contact" service="contact" />
      </Suspense>
    </main>
  )
}
