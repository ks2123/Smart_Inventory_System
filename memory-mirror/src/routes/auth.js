const router = require('express').Router();
const jwt = require('jsonwebtoken');
const store = require('../services/store');
const { HttpError, asyncHandler } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'memory-mirror-multi-tenant-jwt-secret-2026';

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      workspace_id: user.workspace_id,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware: Verify JWT and attach req.user
function requireAuth(req, res, next) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return next(new HttpError(401, 'Authentication credentials required'));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new HttpError(401, 'Invalid or expired session token'));
  }
}

// Middleware: Admin Only
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new HttpError(403, 'Administrative privileges required for this operation'));
  }
  next();
}

// ---- POST /api/auth/login --------------------------------------------------
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      throw new HttpError(400, 'Username/Email and password are required');
    }

    const auth = store.authenticate(identifier, password);
    if (!auth) {
      throw new HttpError(401, 'Invalid credentials. Please verify username/password.');
    }

    const token = signToken(auth.user);
    const { password: _, ...safeUser } = auth.user;

    res.json({
      token,
      user: safeUser,
      workspace: auth.workspace,
    });
  })
);

// ---- POST /api/auth/register-admin -----------------------------------------
router.post(
  '/register-admin',
  asyncHandler(async (req, res) => {
    const { name, email, password, lab_name, lab_code } = req.body || {};
    if (!name || !email || !password || !lab_name) {
      throw new HttpError(400, 'Name, email, password, and workspace/lab name are required');
    }

    const { workspace, adminUser } = store.createWorkspace(lab_name, lab_code, {
      name,
      email,
      password,
    });

    const token = signToken(adminUser);
    const { password: _, ...safeAdmin } = adminUser;

    res.status(201).json({
      token,
      user: safeAdmin,
      workspace,
    });
  })
);

// ---- GET /api/auth/me ------------------------------------------------------
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = store.getUserById(req.user.id);
    if (!user) throw new HttpError(404, 'User account not found');
    const workspace = store.getWorkspace(user.workspace_id);
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, workspace });
  })
);

// ---- POST /api/auth/staff (Admin creates staff accounts) --------------------
router.post(
  '/staff',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, username, email, password, role } = req.body || {};
    if (!name) throw new HttpError(400, 'Staff member name is required');

    try {
      const result = store.createStaff(
        req.user.workspace_id,
        { name, username, email, password, role },
        req.user.id
      );
      res.status(201).json({
        data: result.staff,
        temporaryPassword: result.temporaryPassword,
        message: 'Staff account generated successfully',
      });
    } catch (err) {
      throw new HttpError(409, err.message);
    }
  })
);

// ---- GET /api/auth/staff (Admin views staff in their lab) -------------------
router.get(
  '/staff',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const staffMembers = store.getStaffMembers(req.user.workspace_id);
    res.json({ data: staffMembers });
  })
);

// ---- DELETE /api/auth/staff/:id (Admin removes staff) ----------------------
router.delete(
  '/staff/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const ok = store.deleteStaff(req.user.workspace_id, req.params.id);
    if (!ok) throw new HttpError(404, 'Staff account not found or cannot be deleted');
    res.status(204).end();
  })
);

// ---- GET /api/auth/demo-accounts -------------------------------------------
router.get('/demo-accounts', (req, res) => {
  res.json({
    admin: [
      {
        label: 'Dr. Alex Reynolds (Admin @ Main Robotics Lab)',
        identifier: 'admin@robotics.mirror',
        password: 'password123',
        lab: 'Main Robotics & Mechatronics Lab',
        role: 'admin',
      },
      {
        label: 'Dr. Sarah Lin (Admin @ Nanofabrication Lab)',
        identifier: 'admin@nanofab.mirror',
        password: 'password123',
        lab: 'Advanced Micro & Nanofabrication Facility',
        role: 'admin',
      },
    ],
    staff: [
      {
        label: 'Marcus Chen (Staff @ Robotics Lab)',
        identifier: 'staff_marcus',
        password: 'password123',
        lab: 'Main Robotics & Mechatronics Lab',
        role: 'staff',
      },
      {
        label: 'Elena Rostova (Staff @ Robotics Lab)',
        identifier: 'staff_elena',
        password: 'password123',
        lab: 'Main Robotics & Mechatronics Lab',
        role: 'staff',
      },
      {
        label: 'Kenji Tanaka (Staff @ Nanofab Lab)',
        identifier: 'staff_tanaka',
        password: 'password123',
        lab: 'Advanced Micro & Nanofabrication Facility',
        role: 'staff',
      },
    ],
  });
});

module.exports = { router, requireAuth, requireAdmin };
