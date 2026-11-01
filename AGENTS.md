# AGENTS.md

On-demand context guide for AI coding agents working in this repository. Human
contributors should read it too. Keep it in sync when architecture changes.

## Stack

| Layer           | Choice                                               |
| --------------- | ---------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack default)           |
| Runtime         | React 19                                             |
| Language        | TypeScript 5 (`target` ES2022, strict)               |
| Styling         | Tailwind CSS v4 + shadcn/ui (Radix primitives)       |
| Bundler         | Turbopack (default for `next dev` **and** `build`)   |
| Node            | >= 20.9.0 (see `package.json` `engines`)             |
| Database / Auth | PostgreSQL adapter; live DB approval/config required |

## Commands (pnpm)

| Command        | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| `pnpm dev`     | Dev server (Turbopack)                                         |
| `pnpm build`   | Production build (Turbopack). Fallback: `next build --webpack` |
| `pnpm start`   | Serve the production build                                     |
| `pnpm typegen` | `next typegen` — generate `PageProps`/`LayoutProps`            |
| `pnpm lint`    | ESLint (flat config, `eslint.config.mjs`)                      |
| `pnpm test`    | Jest + Testing Library                                         |
| `pnpm format`  | Prettier                                                       |

## Routing structure

```
app/
  layout.tsx              Root layout (metadata, public navigation, opt-in analytics)
  page.tsx                Home
  components/page.tsx      Component gallery
  demo/cache/             Cache Components reference implementation
    page.tsx               Cached read + Server Action form
    data.ts                `use cache` fetcher (cacheTag + cacheLife)
    actions.ts             Server Action (updateTag)
  not-found.tsx            Native 404 boundary (returns 404 status)
proxy.ts                  Network boundary (successor to middleware.ts)
```

### Typed async route props

`params` and `searchParams` are **async** in Next.js 16 — always `await` them.
Use the generated global helpers (run `pnpm typegen` after adding routes):

```ts
export default async function Page(props: PageProps<'/demo/cache'>) {
  const searchParams = await props.searchParams
}
```

## Caching layer — strict tokens

Cache Components is enabled via `cacheComponents: true` in `next.config.ts`
(this replaces the old `experimental.ppr`). Rules:

- Mark a cacheable function with the **`use cache`** directive on its first line.
- Tag entries with **`cacheTag('<tag>')`** (from `next/cache`).
- Set a revalidation profile with **`cacheLife('<profile>')`**. Stable named
  profiles: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`, `default`.
  Custom timespans: `cacheLife({ stale, revalidate, expire })`.
- Dynamic/cached content in a page must be read inside `<Suspense>`.

### Invalidation — pick the right one

| API                                   | Semantics                                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `updateTag('<tag>')`                  | **Read-your-writes** — expire + recompute in the current request. Use in Server Actions after a mutation. |
| `revalidateTag('<tag>', '<profile>')` | Eventual invalidation. **Two args required in Next 16** (tag + profile).                                  |

Canonical example: [app/demo/cache/](app/demo/cache/).

## Network boundary

`proxy.ts` (root) replaces `middleware.ts`. Add auth/redirects/rewrites there
and scope with `config.matcher` (empty by default = runs on nothing).

## Conventions

- Path alias: `@/*` → repo root.
- Types via `type` (not `interface`) — enforced by ESLint.
- No `console` / no `any` (ESLint errors).

## Carolina Local AI product directive (2026-11-01)

The public brand is **Carolina Local AI**, an independent veteran-owned North Carolina digital growth brand, separate from ClientVerse. Preserve this repository and Vercel project. Primary message: **Get Found. Get Customers. Grow Smarter.**

The owner's current request supersedes the old audit-first funnel. Offers: Free AI Visibility Check, AI Growth Blueprint, Website Studio, Business Growth Systems, Ongoing Growth Management. Proposed prices are private and pending owner approval and cost validation; do not include them in public UI or repository documentation. Website projects never require an audit purchase. No payments may be activated without approval.

### Implemented routes and boundaries

- `/visibility`: local self-reported preliminary check and guarded human-review intake.
- `/studio`, `/studio/demos/[industry]`, `/studio/quote`: concept demos, scope comparison, guarded quote request.
- `/consulting`, `/consulting/request`: service discovery and guarded consultation request.
- `/contact`, `/blueprint`, `/studio/inquire`, `/studio/onboarding`: service-specific inquiry and website planning intake.
- `/about`, `/privacy`, `/terms`: positioning and review-draft disclosures.
- `/api/leads`: validated PostgreSQL intake, gated by explicit enablement and approved server configuration. `db/001_lead_intake.sql` must be applied by an authorized operator, never automatically. No database provisioned or real CRM integration activated.
- Starter gallery/cache examples remain preserved, unlinked and noindex. They are not business features.

### Security and evidence

Never fabricate findings, testimonials, rankings, client logos, scans, or successful delivery. Preliminary evidence comes only from answers and must be labeled accordingly. No URL supplied by a user is fetched by the assessment. Never expose credentials. Intake must confirm durable storage before success. Rate limiting and deduplication are transactional in PostgreSQL when configured; local embedded PostgreSQL tests are not remote activation. CRM outbox remains pending configuration until a real API contract is available. Owner-approved privacy contact, retention, receiver security, and deletion controls are launch gates.

### Checks and release

Use pnpm. Jest now uses `next/jest`, root aliases, and `__tests__/`; browser tests use Playwright and axe in `e2e/`. Run lint, typegen, tsc, Jest, `pnpm test:integration`, build, `pnpm test:e2e`, `pnpm security:source`, and both full/production dependency audits. Do not infer WCAG conformance or Core Web Vitals from automated checks alone. Metadata uses the verified Vercel production alias, previews are noindex, analytics stays disabled unless explicitly configured. Work in a branch, publish a reviewable PR and preview, never merge or promote production without approval.

See README and docs for the verified audit, acceptance status, and integration contract.
