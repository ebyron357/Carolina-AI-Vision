# PR #2 independent recheck and corrections

Reviewed 2026-11-01, beginning at PR head `fd88ee29a7d9f8024c346b98180b0fe12d0e4215`. Prior reports were treated as claims and rerun, not accepted as evidence. The PR remained open and editable on `feat/carolina-local-ai`; no follow-up PR was needed.

## Review coverage: VERIFIED

All 41 changed files were enumerated from GitHub's PR file listing and inspected locally. This includes every public page, API, shared component, styles, tests, documentation, config, logo and ignore changes. The generated pnpm lockfile was reviewed through changed resolution/importer metadata, dependency installation and audit, not hand-edited. No nested agent instructions were found. Existing starter source was preserved.

## Confirmed issues and changes

| Finding                                                                  | Evidence / impact                                                                                                                | Correction / verification                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VERIFIED: E2E environment inherited real intake settings                 | Existing Playwright config had no environment isolation; it could submit synthetic data to a configured receiver                 | Clear intake enable flag, DB/hash and obsolete receiver settings in webServer env; all E2E intake checks remain disabled.                                                                                                                          |
| VERIFIED: gallery lost theme context                                     | Root ThemeProvider removed while ThemeToggle remained                                                                            | Scoped provider restored, hydration attribute handling added; browser test selects Dark and Light.                                                                                                                                                 |
| VERIFIED: demo guard accepted inherited object keys                      | `constructor in concepts` and `toString in concepts` were true, leading to invalid render paths                                  | Own-property guard; browser tests for constructor/toString/**proto** render the branded not-found page. Streamed not-found pages may return 200 once headers are sent; content is checked, not falsely claimed native 404 for these dynamic paths. |
| VERIFIED: focus indicator contrast failed on light surfaces              | Orange focus ring vs light homepage/demo backgrounds did not reach 3:1                                                           | Dark focus ring on light sections; browser computed-style regression plus automated accessibility checks.                                                                                                                                          |
| VERIFIED: incomplete intake taxonomy and site routes                     | Only visibility/website/consulting journeys; no general contact, dedicated Blueprint inquiry or Studio onboarding intake         | Add contact, Blueprint, Studio inquiry/onboarding pages and validated service, package, upgrades and timeline fields; service classification and follow-up queue server-side.                                                                      |
| VERIFIED: in-memory rate limiting and receiver stub were not persistence | No configured project variables or storage, receiver success covered by mocks only                                               | Transactional PostgreSQL migration/adapter, database throttle/dedup, consent/audit and pending CRM outbox; real embedded PostgreSQL tests. Remote configuration remains BLOCKED.                                                                   |
| VERIFIED: no retry-safe receipt reference                                | Previous endpoint generated a new UUID for every attempt                                                                         | Client reuses request UUID and storage uses atomic fingerprint dedup; duplicate returns original reference.                                                                                                                                        |
| VERIFIED: Website Studio offered only minimal package concepts           | No onboarding, option selection or maintenance/upgrade presentation                                                              | Add concrete scope comparison, inquiry and planning intake, maintenance, content, CRM and automation options; fictional concept copy is explicitly illustrative.                                                                                   |
| VERIFIED: full dependency audit was not zero                             | Baseline full audit reported 70 advisories: 1 critical, 41 high, 21 moderate, 7 low; previous zero claim covered production only | Refresh graph within declared ranges. Production audit zero; full audit remaining 1 moderate minimatch and 1 low deepmerge in development tooling, no high/critical. No unrelated major-version override forced.                                   |

## Baseline independent executions: VERIFIED

`pnpm install --frozen-lockfile`, lint, typegen, tsc, Jest (28 tests), build, and original Chromium browser suite (6 tests) all passed on the inspected baseline. GitHub check runs contained a successful Vercel Preview Comments check, not unit/browser CI. No Actions workflow exists in the PR. Previous workflow publication was blocked by publisher permissions; workflow supplied separately, not represented as hosted CI.

## Current verification scope

Expanded Jest, database integration, production build, source-pattern scan and Chromium/axe browser suite are run locally. Public routes are checked at 390, 768 and 1280 widths, including new intake pages, options, keyboard skip/mobile navigation, demo interactions, not-found paths, focus colors and preserved gallery theme controls. Source scan checks selected high-confidence patterns in the current tree, not complete Git history. Executed current checks:

- `pnpm lint`, `pnpm typegen`, `pnpm exec tsc --noEmit`, `pnpm build`: passed.
- `pnpm test --runInBand --watch=false`: 3 suites, 44 tests passed.
- `pnpm test:integration`: one real embedded-PostgreSQL scenario passed, including closing/reopening, concurrent duplicates, request-ID collisions, forced-outbox rollback, consent/classification and rate limit.
- `pnpm test:e2e`: 10 Chromium tests passed on the expanded implementation, including the final form/TLS hardening.
- `pnpm security:source`: 88 source files scanned at that point, no selected high-confidence secret patterns found; final scan repeated before commit.
- `pnpm audit --prod`: zero known vulnerabilities. Full audit: one moderate minimatch and one low deepmerge advisory in development tooling; high/critical zero. Full audit default exits nonzero because these remain; not described as clean.
- Fresh local mobile Lighthouse homepage: performance 95, accessibility 100, best practices 100, SEO 100; LCP 0.8s, CLS 0.016, TBT 260ms. This lab run precedes the final form-event/TLS-only polish and is not field CWV or INP evidence.

See the PR body and completion report for final exact-commit deployment evidence and test counts.

## Boundaries: BLOCKED / UNVERIFIED

- BLOCKED: live lead capture needs an approved DB, migration, least-privilege runtime role, protected configuration, privacy/legal approval, retention and a responsible response process. No remote migration or environment change occurred.
- BLOCKED: CRM source access was denied through the connected integration; no API contract or test tenant was available. Outbox is pending configuration, not delivered. No duplicate CRM was created.
- BLOCKED: independent visibility findings need a research methodology and evidence; this is still a self-reported preliminary checklist.
- UNVERIFIED: manual assistive-technology conformance, real Safari/Firefox/devices, field Core Web Vitals/INP, real analytics, remote DB TLS/permissions/backup/deletion, CRM staff assignment and notifications.
- VERIFIED: public candidate prices and payment processing remain absent. Website projects require no assessment purchase.

## Production disposition

Not production-ready. This is reviewable implementation and local evidence, not proof of operational lead delivery. Existing production remains on its original deployment pending separate owner release approval. Live billing/invoice data is reported privately to the owner rather than committed to this public repository.
