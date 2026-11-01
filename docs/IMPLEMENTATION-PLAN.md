# Carolina AI Vision — Implementation & Acceptance Plan

**Governing outcome:** A premium, credible AI visibility and consulting business site that converts qualified leads while making no unsupported technical or commercial claims.

## Phase 0 — Confirm source of truth
- Preserve `main` and the existing starter until reviewed change sets are approved.
- Inspect actual routes, dependencies, design tokens and existing agent instructions.
- Confirm business name, verified domain, contact details, checkout owner, intake privacy policy, audit deliverables and scheduling provider before publishing claims.
- Never replace facts with assumed integrations, rankings, customer testimonials or fabricated ROI.

## Phase 1 — Brand and information architecture
- Build polished responsive homepage, navigation/footer and clear primary action for Free AI Visibility Snapshot, secondary action for the $197 AI Visibility Audit.
- Create Services, AI Consulting, About, Contact, Privacy and Terms pages with truthful content.
- Remove upstream marketing links and inaccurate canonical URL. Keep demo route out of public navigation.
- Acceptance: every route opens, no upstream brand remains in public surface, mobile and keyboard navigation work, and no fabricated trust elements.

## Phase 2 — Acquisition funnel
- Snapshot intake: business name, website/domain, contact method, plain-language consent and validation. Avoid collecting unnecessary sensitive information.
- Implement server-side submission, spam/rate limiting, explicit errors, success confirmation and secure CRM or email handoff once configured.
- Define snapshot methodology and what is/isn't measured; do not present synthetic scores as evidence.
- Acceptance: validated submission reaches authorized destination in a controlled test; failure state and privacy links verified.

## Phase 3 — Paid audit offer
- Explain precisely what $197 purchases, timeline, sample deliverable, refund/cancellation policy and buyer expectations.
- Configure payment through a verified provider; handle server-side verification and webhook signature checks, idempotent fulfillment, non-exposure of card data.
- Acceptance: sandbox test purchase, failed transaction, duplicate event and receipt/fulfillment pathway documented; no live payments before authorization.

## Phase 4 — Consulting and operations
- Consultation intake and provider-confirmed scheduling; clean contact and opportunity handoff to an authorized CRM.
- Define human review of AI-produced recommendations, delivery checklists and client communications.
- Acceptance: no duplicate submissions, tested notifications, auditable record and clear manual fallback.

## Phase 5 — Hardening and launch
- Align Jest setup and imports; add CI for lint, typecheck, unit tests and build.
- Review dependencies, headers, secrets, secure forms, data retention, privacy compliance, SEO sitemap/robots, accessibility, responsiveness and real-world performance.
- Validate Vercel deployment and production domain, analytics, logs and rollback.
- Acceptance: evidence-backed launch checklist signed off; no automatic deployment or unverifiable readiness claims.

## Execution rules
- Work in focused branches and pull requests, preferably with screen-level changes.
- Each PR must report scope, precise file changes, checked vs unchecked tests, outcomes, limitations and follow-on steps.
- Keep `README.md`, `AGENTS.md`, this plan and the audit internally consistent. Replace governing documents in full when rules change.
- Avoid introducing database, auth, payment or marketing vendors without a scoped decision and verification.
- Status vocabulary: **verified working**, **implemented untested**, **planned**, **blocked**, **not inspected**.
