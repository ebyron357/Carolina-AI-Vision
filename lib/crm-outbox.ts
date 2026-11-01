import { randomUUID } from 'node:crypto'
import type { Database } from '@/lib/database'
export type Delivery = {
  tenantId: string
  correlationId: string
  crmLeadId: string
  assignmentId: string
  followupId: string
}
export type Envelope = {
  tenantId: string
  correlationId: string
  idempotencyKey: string
  classification: string
  followUpQueue: string
  lead: Record<string, unknown>
}
// Website-side port only. No ClientVerse API route/auth/schema has been verified.
export type CrmTransport = {
  deliver(envelope: Envelope, signal: AbortSignal): Promise<Delivery>
}
export class DeliveryFailure extends Error {
  constructor(public code: 'transient' | 'permanent' | 'contract' | 'timeout') {
    super(code)
  }
}
export async function processOne(
  db: Database,
  transport: CrmTransport,
  tenantId: string
) {
  if (!tenantId || tenantId.length > 160) throw new Error('Tenant required')
  const token = randomUUID()
  const { rows } = await db.query<{
    lead_id: string
    payload: Record<string, unknown>
    classification: string
    follow_up_queue: string
    attempt: number
    tenant_id: string
  }>('SELECT * FROM carolina.claim_outbox($1,$2::uuid)', [tenantId, token])
  const job = rows[0]
  if (!job) return 'idle' as const
  let outcome = 'retry',
    code = 'transient',
    receipt: Delivery | null = null
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort()
        reject(new DeliveryFailure('timeout'))
      }, 10000)
    })
    const result = await Promise.race([
      transport.deliver(
        {
          tenantId,
          correlationId: job.lead_id,
          idempotencyKey: `carolina:${tenantId}:${job.lead_id}`,
          classification: job.classification,
          followUpQueue: job.follow_up_queue,
          lead: job.payload,
        },
        controller.signal
      ),
      timeout,
    ])
    if (
      !result ||
      result.tenantId !== tenantId ||
      result.correlationId !== job.lead_id ||
      ![result.crmLeadId, result.assignmentId, result.followupId].every(
        (x) => typeof x === 'string' && x.length > 0 && x.length <= 200
      )
    )
      throw new DeliveryFailure('contract')
    receipt = {
      tenantId,
      correlationId: job.lead_id,
      crmLeadId: result.crmLeadId,
      assignmentId: result.assignmentId,
      followupId: result.followupId,
    }
    outcome = 'delivered'
    code = 'none'
  } catch (error) {
    code = error instanceof DeliveryFailure ? error.code : 'transient'
    outcome = ['permanent', 'contract'].includes(code) ? 'dead' : 'retry'
  } finally {
    clearTimeout(timer)
  }
  if (outcome === 'retry' && job.attempt >= 5) outcome = 'dead'
  const result = await db.query<{ accepted: boolean }>(
    'SELECT carolina.finish_outbox($1::uuid,$2,$3::uuid,$4,$5::jsonb,$6) AS accepted',
    [
      job.lead_id,
      tenantId,
      token,
      outcome,
      receipt ? JSON.stringify(receipt) : null,
      code,
    ]
  )
  // Do not retry finish in-process after uncertainty; lease recovery owns the next attempt.
  return result.rows[0]?.accepted ? outcome : 'lease_lost'
}
