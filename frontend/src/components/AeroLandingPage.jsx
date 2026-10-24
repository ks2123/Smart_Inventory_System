import React from 'react';
import { ArrowRight, Radio, Check, Sun, Moon } from 'lucide-react';

export default function AeroLandingPage({
  onOpenAuth,
  user,
  workspace,
  onLogout,
  onOpenStaffLogin,
  onOpenAdminPortal,
  onLaunchScanner,
  onViewInventory,
  isDark = true,
  onToggleTheme,
}) {
  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-[#0B1528]'
    }`}>
      
      {/* Cosmic Twinkling Stars Background Effect (In Dark Mode) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Stardust Speckles */}
          <div className="absolute top-[8%] left-[12%] w-1 h-1 rounded-full bg-white/60 shadow-[0_0_6px_#fff]" />
          <div className="absolute top-[18%] left-[28%] w-1.5 h-1.5 rounded-full bg-cyan-300/50 shadow-[0_0_8px_#38bdf8]" />
          <div className="absolute top-[12%] right-[22%] w-1 h-1 rounded-full bg-white/50" />
          <div className="absolute top-[34%] left-[6%] w-1 h-1 rounded-full bg-cyan-200/40" />
          <div className="absolute top-[42%] right-[14%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_#fff]" />
          <div className="absolute top-[68%] left-[18%] w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-[75%] right-[26%] w-1 h-1 rounded-full bg-cyan-300/40" />
          <div className="absolute top-[85%] left-[8%] w-1.5 h-1.5 rounded-full bg-white/60" />
          <div className="absolute top-[28%] right-[42%] w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-[58%] right-[48%] w-1 h-1 rounded-full bg-cyan-400/30" />
          
          {/* Ambient Dark Cyan Deep Radial Bloom */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-cyan-500/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none bg-sky-500/5" />
        </div>
      )}

      {/* Top Floating SaaS Header Capsule Bar */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className={`w-full px-5 sm:px-7 py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-glass flex items-center justify-between gap-4 ${
          isDark
            ? 'bg-[#090F1E]/85 border-slate-800/80 text-slate-100'
            : 'bg-white/95 border-[#96C2EC] text-[#0B1528] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
        }`}>
          
          {/* Left Brand: Memory Mirror Official Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => onLaunchScanner()}
            title="Project Memory Mirror"
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

            <span className={`font-heading font-black tracking-[0.16em] text-sm sm:text-base uppercase ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              MEMORY<span className={isDark ? "text-cyan-400" : "text-sky-600"}>MIRROR</span>
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-heading font-bold tracking-[0.18em] uppercase">
            <button 
              onClick={onLaunchScanner} 
              className={`transition-colors tracking-[0.18em] ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B1528]'
              }`}
            >
              RFID SCANNER
            </button>
            <button 
              onClick={onViewInventory} 
              className={`transition-colors tracking-[0.18em] ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B1528]'
              }`}
            >
              EQUIPMENT FLEET
            </button>
          </nav>

          {/* Right User/Auth Pill & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
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

            {user ? (
              <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-sm ${
                isDark ? 'bg-[#0A1324] border-slate-700/80 text-white' : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528]'
              }`}>
                <span className="font-bold truncate max-w-[130px]">
                  {user.name.length > 15 ? `${user.name.slice(0, 14)}...` : user.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-magenta-950 text-magenta-300 border border-magenta-800'
                }`}>
                  {user.role}
                </span>
                <button
                  onClick={onLogout}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-400 uppercase transition-colors tracking-wider ml-1"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStaffLogin}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                    isDark
                      ? 'bg-[#0A1324] hover:bg-[#0E1A33] border-slate-700 hover:border-cyan-400 text-slate-200'
                      : 'bg-white hover:bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                  }`}
                >
                  <span>STAFF LOGIN</span>
                </button>

                <button
                  onClick={onOpenAdminPortal}
                  className={`px-3.5 py-1.5 rounded-full border text-[11px] font-heading font-bold uppercase tracking-wider transition-all ${
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

      {/* Main Hero Section */}
      <main className="relative z-20 flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col lg:flex-row items-center justify-between my-auto py-10 sm:py-14 gap-10 lg:gap-14">
        
        {/* Left Side: Typography, Description & Actions */}
        <div className="flex-1 max-w-xl z-20">
          
          {/* Stacked Giant Hero Heading */}
          <h1 className={`font-heading font-black text-6xl sm:text-7xl lg:text-[84px] tracking-tight uppercase leading-[0.92] select-none ${
            isDark ? 'text-[#8BE5F8]' : 'text-[#0B1528]'
          }`}>
            MEMORY<br />MIRROR
          </h1>

          {/* Description Copy */}
          <p className={`mt-6 text-sm sm:text-base font-sans font-normal leading-relaxed max-w-[480px] ${
            isDark ? 'text-slate-300 opacity-95' : 'text-slate-600'
          }`}>
            The universal physical-to-digital reflection system. Bind physical tools, test gear, and storage cupboards to cryptographic audit trails with instant ESP32 RFID taps and emergency QR codes.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            
            {/* Primary Action Button: Glowing Cyan Pill */}
            <button
              onClick={user ? onViewInventory : onOpenStaffLogin}
              className={`flex items-center gap-2 px-7 py-3.5 rounded-full font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-[#DCF7FE] via-[#86E4F8] to-[#38BDF8] text-[#06101D] shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:shadow-[0_0_50px_rgba(56,189,248,0.9)]'
                  : 'bg-[#0B1528] text-white shadow-[0_4px_20px_rgba(11,21,40,0.25)] hover:bg-[#1E293B]'
              }`}
            >
              <span>{user ? 'OPEN LAB WORKSPACE' : 'OPEN LAB WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Secondary Action Button: Outline Dark Pill */}
            <button
              onClick={onLaunchScanner}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-full border font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-[#081120]/90 hover:bg-[#0C1A32] border-slate-700/80 hover:border-cyan-400 text-slate-200'
                  : 'bg-white hover:bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] shadow-sm'
              }`}
            >
              <Radio className={`w-4 h-4 animate-pulse ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>TEST RFID SCANNER</span>
            </button>

          </div>

          {/* 6 Capabilities Checklist (2 Columns x 3 Items) */}
          <div className={`mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-sans ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Multi-tenant Lab Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Printable Emergency QR PNG</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Staff Provisioning Panel</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Real-time Asset Reflection</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>128×64 OLED Hardware Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Secured Cryptographic Logs</span>
            </div>
          </div>

        </div>

        {/* Right Side: Floating Glowing Hardware Lab Image (Single image, theme glow, no text) */}
        <div className="relative flex-1 max-w-lg w-full flex justify-center lg:justify-end">
          <div className="relative w-full animate-float">
            
            {/* Ambient Cyan Theme Glow Behind the Image */}
            <div className={`absolute -inset-1 rounded-3xl blur-2xl transform scale-95 pointer-events-none ${
              isDark ? 'bg-cyan-400/25' : 'bg-sky-400/20'
            }`} />

            {/* Pure Single Glowing Frame without any text */}
            <div className={`relative rounded-3xl overflow-hidden border-2 aspect-[16/11] transition-transform duration-500 hover:scale-[1.02] ${
              isDark 
                ? 'border-cyan-400/60 shadow-[0_0_50px_rgba(56,189,248,0.45),0_0_90px_rgba(0,240,255,0.2)] bg-slate-950' 
                : 'border-[#96C2EC] shadow-[0_8px_32px_rgba(186,215,238,0.6)] bg-white'
            }`}>
              <img
                src="/hero-lab.jpg"
                alt="Universal Laboratory Hardware Equipment & Robotics Reflection"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.80)' }}
                loading="eager"
              />
            </div>

          </div>
        </div>

      </main>

      {/* Floating Bottom Horizontal Spec Bar */}
      <footer className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 pb-8 w-full flex justify-center">
        <div className={`w-full max-w-3xl px-6 sm:px-8 py-3.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-glass flex items-center justify-between gap-4 text-center sm:text-left ${
          isDark
            ? 'bg-[#08101F]/90 border-cyan-500/25 text-white'
            : 'bg-white/95 border-[#96C2EC] text-[#0B1528] shadow-[0_4px_24px_-2px_rgba(186,215,238,0.45)]'
        }`}>
          
          {/* Spec 1: 13.56 MHz */}
          <div className="flex-1">
            <div className={`font-heading font-extrabold text-base sm:text-lg tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              13.56 MHz
            </div>
            <div className={`text-[10px] sm:text-[11px] font-mono lowercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              rc522 rfid frequency
            </div>
          </div>

          <div className={`h-8 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-[#96C2EC]'}`} />

          {/* Spec 2: 128x64 */}
          <div className="flex-1">
            <div className={`font-heading font-extrabold text-base sm:text-lg tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              128×64
            </div>
            <div className={`text-[10px] sm:text-[11px] font-mono lowercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              ssd1306 oled live sync
            </div>
          </div>

          <div className={`h-8 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-[#96C2EC]'}`} />

          {/* Spec 3: < 50ms */}
          <div className="flex-1">
            <div className={`font-heading font-extrabold text-base sm:text-lg tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              &lt; 50ms
            </div>
            <div className={`text-[10px] sm:text-[11px] font-mono lowercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              esp32 scan latency
            </div>
          </div>

          <div className={`h-8 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-[#96C2EC]'}`} />

          {/* Spec 4: 100% */}
          <div className="flex-1">
            <div className={`font-heading font-extrabold text-base sm:text-lg tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              100%
            </div>
            <div className={`text-[10px] sm:text-[11px] font-mono lowercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              immutable audit vault
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
