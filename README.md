# Jeko Landing Pages

Pre-sell ("advertorial") landing pages for Sophie & Olivia paid-ad traffic. Each page is presented as third-party / editorial content (review, ranking, comparison) and redirects visitors to the Shopify store via a tracked CTA.

Two source docs, both required reading:

- [KICKOFF.md](./KICKOFF.md) — technical brief: stack, URL structure, click logging, env, build order.
- [REFERENCE.md](./REFERENCE.md) — page-template blueprint: 15 sections, voice patterns, CTA frequency, trust-signal stack, disclosure pattern, lingerie/shapewear adaptation. **Read before authoring or editing any page.**

## Stack

- Node 20 + TypeScript (strict)
- [Hono](https://hono.dev/) on `@hono/node-server`
- Supabase (Postgres) for click logging
- `zod` env validation, `pino` logging
- `vitest` for tests
- Deployed on Railway

## Project layout

```
src/                      TypeScript server source
pages/<slug>/<version>/   Self-contained landing pages (index.html + meta.json)
public/                   Shared static assets (served at /public/*)
supabase/migrations/      SQL migrations (001_initial.sql lands in step 4)
```

## Local dev

```bash
pnpm install
cp .env.example .env       # fill in real Supabase values
pnpm dev                   # tsx watch on src/index.ts
```

## Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Run the server with file-watch reload     |
| `pnpm build`       | Compile TS to `dist/`                     |
| `pnpm start`       | Run the compiled server                   |
| `pnpm typecheck`   | `tsc --noEmit` against strict config      |
| `pnpm lint`        | ESLint over `.ts` / `.cjs`                |
| `pnpm format`      | Prettier write (skips `pages/**/*.html`)  |
| `pnpm test`        | Vitest run                                |

## Build status

Implementation proceeds in the seven steps documented in [KICKOFF.md](./KICKOFF.md#build-order).

- [x] **Step 1 — Scaffolding.** Tooling, configs, folder layout. `pnpm typecheck` clean after install.
- [x] **Step 2 — Hono server skeleton.** Boot, zod env validation, `/healthz` returns 200, pino structured request logging, graceful shutdown on SIGINT/SIGTERM.
- [x] **Step 3 — Page routing + static assets.** `GET /:slug/:version` serves `pages/<slug>/<version>/index.html` after zod-validating `meta.json`. `GET /public/*` serves static assets with path-traversal protection. Helpful HTML 404s for missing folders, malformed `meta.json`, and `active === false`.
- [x] **Step 4 — Supabase migration + click logging.** `landing_events` migration at `supabase/migrations/001_initial.sql`. Fire-and-forget `logEvent('view', ...)` on each successful page hit — captures UTMs, referer, country headers, user-agent. Verified: Supabase failure logs a warn but does not block or fail the page response. `EVENTS_ENABLED=false` env flag short-circuits all inserts for local/demo use.
- [x] **Step 5 — CTA redirect.** `GET /:slug/:version/cta` reads `meta.json.ctaUrl`, fire-and-forgets a `cta_click` event, and 302s to the merchant. Incoming UTMs are merged onto the target URL's `searchParams` (UTMs win on key collisions).
- [x] **Step 6 — First real page (`pages/lingerie/v1/`).** 15-section advertorial for the Sophie & Olivia Joyce Set following [REFERENCE.md](./REFERENCE.md). 725 lines, mobile-first, 9 CTAs on the page + 1 sticky mobile bottom CTA, all to `/lingerie/v1/cta`. Inline JS appends current page UTMs to all CTA hrefs before any click so UTMs survive the `/cta → Shopify` hop. Real product hero image from the Shopify CDN, real Shopify customer URL in `meta.json`.
- [x] **Step 7 — Dockerfile + Railway deploy config.** Multi-stage `node:20-alpine` build, non-root `app` user, `pnpm prune --prod`, source maps enabled at runtime. `railway.json` declares the Dockerfile builder, `/healthz` healthcheck, restart-on-failure. Production build verified locally: routes serve correctly, logs emit single-line JSON. Actual Railway deploy is a manual step — see the deploy walkthrough below.

## Authoring a landing page

Each page is exactly two files in `pages/<slug>/<version>/`:

- `index.html` — the full page, inline CSS, inline JS. Expect **600–800 lines** following the 15-section template in [REFERENCE.md](./REFERENCE.md). Mobile-first; sticky bottom CTA on mobile.
- `meta.json` — `{ "ctaUrl": "...", "title": "...", "active": true }`

The CTA button in HTML points to `/<slug>/<version>/cta`. The server logs the click and 302s to `meta.json.ctaUrl` with the original query string preserved (UTMs survive). Per REFERENCE, the **same CTA appears 8–10 times** across the page — all pointing to the same `/cta` endpoint. Runner-up products in the ranking get no buy buttons; only the winner does.

Before drafting a page, get a content brief covering: brand pain-point story, 4 named competitor products to "test" against, the academic/professional credibility reference to cite, and 3 testimonials.

## Non-negotiables

- TS strict. No `any` without a `// FIXME` comment.
- Click logging is fire-and-forget — if Supabase is down, pages still serve.
- `meta.json.ctaUrl` is the single source of truth for where the CTA goes. Never hardcode Shopify URLs in HTML.
- UTMs on the landing URL must survive the 302 to Shopify.
- Page HTML never blocks on backend calls — paid-ad landings must load fast.
