/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/leads/route'
const valid = {
  journey: 'website',
  name: 'Sample',
  business: 'Example',
  email: 'sample@example.com',
  website: '',
  goal: 'A clear site',
  consent: true,
  startedAt: Date.now() - 5000,
}
const send = (body: unknown, origin = 'https://example.test', extra = {}) =>
  POST(
    new NextRequest('https://example.test/api/leads', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/json', ...extra },
      body: JSON.stringify(body),
    })
  )
beforeEach(() => {
  delete process.env.LEAD_INTAKE_URL
  delete process.env.LEAD_INTAKE_TOKEN
})
test('rejects cross-origin request', async () =>
  expect((await send(valid, 'https://evil.test')).status).toBe(403))
test('rejects oversized request', async () =>
  expect((await send({ ...valid, goal: 'x'.repeat(13000) })).status).toBe(413))
test('rejects honeypot and rushed submissions', async () => {
  expect((await send({ ...valid, companyFax: 'bot' })).status).toBe(400)
  expect((await send({ ...valid, startedAt: Date.now() })).status).toBe(400)
})
test('rejects missing consent server-side', async () =>
  expect((await send({ ...valid, consent: false })).status).toBe(400))
test('fails closed without receiver configuration', async () => {
  const r = await send(valid)
  expect(r.status).toBe(503)
  expect((await r.json()).message).toContain('Nothing has been saved')
})
test('acknowledges only confirmed durable storage', async () => {
  process.env.LEAD_INTAKE_URL = 'https://receiver.example.test'
  process.env.LEAD_INTAKE_TOKEN = 'test-only'
  const mock = jest
    .spyOn(global, 'fetch')
    .mockImplementation(async (_url, init) => {
      const body = JSON.parse(String(init?.body))
      return new Response(JSON.stringify({ stored: true, id: body.id }))
    })
  const r = await send(valid, undefined, {
    'x-vercel-forwarded-for': '192.0.2.2',
  })
  expect(r.status).toBe(201)
  expect(mock).toHaveBeenCalledTimes(1)
  mock.mockRestore()
})
test('does not claim success on unconfirmed delivery', async () => {
  process.env.LEAD_INTAKE_URL = 'https://receiver.example.test'
  process.env.LEAD_INTAKE_TOKEN = 'test-only'
  const mock = jest.spyOn(global, 'fetch').mockResolvedValue(new Response('{}'))
  expect(
    (await send(valid, undefined, { 'x-vercel-forwarded-for': '192.0.2.3' }))
      .status
  ).toBe(502)
  mock.mockRestore()
})
test('throttles repeated requests', async () => {
  for (let i = 0; i < 5; i++)
    await send(valid, undefined, { 'x-vercel-forwarded-for': '192.0.2.4' })
  expect(
    (await send(valid, undefined, { 'x-vercel-forwarded-for': '192.0.2.4' }))
      .status
  ).toBe(429)
})
