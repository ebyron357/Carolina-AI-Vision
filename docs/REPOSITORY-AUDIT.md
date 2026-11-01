# Carolina Local AI — verified audit and delivery evidence

Date: 2026-11-01. Existing repository: ebyron357/Carolina-AI-Vision. Existing Vercel project: tradeiq/carolina-ai-vision. No duplicate project or repository created.

## Baseline: VERIFIED

- Cloned `main` at `c548e06b7672ac380ab8b4e72f44028e19551d57`; no open PRs at inspection.
- Read root AGENTS.md, CLAUDE.md, README, existing audit/plan, actual routes, configuration, lockfile, components and scripts. No nested agent instructions discovered.
- Public home was the upstream starter, with component gallery and cache demo routes, upstream metadata, no business journeys, no database, and no intake backend.
- Declared Next.js 16.2.10 / React 19 / TypeScript / Tailwind 4, pnpm lockfile. Jest referenced absent ts-jest and identity-obj-proxy and the wrong alias. Executed baseline Jest failed on missing ts-jest.
- Vercel inspection confirmed the existing production deployment was READY, root `.`, Next.js framework, Node 26.x, and production alias `https://carolina-ai-vision.vercel.app`. No environment variables were present. Production was not changed.
- Replit reference text at `https://carolina-ai-vision.replit.app/` was accessible: Carolina Local AI branding, veteran-owned/NC positioning, AI visibility content, simulated preview explicitly labeled, and older audit-first funnel. This implementation follows the owner's newer offer direction instead. Replit source, rendered reference appearance, private assets, backend behavior, and integration internals were not verified.
- Initial production dependency audit reported advisories affecting Next and transitive packages. Updated Next/eslint-config-next to 16.4.3, PostCSS, and vulnerable transitive lock entries via pnpm. Removed obsolete experimental View Transitions configuration and incompatible explicit runtime segment config based on installed framework types/build evidence. Retained Cache Components with migration-compatible Partial Prefetching disabled.

## Implementation: VERIFIED in source and local checks

- Navy/blue/orange public design; no stock AI imagery, fabricated testimonials, customer logos, results, or public proposed prices.
- Homepage, visibility self-check, Website Studio, three fictional industry concepts, package scope comparison, quote request, consulting discovery/request, About, privacy/terms review drafts, branded 404, metadata, sitemap, robots.
- Old paid-audit-first requirement removed from governing docs. Website requests never require an audit. All five requested offer categories represented; no payments activated.
- Native accessible mobile navigation, skip link, semantic labels, keyboard focus, reduced-motion CSS, responsive layouts.
- Server validation, origin/content-type/body bounds, consent, honeypot, form-age checks, best-effort per-instance throttling, no user-URL fetching, and confirmed-storage-only success acknowledgment.
- With no receiver configured, UI clearly disables submission and endpoint returns 503 rather than pretending to save a lead. Self-check findings identify only supplied answers as evidence and never claim independent scanning.
- ClientVerse evaluated as an internal integration: BLOCKED by absent API contract/test tenant/authorized configuration; no integration activated or privileged system exposed.
- Analytics remains opt-in and disabled in the inspected configuration. Security headers include CSP, HSTS, frame denial, nosniff, permissions and referrer policies. CSP allows inline Next.js scripts/styles; nonce-based strict CSP is not implemented.
- Existing starter gallery/cache source preserved and unlinked/noindex. No license terms invented; upstream licensing remains a review item.

## Executed test evidence

- `pnpm install --frozen-lockfile`: passed against baseline lockfile.
- `pnpm lint`: passed.
- `pnpm typegen` and `pnpm exec tsc --noEmit`: passed after correcting test matcher types and framework configuration.
- `pnpm test --runInBand --watch=false`: 3 suites, 28 tests passed. Covers input safety, self-reported evidence, unconfigured UI, origin/body/consent/spam controls, receiver-confirmed success, uncertain delivery and throttling. Receiver integration tests use mocks, not a real CRM.
- `pnpm build`: passed; public/static routes and dynamic intake generated successfully.
- `pnpm test:e2e`: 6 Chromium tests passed against local production build. Checked 12 public routes at 390, 768, 1280 widths for horizontal overflow and automated axe WCAG A/AA rules; keyboard skip link, mobile navigation, self-check, demo accordion, direct quote journey, native 404, sitemap, security headers, and unconfigured endpoint behavior.
- `pnpm audit --prod`: zero known vulnerabilities after updates. This does not prove absence of vulnerabilities; development dependencies are outside this audit scope.
- Lighthouse mobile lab run against the local production homepage: performance 89, accessibility 100, best practices 100, SEO 100; LCP 0.8s, CLS 0, TBT 450ms. This run overlapped the browser regression suite and is not field Core Web Vitals; INP remains unverified.
- Existing peer warning: eslint-plugin-tailwindcss 3.18.0 wants Tailwind 3 while starter uses Tailwind 4; plugin is not part of active flat ESLint configuration. No lint/build failure observed.
- CI workflow prepared and delivered separately: the publishing integration cannot publish `.github/workflows/ci.yml` (HTTP 403). The PR excludes it. Hosted Actions execution remains unverified.

## UNVERIFIED

Full WCAG 2.2 AA conformance, assistive-technology testing, real devices/Safari/Firefox, field Core Web Vitals (LCP/INP/CLS), real analytics events, live email/CRM persistence or notifications, owner-approved original brand assets, legal sufficiency, and independent AI/search findings. Automated accessibility is not screen-reader certification. System fonts remove external Google-font build/runtime dependencies from the public layout.

## BLOCKED / production verdict

**Not production-ready.** Durable lead storage and real delivery require owner-approved provider/CRM access and contract; privacy contact, retention/deletion/access policies and legal review remain open. Distributed abuse controls, verified receiver behavior/deduplication, independent visibility research, manual accessibility/performance checks, commercial cost validation and owner approval remain release gates. See INTEGRATIONS.md and IMPLEMENTATION-PLAN.md.

Preview/PR links and deployed browser verification are recorded in the review PR and final delivery report, not presumed by this local audit. No production release, purchase, or payment activation authorized or performed.
