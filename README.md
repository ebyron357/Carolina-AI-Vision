# Carolina Local AI / Carolina AI Vision

A review-stage business website on the existing Next.js foundation. **Not production-ready:** live database intake and independent visibility research are not connected.

## Product

Independent, veteran-owned digital growth services for North Carolina businesses, separate from ClientVerse. **Get Found. Get Customers. Grow Smarter.**

- Free AI Visibility Check: a self-reported preliminary checklist; no live search or AI-platform scan.
- Website Studio: three clearly fictional interactive industry concepts, scope comparisons, direct quote request without an audit prerequisite.
- AI Growth Blueprint, Business Growth Systems, Ongoing Growth Management: service discovery and consultation request.
- Proposed prices remain private; no payments, subscriptions, booking service, or customer CRM has been activated.

## Run and verify

Node 26 (matching the inspected Vercel project), pnpm 12.16.1. Next.js 16.4.3, React 19, TypeScript, Tailwind 4. Existing starter components are preserved.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typegen && pnpm exec tsc --noEmit
pnpm test --runInBand --watch=false
pnpm test:integration
pnpm security:source
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit --prod
```

A CI workflow was prepared but cannot be included by the publishing integration (workflow permission restriction). It is provided separately for the owner to add. Hosted CI execution remains unverified.

See [Phase 3 evidence](docs/PHASE3-EVIDENCE.md) for the current verification boundaries.

## Phase 3 operations

Checksum-verified migrations, execution-only roles, app liveness/intake readiness, local outbox processing with leases/retries/dead letters, and explicit privacy operations are implemented. No ClientVerse-specific adapter or live database is activated. See [release operations](docs/RELEASE-OPERATIONS.md) before enabling anything.

## Intake configuration — disabled pending approval

The inspected project has no environment variables or connected storage. The PostgreSQL migration/adapter implements persistence, consent/audit records, server classification, pending CRM outbox, database-backed throttling and duplicate receipts. Local embedded PostgreSQL tests verify real SQL behavior, not a connected Vercel database.

Configuration requires an owner-approved database/migration/runtime role, `DATABASE_URL`, `LEAD_HASH_SECRET` (32+ unpredictable characters), and explicit `LEAD_INTAKE_ENABLED=true`. Do not enable before privacy/legal review, retention/deletion policy, access ownership and an operational follow-up process are in place. Secrets are server-only and must use protected entry. Never put values in Git, browser code, PRs or chat. See [the integration contract and activation gates](docs/INTEGRATIONS.md).

ClientVerse repository access was denied; no real endpoint or dispatcher is invented. Stored outbox records remain `pending_configuration` and the UI never claims CRM delivery. Analytics remains explicitly opt-in and disabled in the inspected project.

## Delivery and launch

- [Independent PR #2 recheck](docs/PR2-REVIEW.md)
- [Repository audit](docs/REPOSITORY-AUDIT.md)
- [Acceptance and launch gates](docs/IMPLEMENTATION-PLAN.md)
- [Agent instructions](AGENTS.md)

Only preview deployment and PR review are authorized. Do not merge or publish production changes without owner approval.
