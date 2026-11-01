# Acceptance and production gates

## Implemented for review

- Branded navy, blue, orange responsive site and accessible semantic navigation.
- Three distinct journeys: free preliminary self-check, Website Studio with industry concepts and scope comparison, AI consulting/service discovery.
- Forms for all requested services, contact and Studio planning, with consent, validated scope/options, focused receipt/error states and a gated transactional PostgreSQL intake implementation.
- Embedded PostgreSQL tests cover persistence, rollback, concurrency/dedup, rate limits, classification, audit and pending CRM outbox. Remote activation remains blocked.
- Metadata, sitemap, robots, security headers, no public proposed prices, no payments.
- Repaired Jest, added unit/route integration tests, Playwright/axe checks, and separately supplied CI configuration (publisher cannot add workflows).

## Required before real lead collection / production

1. Approve brand assets and visual direction against original references. The Replit text was accessible, but its source, private assets, and integration internals were not available.
2. Approve legal identity, privacy contact, retention/deletion policy, and final legal copy.
3. Approve a PostgreSQL destination, apply the migration with an admin migration identity, create a least-privilege runtime role and configure server-only secrets in preview. Verify actual TLS/access/persistence/cleanup before explicit enablement.
4. Verify the implemented database-backed throttling on the approved remote database; review traffic-level abuse protection, NAT behavior, expiry and operational monitoring. Authorize the real CRM API and implement/test an outbox dispatcher, staff assignment and notification workflow.
5. Supply a source-backed visibility research methodology if independent findings are required. The local self-check is not an external assessment engine.
6. Complete manual screen-reader checks, broader browsers/devices, and field Core Web Vitals. Automated axe is not WCAG certification.
7. Approve and cost-validate commercial prices privately. Never publish proposals by default.
8. Review PR and preview, resolve blockers, and separately authorize production release. No merge, production promotion, purchase, or payment activation is authorized by this implementation.

Current overall disposition: **review preview, not production-ready**. Consult the audit and PR for actual executed check results.
