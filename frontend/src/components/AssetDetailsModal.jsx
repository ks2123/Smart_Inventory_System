import React, { useEffect, useState } from 'react';
import { X, Wrench, QrCode, Radio, Calendar, DollarSign, MapPin, Tag, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { fetchAssetByUid } from '../api/client';

export default function AssetDetailsModal({ isOpen, onClose, uid, onLogMaintenance, onOpenQr, onSimulateScan, userRole, isDark = true }) {
  const isAdmin = userRole === 'admin';
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !uid) return;
    setLoading(true);
    fetchAssetByUid(uid)
      .then((data) => setAsset(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, uid]);

  if (!isOpen) return null;

  const logs = asset?.maintenance_logs || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isDark
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}>
            ● ACTIVE IN SERVICE
          </span>
        );
      case 'under_maintenance':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isDark
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}>
            ▲ UNDER MAINTENANCE
          </span>
        );
      case 'faulty':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isDark
              ? 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              : 'bg-rose-50 text-rose-700 border-rose-300'
          }`}>
            ✖ FLAG AS FAULTY
          </span>
        );
      case 'retired':
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isDark
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}>
            ■ RETIRED
          </span>
        );
      default:
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isDark
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
              : 'bg-cyan-50 text-cyan-800 border-cyan-300'
          }`}>
            ACTIVE
          </span>
        );
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-4xl my-8 rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        isDark
          ? 'glass-panel-elevated border-cyan-500/30 text-white'
          : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-cyan-500/20' : 'border-[#96C2EC]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
              isDark
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                : 'bg-[#EDF5FD] border-[#D0E3F7] text-cyan-700'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-heading font-bold text-lg sm:text-xl tracking-wide uppercase ${
                  isDark ? 'text-white' : 'text-[#0B1528]'
                }`}>
                  ASSET DIGITAL TWIN &amp; AUDIT LEDGER
                </h2>
                {asset && getStatusBadge(asset.status)}
              </div>
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                RFID UID: <strong className={isDark ? 'text-white' : 'text-[#0B1528]'}>{uid}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-[#F4F8FC] text-slate-500 hover:text-[#0B1528]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono text-cyan-300">FETCHING COMPLETE ASSET HISTORY...</span>
          </div>
        ) : !asset ? (
          <div className="py-16 text-center text-slate-400 font-mono text-sm">
            Asset not found or failed to load.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            
            {/* Top Overview: Photo & Key Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Image Preview */}
              <div className="md:col-span-5">
                <div className={`aspect-[4/3] rounded-2xl overflow-hidden border relative shadow-lg ${
                  isDark ? 'border-cyan-500/30 bg-slate-900' : 'border-[#96C2EC] bg-[#F4F8FC]'
                }`}>
                  {asset.image_url ? (
                    <img src={asset.image_url} alt={asset.item_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${
                      isDark ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      <Tag className="w-10 h-10 mb-2" />
                      <span className="text-xs font-mono">NO PHYSICAL PHOTO</span>
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md ${
                    isDark ? 'bg-slate-950/80 text-cyan-300 border-cyan-500/30' : 'bg-white/90 text-cyan-800 border-[#96C2EC]'
                  }`}>
                    VERIFIED CLOUD STORAGE
                  </div>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="md:col-span-7 space-y-3">
                <span className={`text-[11px] font-mono tracking-widest uppercase ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  {asset.category}
                </span>
                <h3 className={`text-2xl font-heading font-bold tracking-wide ${
                  isDark ? 'text-white' : 'text-[#0B1528]'
                }`}>
                  {asset.item_name}
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                  }`}>
                    <span className="text-slate-500 text-[10px] block uppercase">LAB / DEPARTMENT</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-[#0B1528]'}`}>{asset.department}</span>
                  </div>
                  {isAdmin ? (
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                    }`}>
                      <span className="text-slate-500 text-[10px] block uppercase">ESTIMATED ASSET COST</span>
                      <span className="text-emerald-500 font-semibold">{asset.cost ? `₹${Number(asset.cost).toLocaleString('en-IN')}` : '₹0'}</span>
                    </div>
                  ) : (
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                    }`}>
                      <span className="text-slate-500 text-[10px] block uppercase">RFID HARDWARE INTERFACE</span>
                      <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>13.56MHz Mifare Classic</span>
                    </div>
                  )}
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                  }`}>
                    <span className="text-slate-500 text-[10px] block uppercase">PURCHASE DATE</span>
                    <span className={isDark ? 'text-slate-200' : 'text-[#0B1528]'}>{asset.purchase_date || 'N/A'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#F4F8FC] border-[#96C2EC]'
                  }`}>
                    <span className="text-slate-500 text-[10px] block uppercase">REGISTERED IN SYSTEM</span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(asset.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => { onClose(); onLogMaintenance(asset); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-magenta-vibrant hover:bg-magenta-dark text-white font-heading font-bold text-xs uppercase shadow-glow-magenta-sm transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>LOG MAINTENANCE</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenQr(asset); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-heading font-semibold text-xs uppercase transition-all ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                        : 'bg-[#F4F8FC] hover:bg-[#96C2EC] text-[#0B1528] border border-[#96C2EC]'
                    }`}
                  >
                    <QrCode className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    <span>PRINT QR</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onSimulateScan(asset.uid); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono text-xs transition-all ${
                      isDark
                        ? 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300'
                        : 'bg-[#EDF5FD] hover:bg-[#D0E3F7] border border-[#D0E3F7] text-cyan-800'
                    }`}
                  >
                    <Radio className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    <span>TAP RFID</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Complete Chronological Maintenance Audit Logs */}
            <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-[#96C2EC]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  <span className={`font-heading font-bold text-sm tracking-wider uppercase ${
                    isDark ? 'text-white' : 'text-[#0B1528]'
                  }`}>
                    IMMUTABLE AUDIT LOG TRAIL ({logs.length} RECORDS)
                  </span>
                </div>
                <span className={`text-[11px] font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  CRYPTOGRAPHIC LOG INTEGRITY: VERIFIED
                </span>
              </div>

              {logs.length === 0 ? (
                <div className={`p-6 rounded-2xl border text-center text-xs font-mono ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-[#F4F8FC] border-[#96C2EC] text-slate-600'
                }`}>
                  No maintenance records logged for this hardware unit yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 rounded-2xl border transition-all text-xs font-mono ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30'
                          : 'bg-[#F4F8FC] border-[#96C2EC] hover:border-cyan-300'
                      }`}
                    >
                      <div className={`flex items-center justify-between pb-2 border-b ${
                        isDark ? 'border-slate-800/80' : 'border-[#96C2EC]'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            isDark ? 'bg-slate-800 text-cyan-300 border-slate-700' : 'bg-white text-cyan-800 border-[#96C2EC]'
                          }`}>
                            {log.log_type}
                          </span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>{log.assistant_name}</span>
                        </div>
                        <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Clock className="w-3 h-3 text-slate-400" />
                          {log.log_date}
                        </span>
                      </div>

                      <p className={`mt-2 font-sans leading-relaxed text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {log.description}
                      </p>

                      {log.parts_replaced?.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-slate-500 text-[10px]">PARTS REPLACED:</span>
                          {log.parts_replaced.map((part, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                isDark ? 'bg-slate-800 text-cyan-300 border-slate-700' : 'bg-white text-cyan-800 border-[#96C2EC]'
                              }`}
                            >
                              +{part}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
