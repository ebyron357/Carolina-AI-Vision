import { createHmac } from 'node:crypto'
import { createDatabase } from '@/lib/database'
import { type Lead, classifyLead } from '@/lib/leads'
let pool: ReturnType<typeof createDatabase> | undefined
export function intakeEnabled() {
  return (
    process.env.LEAD_INTAKE_ENABLED === 'true' &&
    Boolean(
      process.env.DATABASE_URL &&
      (process.env.LEAD_HASH_SECRET?.length || 0) >= 32
    )
  )
}
export type Query = (
  sql: string,
  values: unknown[]
) => Promise<{
  rows: { id: string | null; duplicate: boolean; limited: boolean }[]
}>
export async function captureLead(
  query: Query,
  lead: Lead,
  requestId: string,
  ip: string,
  secret: string
) {
  const hash = (s: string) =>
    createHmac('sha256', secret).update(s).digest('hex')
  const fingerprint = hash(
    JSON.stringify({ ...lead, email: lead.email.toLowerCase() })
  )
  const { classification, queue } = classifyLead(lead.service)
  const { rows } = await query(
    'SELECT * FROM carolina.capture_lead($1::uuid,$2,$3,$4::jsonb,$5,$6,$7)',
    [
      requestId,
      fingerprint,
      hash(ip),
      JSON.stringify(lead),
      classification,
      queue,
      '2026-11-01',
    ]
  )
  if (!rows[0]) throw new Error('Storage acknowledgment missing')
  return rows[0]
}
export async function storeLead(lead: Lead, requestId: string, ip: string) {
  if (!pool) pool = createDatabase(process.env.DATABASE_URL!)
  return captureLead(
    (sql, values) => pool!.query(sql, values),
    lead,
    requestId,
    ip,
    process.env.LEAD_HASH_SECRET!
  )
}

export async function intakeReady() {
  if (!intakeEnabled()) return false
  try {
    if (!pool) pool = createDatabase(process.env.DATABASE_URL!)
    const result = await pool.query<{ ready: boolean }>(
      'SELECT carolina.intake_ready() AS ready'
    )
    return result.rows[0]?.ready === true
  } catch {
    return false
  }
}
