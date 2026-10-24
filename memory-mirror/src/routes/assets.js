const router = require('express').Router();
const store = require('../services/store');
const upload = require('../middleware/upload');
const { requireAuth, requireAdmin } = require('./auth');
const { HttpError, asyncHandler } = require('../utils/errors');
const { normalizeUid } = require('../utils/uid');
const { clean, assetCreate, assetUpdate, listQuery } = require('../validators');

// All asset operations require authentication (Admin or Staff)
router.use(requireAuth);

// Normalise :uid
router.param('uid', (req, res, next, raw) => {
  const uid = normalizeUid(raw);
  if (!uid) return next(new HttpError(400, 'Invalid UID format (8-20 hex characters required)'));
  req.uid = uid;
  next();
});

// ---- Lab Stats Summary -----------------------------------------------------
router.get(
  '/stats/summary',
  asyncHandler(async (req, res) => {
    const stats = await store.getStats(req.user.workspace_id);
    res.json(stats);
  })
);

// ---- List assets scoped to caller's Lab -------------------------------------
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = listQuery.parse(req.query);
    const result = await store.getAssets(req.user.workspace_id, q);
    res.json({
      data: result.data,
      pagination: { page: q.page, limit: q.limit, total: result.total },
    });
  })
);

// ---- Get one asset + maintenance history -----------------------------------
router.get(
  '/:uid',
  asyncHandler(async (req, res) => {
    const data = await store.getAssetByUid(req.user.workspace_id, req.uid);
    if (!data) throw new HttpError(404, 'Asset not found in your assigned lab workspace');
    res.json({ data });
  })
);

// ---- Register new asset (Admin or Staff) -----------------------------------
router.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const body = assetCreate.parse(clean(req.body));
    try {
      const data = await store.createAsset(req.user.workspace_id, body, req.file);
      res.status(201).json({ data });
    } catch (err) {
      if (err.code === '23505') throw new HttpError(409, err.message);
      throw err;
    }
  })
);

// ---- Update asset (Admin only for critical costs; Staff can update status) --
router.patch(
  '/:uid',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const body = assetUpdate.parse(clean(req.body));
    if (!Object.keys(body).length && !req.file) throw new HttpError(400, 'Nothing to update');

    // Only Admin can modify acquisition cost
    if (body.cost !== undefined && req.user.role !== 'admin') {
      throw new HttpError(403, 'Only Lab Administrators can alter equipment valuation and cost');
    }

    const updated = await store.updateAsset(req.user.workspace_id, req.uid, body, req.file);
    if (!updated) throw new HttpError(404, 'Asset not found in your assigned lab workspace');
    res.json({ data: updated });
  })
);

// ---- Delete asset (Admin Only!) --------------------------------------------
router.delete(
  '/:uid',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const ok = await store.deleteAsset(req.user.workspace_id, req.uid);
    if (!ok) throw new HttpError(404, 'Asset not found in your assigned lab workspace');
    res.status(204).end();
  })
);

// Attach nested logs router
router.use('/:uid/logs', require('./logs'));

module.exports = router;
