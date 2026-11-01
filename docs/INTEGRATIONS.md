# Lead intake and ClientVerse evaluation

## VERIFIED

The baseline repository has no database or CRM integration. The Vercel project had no environment variables at inspection. Public forms are unavailable until configured. No credentials were requested or exposed, no service was purchased, and no payment processing was activated.

## Receiver contract (implemented adapter; not a connected service)

Server-only configuration: `LEAD_INTAKE_URL` (HTTPS) and `LEAD_INTAKE_TOKEN` (bearer authentication). The adapter POSTs a generated request ID, validated minimal lead fields, consent timestamp, and privacy notice version. The receiver must persist atomically and reply with JSON `{ "stored": true, "id": "<matching request ID>" }`. A 2xx without that acknowledgment is not success. Redirects are rejected and requests time out after 8 seconds. Do not log credentials or lead bodies. A timeout or malformed acknowledgment can leave delivery uncertain; retry may create duplicates. Durable deduplication, encrypted storage, role-scoped access, and notifications belong to the receiver and are not verified here.

The public endpoint checks origin, JSON type, bounded body size, allowlisted fields, lengths, email/URL shape, consent, honeypot, minimum form age, and best-effort per-instance rate limiting. User URLs are never fetched, eliminating assessment SSRF. Vercel deployment protection remains in place. The rate limiter is not durable across instances; distributed rate limiting/bot protection is a launch gate, not a solved problem.

## ClientVerse: BLOCKED

No API contract, test tenant, integration documentation, or authorized credentials were available. It cannot be represented as connected or safe to activate. Keep it internal and separate from Carolina Local AI's public identity.

Before approval: confirm the API and tenant, authenticated endpoint, lead schema, consent fields, storage acknowledgment behavior, idempotency, retention/deletion, least-privilege access, notification delivery, and test-record cleanup. Use synthetic records and protected secret entry. Do not request privileged customer credentials through this website.

## Evidence collection: BLOCKED

The visibility check currently provides recommendations supported only by user-supplied answers. Independent findings require research with source URLs, retrieval dates, search context, reviewed observations, and limitations. No platform rankings or simulated scan scores are generated.
