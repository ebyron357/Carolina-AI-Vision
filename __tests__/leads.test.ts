import { validateLead, preliminaryFindings } from '@/lib/leads'
const valid = {
  journey: 'website',
  name: 'Sample Owner',
  business: 'Sample business',
  email: 'owner@example.com',
  website: 'https://example.com',
  goal: 'A new website',
  consent: true,
}
test('normalizes a valid lead without adding arbitrary fields', () => {
  expect(validateLead({ ...valid, name: ' Owner ', admin: true }).lead).toEqual(
    {
      ...valid,
      name: 'Owner',
      profile: '',
      followup: '',
      service: 'website-quote',
      package: 'unsure',
      upgrades: [],
      timeline: 'unsure',
    }
  )
})
test.each([
  null,
  [],
  {},
  { ...valid, consent: false },
  { ...valid, email: 'bad' },
  { ...valid, journey: 'payment' },
  { ...valid, name: 'a'.repeat(101) },
  { ...valid, goal: '' },
  { ...valid, website: 'javascript:alert(1)' },
  { ...valid, website: 'https://user:pass@example.com' },
  { ...valid, profile: 'fake' },
])('rejects invalid or unsafe input %#', (v) => {
  expect(validateLead(v).error).toBeDefined()
})
test('optional website is accepted', () =>
  expect(validateLead({ ...valid, website: '' }).lead).toBeDefined())
test('findings identify their self-reported evidence and never imply scanning', () => {
  const f = preliminaryFindings({
    website: 'https://example.com',
    profile: 'yes',
    followup: 'no',
  })
  expect(f).toHaveLength(3)
  expect(f[0].recommendation).toContain('not been fetched')
  expect(f[1].evidence).toContain('You reported')
  expect(f[2].evidence).toContain('You reported no')
})

test.each([
  { ...valid, website: 'x'.repeat(501) },
  { ...valid, website: 123 },
])('rejects malformed optional fields %#', (v) =>
  expect(validateLead(v).error).toBeDefined()
)

test.each([
  'visibility',
  'website-inquiry',
  'website-quote',
  'blueprint',
  'automation',
  'management',
  'contact',
])('classifies approved service %s', (service) => {
  const journey =
    service === 'visibility'
      ? 'visibility'
      : service.startsWith('website')
        ? 'website'
        : ['blueprint', 'automation', 'management'].includes(service)
          ? 'consulting'
          : 'contact'
  expect(validateLead({ ...valid, journey, service }).lead?.service).toBe(
    service
  )
})
test.each([
  { service: 'admin' },
  { package: 'fake' },
  { upgrades: ['admin'] },
  { upgrades: 'crm' },
  { timeline: 'fake' },
  { journey: 'visibility', service: 'website-quote' },
])('rejects unapproved scope options %#', (options) =>
  expect(validateLead({ ...valid, ...options }).error).toBeDefined()
)
