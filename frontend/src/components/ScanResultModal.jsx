import React, { useEffect, useState } from 'react';
import {
  X,
  Radio,
  Cpu,
  Tag,
  Calendar,
  MapPin,
  Wrench,
  QrCode,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Trash2,
  Lock,
  Copy,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Play a futuristic two-tone RFID scan chime using HTML5 Web Audio API
function playScanChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.3);
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

export default function ScanResultModal({
  isOpen,
  onClose,
  scannedData,
  currentWorkspace,
  userRole = 'admin',
  onLogMaintenance,
  onOpenQr,
  onOpenDetails,
  onRegisterAsset,
  onDeleteAsset,
  isDark = true,
}) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Trigger audio chime on popup open
  useEffect(() => {
    if (isOpen && scannedData) {
      playScanChime();
    }
  }, [isOpen, scannedData?.uid]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !scannedData) return null;

  const isRegistered = scannedData.registered !== false && scannedData.asset;
  const asset = scannedData.asset || {};
  const display = scannedData.display || {
    line1: asset.item_name || 'SCAN COMPLETE',
    line2: asset.department || scannedData.uid,
    line3: asset.status ? `STATUS: ${asset.status.toUpperCase()}` : 'UID CAPTURED',
    line4: 'MEMORY MIRROR',
  };
  const maintenance = scannedData.maintenance || { total: 0, recent: [] };
  const lastLog = maintenance.recent?.[0];

  // Determine Lab Ownership
  // Case A: Unregistered
  // Case B: Registered in Current User's Lab
  // Case C: Registered in Another Lab
  const isSameLab = isRegistered && (
    !currentWorkspace || 
    !scannedData.workspace_id || 
    scannedData.workspace_id === currentWorkspace.id
  );
  const isOtherLab = isRegistered && !isSameLab;

  const handleCopyUid = () => {
    if (scannedData?.uid) {
      navigator.clipboard.writeText(scannedData.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDeleteClick = async () => {
    if (!asset.uid) return;
    try {
      setDeleting(true);
      await onDeleteAsset(asset.uid);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE
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
            FAULTY
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            REGISTERED
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto transition-colors ${
        isDark ? 'bg-black/80' : 'bg-slate-900/40'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-2xl my-6 rounded-3xl p-6 sm:p-8 border transition-all ${
            isDark
              ? 'border-cyan-400/50 bg-[#0A1120] text-slate-100 shadow-[0_0_60px_rgba(0,240,255,0.25)]'
              : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          {isDark && (
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
              isOtherLab ? 'bg-rose-500/15' : isSameLab ? 'bg-emerald-500/15' : 'bg-cyan-500/15'
            }`} />
          )}

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-current/10">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-11 h-11 rounded-2xl border ${
                isOtherLab
                  ? 'bg-rose-950 border-rose-500/50 text-rose-400 shadow-glow-rose-sm'
                  : isSameLab
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                  : 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-glow-cyan-sm'
              }`}>
                {isOtherLab ? (
                  <Lock className="w-5 h-5 text-rose-400 animate-pulse" />
                ) : (
                  <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-extrabold text-base sm:text-lg tracking-wider uppercase">
                    RFID SCAN DETECTED
                  </h2>
                  <span className={`w-2 h-2 rounded-full animate-ping ${
                    isOtherLab ? 'bg-rose-400' : isSameLab ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`} />
                </div>
                <span className="font-mono text-xs opacity-60">
                  {scannedData.scanned_at
                    ? `Scanned at ${new Date(scannedData.scanned_at).toLocaleTimeString()}`
                    : 'Real-time hardware tap'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-[#F4F8FC] text-slate-500 hover:text-[#0B1528]'
              }`}
              title="Close Popup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tag UID Pill Banner */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Tag className="w-4 h-4 text-cyan-400" />
              <span className="opacity-70">SCANNED RFID UID:</span>
              <span className="font-bold tracking-widest text-sm text-cyan-300">
                {scannedData.uid}
              </span>
            </div>

            <button
              onClick={handleCopyUid}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY UID</span>
                </>
              )}
            </button>
          </div>

          {/* Physical ESP32 OLED 128x64 Emulation */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-cyan-400/80 mb-1.5 pb-1 border-b border-cyan-900/50">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>ESP32 SSD1306 OLED (128×64) HARDWARE DISPLAY</span>
              </span>
              <span className="text-emerald-400 font-bold">LIVE SYNCED</span>
            </div>
            <div className="space-y-0.5 text-cyan-300 font-mono text-[11px] sm:text-xs tracking-wider">
              <div className="truncate">&gt; {display.line1}</div>
              <div className="truncate">&gt; {display.line2}</div>
              <div className="truncate">&gt; {display.line3}</div>
              <div className="truncate text-cyan-400/70">&gt; {display.line4}</div>
            </div>
          </div>

          {/* CASE 1: REGISTERED IN SAME LAB */}
          {isSameLab && (
            <div className="mt-4 space-y-4">
              {/* Lab Ownership Banner */}
              <div className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DETECTED IN YOUR LAB WORKSPACE</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {currentWorkspace?.code || 'ACTIVE LAB'}
                </span>
              </div>

              {/* Asset Information Showcase */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className={`w-full sm:w-36 h-36 rounded-2xl overflow-hidden border shrink-0 relative group ${
                  isDark ? 'border-slate-800 bg-slate-950' : 'border-[#96C2EC] bg-white'
                }`}>
                  <img
                    src={asset.image_url || '/placeholder.png'}
                    alt={asset.item_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                      {asset.category || 'EQUIPMENT'}
                    </span>
                    {getStatusBadge(asset.status)}
                  </div>

                  <h3 className={`font-heading font-black text-lg sm:text-xl leading-snug ${
                    isDark ? 'text-white' : 'text-[#0B1528]'
                  }`}>
                    {asset.item_name}
                  </h3>

                  <div className={`grid grid-cols-2 gap-2 text-xs font-mono pt-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{asset.department || 'Main Lab Bay'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Purchased: {asset.purchase_date || 'N/A'}</span>
                    </div>

                    {asset.cost !== undefined && asset.cost !== null && (
                      <div className="col-span-2 text-xs font-mono font-bold text-emerald-400">
                        Asset Valuation: ₹{Number(asset.cost).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Maintenance summary line */}
              {lastLog && (
                <div className={`p-3 rounded-xl border text-xs font-mono ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>LAST SERVICE LOG ({lastLog.log_date})</span>
                    </span>
                    <span className="text-[10px] opacity-60">By {lastLog.assistant_name}</span>
                  </div>
                  <p className="text-[11px] mt-1 line-clamp-1 opacity-80">
                    &ldquo;{lastLog.description}&rdquo;
                  </p>
                </div>
              )}

              {/* The 2 Primary Action Buttons requested: SEE DETAILS & DELETE ASSET */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onOpenDetails(asset.uid)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-heading font-extrabold uppercase tracking-wider transition-all shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 hover:bg-cyan-900 border-cyan-400 text-cyan-300 shadow-glow-cyan-sm'
                      : 'bg-[#0B1528] hover:bg-[#1E293B] text-white border-transparent'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>SEE DETAILS</span>
                </button>

                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-heading font-extrabold uppercase tracking-wider transition-all bg-rose-950/70 hover:bg-rose-900 border-rose-500/50 text-rose-300 hover:text-white shadow-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>{deleting ? 'DELETING...' : 'DELETE ASSET'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CASE 2: REGISTERED IN ANOTHER LAB */}
          {/* ------------------------------------------------------------- */}
          {isOtherLab && (
            <div className="mt-4 p-5 rounded-2xl bg-rose-950/30 border border-rose-500/50 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm sm:text-base uppercase text-rose-300">
                    ALREADY REGISTERED IN ANOTHER LAB!
                  </h3>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    This RFID tag is already bound to another laboratory workspace:
                  </p>
                </div>
              </div>

              {/* Lab Ownership Info Card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Laboratory:</span>
                  <strong className="text-white">{scannedData.workspace_name || 'Other Facility'}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tenant Lab Code:</span>
                  <span className="text-cyan-300 font-bold">{scannedData.workspace_code || 'LAB-TENANT'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Item Name:</span>
                  <span className="text-rose-300 font-semibold truncate max-w-[200px]">{asset.item_name || 'Registered Gear'}</span>
                </div>
              </div>

              {/* Explanatory security warning */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Security Policy:</strong> This asset cannot be registered in your lab until the administrator of that facility removes or deletes it from their workspace.
                </span>
              </div>

              {/* Locked Button */}
              <div className="pt-1">
                <button
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-400/80 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>REGISTRATION LOCKED BY {scannedData.workspace_code || 'OTHER LAB'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CASE 3: UNREGISTERED TAG (Free Tag) */}
          {/* ------------------------------------------------------------- */}
          {!isRegistered && (
            <div className="mt-4 p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Tag className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm sm:text-base uppercase text-cyan-300">
                    UNREGISTERED / FREE RFID TAG DETECTED
                  </h3>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    This RFID tag (UID: <strong>{scannedData.uid}</strong>) is not yet registered in any lab. You can bind and register it to your workspace immediately!
                  </p>
                </div>
              </div>

              {/* Target Lab confirmation */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-xs flex items-center justify-between">
                <span className="text-slate-400">Target Lab:</span>
                <strong className="text-cyan-300">{currentWorkspace?.name || 'My Lab Workspace'}</strong>
              </div>

              {/* Action to Register in Current Lab */}
              <div className="pt-1">
                <button
                  onClick={() => onRegisterAsset(scannedData.uid)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-black text-xs uppercase tracking-wider shadow-glow-cyan-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <span>+ REGISTER IN THIS LAB ({currentWorkspace?.code || 'MY LAB'})</span>
                </button>
              </div>
            </div>
          )}

          {/* Dismiss Close button */}
          <div className="mt-5 pt-3 border-t border-current/10 flex justify-end">
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
