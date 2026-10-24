const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const eventBus = require('./eventBus');

// Directory for local image uploads
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Persistent JSON file database storage
const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial Workspaces (Labs)
const INITIAL_WORKSPACES = [
  {
    id: 'lab-robotics-01',
    name: 'Main Robotics & Mechatronics Lab',
    slug: 'robotics-lab',
    code: 'ROBOTICS-LAB',
    admin_id: 'admin-01',
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    id: 'lab-nanofab-02',
    name: 'Advanced Micro & Nanofabrication Facility',
    slug: 'nanofab-lab',
    code: 'NANOFAB-LAB',
    admin_id: 'admin-02',
    created_at: '2024-02-15T09:00:00Z',
  },
];

// Initial Users (Admins & Staff)
const INITIAL_USERS = [
  {
    id: 'admin-01',
    workspace_id: 'lab-robotics-01',
    name: 'Dr. Alex Reynolds',
    email: 'admin@robotics.mirror',
    username: 'admin_robotics',
    password: 'password123',
    role: 'admin',
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    id: 'staff-01',
    workspace_id: 'lab-robotics-01',
    name: 'Marcus Chen',
    email: 'marcus@robotics.mirror',
    username: 'staff_marcus',
    password: 'password123',
    role: 'staff',
    created_by: 'admin-01',
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'staff-02',
    workspace_id: 'lab-robotics-01',
    name: 'Elena Rostova',
    email: 'elena@robotics.mirror',
    username: 'staff_elena',
    password: 'password123',
    role: 'staff',
    created_by: 'admin-01',
    created_at: '2024-04-12T11:30:00Z',
  },
  {
    id: 'admin-02',
    workspace_id: 'lab-nanofab-02',
    name: 'Dr. Sarah Lin',
    email: 'admin@nanofab.mirror',
    username: 'admin_nanofab',
    password: 'password123',
    role: 'admin',
    created_at: '2024-02-15T09:00:00Z',
  },
  {
    id: 'staff-03',
    workspace_id: 'lab-nanofab-02',
    name: 'Kenji Tanaka',
    email: 'tanaka@nanofab.mirror',
    username: 'staff_tanaka',
    password: 'password123',
    role: 'staff',
    created_by: 'admin-02',
    created_at: '2024-05-20T14:00:00Z',
  },
];

