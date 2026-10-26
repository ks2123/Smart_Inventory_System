import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Key, Trash2, Copy, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { fetchStaffMembers, createStaffAccount, deleteStaffAccount } from '../api/client';

export default function StaffManagementModal({ isOpen, onClose, workspace, isDark = true }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successCreds, setSuccessCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await fetchStaffMembers();
      setStaffList(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError('');
      setName('');
      setEmail('');
      setSuccessCreds(null);
      loadStaff();
      generateSuggestedCreds();
    }
  }, [isOpen]);

  const generateSuggestedCreds = () => {
    const randomNum = Math.floor(10 + Math.random() * 89);
    const passNum = Math.floor(1000 + Math.random() * 9000);
    setUsername(`staff_assistant_${randomNum}`);
    setPassword(`Pass!${passNum}`);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Staff member name is required.');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const res = await createStaffAccount({
        name: name.trim(),
        username: username.trim(),
        email: email.trim() || undefined,
        password: password.trim() || undefined,
      });

      setSuccessCreds({
        name: res.data.name,
        username: res.data.username,
        password: res.temporaryPassword,
        email: res.data.email,
      });

      setName('');
      generateSuggestedCreds();
      loadStaff();
    } catch (err) {
      setError(err.message || 'Failed to create staff account');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (staffId, staffName) => {
    if (!window.confirm(`Revoke access for staff member [${staffName}]?`)) return;
    try {
      await deleteStaffAccount(staffId);
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    } catch (err) {
      alert(err.message || 'Failed to remove staff account');
    }
  };

  const copyCredsToClipboard = () => {
    if (!successCreds) return;
    const text = `Memory Mirror Staff Access:\nUsername: ${successCreds.username}\nPassword: ${successCreds.password}\nWorkspace: ${workspace?.name || 'Assigned Lab'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-3xl my-8 rounded-3xl p-6 sm:p-8 border transition-all ${
        isDark
          ? 'border-cyan-500/30 bg-[#0B1120] text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.18)]'
          : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-[#96C2EC]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-11 h-11 rounded-2xl border ${
              isDark
                ? 'bg-cyan-950 border-cyan-500/40 text-cyan-400 shadow-glow-cyan-sm'
                : 'bg-[#EDF5FD] border-[#D0E3F7] text-cyan-700'
            }`}>
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`font-heading font-extrabold text-lg sm:text-xl tracking-wide uppercase ${
                isDark ? 'text-white' : 'text-[#0B1528]'
              }`}>
                STAFF ACCESS MANAGEMENT
              </h2>
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                WORKSPACE: <strong className={isDark ? 'text-white' : 'text-[#0B1528]'}>{workspace?.name || 'Lab Workspace'}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-[#F4F8FC] text-slate-500 hover:text-[#0B1528]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            isDark ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Created Card */}
        {successCreds && (
          <div className={`mt-4 p-4 rounded-2xl border text-xs font-mono ${
            isDark
              ? 'bg-cyan-950/70 border-cyan-400/50 text-slate-300 shadow-glow-cyan-sm'
              : 'bg-[#F4F8FC] border-cyan-300 text-[#0B1528]'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-cyan-800' : 'border-cyan-200'
            }`}>
              <span className={`${isDark ? 'text-cyan-300' : 'text-cyan-800'} font-bold flex items-center gap-1.5 uppercase`}>
                <Check className="w-4 h-4 text-emerald-500" />
                STAFF ACCOUNT CREATED SUCCESSFULLY
              </span>
              <button
                onClick={copyCredsToClipboard}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] ${
                  isDark ? 'bg-cyan-900 hover:bg-cyan-800 text-cyan-200' : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-semibold'
                }`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED!' : 'COPY CREDENTIALS'}</span>
              </button>
            </div>
            <div className={`mt-2 grid grid-cols-2 gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div>Name: <strong className={isDark ? 'text-white' : 'text-[#0B1528]'}>{successCreds.name}</strong></div>
              <div>Username: <strong className={isDark ? 'text-cyan-300' : 'text-cyan-800'}>{successCreds.username}</strong></div>
              <div>Temp Password: <strong className="text-magenta-500">{successCreds.password}</strong></div>
              <div>Assigned Lab: <strong className={isDark ? 'text-white' : 'text-[#0B1528]'}>{workspace?.name}</strong></div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create Staff Form */}
          <div className={`lg:col-span-5 p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
          }`}>
            <h3 className={`font-heading font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
              isDark ? 'text-cyan-400' : 'text-cyan-800'
            }`}>
              <UserPlus className="w-4 h-4" />
              PROVISION NEW STAFF ACCOUNT
            </h3>

            <form onSubmit={handleCreateSubmit} autoComplete="off" className="space-y-3">
              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Vance"
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-[10px] font-mono font-bold uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    USERNAME *
                  </label>
                  <button
                    type="button"
                    onClick={generateSuggestedCreds}
                    className={`text-[10px] hover:underline flex items-center gap-0.5 ${
                      isDark ? 'text-cyan-400' : 'text-cyan-700'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-cyan-300 focus:border-cyan-400'
                      : 'bg-white border-[#96C2EC] text-cyan-800 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  TEMPORARY PASSWORD *
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-magenta-300 focus:border-cyan-400'
                      : 'bg-white border-[#96C2EC] text-magenta-600 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  EMAIL (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="liam@lab.mirror"
                  autoComplete="off"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className={`w-full py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-1 ${
                  isDark
                    ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white shadow-glow-magenta hover:shadow-[0_0_30px_rgba(244,63,94,0.7)]'
                    : 'bg-[#0B1528] text-white hover:bg-[#1E293B] shadow-md'
                }`}
              >
                {creating ? 'GENERATING...' : 'GENERATE STAFF ACCOUNT'}
              </button>
            </form>
          </div>

          {/* Right Column: Existing Staff Directory */}
          <div className="lg:col-span-7">
            <div className={`flex items-center justify-between pb-2 mb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-[#96C2EC]'
            }`}>
              <span className={`font-heading font-bold text-xs uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-[#0B1528]'
              }`}>
                ACTIVE LAB ASSISTANTS ({staffList.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                SCOPED TO {workspace?.code || 'THIS LAB'}
              </span>
            </div>

            {loading ? (
              <div className={`py-12 text-center text-xs font-mono ${
                isDark ? 'text-cyan-400' : 'text-cyan-700'
              }`}>
                Loading staff directory...
              </div>
            ) : staffList.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center text-xs font-mono ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-[#F4F8FC] border-[#96C2EC] text-slate-600'
              }`}>
                No staff members provisioned yet. Use the form on the left to add lab technicians.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/30'
                        : 'bg-[#F4F8FC] border-[#96C2EC] hover:border-cyan-300'
                    }`}
                  >
                    <div>
                      <div className={`font-heading font-bold text-xs flex items-center gap-2 ${
                        isDark ? 'text-white' : 'text-[#0B1528]'
                      }`}>
                        <span>{staff.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                          isDark ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-white text-cyan-800 border-[#96C2EC]'
                        }`}>
                          {staff.role.toUpperCase()}
                        </span>
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Username: <strong className={isDark ? 'text-cyan-400' : 'text-cyan-700'}>{staff.username}</strong> &bull; {staff.email}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(staff.id, staff.name)}
                      className={`p-2 rounded-xl border border-transparent transition-all ${
                        isDark
                          ? 'hover:bg-rose-950/70 hover:border-rose-500/40 text-slate-500 hover:text-rose-400'
                          : 'hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600'
                      }`}
                      title="Revoke Staff Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
