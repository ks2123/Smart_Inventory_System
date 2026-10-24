import React from 'react';
import { Tag, Wrench, QrCode, ExternalLink, Trash2, MapPin, Radio, Calendar } from 'lucide-react';

export default function AssetCard({
  asset,
  onSelect,
  onLogMaintenance,
  onOpenQr,
  onSimulateScan,
  onDelete,
  isDark,
  userRole,
}) {
  const isAdmin = userRole === 'admin';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ACTIVE
          </span>
        );
      case 'under_maintenance':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            MAINT
          </span>
        );
      case 'faulty':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            FAULTY
          </span>
        );
      case 'retired':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            RETIRED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ACTIVE
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-400/50 hover:shadow-glow-cyan-sm'
          : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)] hover:border-sky-300 hover:shadow-[0_8px_25px_-2px_rgba(186,215,238,0.6)]'
      }`}
    >
      {/* 16:9 Equipment Photo Banner (Identical to RFID Simulator) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950/60">
        <img
          src={asset.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
          alt={asset.item_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/35" />

        {/* UID Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold backdrop-blur-md border ${
              isDark
                ? 'bg-slate-950/80 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-[#F4F8FC] text-[#0B1528] border-[#96C2EC] shadow-sm'
            }`}
          >
            UID: {asset.uid}
          </span>
        </div>

        {/* Status Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 backdrop-blur-md rounded-full">
          {getStatusBadge(asset.status)}
        </div>

        {/* Department & Category Overlay (Bottom) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300">
          <span className="truncate max-w-[170px] bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-cyan-400" />
            <span className="truncate">{asset.department}</span>
          </span>
          <span className="text-cyan-400 font-bold bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            {asset.category}
          </span>
        </div>
      </div>

      {/* Card Content & Action Area */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div>
          <h4
            onClick={() => onSelect(asset.uid)}
            className={`font-heading font-bold text-sm tracking-wide line-clamp-1 cursor-pointer transition-colors ${
              isDark ? 'text-white group-hover:text-cyan-300' : 'text-[#0B1528] group-hover:text-sky-600'
            }`}
            title="Click to view details"
          >
            {asset.item_name}
          </h4>

          {/* Valuation & Acquisition Meta */}
          <div className="mt-2 flex items-center justify-between text-xs font-mono opacity-80 pt-2 border-t border-current/10">
            <span className="flex items-center gap-1 text-[11px] opacity-70">
              <Calendar className="w-3 h-3 text-cyan-400" />
              {asset.purchase_date || 'N/A'}
            </span>
            {isAdmin ? (
              <span className="font-bold text-emerald-400 text-xs">
                {asset.cost ? `₹${Number(asset.cost).toLocaleString('en-IN')}` : '₹0'}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider">
                RFID BOUND
              </span>
            )}
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-col gap-2 pt-1 border-t border-current/10">
          {/* Primary Action Button (Matches RFID Tap Button) */}
          <button
            onClick={() => onSimulateScan(asset.uid)}
            className={`w-full py-2 px-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isDark
                ? 'bg-cyan-950/70 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 hover:shadow-glow-cyan-sm'
                : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-sm'
            }`}
            title="Simulate RFID Card Tap on ESP32"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 group-hover:text-current animate-pulse" />
            <span>TAP RFID TO ESP32</span>
          </button>

          {/* Secondary Quick Action Icons */}
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={() => onLogMaintenance(asset)}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-magenta-900/60 hover:text-magenta-300 text-slate-300 border border-slate-700/60'
                  : 'bg-[#F4F8FC] hover:bg-white text-[#0B1528] border border-[#96C2EC] shadow-sm'
              }`}
              title="Add Maintenance Log"
            >
              <Wrench className="w-3 h-3 text-magenta-400" />
              <span>LOG</span>
            </button>

            <button
              onClick={() => onOpenQr(asset)}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700/60 text-cyan-400 hover:bg-slate-700'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] hover:bg-white shadow-sm'
              }`}
              title="Dynamic Emergency QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelect(asset.uid)}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] hover:bg-white shadow-sm'
              }`}
              title="Full Asset & Audit Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {isAdmin && (
              <button
                onClick={() => onDelete(asset.uid)}
                className="p-1.5 rounded-lg border border-transparent hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all"
                title="Delete Asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
