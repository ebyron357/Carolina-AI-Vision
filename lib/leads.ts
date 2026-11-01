export const journeys = ['visibility', 'website', 'consulting'] as const
export type Journey = (typeof journeys)[number]
export type Lead = {
  journey: Journey
  name: string
  email: string
  business: string
  website: string
  goal: string
  consent: true
  profile: string
  followup: string
}
export function validateLead(value: unknown): { lead?: Lead; error?: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return { error: 'Invalid submission.' }
  const v = value as Record<string, unknown>
  const limits: Record<string, number> = {
    journey: 20,
    name: 100,
    email: 254,
    business: 160,
    website: 500,
    goal: 2000,
    profile: 10,
    followup: 10,
  }
  for (const [key, max] of Object.entries(limits)) {
    if (
      v[key] !== undefined &&
      (typeof v[key] !== 'string' || (v[key] as string).trim().length > max)
    )
      return { error: 'Invalid field type or length.' }
  }
  const text = (key: string, max: number) =>
    typeof v[key] === 'string' && (v[key] as string).trim().length <= max
      ? (v[key] as string).trim()
      : ''
  const journey = text('journey', 20) as Journey
  const name = text('name', 100),
    email = text('email', 254),
    business = text('business', 160),
    website = text('website', 500),
    goal = text('goal', 2000)
  if (
    !journeys.includes(journey) ||
    !name ||
    !business ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    v.consent !== true ||
    !goal
  )
    return {
      error: 'Enter your name, business, valid email, goal, and consent.',
    }
  if (website) {
    try {
      const url = new URL(website)
      if (
        !['https:', 'http:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        !url.hostname.includes('.')
      )
        return { error: 'Use a full public website URL without credentials.' }
    } catch {
      return { error: 'Use a full website URL, such as https://example.com.' }
    }
  }
  const profile = text('profile', 10),
    followup = text('followup', 10)
  if (
    ![profile, followup].every((s) => ['yes', 'no', 'unsure', ''].includes(s))
  )
    return { error: 'Invalid assessment response.' }
  return {
    lead: {
      journey,
      name,
      email,
      business,
      website,
      goal,
      consent: true,
      profile,
      followup,
    },
  }
}
export function preliminaryFindings({
  website,
  profile,
  followup,
}: Pick<Lead, 'website' | 'profile' | 'followup'>) {
  return [
    {
      evidence: website
        ? 'You supplied a website URL.'
        : 'You have not supplied a website URL.',
      recommendation: website
        ? 'Review service clarity, accessible contact options, and search metadata. The site has not been fetched or inspected.'
        : 'Confirm your primary business website before reviewing its visibility.',
    },
    {
      evidence:
        profile === 'yes'
          ? 'You reported a current Google Business Profile.'
          : profile === 'no'
            ? 'You reported no current Google Business Profile.'
            : 'Your Google Business Profile status is unknown.',
      recommendation:
        'Verify ownership, categories, service areas, and contact details against the public profile. This has not been independently checked.',
    },
    {
      evidence:
        followup === 'yes'
          ? 'You reported an enquiry follow-up process.'
          : followup === 'no'
            ? 'You reported no enquiry follow-up process.'
            : 'Your follow-up process is unknown.',
      recommendation:
        'Document who responds to enquiries and how handoffs work. A process review is needed before recommending automation.',
    },
  ]
}
