import { serve } from '@hono/node-server';
import { env } from './env.js';
import { logger } from './logger.js';
import { createApp } from './server.js';

const app = createApp();

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info({ port: info.port, env: env.NODE_ENV }, 'server listening');
});

const shutdown = (signal: string): void => {
  logger.info({ signal }, 'shutting down');
  server.close((err) => {
    if (err) {
      logger.error({ err }, 'error during shutdown');
      process.exit(1);
    }
    logger.info('server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('forced exit after 10s');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
