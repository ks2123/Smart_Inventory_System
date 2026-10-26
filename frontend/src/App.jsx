import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AeroLandingPage from './components/AeroLandingPage';
import HardwareCard from './components/HardwareCard';
import AssetGrid from './components/AssetGrid';
import RegisterAssetModal from './components/RegisterAssetModal';
import AuditLogModal from './components/AuditLogModal';
import QrCodeModal from './components/QrCodeModal';
import AssetDetailsModal from './components/AssetDetailsModal';
import HardwareSpecsModal from './components/HardwareSpecsModal';
import AuthModal from './components/AuthModal';
import StaffManagementModal from './components/StaffManagementModal';
import ScanResultModal from './components/ScanResultModal';
import {
  fetchAssets,
  fetchStats,
  triggerScan,
  deleteAsset,
  subscribeToEvents,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from './api/client';
import confetti from 'canvas-confetti';
import { Cpu, Radio, ShieldCheck, Terminal, Users, Building2, UserCheck, AlertCircle, Wrench } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mm_theme') : null;
    return saved ? saved === 'dark' : true;
  });

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mm_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Navigation tab: 'HOME' | 'SCANNER' | 'INVENTORY'
  const [activeTab, setActiveTab] = useState('HOME');

  // Authenticated User & Tenant Workspace
  const [user, setUser] = useState(() => {
    const data = getStoredUser();
    return data ? { id: data.id, name: data.name, email: data.email, username: data.username, role: data.role } : null;
  });

  const [workspace, setWorkspace] = useState(() => {
    const data = getStoredUser();
    return data?.workspace || { id: 'lab-robotics-01', name: 'Main Robotics & Mechatronics Lab', code: 'ROBOTICS-LAB' };
  });

  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('staff');
  const [staffManagementOpen, setStaffManagementOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [initialUidForRegister, setInitialUidForRegister] = useState('');
  const [lastDetectedUid, setLastDetectedUid] = useState('');
  const [auditAsset, setAuditAsset] = useState(null);
  const [qrAsset, setQrAsset] = useState(null);
  const [detailsUid, setDetailsUid] = useState(null);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Dynamically compute real valuation from actual assets or stats (never hardcode 28,50,000!)
  const totalValuation = React.useMemo(() => {
    if (stats?.inventory_value !== undefined && stats?.inventory_value !== null) {
      return Number(stats.inventory_value);
    }
    return assets.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
  }, [stats, assets]);

  // Sync theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleAuthSuccess = (authenticatedUser, userWorkspace) => {
    setUser(authenticatedUser);
    if (userWorkspace) setWorkspace(userWorkspace);
    setAuthOpen(false);
    setActiveTab('INVENTORY');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00F0FF', '#FF007F', '#38BDF8'],
    });
  };

  const handleLogout = () => {
    setUser(null);
    setWorkspace(null);
    setAssets([]);
    setStats(null);
    setScannedData(null);
    setStoredToken('');
    setStoredUser(null, null);
    setActiveTab('HOME');
  };

  const requireAuth = (callback, requiredRole = 'staff') => {
    if (!user) {
      setAuthInitialRole(requiredRole);
      setAuthOpen(true);
      return;
    }
    if (requiredRole === 'admin' && user.role !== 'admin') {
      alert('This operation requires Lab Administrator privileges.');
      return;
    }
    callback();
  };

  // Load assets and stats scoped to workspace
  const loadData = async () => {
    try {
      const [assetsRes, statsRes] = await Promise.all([
        fetchAssets({ q: searchQuery }),
        fetchStats(),
      ]);
      setAssets(assetsRes.data || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, workspace, searchQuery]);

  // Open Register modal and autofill the detected RFID
  const openRegisterModal = (uidOverride) => {
    requireAuth(() => {
      const targetUid = uidOverride || lastDetectedUid || (scannedData?.uid || '');
      setInitialUidForRegister(targetUid);
      setRegisterOpen(true);
    });
  };

  // Subscribe to real-time events via Server-Sent Events (SSE)
  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'scan') {
        setScannedData(event.data);
        if (event.data?.uid) {
          setLastDetectedUid(event.data.uid);
          setInitialUidForRegister(event.data.uid);
        }
        setIsScanModalOpen(true);
        fetchStats().then(setStats).catch(() => {});
      } else if (['asset_created', 'asset_updated', 'asset_deleted', 'log_added', 'staff_created', 'staff_deleted'].includes(event.type)) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Trigger RFID Hardware Scan
  const handleScan = async (uid, deviceId = 'robotics-esp32-reader-1') => {
    try {
      setScanning(true);
      const res = await triggerScan(uid, deviceId);
      setScannedData(res.data);
      if (res.data?.uid) {
        setLastDetectedUid(res.data.uid);
        setInitialUidForRegister(res.data.uid);
      }
      setIsScanModalOpen(true);
      fetchStats().then(setStats).catch(() => {});
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setScanning(false);
    }
  };

  // Asset creation callback
  const handleAssetCreated = (newAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
    fetchStats().then(setStats).catch(() => {});
    handleScan(newAsset.uid);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#FF007F', '#38BDF8'],
    });
  };

  // Maintenance Log Callback
  const handleMaintenanceLogged = (newLog, statusAfter) => {
    loadData();
    if (scannedData?.asset && scannedData.asset.uid === newLog.asset_uid) {
      handleScan(scannedData.asset.uid);
    }
  };

  // Delete Asset (Admin Only)
  const handleDeleteAsset = async (uid) => {
    requireAuth(async () => {
      if (!window.confirm(`Are you sure you want to delete asset [${uid}] from this lab workspace?`)) return;
      try {
        await deleteAsset(uid);
        setAssets((prev) => prev.filter((a) => a.uid !== uid));
        if (scannedData?.uid === uid) setScannedData(null);
        fetchStats().then(setStats).catch(() => {});
      } catch (err) {
        alert(err.message || 'Failed to delete asset');
      }
    }, 'admin');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-200 relative ${
      isDark ? 'bg-[#040711] text-slate-100' : 'bg-[#EDF5FD] text-[#0B1528]'
    }`}>
      
      {/* Global Ambient Cyber-Mesh Background */}
      <div 
        className={`fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0 transition-all duration-500 ${
          isDark
            ? 'opacity-25'
            : 'opacity-25 mix-blend-multiply'
        }`}
        style={{
          backgroundImage: `url('/landing-bg.jpg')`,
          filter: isDark 
            ? 'brightness(0.55) contrast(0.95)' 
            : 'invert(1) hue-rotate(185deg) contrast(1.35) saturate(1.2) brightness(0.72)',
        }}
      />

      {/* 1. Landing Page View (when activeTab is 'HOME') */}
      {activeTab === 'HOME' ? (
        <AeroLandingPage
          onOpenAuth={(role) => { setAuthInitialRole(role || 'staff'); setAuthOpen(true); }}
          user={user}
          workspace={workspace}
          onLogout={handleLogout}
          onOpenStaffLogin={() => { setAuthInitialRole('staff'); setAuthOpen(true); }}
          onOpenAdminPortal={() => { setAuthInitialRole('admin'); setAuthOpen(true); }}
          onLaunchScanner={() => setActiveTab('SCANNER')}
          onViewInventory={() => setActiveTab('INVENTORY')}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        /* 2. Focused Portal Views: SCANNER, INVENTORY, DOCS */
        <>
          <Navbar
            user={user}
            workspace={workspace}
            onOpenAuth={(role) => { setAuthInitialRole(role || 'staff'); setAuthOpen(true); }}
            onLogout={handleLogout}
            onOpenRegister={() => openRegisterModal()}
            onOpenStaffManagement={() => setStaffManagementOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-16 flex-1">
            
            {/* ROLE-DIFFERENTIATED DASHBOARD CONSOLES */}
            {user?.role === 'admin' ? (
              /* --- ADMIN DASHBOARD: Executive Command Console --- */
              <div className="mb-8 space-y-4">
                <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-900/95 border-cyan-500/40 shadow-glow-cyan-sm'
                    : 'bg-white border-[#96C2EC] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
                }`}>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border shrink-0 ${
                        isDark
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-400 shadow-glow-cyan-sm'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-sky-600'
                      }`}>
                        <ShieldCheck className="w-6 h-6 animate-pulse-slow" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className={`font-heading font-black text-lg sm:text-xl uppercase tracking-wider ${
                            isDark ? 'text-white' : 'text-[#0B1528]'
                          }`}>
                            LAB COMMAND CONSOLE
                          </h1>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isDark
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            ADMINISTRATOR
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isDark
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-[#F4F8FC] text-slate-700 border-[#96C2EC]'
                          }`}>
                            TENANT: {workspace?.code || 'ROBOTICS-LAB'}
                          </span>
                        </div>
                        <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Workspace Owner: <strong className={isDark ? "text-white" : "text-[#0B1528]"}>{user.name}</strong> &bull; Laboratory: <span className={isDark ? "text-cyan-300" : "text-sky-600 font-semibold"}>{workspace?.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setStaffManagementOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                          isDark
                            ? 'bg-cyan-950 hover:bg-cyan-900 border-cyan-400/60 text-cyan-300 shadow-glow-cyan-sm'
                            : 'bg-white hover:bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                        }`}
                      >
                        <Users className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                        <span>MANAGE STAFF ({stats?.total_staff ?? 2})</span>
                      </button>

                      <button
                        onClick={() => openRegisterModal()}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all ${
                          isDark
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-glow-cyan-sm'
                            : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-sm'
                        }`}
                      >
                        <span>+ NEW ASSET</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin Exclusive Fleet Financial & Operations Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>FLEET INVENTORY</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>{assets.length} <span className="text-xs font-mono font-normal opacity-60">Units</span></div>
                    <span className={`text-[10px] font-mono mt-2 flex items-center gap-1 ${isDark ? 'text-cyan-400' : 'text-sky-600 font-semibold'}`}>● 100% RFID Tagged</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-cyan-500/30 shadow-glow-cyan-sm' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>TOTAL LAB VALUATION</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ₹{totalValuation.toLocaleString('en-IN')}
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Executive Admin Metric</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>ACTIVE STAFF</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-cyan-300' : 'text-[#0B1528]'}`}>{stats?.total_staff ?? 0} <span className="text-xs font-mono font-normal opacity-60">Technicians</span></div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Provisioned by Admin</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>OPERATIONAL HEALTH</span>
                    <div className={`text-xl font-heading font-bold mt-1 ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>
                      <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{stats?.active ?? assets.filter(a => a.status === 'active').length}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>{stats?.under_maintenance ?? assets.filter(a => a.status === 'under_maintenance').length}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className={isDark ? 'text-rose-400' : 'text-rose-600'}>{stats?.faulty ?? assets.filter(a => a.status === 'faulty').length}</span>
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active / Maint / Faulty</span>
                  </div>
                </div>
              </div>
            ) : user?.role === 'staff' ? (
              /* --- STAFF DASHBOARD: Field Technician Station (NO FINANCIAL COSTS, NO STAFF DIRECTORY) --- */
              <div className="mb-8 space-y-4">
                <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-900/95 border-magenta-500/40 shadow-glow-magenta-sm'
                    : 'bg-white border-[#96C2EC] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
                }`}>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-magenta-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border shrink-0 ${
                        isDark
                          ? 'bg-magenta-950 border-magenta-400 text-magenta-400 shadow-glow-magenta-sm'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-rose-600'
                      }`}>
                        <Wrench className="w-6 h-6 animate-pulse-slow" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className={`font-heading font-black text-lg sm:text-xl uppercase tracking-wider ${
                            isDark ? 'text-white' : 'text-[#0B1528]'
                          }`}>
                            FIELD TECHNICIAN WORKSPACE
                          </h1>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isDark
                              ? 'bg-magenta-950 text-magenta-300 border-magenta-500/50'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            STAFF ASSISTANT
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isDark
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-[#F4F8FC] text-slate-700 border-[#96C2EC]'
                          }`}>
                            ASSIGNED LAB: {workspace?.code || 'ROBOTICS-LAB'}
                          </span>
                        </div>
                        <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Technician on Duty: <strong className={isDark ? "text-white" : "text-[#0B1528]"}>{user.name}</strong> (@{user.username || 'staff'}) &bull; Facility: <span className={isDark ? "text-magenta-300" : "text-rose-600 font-semibold"}>{workspace?.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setActiveTab('SCANNER')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                          isDark
                            ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark hover:shadow-glow-magenta'
                            : 'bg-[#0B1528] hover:bg-[#1E293B] shadow-sm'
                        }`}
                      >
                        <Radio className="w-4 h-4 text-white animate-pulse" />
                        <span>TAP / SCAN RFID</span>
                      </button>

                      <button
                        onClick={() => openRegisterModal()}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/30'
                            : 'bg-white hover:bg-[#F4F8FC] text-[#0B1528] border-[#96C2EC] shadow-sm'
                        }`}
                      >
                        <span>+ REGISTER EQUIPMENT</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Staff Operational Metrics (NO FINANCIAL COSTS, NO STAFF MANAGEMENT) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>MY ASSIGNED FLEET</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>{assets.length} <span className="text-xs font-mono font-normal opacity-60">Equipment</span></div>
                    <span className={`text-[10px] font-mono mt-2 flex items-center gap-1 ${isDark ? 'text-magenta-400' : 'text-rose-600 font-semibold'}`}>● Assigned for Maintenance</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>OPERATIONAL / READY</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {stats?.active ?? assets.filter(a => a.status === 'active').length} <span className="text-xs font-mono font-normal opacity-60">Active</span>
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Passes Inspection</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-amber-500/30' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>ATTENTION REQUIRED</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {(stats?.under_maintenance ?? assets.filter(a => a.status === 'under_maintenance').length) + (stats?.faulty ?? assets.filter(a => a.status === 'faulty').length)} <span className="text-xs font-mono font-normal opacity-60">Units</span>
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pending Service / Repairs</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
                  }`}>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>MAINTENANCE AUDITS</span>
                    <div className={`text-2xl font-heading font-black mt-1 ${isDark ? 'text-cyan-300' : 'text-[#0B1528]'}`}>{stats?.total_logs ?? 0} <span className="text-xs font-mono font-normal opacity-60">Entries</span></div>
                    <span className={`text-[10px] font-mono mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Logged in Vault</span>
                  </div>
                </div>
              </div>
            ) : (
              /* --- GUEST / UNASSIGNED MODE --- */
              <div className={`p-4 rounded-2xl border mb-8 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ${
                isDark
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-glass'
                  : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
                    isDark
                      ? 'bg-cyan-950 border-cyan-500/40 text-cyan-400'
                      : 'bg-[#F4F8FC] border-[#96C2EC] text-sky-600'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-heading font-extrabold text-sm sm:text-base tracking-wide ${
                        isDark ? 'text-white' : 'text-[#0B1528]'
                      }`}>
                        {workspace?.name || 'Main Robotics & Mechatronics Lab'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isDark
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}>
                        TENANT: {workspace?.code || 'ROBOTICS-LAB'}
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Guest View &bull; View-only Access (Login as Staff or Admin to access controls)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setAuthInitialRole('staff'); setAuthOpen(true); }}
                    className={`px-3.5 py-1.5 rounded-full text-white text-xs font-heading font-bold uppercase transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark shadow-glow-magenta-sm'
                        : 'bg-[#0B1528] hover:bg-[#1E293B] shadow-sm'
                    }`}
                  >
                    LOGIN AS STAFF
                  </button>
                  <button
                    onClick={() => { setAuthInitialRole('admin'); setAuthOpen(true); }}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-heading font-bold uppercase transition-all ${
                      isDark
                        ? 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-500/40 text-cyan-300'
                        : 'bg-white hover:bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                    }`}
                  >
                    LOGIN AS ADMIN
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SCANNER (Hardware RFID Tap Terminal & OLED Display) */}
            {activeTab === 'SCANNER' && (
              <div className="space-y-6">
                
                {/* Active Scanned Hardware Card with 128x64 OLED Simulator */}
                {scannedData ? (
                  <HardwareCard
                    scannedData={scannedData}
                    onLogMaintenance={(asset) => requireAuth(() => setAuditAsset(asset))}
                    onOpenQr={(asset) => setQrAsset(asset)}
                    onOpenDetails={(uid) => setDetailsUid(uid)}
                    onRegister={(uid) => openRegisterModal(uid)}
                    isDark={isDark}
                  />
                ) : (
                  <div className={`rounded-3xl p-12 text-center border transition-all ${
                    isDark 
                      ? 'glass-aero-dark border-cyan-500/30' 
                      : 'bg-white border-[#96C2EC] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
                  }`}>
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border mx-auto mb-4 animate-pulse ${
                      isDark
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-400 shadow-glow-cyan-sm'
                        : 'bg-[#F4F8FC] border-[#96C2EC] text-sky-600'
                    }`}>
                      <Radio className="w-8 h-8" />
                    </div>
                    <h3 className={`font-heading font-black text-xl uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-[#0B1528]'
                    }`}>
                      ESP32 RFID SCANNER ACTIVE
                    </h3>
                    <p className={`text-xs font-mono mt-2 max-w-md mx-auto ${isDark ? 'opacity-60 text-slate-300' : 'text-slate-500'}`}>
                      Ready for 13.56MHz physical card tap on hardware reader, or click &ldquo;TAP RFID TO ESP32&rdquo; on any equipment in your Equipment Fleet.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handleScan(assets[0]?.uid || '04A32F1B')}
                        disabled={scanning}
                        className={`px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                          isDark
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan-sm'
                            : 'bg-[#0B1528] text-white hover:bg-[#1E293B]'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>TEST SCAN BENCHMARK CHIP (04A32F1B)</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('INVENTORY')}
                        className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider border transition-all ${
                          isDark
                            ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white'
                            : 'border-[#96C2EC] bg-white text-[#0B1528] hover:bg-[#F4F8FC] shadow-sm'
                        }`}
                      >
                        GO TO EQUIPMENT FLEET &rarr;
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB: INVENTORY (Equipment Fleet Management Scoped to Workspace) */}
            {activeTab === 'INVENTORY' && (
              <AssetGrid
                assets={assets}
                loading={loading}
                onSelect={(uid) => setDetailsUid(uid)}
                onLogMaintenance={(asset) => requireAuth(() => setAuditAsset(asset))}
                onOpenQr={(asset) => setQrAsset(asset)}
                onSimulateScan={(uid) => handleScan(uid)}
                onDelete={handleDeleteAsset}
                onOpenRegister={() => requireAuth(() => { setInitialUidForRegister(''); setRegisterOpen(true); })}
                isDark={isDark}
                user={user}
              />
            )}

          </main>

          {/* Minimalist Tech Footer */}
          <footer className={`border-t py-6 transition-colors ${
            isDark ? 'border-cyan-500/10 bg-[#040711] text-slate-400' : 'border-[#96C2EC] bg-white text-slate-500 shadow-sm'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded overflow-hidden border shrink-0 ${
                  isDark ? 'border-cyan-400/50 bg-[#0C1A30]' : 'border-[#96C2EC] bg-white'
                }`}>
                  <img src="/logo.png" alt="Memory Mirror Logo" className="w-full h-full object-contain p-0.5" />
                </div>
                <span className={`font-heading font-black uppercase ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>PROJECT MEMORY MIRROR</span>
                <span>&bull;</span>
                <span>MULTI-TENANT ASSET &amp; MAINTENANCE VAULT</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <button onClick={() => setActiveTab('HOME')} className="hover:underline">HOME</button>
                <span>+</span>
                <button onClick={() => setActiveTab('SCANNER')} className="hover:underline">SCANNER</button>
                <span>+</span>
                <button onClick={() => setActiveTab('INVENTORY')} className="hover:underline">INVENTORY</button>
                <span>+</span>
                <span className={isDark ? "text-cyan-400" : "text-sky-600 font-semibold"}>{workspace?.name || 'Main Robotics Lab'}</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialRole={authInitialRole}
        isDark={isDark}
      />

      <StaffManagementModal
        isOpen={staffManagementOpen}
        onClose={() => setStaffManagementOpen(false)}
        workspace={workspace}
        isDark={isDark}
      />

      <RegisterAssetModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onCreated={handleAssetCreated}
        initialUid={initialUidForRegister}
        isDark={isDark}
        userRole={user?.role}
      />

      <AuditLogModal
        isOpen={!!auditAsset}
        asset={auditAsset}
        onClose={() => setAuditAsset(null)}
        onLogged={handleMaintenanceLogged}
        isDark={isDark}
      />

      <QrCodeModal
        isOpen={!!qrAsset}
        asset={qrAsset}
        onClose={() => setQrAsset(null)}
        isDark={isDark}
      />

      <AssetDetailsModal
        isOpen={!!detailsUid}
        uid={detailsUid}
        onClose={() => setDetailsUid(null)}
        onLogMaintenance={(asset) => requireAuth(() => setAuditAsset(asset))}
        onOpenQr={(asset) => setQrAsset(asset)}
        onSimulateScan={(uid) => handleScan(uid)}
        userRole={user?.role}
        isDark={isDark}
      />

      <HardwareSpecsModal
        isOpen={specsOpen}
        onClose={() => setSpecsOpen(false)}
        isDark={isDark}
      />

      {/* Instant Scan Result Popup Modal */}
      <ScanResultModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        scannedData={scannedData}
        currentWorkspace={workspace}
        userRole={user?.role}
        onLogMaintenance={(asset) => {
          setIsScanModalOpen(false);
          requireAuth(() => setAuditAsset(asset));
        }}
        onOpenQr={(asset) => {
          setIsScanModalOpen(false);
          setQrAsset(asset);
        }}
        onOpenDetails={(uid) => {
          setIsScanModalOpen(false);
          setDetailsUid(uid);
        }}
        onRegisterAsset={(uid) => {
          setIsScanModalOpen(false);
          openRegisterModal(uid);
        }}
        onDeleteAsset={handleDeleteAsset}
        isDark={isDark}
      />

    </div>
  );
}
