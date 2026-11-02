# AGENTS.md

On-demand context guide for AI coding agents working in this repository. Human
contributors should read it too. Keep it in sync when architecture changes.

## Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack default)         |
| Runtime    | React 19                                           |
| Language   | TypeScript 5 (`target` ES2022, strict)             |
| Styling    | Tailwind CSS v4 + shadcn/ui (Radix primitives)     |
| Bundler    | Turbopack (default for `next dev` **and** `build`) |
| Node       | >= 20.9.0 (see `package.json` `engines`)           |
| Database / Auth | none (UI starter — add your own)              |

## Commands (pnpm)

| Command         | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `pnpm dev`      | Dev server (Turbopack)                             |
| `pnpm build`    | Production build (Turbopack). Fallback: `next build --webpack` |
| `pnpm start`    | Serve the production build                          |
| `pnpm typegen`  | `next typegen` — generate `PageProps`/`LayoutProps` |
| `pnpm lint`     | ESLint (flat config, `eslint.config.mjs`)          |
| `pnpm test`     | Jest + Testing Library                             |
| `pnpm format`   | Prettier                                           |

## Routing structure

```
app/
  layout.tsx              Root layout (metadata, ThemeProvider, fonts)
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
Use the generated global helpers. After installing dependencies, run
`pnpm typegen && pnpm exec tsc --noEmit` on a clean checkout and after
adding, removing, or renaming routes. Type generation must succeed before
standalone TypeScript checking; it creates the route types and `next-env.d.ts`
without requiring a development server or full build:

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

| API                              | Semantics                                   |
| -------------------------------- | ------------------------------------------- |
| `updateTag('<tag>')`             | **Read-your-writes** — expire + recompute in the current request. Use in Server Actions after a mutation. |
| `revalidateTag('<tag>', '<profile>')` | Eventual invalidation. **Two args required in Next 16** (tag + profile). |

Canonical example: [app/demo/cache/](app/demo/cache/).

## Network boundary

`proxy.ts` (root) replaces `middleware.ts`. Add auth/redirects/rewrites there
and scope with `config.matcher` (empty by default = runs on nothing).

## View Transitions

Native React 19 View Transitions are enabled via `experimental.viewTransition`
in `next.config.ts`. Trigger per-navigation types with the `<Link>`
`transitionTypes` prop, e.g. `<Link href="/x" transitionTypes={['slide']}>`.

## Conventions

- Path alias: `@/*` → repository root (`./*` in `tsconfig.json`); for example, `@/components/ui/button` resolves to `components/ui/button.tsx`.
- Types via `type` (not `interface`) — enforced by ESLint.
- No `console` / no `any` (ESLint errors).

## Carolina AI Vision product directive (2026-11-01)

This repository is being converted from an upstream UI starter into the **Carolina AI Vision** business website. The product goal is qualified lead generation and ethical conversion through a Free AI Visibility Snapshot, a **$197 AI Visibility Audit**, and continuing AI consulting, local SEO, website optimization and automation. **These offers are not implemented merely because they appear in this document.**

### Canonical documents and decision boundaries

- [README.md](README.md): full product overview, verified technical setup, release precautions and current feature status.
- [docs/REPOSITORY-AUDIT.md](docs/REPOSITORY-AUDIT.md): dated inspection evidence, findings, limitations and launch risks.
- [docs/IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md): implementation order and acceptance criteria.
- Keep technical stack and framework rules here; keep product-level scope in README and the plan, rather than duplicating large instructions.
- When policy changes, update affected governing documents as **complete replacements** and ensure they remain consistent.
- Do not silently change the chosen Next.js starter, wipe existing work, introduce a new vendor, or claim unverified integrations. Use reviewable PRs before release.

### Coding and security expectations

- Preserve the TypeScript alias described in Conventions above; check Jest's incorrect `src/` mapping before relying on tests.
- Existing `proxy.ts` has an empty matcher; **it supplies no active authorization mechanism**. Any sensitive workflow needs explicit server-side authorization, validation, abuse controls, secrets protection, and privacy-by-design.
- Require accessible, responsive, reduced-motion friendly UI, semantically labeled inputs, keyboard access, informative errors and honest content.
- Treat lead intake, payment, booking, analytics, CRM, audit engines and deployment as unverified until real checks demonstrate functionality.
- Do not insert testimonials, logos, compliance certifications, sample metrics or AI audit results that are not supported by evidence.
- Report actual command executions and test outputs. A command written in documentation is not a passing test.
