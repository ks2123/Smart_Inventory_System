const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { ZodError } = require('zod');
const env = require('./config/env');
const eventBus = require('./services/eventBus');
const store = require('./services/store');
const { router: authRouter } = require('./routes/auth');
const { HttpError } = require('./utils/errors');

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-device-key'],
  })
);

app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50kb' }));

// Static directory for uploaded equipment images
const UPLOADS_DIR = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Rate limiting
app.use('/api', rateLimit({ windowMs: 60_000, limit: 1200, standardHeaders: true, legacyHeaders: false }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Project Memory Mirror Multi-Tenant API',
    time: new Date().toISOString(),
  });
});

// Real-time Server-Sent Events (SSE) for instant dashboard sync
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);

  const onScan = (data) => res.write(`data: ${JSON.stringify({ type: 'scan', data })}\n\n`);
  const onAssetCreated = (data) => res.write(`data: ${JSON.stringify({ type: 'asset_created', data })}\n\n`);
  const onAssetUpdated = (data) => res.write(`data: ${JSON.stringify({ type: 'asset_updated', data })}\n\n`);
  const onAssetDeleted = (data) => res.write(`data: ${JSON.stringify({ type: 'asset_deleted', data })}\n\n`);
  const onLogAdded = (data) => res.write(`data: ${JSON.stringify({ type: 'log_added', data })}\n\n`);
  const onStaffCreated = (data) => res.write(`data: ${JSON.stringify({ type: 'staff_created', data })}\n\n`);
  const onStaffDeleted = (data) => res.write(`data: ${JSON.stringify({ type: 'staff_deleted', data })}\n\n`);

  eventBus.on('scan', onScan);
  eventBus.on('asset_created', onAssetCreated);
  eventBus.on('asset_updated', onAssetUpdated);
  eventBus.on('asset_deleted', onAssetDeleted);
  eventBus.on('log_added', onLogAdded);
  eventBus.on('staff_created', onStaffCreated);
  eventBus.on('staff_deleted', onStaffDeleted);

  const heartbeat = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    eventBus.off('scan', onScan);
    eventBus.off('asset_created', onAssetCreated);
    eventBus.off('asset_updated', onAssetUpdated);
    eventBus.off('asset_deleted', onAssetDeleted);
    eventBus.off('log_added', onLogAdded);
    eventBus.off('staff_created', onStaffCreated);
    eventBus.off('staff_deleted', onStaffDeleted);
  });
});

// Mount SaaS Routes
app.use('/api/auth', authRouter);
app.use('/api/scan', rateLimit({ windowMs: 60_000, limit: 300 }), require('./routes/scan'));
app.use('/api/assets', require('./routes/assets'));

// Inspect Database Live View
app.get('/api/db', (req, res) => {
  res.json(store.getRawDatabaseSnapshot());
});

// Serve frontend static build in production with aggressive no-cache so updates apply immediately
const FRONTEND_DIST = path.join(__dirname, '../../frontend/dist');
app.use(express.static(FRONTEND_DIST, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  },
}));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexHtml = path.join(FRONTEND_DIST, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexHtml)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(indexHtml);
  }
  res.status(404).json({ error: 'Endpoint or static build not found' });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof multer.MulterError) {
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: err.message });
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, details: err.details });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
