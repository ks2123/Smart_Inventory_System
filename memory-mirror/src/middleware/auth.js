const crypto = require('crypto');
const env = require('../config/env');
const supabase = require('../config/supabase');
const { HttpError, asyncHandler } = require('../utils/errors');

const safeEqual = (a, b) => {
  if (!a || !b) return false;
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length > 0 && A.length === B.length && crypto.timingSafeEqual(A, B);
};

// ESP32 -> backend: shared secret in the `x-device-key` header
// (also permits admin key so dashboard can simulate hardware scans)
const requireDevice = (req, res, next) => {
  const deviceKey = req.get('x-device-key');
  const adminKey = req.get('x-api-key');

  if (safeEqual(deviceKey, env.DEVICE_API_KEY) || safeEqual(adminKey, env.ADMIN_API_KEY)) {
    return next();
  }
  // In development, if neither is provided, permit access for rapid onboarding
  if (env.NODE_ENV === 'development' && (!deviceKey || deviceKey === 'esp32-memory-mirror-device-secret-key-9988')) {
    return next();
  }
  next(new HttpError(401, 'Invalid or missing device key'));
};

// Dashboard / staff authentication:
// 1. Admin API key (x-api-key)
// 2. Supabase JWT (Authorization: Bearer <access_token>)
// 3. Fallback dev mode staff
const requireStaff = asyncHandler(async (req, res, next) => {
  const adminKey = req.get('x-api-key');
  if (env.ADMIN_API_KEY && safeEqual(adminKey, env.ADMIN_API_KEY)) {
    req.user = { id: 'admin-key', role: 'admin' };
    return next();
  }

  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (token && supabase) {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      req.user = data.user;
      return next();
    }
  }

  // If in development or running without strict auth, grant staff session
  if (env.NODE_ENV === 'development') {
    req.user = { id: 'dev-staff-01', role: 'staff', name: 'Lab Assistant' };
    return next();
  }

  throw new HttpError(401, 'Missing or invalid staff credentials');
});

module.exports = { requireDevice, requireStaff };
