/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/leads/route'
import { storeLead } from '@/lib/lead-storage'
jest.mock('@/lib/lead-storage', () => ({
  intakeEnabled: () => process.env.LEAD_INTAKE_ENABLED === 'true',
  storeLead: jest.fn(),
}))
const stored = jest.mocked(storeLead)
const valid = {
  journey: 'website',
  name: 'Sample',
  business: 'Example',
  email: 'sample@example.com',
  website: '',
  goal: 'A clear site',
  consent: true,
  startedAt: Date.now() - 5000,
  requestId: 'b4364a1d-363d-4d12-bb60-4040dcfe03ea',
}
const send = (
  body: unknown,
  origin = 'https://example.test',
  type = 'application/json'
) =>
  POST(
    new NextRequest('https://example.test/api/leads', {
      method: 'POST',
      headers: { origin, 'content-type': type },
      body: JSON.stringify(body),
    })
  )
beforeEach(() => {
  process.env.LEAD_INTAKE_ENABLED = 'false'
  stored.mockReset()
})
test('rejects cross-origin and non-JSON requests', async () => {
  expect((await send(valid, 'https://evil.test')).status).toBe(403)
  expect((await send(valid, undefined, 'text/plain')).status).toBe(415)
  expect(stored).not.toHaveBeenCalled()
})
test('rejects oversized request', async () =>
  expect((await send({ ...valid, goal: 'x'.repeat(13000) })).status).toBe(413))
test('rejects honeypot and rushed submissions', async () => {
  expect((await send({ ...valid, companyFax: 'bot' })).status).toBe(400)
  expect((await send({ ...valid, startedAt: Date.now() })).status).toBe(400)
})
test('rejects consent and invalid idempotency references', async () => {
  expect((await send({ ...valid, consent: false })).status).toBe(400)
  expect((await send({ ...valid, requestId: 'bad' })).status).toBe(400)
})
test('fails closed without enabled persistence', async () => {
  const r = await send(valid)
  expect(r.status).toBe(503)
  expect((await r.json()).message).toContain('Nothing has been saved')
  expect(stored).not.toHaveBeenCalled()
})
test('storage acknowledgment required before receipt', async () => {
  process.env.LEAD_INTAKE_ENABLED = 'true'
  stored.mockResolvedValue({
    id: valid.requestId,
    limited: false,
    duplicate: false,
  })
  const r = await send(valid)
  expect(r.status).toBe(201)
  expect((await r.json()).id).toBe(valid.requestId)
})
test('duplicate uses original receipt', async () => {
  process.env.LEAD_INTAKE_ENABLED = 'true'
  stored.mockResolvedValue({
    id: valid.requestId,
    limited: false,
    duplicate: true,
  })
  expect((await send(valid)).status).toBe(200)
})
test('database rate limit returns retry guidance', async () => {
  process.env.LEAD_INTAKE_ENABLED = 'true'
  stored.mockResolvedValue({ id: null, limited: true, duplicate: false })
  const r = await send(valid)
  expect(r.status).toBe(429)
  expect(r.headers.get('retry-after')).toBe('600')
})
test('storage failure never claims delivery', async () => {
  process.env.LEAD_INTAKE_ENABLED = 'true'
  stored.mockRejectedValue(new Error('offline'))
  const r = await send(valid)
  expect(r.status).toBe(503)
  expect((await r.json()).message).toContain('same form')
})
