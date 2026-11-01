# Carolina AI Vision

**Status: starter foundation; business website not yet implemented.** Carolina AI Vision is planned as a premium, lead-generating AI visibility, local SEO, website optimization, automation, and consulting website for businesses. The primary commercial offer is a **$197 AI Visibility Audit**; a **Free AI Visibility Snapshot** serves as a lead-generation entry point. These are planned services and interfaces, not live features.

## Product scope

| Experience | Intended outcome | Current state |
| --- | --- | --- |
| Home | Explain value proposition and route qualified prospects | Generic upstream starter home page |
| Free AI Visibility Snapshot | Lead capture, consent, and a clearly scoped preliminary snapshot | Not implemented |
| $197 AI Visibility Audit | Explain deliverables, pricing, scope, limitations, and secure purchase flow | Not implemented; no verified checkout |
| Services | AI search visibility, local SEO, website optimization, AI automation | Not implemented |
| AI Consulting | Consultation request and scheduling | Not implemented |
| About / Contact | Business identity, contact and inquiry flows | Not implemented |
| Privacy / Terms | Appropriate legal and data-handling disclosures | Not implemented; legal review needed |

**Do not describe a snapshot, audit, payment, scheduling integration, or CRM handoff as operational until independently tested.** Any future audit report must distinguish externally observable evidence from estimates, and avoid invented scores or search engine rankings.

## Technical baseline (verified in repository files)

- Next.js 16 App Router, React 19, TypeScript 5 with strict mode, Tailwind CSS 4, and shadcn/ui/Radix components.
- Node.js >= 20.9.0; pnpm lockfile included.
- Project routes currently include a starter home page, component gallery, example cache route, and 404 handling.
- Vercel Analytics component is included, **but deployment, tracking consent configuration, and incoming data have not been verified**.
- No database, authentication, verified payment provider, working lead-capture backend, or CRM integration is established by this review.
- `AGENTS.md` is the canonical technical guidance for contributors; `CLAUDE.md` points to it.

## Getting started

```bash
git clone https://github.com/ebyron357/Carolina-AI-Vision.git
cd Carolina-AI-Vision
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. The current page is an upstream starter, not the business site.

## Quality checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test -- --runInBand --watch=false
pnpm build
```

These are **commands to run**, not passing test claims. The repository's Jest configuration references `ts-jest` and `identity-obj-proxy`, which are not declared in the inspected `package.json`; verify and repair test setup before treating Jest results as reliable. A working CI workflow has not been confirmed.

## Build and release rules

1. Preserve the installed starter and existing source code until changes are reviewed; replace starter branding before public launch.
2. Implement each offer with transparent deliverables, consent and privacy notices, accessible validated forms, meaningful success/error states, and anti-spam controls.
3. Do not expose secrets in client-side code or commits. Handle lead submissions server-side with least privilege, logging that excludes unnecessary personal information, and retention rules.
4. Treat Stripe, CRM, scheduling, analytics, email delivery and AI audit vendors as **unconnected** until configured and verified.
5. Use descriptive metadata and truthful business claims; no fake testimonials, customer logos, metrics, audit findings, or generated evidence.
6. Test keyboard navigation, responsive breakpoints, reduced motion, performance, SEO metadata and security before publishing.
7. Report changes through pull requests with file-level evidence, commands executed, results, and outstanding blockers. No automatic production deployment.

## Evidence and delivery

- [Repository audit and prioritized findings](docs/REPOSITORY-AUDIT.md)
- [Implementation and acceptance plan](docs/IMPLEMENTATION-PLAN.md)
- [Agent conventions](AGENTS.md)

Current repository review is **static inspection** of named files, not an executed build, security penetration test, end-to-end test, or live-site validation. See the audit for the exact inspection scope and open checks.
