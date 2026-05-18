import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { logger } from './logger.js';

const PAGES_ROOT = path.resolve(process.cwd(), 'pages');

const SLUG_RE = /^[a-z0-9-]+$/;
const VERSION_RE = /^v\d+$/;

const MetaSchema = z.object({
  ctaUrl: z.string().url(),
  title: z.string().min(1),
  active: z.boolean(),
});

export type PageMeta = z.infer<typeof MetaSchema>;

export class PageNotFoundError extends Error {
  constructor(public readonly reason: string) {
    super(reason);
    this.name = 'PageNotFoundError';
  }
}

export class PageInactiveError extends Error {
  constructor() {
    super('inactive');
    this.name = 'PageInactiveError';
  }
}

export interface LoadedPage {
  html: string;
  meta: PageMeta;
}

function resolvePageDir(slug: string, version: string): string {
  if (!SLUG_RE.test(slug)) throw new PageNotFoundError('invalid_slug');
  if (!VERSION_RE.test(version)) throw new PageNotFoundError('invalid_version');
  const pageDir = path.resolve(PAGES_ROOT, slug, version);
  if (pageDir !== path.join(PAGES_ROOT, slug, version)) {
    throw new PageNotFoundError('path_escape');
  }
  return pageDir;
}

async function readAndValidateMeta(
  pageDir: string,
  slug: string,
  version: string,
): Promise<PageMeta> {
  let metaRaw: string;
  try {
    metaRaw = await fs.readFile(path.join(pageDir, 'meta.json'), 'utf8');
  } catch {
    throw new PageNotFoundError('missing_meta');
  }

  let metaJson: unknown;
  try {
    metaJson = JSON.parse(metaRaw);
  } catch (err) {
    logger.warn({ slug, version, err }, 'meta.json parse failed');
    throw new PageNotFoundError('meta_parse');
  }

  const parsed = MetaSchema.safeParse(metaJson);
  if (!parsed.success) {
    logger.warn(
      { slug, version, issues: parsed.error.issues },
      'meta.json schema validation failed',
    );
    throw new PageNotFoundError('meta_invalid');
  }

  if (!parsed.data.active) throw new PageInactiveError();
  return parsed.data;
}

export async function loadMeta(slug: string, version: string): Promise<PageMeta> {
  const pageDir = resolvePageDir(slug, version);
  return readAndValidateMeta(pageDir, slug, version);
}

export async function loadPage(slug: string, version: string): Promise<LoadedPage> {
  const pageDir = resolvePageDir(slug, version);
  const [meta, html] = await Promise.all([
    readAndValidateMeta(pageDir, slug, version),
    fs.readFile(path.join(pageDir, 'index.html'), 'utf8').catch(() => {
      throw new PageNotFoundError('missing_html');
    }),
  ]);
  return { html, meta };
}
