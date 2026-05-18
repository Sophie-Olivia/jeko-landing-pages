import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { logEvent } from './events.js';
import { logger } from './logger.js';
import { loadMeta, loadPage, PageInactiveError, PageNotFoundError } from './pages.js';

function notFoundHtml(message: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:0 24px;color:#1a1a1a}h1{font-size:28px;margin:0 0 12px}p{color:#555;line-height:1.5}</style></head><body><h1>Not found</h1><p>${message}</p></body></html>`;
}

export function createApp(): Hono {
  const app = new Hono();

  app.use('*', async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    logger.info(
      { method: c.req.method, path: c.req.path, status: c.res.status, ms },
      'request',
    );
  });

  app.get('/healthz', (c) => c.json({ ok: true }));

  app.use(
    '/public/*',
    serveStatic({
      root: './public',
      rewriteRequestPath: (p) => p.replace(/^\/public/, '') || '/',
    }),
  );

  app.get('/:slug/:version/cta', async (c) => {
    const slug = c.req.param('slug');
    const version = c.req.param('version');
    try {
      const meta = await loadMeta(slug, version);
      logEvent('cta_click', slug, version, c);
      const target = new URL(meta.ctaUrl);
      for (const [key, value] of Object.entries(c.req.query())) {
        target.searchParams.set(key, value);
      }
      return c.redirect(target.toString(), 302);
    } catch (err) {
      if (err instanceof PageInactiveError || err instanceof PageNotFoundError) {
        return c.html(notFoundHtml(`No active CTA at /${slug}/${version}/cta.`), 404);
      }
      throw err;
    }
  });

  app.get('/:slug/:version', async (c) => {
    const slug = c.req.param('slug');
    const version = c.req.param('version');
    try {
      const { html } = await loadPage(slug, version);
      logEvent('view', slug, version, c);
      return c.html(html);
    } catch (err) {
      if (err instanceof PageInactiveError) {
        return c.html(notFoundHtml('This page is no longer active.'), 404);
      }
      if (err instanceof PageNotFoundError) {
        return c.html(notFoundHtml(`No page at /${slug}/${version}.`), 404);
      }
      throw err;
    }
  });

  app.notFound((c) => c.html(notFoundHtml('Page not found.'), 404));

  return app;
}
