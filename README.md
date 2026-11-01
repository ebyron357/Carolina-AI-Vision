# Carolina Local AI / Carolina AI Vision

A review-stage business website on the existing Next.js foundation. **Not production-ready:** real lead intake and independent visibility research are not connected.

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
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit --prod
```

A CI workflow was prepared but cannot be included by the publishing integration (workflow permission restriction). It is provided separately for the owner to add. Hosted CI execution remains unverified.

## Intake configuration — do not enable yet

No environment variables were present in the inspected project. The site deliberately disables submission without `LEAD_INTAKE_URL` and `LEAD_INTAKE_TOKEN`. They are server-only. Do not put values in Git, browser code, PRs, or chat.

Before enabling intake, approve and test a durable storage destination, privacy contact, retention/deletion policy, access controls, distributed abuse controls, and operational response process. Read [the integration contract](docs/INTEGRATIONS.md). The current adapter is not a configured CRM or database.

Analytics is rendered only if `NEXT_PUBLIC_ENABLE_ANALYTICS=true`; do not enable before reviewing disclosure and applicable consent requirements. No new external service was purchased or connected.

## Delivery and launch

- [Repository audit](docs/REPOSITORY-AUDIT.md)
- [Acceptance and launch gates](docs/IMPLEMENTATION-PLAN.md)
- [Agent instructions](AGENTS.md)

Only preview deployment and PR review are authorized. Do not merge or publish production changes without owner approval.
