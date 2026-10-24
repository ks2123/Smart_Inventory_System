const { z } = require('zod');
const { normalizeUid } = require('./utils/uid');

const STATUSES = ['active', 'under_maintenance', 'faulty', 'retired'];
const LOG_TYPES = ['inspection', 'repair', 'calibration', 'cleaning', 'part_replacement', 'other'];
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

// multipart/form-data sends empty inputs as "" -> treat as "not provided"
const clean = (body = {}) =>
  Object.fromEntries(Object.entries(body).filter(([, v]) => v !== '' && v != null));

const assetBase = z.object({
  item_name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  department: z.string().trim().min(1).max(150), // department / lab name
  purchase_date: dateStr.optional(),
  cost: z.coerce.number().nonnegative().max(1e10).optional(),
  status: z.enum(STATUSES).optional(),
});

const assetCreate = assetBase.extend({
  uid: z
    .string()
    .transform((v) => normalizeUid(v))
    .refine((v) => v !== null, 'UID must be 8-20 hex characters (4, 7 or 10 byte RFID UID)'),
});

const assetUpdate = assetBase.partial();

const listQuery = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().optional(),
  department: z.string().trim().optional(),
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

const logCreate = z.object({
  assistant_name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(3).max(5000),
  log_date: dateStr.default(() => new Date().toISOString().slice(0, 10)),
  log_type: z.enum(LOG_TYPES).default('inspection'),
  // accepts ["Fuse","Belt"] or "Fuse, Belt"
  parts_replaced: z
    .preprocess(
      (v) =>
        Array.isArray(v)
          ? v
          : typeof v === 'string'
          ? v.split(',').map((s) => s.trim()).filter(Boolean)
          : v,
      z.array(z.string().trim().min(1).max(120)).max(50)
    )
    .default([]),
  status_after: z.enum(STATUSES).optional(), // optionally update asset status in the same transaction
});

const logListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

module.exports = { clean, assetCreate, assetUpdate, listQuery, logCreate, logListQuery };
