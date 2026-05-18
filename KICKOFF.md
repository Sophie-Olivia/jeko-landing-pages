# Jeko Landing Pages — Kickoff Brief

## Project

Pre-sell ("advertorial") landing pages for paid-ad traffic. Each page is presented as third-party / editorial content (review, ranking, comparison) that redirects the visitor to Sophie & Olivia's Shopify store via a tracked CTA.

Two pages at launch, both in the lingerie / shapewear category. Designed to look like the [verified-choice.com/motobike/v1#ranked](https://www.verified-choice.com/motobike/v1#ranked) reference (editorial site with a "top picks" panel that links out to merchants).

## Tech stack (locked)

- **Runtime:** Node.js 20 + TypeScript (strict mode)
- **Web framework:** [Hono](https://hono.dev/) — tiny, fast, runs natively on Node
- **Database:** Supabase (Postgres) via `@supabase/supabase-js` — reuses the existing project `yhlpytmusgkswhbgyjlt`
- **Validation:** `zod`
- **Logging:** `pino`
- **Testing:** `vitest`
- **Lint/format:** ESLint + Prettier
- **Deploy target:** Railway (Dockerfile + railway.json)

No frontend framework. Each landing page is a self-contained HTML file with inline CSS — easy for Claude to author/edit in one shot, no build step on the page side.

## URL structure

```
https://<domain>/<slug>/<version>            # serves the HTML
https://<domain>/<slug>/<version>/cta         # 302 to Shopify with UTMs forwarded
https://<domain>/public/<asset>               # static assets
https://<domain>/healthz                      # for Railway healthcheck
```

Example after launch:
```
https://verified-yourdomain.com/lingerie/v1#ranked
https://verified-yourdomain.com/lingerie/v1/cta?utm_source=fb&utm_campaign=summer
```

Versioning (`v1`, `v2`) lets you A/B test by splitting ad traffic at the campaign level — no code change needed, just create `pages/lingerie/v2/` and route Facebook half the budget there.

## Page authoring workflow

Each page is one folder with **exactly two files**:

```
pages/lingerie/v1/
├── index.html      # the full page — inline CSS, inline JS
└── meta.json       # { "ctaUrl": "...", "title": "...", "active": true }
```

Claude generates `index.html` from a copy prompt. You drop it in the folder. Server serves it. No build step.

**The reference page** ([verified-choice.com/motobike/v1#ranked](https://www.verified-choice.com/motobike/v1#ranked) — confirmed by the client as the target pattern) is a **long-form, 15-section advertorial** of ~1500–3000 words. Expect each `index.html` to be **600–800 lines** of HTML with inline CSS. The full structural blueprint, voice patterns, CTA frequency, trust-signal stack, disclosure pattern, and lingerie-specific adaptation hooks all live in [REFERENCE.md](REFERENCE.md). Read that before authoring or editing any page.

Image/font assets that are reused across pages go in `/public/`. Per-page imagery can also live inline as data URIs or in the page folder if you prefer.

The CTA button in the HTML points to `/<slug>/<version>/cta` — server-side it logs the click and 302s to `meta.json.ctaUrl`, forwarding the original query string (UTMs survive). Important: per the reference pattern, the **same CTA appears 8–10 times** across the page, all pointing to the same `/cta` endpoint. That's intentional repeated affordance.

## Click logging

Single table, server-side, fire-and-forget. Survives ad blockers, no consent banner needed for legitimate-interest analytics.

```sql
create table if not exists landing_events (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  event_type   text not null check (event_type in ('view', 'cta_click')),
  page_slug    text not null,
  page_version text not null,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  referrer     text,
  country      text,
  user_agent   text
);

create index idx_landing_events_created_at on landing_events (created_at desc);
create index idx_landing_events_page on landing_events (page_slug, page_version, created_at desc);
```

That goes in `supabase/migrations/001_initial.sql` and reuses the existing migrate runner pattern.

Standard daily questions answered by one SQL each:
- "Yesterday's views by source": `select utm_source, count(*) from landing_events where event_type='view' and created_at >= …`
- "Page conversion %": `(count cta_click) / (count view)` grouped by `page_slug, utm_source`

## Environment variables (`.env.example`)

```
# Supabase
SUPABASE_URL=https://yhlpytmusgkswhbgyjlt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_DB_URL=postgresql://...

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
TZ=Europe/Paris
```

Validated at boot with zod, same pattern as Jeko Brands v2. Refuses to start on missing values.

## Build order

Six small steps, each independently verifiable:

1. **Scaffolding** — `package.json`, `tsconfig`, lint/format, folder structure, `.env.example`, `.gitignore`, `README.md`. `pnpm typecheck` clean.
2. **Hono server skeleton** — boot, env validation, `/healthz`, structured logging. `pnpm dev` returns 200 on health.
3. **Page routing + static assets** — serves `pages/<slug>/<version>/index.html`; serves `/public/*`. Helpful 404 if slug/version doesn't exist or `meta.json.active === false`.
4. **Supabase migration + click logging** — `landing_events` table, view middleware that fire-and-forgets an insert on each page hit. Verify rows in Supabase.
5. **CTA redirect** — `/<slug>/<version>/cta` reads `meta.json.ctaUrl`, logs the click, 302s with UTMs preserved.
6. **First real page** — build `pages/lingerie/v1/` following the template in [REFERENCE.md](REFERENCE.md). 15 sections, ~600–800 lines of HTML with inline CSS, mobile-first, sticky bottom CTA on mobile. Will need a content brief from you for: the brand pain-point story, 4 named competitor products to "test" alongside Sophie & Olivia, the academic/professional credibility reference to cite, and 3 testimonials.
7. **Dockerfile + Railway deploy** — multi-stage build, non-root user, expose `PORT`. Verify deploy + custom domain DNS.

Stop after step 1 to confirm install before `pnpm install` (same pattern as Jeko Brands v2).

## Non-negotiables

- TS strict. No `any` without a `// FIXME` comment.
- Click logging is fire-and-forget — if Supabase is down, pages still serve.
- `meta.json.ctaUrl` is the single source of truth for where the CTA goes. Never hardcode Shopify URLs in HTML.
- UTMs that come in on the landing URL must survive the 302 to Shopify.
- Page HTML never blocks waiting on any backend call — landing pages must load fast for paid-ad traffic.

## Deferred / out of scope for v1

- Multi-brand pages (current scope is Sophie & Olivia only)
- Form/email capture on the landing page
- Server-side A/B routing (v1: route at the ad campaign level instead)
- Admin UI for editing pages (v1: edit HTML files in git)
- FTC affiliate disclosure logic (your call to add a footer disclaimer or not — it's just HTML)

## First task

Create the scaffolding (step 1). Print the planned file tree, then create the files. Stop before `pnpm install` for review.
