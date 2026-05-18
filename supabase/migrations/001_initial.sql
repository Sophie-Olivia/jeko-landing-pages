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

create index if not exists idx_landing_events_created_at
  on landing_events (created_at desc);

create index if not exists idx_landing_events_page
  on landing_events (page_slug, page_version, created_at desc);
