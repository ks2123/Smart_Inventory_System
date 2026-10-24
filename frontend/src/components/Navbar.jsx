import React from 'react';
import { Sun, Moon, Plus, Users, Building2, UserCheck, LogOut } from 'lucide-react';

export default function Navbar({
  user,
  workspace,
  onOpenAuth,
  onLogout,
  onOpenRegister,
  onOpenStaffManagement,
  activeTab,
  setActiveTab,
  isDark,
  onToggleTheme,
}) {
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
      <div className={`w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-glass flex items-center justify-between gap-4 ${
        isDark
          ? 'bg-[#090F1E]/90 border-slate-800/90 text-slate-100'
          : 'bg-white/95 border-[#96C2EC] text-[#0B1528] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
      }`}>
        
        {/* Brand: Memory Mirror Official Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0" 
          onClick={() => setActiveTab('HOME')}
          title="Return to Home / Landing"
        >
          {/* Memory Mirror Holographic Logo */}
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden border transition-transform group-hover:scale-105 ${
            isDark
              ? 'bg-[#0C1A30] border-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
              : 'bg-white border-[#96C2EC] shadow-sm'
          }`}>
            <img
              src="/logo.png"
              alt="Memory Mirror Logo"
              className="w-full h-full object-contain p-0.5"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className={`font-heading font-black tracking-[0.16em] text-sm sm:text-base uppercase ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              MEMORY<span className={isDark ? "text-cyan-400" : "text-sky-600"}>MIRROR</span>
            </span>
            {workspace && (
              <span className={`hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold border ${
                isDark 
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' 
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}>
                {workspace.code}
              </span>
            )}
          </div>
        </div>

        {/* Center Navigation Links: HOME | RFID SCANNER | EQUIPMENT FLEET */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-heading font-bold tracking-[0.18em] uppercase">
          {[
            { id: 'HOME', label: 'HOME' },
            { id: 'SCANNER', label: 'RFID SCANNER' },
            { id: 'INVENTORY', label: 'EQUIPMENT FLEET' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition-all relative py-1 ${
                activeTab === tab.id
                  ? isDark ? 'text-cyan-400 font-extrabold' : 'text-sky-600 font-extrabold'
                  : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B1528]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${
                  isDark ? 'bg-cyan-400 shadow-glow-cyan-sm' : 'bg-sky-600'
                }`} />
              )}
            </button>
          ))}
        </nav>

        {/* Right Items: Theme Toggle & User/Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900/90 border-slate-700 hover:border-cyan-400 text-amber-400 hover:bg-slate-800'
                : 'bg-[#F4F8FC] border-[#96C2EC] hover:border-sky-300 text-slate-700 hover:bg-white shadow-sm'
            }`}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>

          {/* When Logged In: */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* User Profile Pill */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
                isDark 
                  ? 'bg-[#0A1324] border-slate-700/80 text-white' 
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-cyan-400' : 'bg-magenta-400'}`} />
                <span className="font-heading font-bold text-xs truncate max-w-[110px]">{user.name}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  isAdmin 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                    : 'bg-magenta-950 text-magenta-300 border border-magenta-800'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* + REGISTER Button */}
              <button
                onClick={onOpenRegister}
                className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-glow-cyan-sm'
                    : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-sm'
                }`}
                title="Register New Asset"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>REGISTER</span>
              </button>

              {/* Admin Staff Directory */}
              {isAdmin && (
                <button
                  onClick={onOpenStaffManagement}
                  className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                    isDark
                      ? 'border-cyan-500/40 bg-slate-900/80 text-cyan-300 hover:bg-slate-800'
                      : 'border-[#96C2EC] bg-[#F4F8FC] text-[#0B1528] hover:bg-white shadow-sm'
                  }`}
                  title="Manage Staff"
                >
                  <Users className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                  <span>STAFF</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* When NOT Logged In */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('staff')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                  isDark
                    ? 'bg-[#0A1324] hover:bg-[#0E1A33] border-slate-700 hover:border-cyan-400 text-slate-200'
                    : 'bg-white hover:bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>STAFF</span>
              </button>

              <button
                onClick={() => onOpenAuth('admin')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                  isDark
                    ? 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-500/40 text-cyan-300'
                    : 'bg-[#0B1528] hover:bg-[#1E293B] text-white border-transparent shadow-sm'
                }`}
              >
                ADMIN
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
