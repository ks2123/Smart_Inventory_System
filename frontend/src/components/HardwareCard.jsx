import React from 'react';
import { Cpu, Radio, ShieldCheck, QrCode, Wrench, Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HardwareCard({ scannedData, onLogMaintenance, onOpenQr, onOpenDetails, onRegister, isDark }) {
  if (!scannedData) return null;

  const isRegistered = scannedData.registered !== false && scannedData.asset;
  const asset = scannedData.asset || {};
  const display = scannedData.display || { line1: '', line2: '', line3: '', line4: '' };
  const maintenance = scannedData.maintenance || { total: 0, recent: [] };
  const lastLog = maintenance.recent?.[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE IN SERVICE
          </span>
        );
      case 'under_maintenance':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            UNDER MAINTENANCE
          </span>
        );
      case 'faulty':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            FLAGGED AS FAULTY
          </span>
        );
      case 'retired':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            RETIRED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            ACTIVE
          </span>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scannedData.uid + (scannedData.scanned_at || '')}
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`rounded-3xl p-6 sm:p-8 lg:p-10 border my-8 transition-all duration-300 ${
          isDark
            ? 'glass-aero-dark border-cyan-400/40 shadow-glow-cyan'
            : 'bg-white border-[#96C2EC] shadow-[0_8px_32px_rgba(186,215,238,0.5)] text-[#0B1528]'
        }`}
      >
        {/* Top Scanned Header Bar - Spacious & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-current/10">
          <div className="flex items-center gap-3.5">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border ${
              isDark 
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-glow-cyan-sm' 
                : 'bg-[#F4F8FC] border-[#96C2EC] text-sky-600'
            }`}>
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm sm:text-base tracking-widest uppercase">
                  ACTIVE HARDWARE RFID SCAN
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <span className="font-mono text-xs opacity-60">
                SCANNED AT: {scannedData.scanned_at ? new Date(scannedData.scanned_at).toLocaleTimeString() : 'JUST NOW'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tag UID Pill */}
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-mono text-xs ${
              isDark 
                ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 shadow-sm' 
                : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528]'
            }`}>
              <Tag className="w-4 h-4 text-cyan-500" />
              <span className="opacity-60 text-[10px]">RFID UID:</span>
              <span className="font-bold tracking-widest text-sm">{scannedData.uid}</span>
            </div>

            {isRegistered && getStatusBadge(asset.status)}
          </div>
        </div>

        {/* Unregistered Notice */}
        {!isRegistered ? (
          <div className="py-12 text-center max-w-lg mx-auto">
            <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mb-4">
              <Radio className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase tracking-wider">
              UNREGISTERED RFID TAG DETECTED
            </h3>
            <p className="mt-2 text-xs font-mono opacity-70">
              UID <strong className="text-cyan-400">{scannedData.uid}</strong> is not bound to any equipment in this lab workspace.
            </p>

            {onRegister && (
              <div className="mt-5">
                <button
                  onClick={() => onRegister(scannedData.uid)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-black text-xs uppercase tracking-wider shadow-glow-cyan-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Tag className="w-4 h-4" />
                  <span>+ REGISTER DETECTED RFID ({scannedData.uid})</span>
                </button>
              </div>
            )}
            
            {/* OLED Buffer */}
            <div className="mt-6 oled-screen rounded-2xl p-5 text-left border border-slate-800 shadow-xl">
              <div className="text-[10px] text-cyan-400 font-mono mb-2 flex items-center justify-between border-b border-cyan-900/50 pb-1">
                <span>SSD1306 128×64 OLED BUFFER</span>
                <span>ESP32 I2C 0x3C</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-cyan-200">
                <div className="font-bold text-white">&gt; {display.line1 || 'UNREGISTERED TAG'}</div>
                <div className="text-cyan-400">&gt; {display.line2 || scannedData.uid}</div>
                <div className="text-amber-300">&gt; {display.line3 || 'Register in console'}</div>
                <div className="text-slate-500">&gt; {display.line4 || ''}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Registered Asset: Spacious & Well-Organized Layout */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1 (4 cols): Physical Image & Hardware Badges */}
            <div className="lg:col-span-4 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-current/15 bg-slate-900 relative shadow-md">
                {asset.image_url ? (
                  <img
                    src={asset.image_url}
                    alt={asset.item_name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-40 p-4 text-center">
                    <Cpu className="w-12 h-12 mb-2" />
                    <span className="text-xs font-mono">NO PHYSICAL PHOTO STORED</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                  PHYSICAL ASSET
                </div>
              </div>

              {/* Location & Indian Rupee Valuation Row */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-3.5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                }`}>
                  <span className="opacity-50 text-[10px] uppercase tracking-wider block">ASSIGNED BAY</span>
                  <div className="font-semibold truncate flex items-center gap-1.5 mt-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="truncate">{asset.department}</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                }`}>
                  <span className="opacity-50 text-[10px] uppercase tracking-wider block">VALUATION (INR)</span>
                  <div className="font-bold text-emerald-400 text-sm mt-1">
                    {asset.cost ? `₹${Number(asset.cost).toLocaleString('en-IN')}` : '₹0'}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 (5 cols): Equipment Details, Specs & Maintenance Entry */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  {asset.category}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-heading font-black tracking-wide mt-1 leading-snug ${
                  isDark ? 'text-white' : 'text-[#0B1528]'
                }`}>
                  {asset.item_name}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono opacity-70">
                  <span>Purchased: {asset.purchase_date || 'N/A'}</span>
                  <span>&bull;</span>
                  <span>{maintenance.total} Service Records</span>
                </div>
              </div>

              {/* Latest Audit Entry Box */}
              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono pb-2.5 border-b border-current/10 opacity-70">
                  <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`}>
                    <Wrench className="w-3.5 h-3.5" />
                    LATEST SERVICE ENTRY
                  </span>
                  <span>{lastLog?.log_date || 'No logs yet'}</span>
                </div>

                {lastLog ? (
                  <div className="mt-3 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-slate-300" : "text-slate-600"}>Technician: <strong className={isDark ? "text-white font-heading" : "text-[#0B1528] font-heading"}>{lastLog.assistant_name}</strong></span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        isDark ? 'bg-slate-800 text-cyan-300 border border-cyan-800' : 'bg-white text-slate-800 border border-[#96C2EC] shadow-sm'
                      }`}>
                        {lastLog.log_type}
                      </span>
                    </div>
                    <p className="opacity-85 font-sans leading-relaxed text-xs">
                      {lastLog.description}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2.5 text-xs opacity-50 font-mono">
                    No physical maintenance notes recorded yet.
                  </p>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onLogMaintenance(asset)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white shadow-glow-magenta hover:shadow-[0_0_25px_rgba(244,63,94,0.7)] transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>LOG MAINTENANCE</span>
                </button>

                <button
                  onClick={() => onOpenQr(asset)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-full border transition-all ${
                    isDark ? 'btn-pill-aero-dark' : 'btn-pill-aero'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>EMERGENCY QR</span>
                </button>

                <button
                  onClick={() => onOpenDetails(asset.uid)}
                  className={`p-2.5 rounded-full border transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400' 
                      : 'bg-white border-[#96C2EC] text-[#0B1528] hover:bg-[#F4F8FC] shadow-sm'
                  }`}
                  title="Inspect Full Audit Vault History"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Column 3 (3 cols): SSD1306 128x64 OLED Display Screen */}
            <div className="lg:col-span-3">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-mono opacity-70 pb-2 mb-3 border-b border-current/10">
                  <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="w-3.5 h-3.5" />
                    ESP32 OLED 128×64
                  </span>
                  <span>I2C 0x3C</span>
                </div>

                {/* Simulated OLED Monochrome Screen */}
                <div className="oled-screen rounded-2xl p-4 min-h-[120px] flex flex-col justify-between">
                  <div className="space-y-1.5 font-mono text-[11px] text-cyan-300">
                    <div className="font-bold text-white truncate">
                      {display.line1 || asset.item_name}
                    </div>
                    <div className="text-cyan-400 truncate">
                      {display.line2 || asset.department}
                    </div>
                    <div className="text-sky-300 truncate">
                      {display.line3 || `Status: ${asset.status}`}
                    </div>
                    <div className="text-slate-400 truncate text-[10px]">
                      {display.line4 || 'Ready'}
                    </div>
                  </div>

                  <div className="pt-2 mt-3 border-t border-cyan-950/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>RC522 // GPIO 5</span>
                    <span className="text-emerald-400 font-bold">LIVE SYNC</span>
                  </div>
                </div>

                <p className="mt-3 text-[10px] font-mono opacity-60 text-center leading-relaxed">
                  21-character line buffer formatted and transmitted to SSD1306 physical display.
                </p>
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
