# Project Memory Mirror
### Universal Physical Object Digital History & Asset Maintenance Tracker
*Powered by ESP32 Mini, RC522 13.56MHz RFID, SSD1306 OLED Display, and Dynamic Emergency QR Codes.*

---

## Architecture Overview

```
Smart_inventry_system/
├── frontend/                     # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── api/client.js         # REST client + Server-Sent Events (SSE) real-time bus
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Aero Minimal top nav with live status badge
│   │   │   ├── HeroSection.jsx   # Dark cinematic hero with glowing pink CTA
│   │   │   ├── HardwareCard.jsx  # Active RFID scan card + 128x64 OLED simulator
│   │   │   ├── RfidSimulator.jsx # RC522 RFID card tap simulator (click/type UID)
│   │   │   ├── AssetGrid.jsx     # Filterable equipment catalog & fleet status
│   │   │   ├── AssetCard.jsx     # Individual asset cards with status pills
│   │   │   ├── RegisterAssetModal.jsx # Drag-and-drop photo upload & UID binding
│   │   │   ├── AuditLogModal.jsx # Single-click maintenance audit logging form
│   │   │   ├── QrCodeModal.jsx   # Dynamic QR generator with "Download PNG Badge"
│   │   │   └── HardwareSpecsModal.jsx # ESP32 pinout schematic & API contract
│   │   ├── App.jsx               # Master console controller with live event sync
│   │   └── index.css             # Glassmorphism, OLED screens, cyber neon styling
│   └── dist/                     # Optimized production bundle
│
├── memory-mirror/                # Production Express.js + Supabase Backend
│   ├── src/
│   │   ├── app.js                # Express app, helmet, CORS, SSE /api/events, static serving
│   │   ├── server.js             # HTTP listener on port 3000
│   │   ├── config/               # env validation & Supabase client
│   │   ├── middleware/           # auth (device key + staff JWT), multer 5MB cap
│   │   ├── routes/               # scan.js (ESP32), assets.js (CRUD), logs.js
│   │   ├── services/             # hybrid store (Supabase + local engine), eventBus
│   │   ├── utils/                # UID normalisation, error handlers
│   │   └── validators.js         # Zod schemas
│   ├── firmware/
│   │   └── memory_mirror_esp32.ino # Arduino C++ sketch for ESP32 + RC522 + OLED
│   └── supabase/
│       └── schema.sql            # Postgres DDL, triggers, RLS, and storage bucket
└── DESIGN.md                     # Visual Design Guidelines & Aero Minimal tokens
```

---

## Design Language & Visual System

- **Background Palette**: Deep Navy / Obsidian Charcoal (`#070B14`, `#0B1120`, `#0F172A`)
- **Accent Lighting**: Glowing Cyan / Neon Blue (`#00F0FF`, `#38BDF8`, `#7DD3FC`)
- **Action CTAs**: Vibrant Pink / Neon Magenta (`#FF007F`, `#F43F5E`, `#EC4899`) with radiant glow
- **Display Simulation**: SSD1306 128×64 retro monochrome blue OLED screen texture
- **Typography**: `Space Grotesk` (headings, badges, technical labels) & `Plus Jakarta Sans` (body)

---

## Core Features Implemented

1. **Dark Cinematic Hero Section**:
   - High-impact display typography, real-time fleet metrics (Active Assets, Under Maintenance, Faulty, Total Scans).
   - Glowing Magenta **"LAUNCH CONSOLE"** action button.

2. **RC522 RFID Card Tap Simulator**:
   - Click preset industrial tags (Oscilloscope `04A32F1B`, 3D Printer `82B41C90`, PCB Printer `F0E1D2C3`, Soldering Station `1A2B3C4D`, CNC Mill `99AA88BB`) or enter any raw hex UID to immediately trigger hardware scans.

3. **Active Hardware Scanned Card & Live OLED Companion**:
   - Shows active RFID UID, equipment category, status badge, and physical photo preview.
   - Built-in **128×64 SSD1306 OLED Screen Preview** displaying the exact 4-line pre-formatted buffer sent to the microcontroller.

4. **Equipment Photo Upload Registration**:
   - Drag-and-drop physical photo upload supporting JPEG, PNG, and WebP (up to 5 MB).
   - Built-in "GENERATE UID" button for quick tag assignment.

5. **Dynamic Emergency QR Code**:
   - Generates high-density QR code for any tracked physical object.
   - **"DOWNLOAD PNG BADGE"** button renders a printable, high-resolution physical asset tag badge with asset name, UID, department, and QR code.

6. **Immutable Maintenance Audit Trail**:
   - Single-click form for technicians to log inspections, repairs, calibrations, cleaning, and parts replaced.
   - Updates asset status atomically in the same transaction.

7. **Real-Time Data Sync**:
   - Server-Sent Events (SSE) `/api/events` pushes hardware scans and audit log additions to all open browser consoles with zero latency.

---

## Quickstart

### 1. Start the Unified Server (Backend + Frontend)
```bash
cd memory-mirror
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The Express server serves both the REST API and the production-optimized React web console!

### 2. Standalone Frontend Development (Vite Hot-Reloading)
```bash
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)**. All API calls are automatically proxied to the backend on `:3000`.

---

## ESP32 Hardware & Wiring

| Peripheral | Module Pin | ESP32 Mini Pin | Protocol |
|---|---|---|---|
| **RC522 RFID** | SDA (SS) | **GPIO 5** | SPI CS |
| **RC522 RFID** | SCK | **GPIO 18** | VSPI Clock |
| **RC522 RFID** | MOSI | **GPIO 23** | VSPI MOSI |
| **RC522 RFID** | MISO | **GPIO 19** | VSPI MISO |
| **RC522 RFID** | RST | **GPIO 27** | Reset |
| **SSD1306 OLED** | SDA | **GPIO 21** | I2C Data (0x3C) |
| **SSD1306 OLED** | SCL | **GPIO 22** | I2C Clock |
| **Power** | VCC / GND | **3.3V / GND** | 3.3V Logic |

### Flashing Firmware:
1. Open `memory-mirror/firmware/memory_mirror_esp32.ino` in Arduino IDE.
2. Install libraries: `MFRC522`, `Adafruit SSD1306`, `Adafruit GFX`, `ArduinoJson` (v7).
3. Update `WIFI_SSID`, `WIFI_PASS`, `SCAN_URL` (`http://<YOUR_IP>:3000/api/scan`), and `DEVICE_KEY`.
4. Upload to ESP32 Mini.
