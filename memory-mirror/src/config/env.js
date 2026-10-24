require('dotenv').config();
const { z } = require('zod');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  SUPABASE_BUCKET: z.string().default('asset-images'),
  DEVICE_API_KEY: z.string().min(8).default('esp32-memory-mirror-device-secret-key-9988'),
  ADMIN_API_KEY: z.string().min(8).default('memory-mirror-admin-key-2026-production'),
  CORS_ORIGINS: z.string().default('*'),
  REQUIRE_IMAGE: z.enum(['true', 'false']).default('false'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = {
  ...parsed.data,
  REQUIRE_IMAGE: parsed.data.REQUIRE_IMAGE === 'true',
};
