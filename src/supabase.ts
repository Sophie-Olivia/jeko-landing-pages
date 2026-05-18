import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

function build() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let client: ReturnType<typeof build> | null = null;

export function getSupabase() {
  client ??= build();
  return client;
}
