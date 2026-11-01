import { createHmac } from 'node:crypto'
import { Pool } from 'pg'
import { type Lead, classifyLead } from '@/lib/leads'
let pool: Pool | undefined
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
  if (!pool) {
    const url = new URL(process.env.DATABASE_URL!)
    if (!['postgres:', 'postgresql:'].includes(url.protocol))
      throw new Error('Invalid database configuration')
    for (const key of [
      'ssl',
      'sslmode',
      'sslcert',
      'sslkey',
      'sslrootcert',
      'uselibpqcompat',
    ])
      url.searchParams.delete(key)
    pool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true },
      max: 3,
      connectionTimeoutMillis: 5000,
      statement_timeout: 8000,
      query_timeout: 10000,
    })
  }
  return captureLead(
    (sql, values) => pool!.query(sql, values),
    lead,
    requestId,
    ip,
    process.env.LEAD_HASH_SECRET!
  )
}
