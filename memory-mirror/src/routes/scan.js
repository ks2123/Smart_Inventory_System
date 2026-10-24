const router = require('express').Router();
const store = require('../services/store');
const eventBus = require('../services/eventBus');
const { requireDevice } = require('../middleware/auth');
const { HttpError, asyncHandler } = require('../utils/errors');
const { normalizeUid } = require('../utils/uid');

const RECENT_LOGS = 5;
// SSD1306 128px wide @ text size 1 = 21 chars per line
const fit = (s, n = 21) => (s == null ? '' : String(s).slice(0, n));

// POST /api/scan   { "uid": "04:A3:2F:1B", "device_id": "robotics-reader-1" }
router.post(
  '/',
  requireDevice,
  asyncHandler(async (req, res) => {
    const uid = normalizeUid(req.body?.uid);
    if (!uid) throw new HttpError(400, 'Invalid or missing uid');
    const deviceId = typeof req.body.device_id === 'string' ? req.body.device_id.slice(0, 64) : 'esp32-reader';

    const asset = await store.getAssetGlobal(uid);
    await store.recordScan(uid, deviceId, !!asset);

    if (!asset) {
      const notFoundPayload = {
        registered: false,
        uid,
        name: 'UNREGISTERED TAG',
        item_name: 'UNREGISTERED TAG',
        status: 'NEW RFID TAG',
        last_audit: 'TAP CONSOLE',
        display: {
          line1: 'UNREGISTERED TAG',
          line2: fit(uid),
          line3: 'Register in console',
          line4: '',
        },
        scanned_at: new Date().toISOString(),
      };
      eventBus.emit('scan', notFoundPayload);
      return res.status(200).json(notFoundPayload);
    }

    const recentLogs = (asset.maintenance_logs || []).slice(0, RECENT_LOGS);
    const last = recentLogs[0];

    const payload = {
      registered: true,
      uid,
      name: asset.item_name,
      status: asset.status,
      last_audit: last ? last.log_date : 'No maintenance',
      workspace_id: asset.workspace_id,
      workspace_name: asset.workspace?.name || 'Assigned Lab',
      workspace_code: asset.workspace?.code || '',
      asset: {
        id: asset.id,
        uid: asset.uid,
        item_name: asset.item_name,
        category: asset.category,
        department: asset.department,
        purchase_date: asset.purchase_date,
        cost: asset.cost,
        status: asset.status,
        image_url: asset.image_url,
      },
      maintenance: {
        total: (asset.maintenance_logs || []).length,
        recent: recentLogs,
      },
      // Pre-formatted for 128x64 SSD1306 OLED display
      display: {
        line1: fit(asset.item_name),
        line2: fit(asset.department),
        line3: fit(`Status: ${asset.status.replace('_', ' ')}`),
        line4: fit(last ? `Last: ${last.log_date} ${last.log_type}` : 'No maintenance yet'),
      },
      scanned_at: new Date().toISOString(),
    };

    // Broadcast to real-time connected dashboards
    eventBus.emit('scan', payload);

    res.json(payload);
  })
);

module.exports = router;
