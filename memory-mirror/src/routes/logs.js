const router = require('express').Router({ mergeParams: true });
const store = require('../services/store');
const { asyncHandler, HttpError } = require('../utils/errors');
const { logCreate, logListQuery } = require('../validators');

// ---- Append a maintenance note --------------------------------------------
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const b = logCreate.parse(req.body);

    try {
      const data = await store.addLog(req.user.workspace_id, {
        uid: req.uid,
        assistant_name: b.assistant_name || req.user.name,
        staff_id: req.user.id,
        description: b.description,
        log_date: b.log_date,
        parts_replaced: b.parts_replaced,
        log_type: b.log_type,
        status_after: b.status_after,
      });
      res.status(201).json({ data });
    } catch (err) {
      if (err.code === 'P0002') throw new HttpError(404, 'Asset not found in your assigned lab workspace');
      throw err;
    }
  })
);

// ---- Paginated history -------------------------------------------------------
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = logListQuery.parse(req.query);
    const asset = await store.getAssetByUid(req.user.workspace_id, req.uid);
    if (!asset) throw new HttpError(404, 'Asset not found in your assigned lab workspace');

    const logs = asset.maintenance_logs || [];
    const from = (q.page - 1) * q.limit;
    res.json({
      data: logs.slice(from, from + q.limit),
      pagination: { page: q.page, limit: q.limit, total: logs.length },
    });
  })
);

module.exports = router;
