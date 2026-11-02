# Carolina Local AI — Product Recovery and Implementation Specification

**Status:** Product direction corrected; implementation and end-to-end verification pending.
**Repository:** ebyron357/Carolina-AI-Vision
**Deployment rule:** Work on a review branch and preview first. Do not release to production without verified acceptance.

## Mission
Build a real, professional, multi-tenant AI website auditing and website-building SaaS. The website must not be mistaken for the product: users must be able to audit real websites, receive traceable findings, build/edit sites, preview them, and publish through a controlled workflow.

## Core experiences
1. **Audit:** User enters a permitted URL; system validates target and ownership/authorization requirements, schedules a scan, checks crawlability, accessibility, performance, SEO, mobile behavior, security headers, content quality and conversion UX. Report evidence, affected URLs, severity, confidence, remediation steps, timestamps, and downloadable export. Never fabricate scores. Protect scanners against SSRF and private-network targets.
2. **Builder:** Authenticated users create projects from prompts or templates, edit content and layout, manage assets, save versions, preview responsive breakpoints, roll back changes, and publish to configured domains with verified deployment status.
3. **Workspace:** Auth, tenant isolation, projects, audit history, site versions, publishing status, billing entitlements, user roles and audit trail.
4. **Admin:** Manage pricing, brand text, contact information, site-wide labels, content, plans and customer orders through database-backed settings, with role-based permissions and change logs.
5. **Commerce and leads:** Implement Stripe test-mode deposit, subscription, customer portal, webhook verification, idempotency, transactional emails, contact leads and consultation bookings only after the core product flows are working.

## Design direction
Enterprise SaaS design, not colorful starter components: restrained neutral palette with a single purposeful accent; precise typography; consistent spacing, accessible AA contrast, keyboard support, reduced-motion support, clear sidebar and top navigation; real data states, informative empty states, and no decorative fake charts. Mobile-first at 375, 414, 768, 1024, 1280 and 1440px.

## Implementation sequence
**Wave 0 — Inventory:** Inspect every route, component, API, dependency, configuration, test and deployment. Document what exists and what does not. Preserve work; identify all starter/demo content and third-party branding.
**Wave 1 — Foundation:** Choose and implement database, auth, tenant isolation, migrations, typed data contracts, secret management, server-side validation, rate limits and audit logs.
**Wave 2 — Auditing engine:** Implement safe URL intake, job queue, scanners, evidence persistence, report UI and export. Verify against known test sites and independently check outputs.
**Wave 3 — Website builder:** Implement project creation, editable pages, assets, revisions, responsive preview, publishing and rollback. Verify published sites end-to-end.
**Wave 4 — Commercial workflows:** Database-backed offers, Stripe test-mode checkout/subscription/portal, verified webhooks, email delivery, leads and booking.
**Wave 5 — Full QA:** Run responsive, functional, security, accessibility and content audits on every route and each complete user flow. Report PASS only when executed with evidence; otherwise FAIL or NOT RUN. Fix and retest until acceptance.

## Acceptance gates
- A real URL produces a persisted, evidence-backed audit with useful findings and downloadable report.
- A real site can be created, edited, previewed and published, and a rollback succeeds.
- Changes to admin-managed pricing and contact details propagate to the site and checkout.
- No starter branding, placeholder content, dead links, invented metrics or hidden hard-coded business values remain.
- Responsive and WCAG AA checks completed at all required widths.
- Stripe, email, consultation, cancellation and failure flows verified using test systems; no real charges.
- Every acceptance item includes a run timestamp, environment, evidence and result.

## Current verified baseline (2026-11-02)
The repository README and AGENTS.md explicitly describe an upstream Next.js UI starter with no database/auth and unimplemented offers. The inspected app/page.tsx still displays a starter heading and links to the upstream template. These are code inspection findings, not live browser test results. No auditing engine, website builder, Stripe or email end-to-end flow has been verified. Do not claim implementation or QA success until demonstrated.

## Governing priority
This specification corrects the previously narrow brochure/lead-generation direction. When implementation begins, consolidate the approved product scope into full replacement README, AGENTS.md and implementation-plan documents rather than leaving conflicting instructions. Do not delete existing work without reviewing its purpose.
