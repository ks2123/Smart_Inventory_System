# Project Memory Mirror - Backend

Universal Asset & Equipment Maintenance System. Tap an RFID tag on an ESP32 reader and instantly see the item's details, photo URL and maintenance history.

**Stack:** Node.js 18+ / Express · Supabase Postgres + Storage · zod validation

```
src/
  app.js, server.js        Express setup, error handling, rate limits
  config/                  env validation, Supabase client
  middleware/              auth (device key + staff JWT), multer upload
  routes/                  assets.js (CRUD + image), logs.js, scan.js (ESP32)
  services/storage.js      image upload/delete + magic-byte verification
  utils/                   uid normalisation, HttpError, DB error mapping
  validators.js            zod schemas
supabase/schema.sql        tables, constraints, triggers, RLS, storage bucket
firmware/*.ino             ESP32 + RC522 + OLED sample sketch
```

## Setup

1. Create a Supabase project. Paste `supabase/schema.sql` into **SQL Editor** and run it (creates tables, RLS, the `asset-images` bucket).
2. `cp .env.example .env` and fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DEVICE_API_KEY` (and `ADMIN_API_KEY` for curl testing).
3. `npm install && npm run dev`
4. Flash `firmware/memory_mirror_esp32.ino` after setting WiFi, `SCAN_URL`, and the same `DEVICE_API_KEY`.

## Authentication

| Caller | Header | Used for |
|---|---|---|
| ESP32 | `x-device-key: <DEVICE_API_KEY>` | `POST /api/scan` only |
| Dashboard | `Authorization: Bearer <Supabase access token>` | everything under `/api/assets` |
| Scripts/testing | `x-api-key: <ADMIN_API_KEY>` (optional) | everything under `/api/assets` |

The device key can only call `/api/scan` (read-only), so a stolen reader can't modify data.

## API

Errors are always `{ "error": "message", "details": [...]? }` with 400 (validation), 401, 404, 409 (duplicate UID), 413/415 (bad image), 429 (rate limit).

### `GET /api/health`
`{ "status": "ok", "time": "..." }`

### `POST /api/scan`  (ESP32)
```json
{ "uid": "04:A3:2F:1B", "device_id": "lab-reader-1" }
```
UID may contain `:`/`-`/spaces and any case; it is normalised to `04A32F1B`.

**200** - registered tag
```json
{
  "registered": true,
  "uid": "04A32F1B",
  "asset": {
    "id": "…", "item_name": "Digital Oscilloscope", "category": "Test Equipment",
    "department": "Electronics Lab", "purchase_date": "2024-03-15", "cost": 45000,
    "status": "active", "image_url": "https://…/asset-images/04A32F1B/….jpg"
  },
  "maintenance": {
    "total": 7,
    "recent": [{ "id": "…", "log_date": "2026-09-30", "log_type": "repair",
                 "assistant_name": "R. Patil", "description": "Replaced probe cable",
                 "parts_replaced": ["Probe cable"] }]
  },
  "display": { "line1": "Digital Oscilloscope", "line2": "Electronics Lab",
               "line3": "Status: active", "line4": "Last: 2026-09-30 repair" },
  "scanned_at": "2026-10-21T10:00:00.000Z"
}
```
**404** - tag not registered: `{ "registered": false, "uid": "…", "display": {…} }`

`display` is pre-truncated to 21 chars per line for a 128×64 SSD1306. `recent` holds the latest 5 logs; use the assets endpoint for the full history.

### `POST /api/assets`  (register; `multipart/form-data`)
| Field | Type | Required |
|---|---|---|
| `uid` | string (8-20 hex) | yes |
| `item_name`, `category`, `department` | string | yes |
| `purchase_date` | `YYYY-MM-DD` | no |
| `cost` | number ≥ 0 | no |
| `status` | `active` \| `under_maintenance` \| `faulty` \| `retired` (default `active`) | no |
| `image` | file: JPEG/PNG/WebP, ≤ 5 MB | **yes** (set `REQUIRE_IMAGE=false` to relax) |

```bash
curl -X POST http://localhost:3000/api/assets \
  -H "x-api-key: $ADMIN_API_KEY" \
  -F uid=04:A3:2F:1B -F item_name="Digital Oscilloscope" -F category="Test Equipment" \
  -F department="Electronics Lab" -F purchase_date=2024-03-15 -F cost=45000 \
  -F image=@./scope.jpg
```
**201** `{ "data": { …asset incl. image_url } }` · **409** UID already registered.
The image is stored at `asset-images/<UID>/<timestamp>.<ext>`; if the DB insert fails the upload is rolled back.

### `GET /api/assets`
Query: `q` (name/UID search), `category`, `department`, `status`, `page` (1), `limit` (25, max 100).
→ `{ "data": [...], "pagination": { "page", "limit", "total" } }`

### `GET /api/assets/:uid`
Asset plus **all** logs (`maintenance_logs`, newest first). 404 if unknown.

### `PATCH /api/assets/:uid`  (`multipart/form-data`, all fields optional)
Update any registration field; send a new `image` to replace the photo (the old file is deleted).

### `DELETE /api/assets/:uid`
Deletes the asset, cascades its logs, removes its photo. **204**.

### `POST /api/assets/:uid/logs`  (append maintenance note)
```json
{
  "assistant_name": "R. Patil",
  "log_date": "2026-10-21",
  "log_type": "repair",
  "description": "Probe cable intermittent; replaced and recalibrated.",
  "parts_replaced": ["Probe cable", "BNC connector"],
  "status_after": "active"
}
```
Required: `assistant_name`, `description` (≥3 chars). Defaults: `log_date` = today, `log_type` = `inspection`, `parts_replaced` = `[]` (a comma-separated string also works). `log_type`: `inspection | repair | calibration | cleaning | part_replacement | other`.
`status_after` (optional) updates the asset status atomically with the insert (e.g. set `under_maintenance` when opening a repair).
**201** `{ "data": { …log } }` · **404** unknown asset.

### `GET /api/assets/:uid/logs`
Paginated history (`page`, `limit`), newest first.

## Database rules summary

- `assets.uid` is **unique** and constrained to upper-case hex, so one tag = one asset.
- `maintenance_logs.asset_uid` is a foreign key (`on delete cascade`, `on update cascade`) - logs can never be orphaned.
- Logs are **immutable**: a trigger rejects `UPDATE`, giving you a real audit trail.
- **RLS is on for every table.** Only authenticated users get `SELECT`; there are no write policies, so all writes go through this backend using the service-role key.
- Storage bucket `asset-images`: public read, 5 MB cap, JPEG/PNG/WebP only; writes only via the backend.

## Production checklist

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only; never put it in the dashboard or firmware.
- Set `CORS_ORIGINS` to your dashboard's exact origin(s).
- On the ESP32, replace `client.setInsecure()` with `client.setCACert(...)`.
- Deploy on Render/Railway/Fly (set env vars, start command `npm start`). Free tiers sleep, so ping `/api/health` to avoid slow first scans.
- Optional hardening: per-reader device keys (a `devices` table), image resizing with `sharp` for faster thumbnails.
