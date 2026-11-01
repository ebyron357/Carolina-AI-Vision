# Carolina AI Vision — Repository Audit
**Date:** 2026-11-01  
**Repository:** [ebyron357/Carolina-AI-Vision](https://github.com/ebyron357/Carolina-AI-Vision)  
**Method:** Connected GitHub static file inspection. No install, build, automated checks, browser testing, deployment inspection, or payment/CRM validation was executed.

## Executive assessment
**Result: not launch-ready; branded product is not yet implemented.** The repository provides a useful modern Next.js foundation but currently serves an upstream developer starter. This is a product completeness finding, not evidence that the starter is defective.

## Confirmed findings

| ID | Priority | Finding and evidence | Required action |
| --- | --- | --- | --- |
| F01 | Critical | `app/page.tsx` displays "Next.js + Tailwind CSS + shadcn/ui Starter" and links to upstream starter source/deployment. | Replace with Carolina AI Vision conversion-oriented homepage and verified offer copy. |
| F02 | High | `constants/site-config.ts` contains starter title, keywords and canonical base URL `https://next-shadcn-starter-template.vercel.app/`; `app/layout.tsx` uses these to generate metadata. | Set truthful Carolina AI Vision metadata and the *verified* production domain before launch. Do not guess canonical URL. |
| F03 | High | Prior `README.md` described Next.js 14, whereas `package.json` declares Next.js ^16.2.10 and React ^19; `AGENTS.md` documents Next.js 16. | Replace README with version-accurate documentation; align future changes to actual code. |
| F04 | High | No audited implementation was located at `app/contact/page.tsx` or `app/api`; inspected home has no lead form, purchase link, audit flow, or consulting booking. | Build contact/snapshot server-side intake, audit offer and checkout integration; verify before claiming live. |
| F05 | High | `jest.config.js` requires `ts-jest` and `identity-obj-proxy` but neither is listed in the inspected `package.json`. Jest's alias points `@/` to `src/`, while `tsconfig.json` points it to repository root. | Reconcile Jest dependencies/transform and alias, execute test suite. |
| F06 | High | `proxy.ts` is pass-through with empty matcher. This is **not** an authentication or security boundary as configured. | Design server-side validation, abuse protection, data minimization, secret management, and appropriate security headers for actual features. |
| F07 | Medium | `app/components/page.tsx` publicly exposes a component gallery linked from home; demo caching is documented in `AGENTS.md`. | Keep demos internal or remove from customer navigation before production. |
| F08 | Medium | `app/layout.tsx` includes `@vercel/analytics` component. Actual deployment, collection and applicable consent are not verified. | Validate data handling, privacy disclosures, analytics consent needs, and live instrumentation. |
| F09 | Medium | `components.json` points to `app/globals.css`, but root layout imports `styles/globals.css`; inspected `styles/globals.css` exists. | Correct shadcn CSS path if generator workflows rely on it. |
| F10 | Medium | `README.md` previously claimed an MIT license and pointed to `LICENSE`, but the requested `LICENSE` fetch returned 404. | Confirm upstream licensing and add the appropriate license with attribution after verification; do not assume license terms. |
| F11 | Medium | No .github/workflows/ci.yml was accessible in the inspected paths; workflow directory fetch did not resolve. | Establish and verify automated lint, type, test, build, security/dependency checks. |
| F12 | High | Free Snapshot, $197 Audit, Services, Consulting, Contact, Privacy, and Terms are planned requirements, not verified working pages. | Implement each feature and validate evidence-based acceptance criteria before selling or publishing. |

## Source files directly inspected
`README.md`, `AGENTS.md`, `CLAUDE.md`, `package.json`, `app/page.tsx`, `app/layout.tsx`, `app/components/page.tsx`, `app/not-found.tsx`, `app/demo/cache/actions.ts`, `constants/site-config.ts`, `next.config.ts`, `proxy.ts`, `tsconfig.json`, `components.json`, `jest.config.js`, `jest.setup.js`, `styles/globals.css`, `.gitignore`, and a portion of `pnpm-lock.yaml`. Targeted missing-path checks do not prove a function is absent elsewhere.

## Not verified
Full dependency/security scan, GitHub Actions runs, local or remote build, browser rendering, responsiveness, accessibility tests, PageSpeed/Core Web Vitals, OWASP assessment, analytics operation, SEO indexing, actual content and business credentials, vendor integrations, checkout, lead delivery, consent compliance, full file tree, deployment state, and legal policies. **Do not translate an unchecked item into a passing or failing test.**

## Release gates
1. Brand and metadata corrected; legal business identity and canonical URL confirmed.
2. Free Snapshot and contact submissions validated server-side; spam handling, consent and privacy reviewed.
3. $197 Audit offer has explicit scope and fulfillment, correct checkout and webhook validation, test payment/refund paths.
4. All navigation destinations, consultation handoff, disclosure pages, SEO and accessibility tested.
5. CI passes lint, TypeScript, tests and build; dependencies and secrets reviewed.
6. Desktop/mobile UX, keyboard/reduced-motion and performance tested against a real deployment.
7. Owner reviews staging evidence and explicitly authorizes production launch.

**Disposition:** Documentation is ready for review; website code and live launch readiness remain open.
