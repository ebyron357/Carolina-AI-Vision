# Phase 3 evidence and release disposition

Baseline independently verified at `a4365c845fba5cb3b60faf6017108ea63aed330e`: same PR branch, no newer head discovered; dependency install, lint, typegen, TypeScript, 44 unit/route tests, one embedded PostgreSQL scenario, build and 10 Chromium tests passed. Existing GitHub check was Vercel Preview Comments, not hosted unit/browser CI. No merge or production mutation.

## VERIFIED independent changes

- Manual checksum-verified transactional migration runner on one checked-out connection, advisory lock, immutable history and rejection of altered scripts.
- Separate execution-only web/worker/operator role groups and fixed-search-path SECURITY DEFINER functions. Web can capture/read readiness but cannot read/delete tables, claim/release jobs or create schema objects. Worker can claim/finish, not read tables. Operator has explicit release/status/requeue/erase/prune functions, not general table access. All role changes remain local until authorized migration.
- Generic app liveness and non-disclosing intake readiness, no-store/noindex operational responses. No public administrative dispatch/deletion endpoint.
- Private one-job CRM transport-port processor with tenant/correlation/idempotency identifiers, row leases, deadlines, persisted retry/backoff, dead letters, explicit requeue and audited acknowledgment. No ClientVerse URL/authentication/tenant interface is fabricated. A local transport port and synthetic fixtures are not the actual external CRM contract.
- Approved-policy-only retention, local erasure that refuses active delivery, private aggregate delivery status and event/count-only operations audit. No cron, recurring worker or automatic retention activated.
- Six service HTTP-handler submissions verified through real embedded SQL storage and duplicate receipts, with unavailable-storage recovery. Browser calls remain disabled remotely.
- Fixed service/package context loss between landing CTAs and inquiry forms; fixed edited retries reusing an incompatible request UUID. Unchanged retries keep their reference; edited requests receive a new one. Contact labels improved. Strict JSON media type and broken-stream handling added without relaxing validation.

## VERIFIED tests and bounded claims

Current commands and final counts are reported in the PR/delivery record. The expanded SQL/transport-port suite has 13 scenarios, including migration repeat/checksum rejection; role permission denials and positive web capture; local assignment/follow-up acknowledgment; tenant mismatch; retries/dead-letter/operator requeue; lease/replay recovery; retention; six-service HTTP storage; deadline abort; active-lease erasure refusal; operator approval guard refusals; lost-acknowledgment idempotency/lease recovery; and original persistence/dedup/rollback scenario. Embedded tests are not remote pg wire/TLS/provider tests or actual multi-node lock contention.

A browser invocation was blocked by a still-running local test server on port 3000 while another suite completed. No security controls or reuseExistingServer setting were weakened. The final suite was run serially after the listener cleared. An initial new test-fixture syntax error was corrected before publication; no introduced failing checks were published.

Automated axe/WCAG A/AA, keyboard skip/mobile navigation, all 16 public routes across 390/768/1280, native form options, theme regression, metadata/sitemap/security headers and fail-closed intake remain covered. Manual screen-reader, real devices/Safari/Firefox and field CWV/INP remain UNVERIFIED. A fresh local Lighthouse run is delivered separately; lab metrics are not field performance evidence.

## Dependency advisory review

Production graph: zero known advisories at recheck. Full graph: one moderate minimatch glob-amplification/DoS advisory in development glob/lint tooling, requiring a coordinated major minimatch/tooling update; one low deepmerge returned-object prototype-poisoning advisory through Jest config with no patched version reported. Neither package is in the audited production graph. CI/tooling must not process attacker-selected configuration with privileged secrets; local browser environments explicitly blank intake credentials. This reduces exposure, not elimination of advisory risk. Track upstream/coordinated remediation; no forced incompatible major override or zero-full-audit claim. High/critical findings: zero. `pnpm audit` default remains nonzero; `--audit-level high` passes with the two lower findings reported.

## BLOCKED external integration and owner-only gates

- Website project still has no environment values or attached database. A team-owned unattached PostgreSQL resource is discoverable; attachment metadata cannot establish ownership/data isolation/capacity or authorization. Owner must designate an isolated destination, approve provider/privacy/retention/response ownership, authorize operator migration and separate runtime identities, and provide protected preview configuration. No unrelated customer database, privileged credentials or duplicate database was used.
- User-specified ClientVerse source access was retried and returned `repo_not_allowed`. No documented API/auth/tenant/assignment contract is available. Owner must authorize connected repository/docs access, test tenant and least-privilege service identity. Then implement the reviewed adapter against the real API, verify auth/tenant/replay/assignment/follow-up semantics and approve a worker schedule. The local port cannot substitute for this contract.
- Privacy contact, final legal terms, retention/deletion/backups/external CRM erasure, original asset acceptance, real analytics, hosted CI and final production approval remain gates. No guessed contacts or fabricated audit results.

## Verdict

Reviewable independent implementation is delivered; **not production-ready**. Live lead collection, remote database role/TLS behavior and real ClientVerse delivery remain BLOCKED/UNVERIFIED. See RELEASE-OPERATIONS.md for exact commands, identities and safeguards. Existing production, public candidate prices, payments and resource billing settings remain untouched. Account-specific billing evidence is reported privately, not committed to this public repository.

## Final local command evidence

- `pnpm install --frozen-lockfile`: passed baseline install.
- `pnpm lint`, `pnpm typegen`, `pnpm exec tsc --noEmit`, `pnpm build`: passed.
- `pnpm test --runInBand --watch=false`: 3 suites / 45 tests passed.
- `pnpm test:integration`: 13 local SQL/transport-port/operator scenarios passed.
- `pnpm test:e2e`: 13 Chromium tests passed, including operational responses and both service/package context preservation.
- `pnpm security:source`: no selected-pattern findings; current-tree scan, not full-history proof.
- Production dependency audit zero; full audit one moderate/one low, no high/critical.

Exact deployed commit, fresh lab measurements and preview browser evidence are recorded in the PR and consolidated delivery report.
