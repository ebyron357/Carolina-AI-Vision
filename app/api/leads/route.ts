import { NextRequest, NextResponse } from 'next/server'
import { validateLead } from '@/lib/leads'
// Best-effort per-instance limiter, NOT a distributed abuse boundary.
const attempts = new Map<string, { count: number; until: number }>()
const reply = (message: string, status: number) =>
  NextResponse.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  )
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin)
    return reply('Submission origin is not allowed.', 403)
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return reply('Use JSON submission.', 415)
  // Read a bounded stream rather than trusting Content-Length.
  const reader = request.body?.getReader()
  if (!reader) return reply('Missing request.', 400)
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > 12000) {
      await reader.cancel()
      return reply('Submission is too large.', 413)
    }
    chunks.push(value)
  }
  let value: Record<string, unknown>
  try {
    value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return reply('Invalid submission.', 400)
  } catch {
    return reply('Invalid JSON.', 400)
  }
  if (
    value.companyFax ||
    typeof value.startedAt !== 'number' ||
    Date.now() - value.startedAt < 2500 ||
    Date.now() - value.startedAt > 86400000
  )
    return reply('Please reload the form and try again.', 400)
  const { lead, error } = validateLead(value)
  if (!lead) return reply(error || 'Invalid submission.', 400)
  const key =
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    'local'
  const now = Date.now()
  for (const [k, v] of attempts) if (v.until < now) attempts.delete(k)
  if (!attempts.has(key) && attempts.size >= 10000)
    return reply('Too many attempts. Please try again later.', 429)
  const entry = attempts.get(key) || { count: 0, until: now + 600000 }
  entry.count++
  attempts.set(key, entry)
  if (entry.count > 5 || attempts.size > 10000)
    return reply('Too many attempts. Please try again later.', 429)
  const endpoint = process.env.LEAD_INTAKE_URL,
    token = process.env.LEAD_INTAKE_TOKEN
  if (!endpoint || !token)
    return reply(
      'Requests are not being accepted yet. Nothing has been saved or sent. Please return when intake is available.',
      503
    )
  try {
    const url = new URL(endpoint)
    if (url.protocol !== 'https:' || url.username || url.password)
      throw new Error('Invalid configuration')
    const id = crypto.randomUUID()
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        ...lead,
        consentedAt: new Date().toISOString(),
        privacyVersion: '2026-11-01',
      }),
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
      cache: 'no-store',
    })
    // Receiver must acknowledge durable storage, not merely accept an HTTP request.
    if (!response.ok) throw new Error('Delivery failed')
    const ack = await response.json()
    if (ack.stored !== true || ack.id !== id)
      throw new Error('Storage unconfirmed')
    return NextResponse.json(
      { message: 'Your request has been received.', id },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return reply(
      'We could not confirm delivery. Please try again later. A retry may create a duplicate request.',
      502
    )
  }
}
