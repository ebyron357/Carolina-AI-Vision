# Acceptance and production gates

## Implemented for review

- Branded navy, blue, orange responsive site and accessible semantic navigation.
- Three distinct journeys: free preliminary self-check, Website Studio with industry concepts and scope comparison, AI consulting/service discovery.
- Forms with consent, native validation, server validation, explicit unavailable/failure states, and confirmed-storage-only success state.
- Metadata, sitemap, robots, security headers, no public proposed prices, no payments.
- Repaired Jest, added unit/route integration tests, Playwright/axe checks, and separately supplied CI configuration (publisher cannot add workflows).

## Required before real lead collection / production

1. Approve brand assets and visual direction against original references. The Replit text was accessible, but its source, private assets, and integration internals were not available.
2. Approve legal identity, privacy contact, retention/deletion policy, and final legal copy.
3. Approve and configure durable storage or a least-privilege internal CRM receiver; verify persistence, receipt, duplicates, failures, access, and cleanup.
4. Implement distributed spam/abuse protection and operational monitoring. Per-instance throttling is insufficient for production abuse resistance.
5. Supply a source-backed visibility research methodology if independent findings are required. The local self-check is not an external assessment engine.
6. Complete manual screen-reader checks, broader browsers/devices, and field Core Web Vitals. Automated axe is not WCAG certification.
7. Approve and cost-validate commercial prices privately. Never publish proposals by default.
8. Review PR and preview, resolve blockers, and separately authorize production release. No merge, production promotion, purchase, or payment activation is authorized by this implementation.

Current overall disposition: **review preview, not production-ready**. Consult the audit and PR for actual executed check results.