// Initial Equipment Assets (Strictly Modern Universal Asset & Equipment Maintenance System)
const INITIAL_ASSETS = [
  // --- Robotics Lab (lab-robotics-01) ---
  {
    id: 'asset-rob-01',
    workspace_id: 'lab-robotics-01',
    uid: '04A32F1B',
    item_name: 'Tektronix 4-Channel Digital Storage Oscilloscope',
    category: 'Test & Measurement',
    department: 'Electronics Testing Bay 2',
    purchase_date: '2024-03-15',
    cost: 2850.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/04A32F1B.jpg',
    created_at: '2024-03-15T09:00:00Z',
    updated_at: '2026-10-15T14:22:00Z',
  },
  {
    id: 'asset-rob-02',
    workspace_id: 'lab-robotics-01',
    uid: '82B41C90',
    item_name: 'Bantam Tools Desktop Precision CNC Router',
    category: 'Machining & CNC',
    department: 'Rapid Machining Cell',
    purchase_date: '2023-11-20',
    cost: 6400.0,
    status: 'under_maintenance',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/82B41C90.jpg',
    created_at: '2023-11-20T11:30:00Z',
    updated_at: '2026-10-19T08:15:00Z',
  },
  {
    id: 'asset-rob-03',
    workspace_id: 'lab-robotics-01',
    uid: 'F0E1D2C3',
    item_name: 'Main Lab Storage Cupboard #4 (Lockable Tools & Safety Gear)',
    category: 'Storage & Tooling',
    department: 'Central Storage Zone',
    purchase_date: '2023-08-10',
    cost: 1200.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/F0E1D2C3.jpg',
    created_at: '2023-08-10T10:15:00Z',
    updated_at: '2026-09-28T16:45:00Z',
  },
  {
    id: 'asset-rob-04',
    workspace_id: 'lab-robotics-01',
    uid: '1A2B3C4D',
    item_name: 'Formlabs Form 4 Stereolithography 3D Printer',
    category: 'Additive Manufacturing',
    department: 'Polymer Prototyping Bay',
    purchase_date: '2024-05-12',
    cost: 4500.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1581092217951-a96860dbd637?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/1A2B3C4D.jpg',
    created_at: '2024-05-12T13:00:00Z',
    updated_at: '2026-10-10T11:00:00Z',
  },
  {
    id: 'asset-rob-05',
    workspace_id: 'lab-robotics-01',
    uid: '99AA88BB',
    item_name: 'KUKA KR 6 Six-Axis Articulated Robotic Arm',
    category: 'Robotics & Actuators',
    department: 'Robotics Workcell A',
    purchase_date: '2023-04-05',
    cost: 18500.0,
    status: 'faulty',
    image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/99AA88BB.jpg',
    created_at: '2023-04-05T15:45:00Z',
    updated_at: '2026-10-18T10:20:00Z',
  },
  {
    id: 'asset-rob-06',
    workspace_id: 'lab-robotics-01',
    uid: '55EE44FF',
    item_name: 'Weller WXsmart Digital Rework & Soldering Station',
    category: 'Assembly & Rework',
    department: 'SMT Assembly Bench 1',
    purchase_date: '2024-01-18',
    cost: 1100.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/55EE44FF.jpg',
    created_at: '2024-01-18T08:00:00Z',
    updated_at: '2026-09-12T09:30:00Z',
  },

  // --- Nanofab Lab (lab-nanofab-02) ---
  {
    id: 'asset-nano-01',
    workspace_id: 'lab-nanofab-02',
    uid: 'AA11BB22',
    item_name: 'Rigol RSA5065-TG 6.5GHz Real-Time Spectrum Analyzer',
    category: 'Test & Measurement',
    department: 'Cleanroom RF Suite',
    purchase_date: '2024-06-01',
    cost: 7800.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/AA11BB22.jpg',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2026-10-01T11:00:00Z',
  },
  {
    id: 'asset-nano-02',
    workspace_id: 'lab-nanofab-02',
    uid: 'CC33DD44',
    item_name: 'Main Lab Chemical Flammables Storage Cupboard #1',
    category: 'Storage & Tooling',
    department: 'Wet Chemical Bay',
    purchase_date: '2023-09-15',
    cost: 1800.0,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    image_path: 'local/CC33DD44.jpg',
    created_at: '2023-09-15T09:30:00Z',
    updated_at: '2026-09-20T14:00:00Z',
  },
];

// Initial Maintenance Audit Logs
const INITIAL_LOGS = [
  {
    id: 'log-001',
    workspace_id: 'lab-robotics-01',
    asset_uid: '04A32F1B',
    assistant_name: 'Marcus Chen',
    staff_id: 'staff-01',
    log_date: '2026-10-15',
    log_type: 'calibration',
    description: 'Quarterly NIST traceability check on Channel 1 and 2 probes. Offset verified within 0.08% limit.',
    parts_replaced: ['NIST Traceability Sticker', 'Probe Ground Lead'],
    created_at: '2026-10-15T14:22:00Z',
  },
  {
    id: 'log-002',
    workspace_id: 'lab-robotics-01',
    asset_uid: '82B41C90',
    assistant_name: 'Elena Rostova',
    staff_id: 'staff-02',
    log_date: '2026-10-19',
    log_type: 'repair',
    description: 'Spindle motor drive belt slipped under 24k RPM aluminum feed. Dismantled spindle cover, inspected bearings, awaiting OEM belt.',
    parts_replaced: ['Spindle Drive Belt (Ordered)'],
    created_at: '2026-10-19T08:15:00Z',
  },
  {
    id: 'log-003',
    workspace_id: 'lab-robotics-01',
    asset_uid: 'F0E1D2C3',
    assistant_name: 'Dr. Alex Reynolds',
    staff_id: 'admin-01',
    log_date: '2026-09-28',
    log_type: 'inspection',
    description: 'Quarterly audit of lockable storage cupboard contents. Verified all high-voltage insulated gloves and face shields intact.',
    parts_replaced: [],
    created_at: '2026-09-28T16:45:00Z',
  },
  {
    id: 'log-004',
    workspace_id: 'lab-robotics-01',
    asset_uid: '1A2B3C4D',
    assistant_name: 'Marcus Chen',
    staff_id: 'staff-01',
    log_date: '2026-10-10',
    log_type: 'cleaning',
    description: 'Optical optical resin window wiped with isopropyl alcohol. Galvo mirrors checked for micro-dust contamination.',
    parts_replaced: ['Resin Tank Wiper'],
    created_at: '2026-10-10T11:00:00Z',
  },
  {
    id: 'log-005',
    workspace_id: 'lab-robotics-01',
    asset_uid: '99AA88BB',
    assistant_name: 'Elena Rostova',
    staff_id: 'staff-02',
    log_date: '2026-10-18',
    log_type: 'repair',
    description: 'Joint 3 positional encoder error flag during automated pick-and-place sequence. Flagged as faulty for OEM service inspection.',
    parts_replaced: [],
    created_at: '2026-10-18T10:20:00Z',
  },
];

