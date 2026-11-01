# Lead persistence and internal CRM integration

## VERIFIED implementation; live activation BLOCKED

The application now has a PostgreSQL persistence implementation, not an unverified HTTP receiver stub. `db/001_lead_intake.sql` supplies a namespaced schema and an atomic `carolina.capture_lead` function. `lib/lead-storage.ts` uses parameterized queries, a bounded pool, connection/query timeouts, and certificate-verifying TLS. No database was provisioned, purchased, connected, or migrated remotely.

Flow: validated public inquiry → database-backed IP-digest limit → duplicate check → durable lead + consent + classification + follow-up queue + audit + CRM outbox → reference receipt. These records commit together; the receipt confirms storage, **not CRM delivery or a booked appointment**. The database function serializes equal fingerprints across instances. Matching inquiries in 24 hours reuse the existing receipt; request ID collisions with changed payload fail rather than overwrite a lead.

Services: visibility, website-inquiry, website-quote, blueprint, automation, management, contact. Website scope, requested upgrades and timeline are allowlisted. Classification and a follow-up queue are computed server-side. No actual staff assignment, CRM workflow or notification is claimed.

### Configuration required before activation

1. Owner approves a PostgreSQL destination, data processing terms, residency, retention/deletion/backup policy, privacy contact and access owner. Existing unrelated project databases are **not** assumed safe to reuse.
2. An authorized database operator applies `db/001_lead_intake.sql` using an admin migration identity, then creates a separate runtime role. Grant only schema usage, function execution, SELECT/INSERT on lead requests, SELECT/INSERT/UPDATE on intake limits, INSERT on audit/outbox and usage of the audit identity sequence. Do not use an admin connection string in runtime. The function uses invoker rights and PUBLIC access is revoked. Test access and deletion with the actual role.
3. Enter server-only `DATABASE_URL` and `LEAD_HASH_SECRET` (at least 32 unpredictable characters) through protected environment controls, initially preview only. Never send values through chat, Git or the browser. Certificate-verifying TLS is required; custom CA support is not configured.
4. Verify schema, role, storage acknowledgment, rollback, concurrency, deduplication, network failures, deletion and operational access against synthetic records in the approved database. Set `LEAD_INTAKE_ENABLED=true` only after privacy/legal and operational approval. Variables alone do not mean an integration is verified.
5. Configure periodic expiry of intake-limit rows and the approved retention/deletion workflow. The app stores only a keyed digest of IPs, not raw IP addresses. Vercel hosting logs are separate. Rate limits can affect users sharing a NAT/proxy; see the Vercel request-header documentation before adding a proxy.

No SELECT/public administration endpoint is exposed. Same-origin is a CSRF measure, not authentication or bot proof. Body bounds, allowlisted fields, native/server validation, consent, honeypot and timing controls are layered with database throttling. Traffic-level DoS protection and operational monitoring still require review. An unavailable database fails closed and does not claim delivery.

### VERIFIED local database evidence

`pnpm test:integration` runs the actual migration/function against a real embedded PostgreSQL engine (PGlite), using synthetic data in a temporary filesystem directory. It checks persistence after closing/reopening, concurrent duplicate reuse, request-ID collision rollback, lead/audit/outbox atomicity, consent version, service classification/queue, IP hashing and rate limiting. It deliberately breaks outbox insertion and verifies no partial lead/audit commit. The temporary directory is removed. This is **not** a remote pg wire-protocol, TLS, runtime-role, Vercel connection or ClientVerse test.

## ClientVerse: BLOCKED, no endpoint invented

The connected account contains internal CRM projects, but both project-targeted repository-clone attempts were rejected with `repo_not_allowed`. The CRM project has configured environment variable names; their presence does not establish a usable website integration. No values were copied, no admin credentials were requested, and no internal database was attached to this public website.

Exact requirement: authorize repository read access or provide reviewed API documentation, a test tenant, a least-privilege server integration identity, the real ingestion route/schema/authentication/idempotency contract, lead classifications and staff/workflow assignment rules. After that, implement an outbox dispatcher against the verified contract with retry/backoff, durable delivery acknowledgment, duplicate protection, notification/assignment verification and audit events. No dispatcher currently runs; every stored record remains `pending_configuration`. Do not set delivered manually or present queueing as CRM completion.

Available alternative: after approving storage and privacy controls, use a restricted operator/manual follow-up process while the real CRM API is being authorized. The application does not currently provide that operator UI or email notifications. Do not enable public intake without an owned response process.

## Visibility research: BLOCKED

The free self-check remains based only on supplied answers. Independent results require source URLs, retrieval dates, search context, observed facts, human review and limitations. No live rankings, platform recommendations or simulated scanning is claimed.
