// Project Memory Mirror - Multi-Tenant API Client

const API_BASE = '';
const DEVICE_KEY = 'esp32-memory-mirror-device-secret-key-9988';

export function getStoredToken() {
  return localStorage.getItem('mm_jwt_token') || '';
}

export function setStoredToken(token) {
  if (token) localStorage.setItem('mm_jwt_token', token);
  else localStorage.removeItem('mm_jwt_token');
}

export function getStoredUser() {
  const saved = localStorage.getItem('mm_user_data');
  return saved ? JSON.parse(saved) : null;
}

export function setStoredUser(user, workspace) {
  if (user) {
    localStorage.setItem('mm_user_data', JSON.stringify({ ...user, workspace }));
  } else {
    localStorage.removeItem('mm_user_data');
  }
}

function getAuthHeaders() {
  const token = getStoredToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// --- Multi-Tenant Auth APIs ---
export async function loginUser(identifier, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Authentication failed');
  setStoredToken(json.token);
  setStoredUser(json.user, json.workspace);
  return json;
}

export async function registerAdmin({ name, email, password, lab_name, lab_code }) {
  const res = await fetch(`${API_BASE}/api/auth/register-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, lab_name, lab_code }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Admin registration failed');
  setStoredToken(json.token);
  setStoredUser(json.user, json.workspace);
  return json;
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchDemoAccounts() {
  const res = await fetch(`${API_BASE}/api/auth/demo-accounts`);
  if (!res.ok) throw new Error('Failed to load demo accounts');
  return res.json();
}

// --- Staff Management (Admin Only) ---
export async function fetchStaffMembers() {
  const res = await fetch(`${API_BASE}/api/auth/staff`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch staff members');
  return json.data;
}

export async function createStaffAccount({ name, username, email, password, role }) {
  const res = await fetch(`${API_BASE}/api/auth/staff`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, password, role }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create staff account');
  return json;
}

export async function deleteStaffAccount(staffId) {
  const res = await fetch(`${API_BASE}/api/auth/staff/${staffId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error('Failed to revoke staff account');
  return true;
}

// --- Asset & Equipment APIs (Scoped to User's Lab) ---
export async function fetchStats() {
  const res = await fetch(`${API_BASE}/api/assets/stats/summary`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAssets({ q = '', category = '', status = '', page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (status) params.set('status', status);
  params.set('page', page);
  params.set('limit', limit);

  const res = await fetch(`${API_BASE}/api/assets?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) return { data: [], pagination: { total: 0 } };
    throw new Error('Failed to fetch assets');
  }
  return res.json();
}

export async function fetchAssetByUid(uid) {
  const res = await fetch(`${API_BASE}/api/assets/${uid}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function createAsset(formData) {
  const res = await fetch(`${API_BASE}/api/assets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Asset registration failed');
  return json.data;
}

export async function updateAsset(uid, formData) {
  const res = await fetch(`${API_BASE}/api/assets/${uid}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Update failed');
  return json.data;
}

export async function deleteAsset(uid) {
  const res = await fetch(`${API_BASE}/api/assets/${uid}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Deletion failed');
  }
  return true;
}

export async function addMaintenanceLog(uid, logData) {
  const res = await fetch(`${API_BASE}/api/assets/${uid}/logs`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to record maintenance note');
  return json.data;
}

// --- Hardware RFID Scanner Integration ---
export async function triggerScan(uid, deviceId = 'robotics-esp32-reader-1') {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-key': DEVICE_KEY,
    },
    body: JSON.stringify({ uid, device_id: deviceId }),
  });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

// --- Real-Time Server-Sent Events (SSE) ---
export function subscribeToEvents(onMessage) {
  let eventSource = null;
  let isClosed = false;

  function connect() {
    if (isClosed) return;
    eventSource = new EventSource(`${API_BASE}/api/events`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessage(payload);
      } catch (err) {
        console.warn('[SSE] parse error', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      if (!isClosed) {
        setTimeout(connect, 3000);
      }
    };
  }

  connect();

  return () => {
    isClosed = true;
    if (eventSource) eventSource.close();
  };
}
