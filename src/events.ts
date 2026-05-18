import type { Context } from 'hono';
import { env } from './env.js';
import { logger } from './logger.js';
import { getSupabase } from './supabase.js';

export type EventType = 'view' | 'cta_click';

interface LandingEventRow {
  event_type: EventType;
  page_slug: string;
  page_version: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  country: string | null;
  user_agent: string | null;
}

function extractRow(
  eventType: EventType,
  slug: string,
  version: string,
  c: Context,
): LandingEventRow {
  const q = c.req.query();
  return {
    event_type: eventType,
    page_slug: slug,
    page_version: version,
    utm_source: q.utm_source ?? null,
    utm_medium: q.utm_medium ?? null,
    utm_campaign: q.utm_campaign ?? null,
    utm_content: q.utm_content ?? null,
    utm_term: q.utm_term ?? null,
    referrer: c.req.header('referer') ?? null,
    country: c.req.header('cf-ipcountry') ?? c.req.header('x-vercel-ip-country') ?? null,
    user_agent: c.req.header('user-agent') ?? null,
  };
}

export function logEvent(
  eventType: EventType,
  slug: string,
  version: string,
  c: Context,
): void {
  if (!env.EVENTS_ENABLED) return;
  const row = extractRow(eventType, slug, version, c);
  void (async () => {
    try {
      const { error } = await getSupabase().from('landing_events').insert(row);
      if (error) {
        logger.warn({ err: error, eventType, slug, version }, 'event insert failed');
      }
    } catch (err) {
      logger.warn({ err, eventType, slug, version }, 'event insert threw');
    }
  })();
}
