import { connection } from 'next/server'
import { LeadForm } from '@/components/lead-form'
import { intakeEnabled } from '@/lib/lead-storage'
import type { Journey, Service } from '@/lib/leads'
export async function IntakePanel({
  journey,
  service,
}: {
  journey: Journey
  service: Service
}) {
  await connection()
  return (
    <LeadForm
      journey={journey}
      initialService={service}
      enabled={intakeEnabled()}
    />
  )
}