class MultiTenantStore {
  constructor() {
    this.workspaces = new Map();
    this.users = new Map();
    this.assets = new Map();
    this.logs = [];
    this.scans = [];
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (data.workspaces && Array.isArray(data.workspaces)) {
          this.workspaces = new Map(data.workspaces.map((w) => [w.id, w]));
          this.users = new Map(data.users.map((u) => [u.id, u]));
          this.assets = new Map(data.assets.map((a) => [a.uid, a]));
          this.logs = data.logs || [];
          this.scans = data.scans || [];
          console.log(`[Store] Loaded persistent database from ${DB_FILE}: ${this.users.size} users, ${this.assets.size} assets`);
          return;
        }
      }
    } catch (err) {
      console.warn('[Store] Could not load database.json, seeding defaults:', err.message);
    }

    // Default Seed
    this.workspaces = new Map(INITIAL_WORKSPACES.map((w) => [w.id, { ...w }]));
    this.users = new Map(INITIAL_USERS.map((u) => [u.id, { ...u }]));
    this.assets = new Map(INITIAL_ASSETS.map((a) => [a.uid, { ...a }]));
    this.logs = [...INITIAL_LOGS];
    this.scans = [];
    this.saveToDisk();
    console.log(`[Store] Initialized and saved default database to ${DB_FILE}`);
  }

  saveToDisk() {
    try {
      const data = {
        updated_at: new Date().toISOString(),
        workspaces: Array.from(this.workspaces.values()),
        users: Array.from(this.users.values()),
        assets: Array.from(this.assets.values()),
        logs: this.logs,
        scans: this.scans.slice(0, 50),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Store] Failed to save database to disk:', err.message);
    }
  }

  // --- Workspaces ---
  getWorkspace(id) {
    return this.workspaces.get(id) || null;
  }

  getWorkspaceByCode(code) {
    return Array.from(this.workspaces.values()).find(
      (w) => w.code.toUpperCase() === code.toUpperCase() || w.id === code
    );
  }

  createWorkspace(name, code, adminData) {
    const wsId = `lab-${Date.now().toString(36)}`;
    const workspace = {
      id: wsId,
      name,
      code: (code || name.replace(/[^A-Za-z0-9]/g, '-')).toUpperCase(),
      admin_id: null,
      created_at: new Date().toISOString(),
    };
    this.workspaces.set(wsId, workspace);

    const adminId = `admin-${Date.now().toString(36)}`;
    const adminUser = {
      id: adminId,
      workspace_id: wsId,
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      username: adminData.username || adminData.email.split('@')[0],
      password: adminData.password || 'password123',
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    workspace.admin_id = adminId;
    this.users.set(adminId, adminUser);

    this.saveToDisk();
    return { workspace, adminUser };
  }

  // --- Users & Auth ---
  // Authenticate by Email OR Username OR Full Name (case-insensitive & trimmed)
  authenticate(identifier, password) {
    if (!identifier || !password) return null;
    const idLower = String(identifier).toLowerCase().trim();
    const passTrim = String(password).trim();

    const user = Array.from(this.users.values()).find((u) => {
      const emailMatch = (u.email || '').toLowerCase().trim() === idLower;
      const userMatch = (u.username || '').toLowerCase().trim() === idLower;
      const nameMatch = (u.name || '').toLowerCase().trim() === idLower;
      const passMatch = (u.password || '').trim() === passTrim;
      return (emailMatch || userMatch || nameMatch) && passMatch;
    });

    if (!user) return null;
    const workspace = this.workspaces.get(user.workspace_id) || null;
    return { user, workspace };
  }

  getUserById(id) {
    return this.users.get(id) || null;
  }

  // Staff management for an Admin's Workspace
  createStaff(workspaceId, { name, username, email, password, role = 'staff' }, adminId) {
    const cleanUsername = username
      ? username.trim().toLowerCase().replace(/[\s]/g, '_')
      : `staff_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(10 + Math.random() * 90)}`;

    // Verify username uniqueness
    const exists = Array.from(this.users.values()).some((u) => u.username === cleanUsername);
    if (exists) {
      throw new Error(`Username '${cleanUsername}' already exists. Please choose another.`);
    }

    const tempPassword = (password || `TempPass!${Math.floor(1000 + Math.random() * 9000)}`).trim();
    const staffId = `staff-${Date.now().toString(36)}`;
    const newStaff = {
      id: staffId,
      workspace_id: workspaceId,
      name: name.trim(),
      email: (email || `${cleanUsername}@lab.mirror`).toLowerCase().trim(),
      username: cleanUsername,
      password: tempPassword,
      role: 'staff',
      created_by: adminId,
      created_at: new Date().toISOString(),
    };

    this.users.set(staffId, newStaff);
    this.saveToDisk();
    eventBus.emit('staff_created', { workspaceId, staff: newStaff });
    return { staff: newStaff, temporaryPassword: tempPassword };
  }

  getStaffMembers(workspaceId) {
    return Array.from(this.users.values())
      .filter((u) => u.workspace_id === workspaceId && u.role === 'staff')
      .map(({ password, ...safe }) => safe);
  }

  deleteStaff(workspaceId, staffId) {
    const user = this.users.get(staffId);
    if (!user || user.workspace_id !== workspaceId || user.role === 'admin') return false;
    this.users.delete(staffId);
    this.saveToDisk();
    eventBus.emit('staff_deleted', { workspaceId, staffId });
    return true;
  }

  // --- Assets Scoped to Workspace ---
  async getAssets(workspaceId, { q, category, department, status, page = 1, limit = 50 } = {}) {
    let items = Array.from(this.assets.values()).filter((a) => a.workspace_id === workspaceId);

    if (category) items = items.filter((a) => a.category === category);
    if (department) items = items.filter((a) => a.department === department);
    if (status) items = items.filter((a) => a.status === status);
    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (a) =>
          a.item_name.toLowerCase().includes(query) ||
          a.uid.toLowerCase().includes(query) ||
          a.department.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    const total = items.length;
    const from = (page - 1) * limit;
    return { data: items.slice(from, from + limit), total };
  }

  async getAssetByUid(workspaceId, uid) {
    const asset = this.assets.get(uid);
    if (!asset) return null;
    if (workspaceId && asset.workspace_id !== workspaceId) return null;

    const assetLogs = this.logs
      .filter((l) => l.asset_uid === uid)
      .sort((a, b) => new Date(b.log_date) - new Date(a.log_date) || new Date(b.created_at) - new Date(a.created_at));

    return { ...asset, maintenance_logs: assetLogs };
  }

  // Global UID lookup for hardware scanner (resolves which lab owns the tag)
  async getAssetGlobal(uid) {
    const asset = this.assets.get(uid);
    if (!asset) return null;
    const workspace = this.workspaces.get(asset.workspace_id);
    const assetLogs = this.logs
      .filter((l) => l.asset_uid === uid)
      .sort((a, b) => new Date(b.log_date) - new Date(a.log_date) || new Date(b.created_at) - new Date(a.created_at));

    return { ...asset, workspace, maintenance_logs: assetLogs };
  }

  async createAsset(workspaceId, assetData, file) {
    if (this.assets.has(assetData.uid)) {
      const err = new Error(`An asset with RFID UID [${assetData.uid}] is already registered.`);
      err.code = '23505';
      throw err;
    }

    let image_url = null;
    let image_path = null;

    if (file) {
      const ext = file.mimetype?.split('/')[1] || 'jpg';
      const filename = `${assetData.uid}-${Date.now()}.${ext}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filepath, file.buffer);
      image_url = `/uploads/${filename}`;
      image_path = filename;
    }

    const now = new Date().toISOString();
    const newAsset = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      uid: assetData.uid,
      item_name: assetData.item_name,
      category: assetData.category || 'General Equipment',
      department: assetData.department || 'Main Lab',
      purchase_date: assetData.purchase_date || null,
      cost: assetData.cost != null ? Number(assetData.cost) : null,
      status: assetData.status || 'active',
      image_url,
      image_path,
      created_at: now,
      updated_at: now,
    };

    this.assets.set(newAsset.uid, newAsset);
    this.saveToDisk();
    eventBus.emit('asset_created', { workspaceId, asset: newAsset });
    return newAsset;
  }

  async updateAsset(workspaceId, uid, patch, file) {
    const existing = this.assets.get(uid);
    if (!existing || existing.workspace_id !== workspaceId) return null;

    let image_url = existing.image_url;
    let image_path = existing.image_path;

    if (file) {
      const ext = file.mimetype?.split('/')[1] || 'jpg';
      const filename = `${uid}-${Date.now()}.${ext}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filepath, file.buffer);
      image_url = `/uploads/${filename}`;
      image_path = filename;
    }

    const updated = {
      ...existing,
      ...patch,
      image_url,
      image_path,
      updated_at: new Date().toISOString(),
    };

    this.assets.set(uid, updated);
    this.saveToDisk();
    eventBus.emit('asset_updated', { workspaceId, asset: updated });
    return updated;
  }

  async deleteAsset(workspaceId, uid) {
    const existing = this.assets.get(uid);
    if (!existing || existing.workspace_id !== workspaceId) return false;

    this.assets.delete(uid);
    this.logs = this.logs.filter((l) => l.asset_uid !== uid);
    this.saveToDisk();
    eventBus.emit('asset_deleted', { workspaceId, uid });
    return true;
  }

  // --- Maintenance Logs ---
  async addLog(workspaceId, { uid, assistant_name, staff_id, description, log_date, parts_replaced = [], log_type = 'inspection', status_after }) {
    const asset = this.assets.get(uid);
    if (!asset || asset.workspace_id !== workspaceId) {
      const err = new Error('Asset not found in your assigned workspace.');
      err.code = 'P0002';
      throw err;
    }

    const newLog = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      asset_uid: uid,
      staff_id: staff_id || null,
      assistant_name: assistant_name || 'Staff Assistant',
      description,
      log_date: log_date || new Date().toISOString().slice(0, 10),
      log_type,
      parts_replaced: Array.isArray(parts_replaced) ? parts_replaced : [],
      created_at: new Date().toISOString(),
    };

    this.logs.unshift(newLog);

    if (status_after) {
      asset.status = status_after;
      asset.updated_at = new Date().toISOString();
      this.assets.set(uid, asset);
    }

    this.saveToDisk();
    eventBus.emit('log_added', { workspaceId, uid, log: newLog, asset });
    return newLog;
  }

  // --- Scans & Stats ---
  async recordScan(uid, device_id, found) {
    const scan = {
      id: this.scans.length + 1,
      uid,
      device_id: device_id || 'manual-scan',
      found,
      scanned_at: new Date().toISOString(),
    };
    this.scans.unshift(scan);
    this.saveToDisk();
    eventBus.emit('scan_recorded', scan);
    return scan;
  }

  async getStats(workspaceId) {
    const all = Array.from(this.assets.values()).filter((a) => a.workspace_id === workspaceId);
    const active = all.filter((a) => a.status === 'active').length;
    const maintenance = all.filter((a) => a.status === 'under_maintenance').length;
    const faulty = all.filter((a) => a.status === 'faulty').length;
    const retired = all.filter((a) => a.status === 'retired').length;
    const labLogs = this.logs.filter((l) => l.workspace_id === workspaceId);
    const labStaff = Array.from(this.users.values()).filter((u) => u.workspace_id === workspaceId && u.role === 'staff');
    const totalCost = all.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

    return {
      total_assets: all.length,
      active,
      under_maintenance: maintenance,
      faulty,
      retired,
      total_logs: labLogs.length,
      total_staff: labStaff.length,
      inventory_value: totalCost,
      recent_scans: this.scans.slice(0, 10),
    };
  }

  getRawDatabaseSnapshot() {
    return {
      status: 'active',
      timestamp: new Date().toISOString(),
      counts: {
        total_workspaces: this.workspaces.size,
        total_users: this.users.size,
        total_assets: this.assets.size,
        total_maintenance_logs: this.logs.length,
        total_scans_recorded: this.scans.length,
      },
      workspaces: Array.from(this.workspaces.values()),
      users: Array.from(this.users.values()).map(({ password, ...u }) => ({ ...u, password_sample: 'password123' })),
      assets: Array.from(this.assets.values()),
      maintenance_logs: this.logs,
      recent_scans: this.scans.slice(0, 20),
    };
  }
}

const store = new MultiTenantStore();
module.exports = store;
