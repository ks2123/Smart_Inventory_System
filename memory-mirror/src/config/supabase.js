const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let client = null;

if (
  env.SUPABASE_URL &&
  env.SUPABASE_URL.startsWith('http') &&
  !env.SUPABASE_URL.includes('YOUR-PROJECT') &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  env.SUPABASE_SERVICE_ROLE_KEY.length > 20
) {
  try {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client, defaulting to local engine:', err.message);
  }
}

module.exports = client;
