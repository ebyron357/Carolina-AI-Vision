import { NextRequest, NextResponse } from 'next/server'
import { validateLead } from '@/lib/leads'
import { intakeEnabled, storeLead } from '@/lib/lead-storage'
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
  const requestId = value.requestId
  if (
    typeof requestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId
    )
  )
    return reply('Reload the form before submitting.', 400)
  if (!intakeEnabled())
    return reply(
      'Requests are not being accepted yet. Nothing has been saved or sent. Please return when intake is available.',
      503
    )
  const ip =
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    'local'
  try {
    const stored = await storeLead(lead, requestId, ip)
    if (stored.limited)
      return NextResponse.json(
        { message: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': '600' },
        }
      )
    if (!stored.id) throw new Error('Storage unconfirmed')
    return NextResponse.json(
      {
        message:
          'Your request has been stored for review. CRM delivery is not yet configured.',
        id: stored.id,
        duplicate: stored.duplicate,
      },
      {
        status: stored.duplicate ? 200 : 201,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  } catch {
    return reply(
      'We could not confirm storage. Retry with this same form to avoid duplicate requests.',
      503
    )
  }
}
