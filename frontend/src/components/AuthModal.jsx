import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldCheck, UserCheck, Key, Sparkles, Building2, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser, registerAdmin } from '../api/client';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialRole = 'staff', isDark = true }) {
  const [activeTab, setActiveTab] = useState(initialRole === 'admin' ? 'admin' : 'staff');
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [labName, setLabName] = useState('Main Robotics & Mechatronics Lab');
  const [labCode, setLabCode] = useState('ROBOTICS-LAB');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialRole === 'admin') setActiveTab('admin');
      else setActiveTab('staff');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  // Handle Staff or Admin Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Username / Email and Password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(identifier, password);
      onAuthSuccess(res.user, res.workspace);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Workspace Registration
  const handleRegisterAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!adminName || !adminEmail || !adminPassword || !labName) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerAdmin({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        lab_name: labName,
        lab_code: labCode,
      });
      onAuthSuccess(res.user, res.workspace);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Fast Demo Login
  const handleDemoClick = async (demo) => {
    try {
      setLoading(true);
      setError('');
      const res = await loginUser(demo.identifier, demo.password);
      onAuthSuccess(res.user, res.workspace);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto transition-colors ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-lg my-8 rounded-3xl p-6 sm:p-8 border transition-all ${
        isDark
          ? 'border-cyan-500/30 bg-[#0B1120] text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.18)]'
          : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
      }`}>
        
        {/* Glow corners (Dark mode only) */}
        {isDark && (
          <>
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-magenta-500/10 rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        {/* Modal Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-[#96C2EC]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-11 h-11 rounded-2xl border overflow-hidden p-1 ${
              isDark
                ? 'bg-[#0C1A30] border-cyan-500/40 shadow-glow-cyan-sm'
                : 'bg-white border-[#96C2EC]'
            }`}>
              <img src="/logo.png" alt="Memory Mirror Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className={`font-heading font-extrabold text-lg sm:text-xl tracking-wide uppercase ${
                isDark ? 'text-white' : 'text-[#0B1528]'
              }`}>
                PORTAL AUTHENTICATION
              </h2>
              <span className={`text-[11px] font-mono ${
                isDark ? 'text-cyan-300' : 'text-sky-600 font-semibold'
              }`}>
                PROJECT MEMORY MIRROR // MULTI-TENANT ACCESS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-[#F4F8FC] text-slate-500 hover:text-[#0B1528]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Staff, Admin) */}
        <div className={`mt-5 grid grid-cols-2 gap-1 p-1 rounded-2xl border text-xs font-mono ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
        }`}>
          <button
            onClick={() => { setActiveTab('staff'); setError(''); }}
            className={`py-2 px-3 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? isDark
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan-sm'
                  : 'bg-[#0B1528] text-white shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-[#0B1528]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>STAFF LOGIN</span>
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`py-2 px-3 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? isDark
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan-sm'
                  : 'bg-[#0B1528] text-white shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-[#0B1528]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>LAB ADMIN</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- TAB 1: STAFF LOGIN --- */}
        {activeTab === 'staff' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div className={`p-3 rounded-2xl border text-xs font-mono ${
              isDark
                ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-200'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}>
              Staff credentials automatically map you to your Admin's assigned Lab workspace.
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                isDark ? 'text-slate-300' : 'text-[#0B1528]'
              }`}>
                STAFF USERNAME OR EMAIL *
              </label>
              <div className="relative">
                <User className={`absolute left-3.5 top-2.5 w-4 h-4 ${
                  isDark ? 'text-cyan-400' : 'text-sky-600'
                }`} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. staff_marcus"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                      : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                isDark ? 'text-slate-300' : 'text-[#0B1528]'
              }`}>
                PASSWORD *
              </label>
              <div className="relative">
                <Key className={`absolute left-3.5 top-2.5 w-4 h-4 ${
                  isDark ? 'text-cyan-400' : 'text-sky-600'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                      : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all disabled:opacity-50 mt-2 ${
                isDark
                  ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white shadow-glow-magenta hover:shadow-[0_0_35px_rgba(244,63,94,0.7)]'
                  : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-md'
              }`}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN AS STAFF ASSISTANT'}
            </button>
          </form>
        )}

        {/* --- TAB 2: LAB ADMIN / OWNER --- */}
        {activeTab === 'admin' && (
          <div className="mt-5">
            {!isAdminRegister ? (
              /* Admin Sign In */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono pb-2">
                  <span className={isDark ? "text-slate-400" : "text-slate-600"}>Lab Owner / Workspace Administrator</span>
                  <button
                    type="button"
                    onClick={() => { setIsAdminRegister(true); setError(''); }}
                    className={`hover:underline font-bold ${
                      isDark ? 'text-cyan-400' : 'text-sky-600'
                    }`}
                  >
                    + Register New Lab
                  </button>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                    isDark ? 'text-slate-300' : 'text-[#0B1528]'
                  }`}>
                    ADMIN EMAIL OR USERNAME *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-2.5 w-4 h-4 ${
                      isDark ? 'text-cyan-400' : 'text-sky-600'
                    }`} />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@robotics.mirror"
                      required
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                    isDark ? 'text-slate-300' : 'text-[#0B1528]'
                  }`}>
                    ADMIN PASSWORD *
                  </label>
                  <div className="relative">
                    <Key className={`absolute left-3.5 top-2.5 w-4 h-4 ${
                      isDark ? 'text-cyan-400' : 'text-sky-600'
                    }`} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all disabled:opacity-50 mt-2 ${
                    isDark
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-glow-cyan-sm'
                      : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-md'
                  }`}
                >
                  {loading ? 'VERIFYING...' : 'ENTER ADMIN WORKSPACE'}
                </button>
              </form>
            ) : (
              /* Register New Lab Workspace */
              <form onSubmit={handleRegisterAdminSubmit} className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-mono pb-1">
                  <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-sky-600'}`}>Create New Lab Workspace &amp; Owner</span>
                  <button
                    type="button"
                    onClick={() => { setIsAdminRegister(false); setError(''); }}
                    className={`hover:underline ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    &larr; Back to Login
                  </button>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                    isDark ? 'text-slate-300' : 'text-[#0B1528]'
                  }`}>
                    WORKSPACE / LAB NAME *
                  </label>
                  <input
                    type="text"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    placeholder="e.g. Main Robotics & Mechatronics Lab"
                    required
                    className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                        : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                      isDark ? 'text-slate-300' : 'text-[#0B1528]'
                    }`}>
                      ADMIN NAME *
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Dr. Alex Reynolds"
                      required
                      className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                      isDark ? 'text-slate-300' : 'text-[#0B1528]'
                    }`}>
                      LAB CODE *
                    </label>
                    <input
                      type="text"
                      value={labCode}
                      onChange={(e) => setLabCode(e.target.value)}
                      placeholder="ROBOTICS-LAB"
                      required
                      className={`w-full px-4 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-cyan-300 focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                      isDark ? 'text-slate-300' : 'text-[#0B1528]'
                    }`}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@lab.mirror"
                      required
                      className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${
                      isDark ? 'text-slate-300' : 'text-[#0B1528]'
                    }`}>
                      PASSWORD *
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                          : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all mt-1 disabled:opacity-50 ${
                    isDark
                      ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white shadow-glow-magenta'
                      : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-md'
                  }`}
                >
                  {loading ? 'REGISTERING...' : 'INITIALIZE WORKSPACE & ADMIN'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
