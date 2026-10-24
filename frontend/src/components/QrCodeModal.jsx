import React, { useRef } from 'react';
import { X, Download, Printer, QrCode, Tag, MapPin, ShieldCheck, Cpu } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrCodeModal({ isOpen, onClose, asset, isDark = true }) {
  const qrRef = useRef(null);

  if (!isOpen || !asset) return null;

  // The digital history link encoded in the QR code
  const targetUrl = `${window.location.origin}/?uid=${asset.uid}`;
  const qrPayload = JSON.stringify({
    system: 'MEMORY_MIRROR',
    uid: asset.uid,
    item: asset.item_name,
    dept: asset.department,
    url: targetUrl,
  });

  // Download High-Res PNG with printable badge formatting
  const handleDownloadPng = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (!qrCanvas) return;

    // Create a high-res badge canvas
    const badgeCanvas = document.createElement('canvas');
    const ctx = badgeCanvas.getContext('2d');
    const width = 600;
    const height = 750;
    badgeCanvas.width = width;
    badgeCanvas.height = height;

    // Background: Deep obsidian
    ctx.fillStyle = '#070B14';
    ctx.fillRect(0, 0, width, height);

    // Cyan Neon Border
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner hairline border
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Top Header: System Brand
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Space Grotesk", sans-serif';
    ctx.fillText('PROJECT MEMORY MIRROR', 50, 70);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '14px monospace';
    ctx.fillText('PHYSICAL OBJECT DIGITAL HISTORY TAG', 50, 95);

    // Divider
    ctx.strokeStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(50, 115);
    ctx.lineTo(width - 50, 115);
    ctx.stroke();

    // Equipment Details
    ctx.fillStyle = '#7DD3FC';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('EQUIPMENT IDENTIFIER', 50, 145);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    // Wrap long names
    const itemName = asset.item_name.length > 36 ? asset.item_name.slice(0, 36) + '...' : asset.item_name;
    ctx.fillText(itemName, 50, 175);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px "Space Grotesk", sans-serif';
    ctx.fillText(`${asset.category} • ${asset.department}`, 50, 202);

    // RFID UID Banner
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(50, 225, width - 100, 48);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 225, width - 100, 48);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`RFID UID: ${asset.uid}`, 70, 255);

    // Draw the QR Code in center
    const qrSize = 300;
    const qrX = (width - qrSize) / 2;
    const qrY = 300;

    // White backing for QR code
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Footer instruction
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN WITH ANY SMARTPHONE CAMERA FOR INSTANT AUDIT LOGS', width / 2, 665);

    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`STATUS: ${asset.status.toUpperCase()} • COMPLIANCE CERTIFIED`, width / 2, 695);

    // Trigger PNG Download
    const dataUrl = badgeCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `MemoryMirror-Tag-${asset.uid}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-lg my-8 rounded-3xl p-6 sm:p-8 border transition-all ${
        isDark
          ? 'glass-panel-elevated border-cyan-400/40 shadow-glow-cyan text-white'
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
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-heading font-bold text-lg sm:text-xl tracking-wide uppercase ${
                isDark ? 'text-white' : 'text-[#0B1528]'
              }`}>
                EMERGENCY DYNAMIC QR CODE
              </h2>
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                PRINTABLE BADGE &bull; RAPID INCIDENT SCANNING
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

        {/* Printable Asset Tag Preview Card */}
        <div className={`mt-6 p-6 rounded-2xl border-2 shadow-2xl relative overflow-hidden text-center transition-all ${
          isDark ? 'bg-[#070B14] border-cyan-400/40' : 'bg-[#F4F8FC] border-cyan-500/40'
        }`}>
          
          {/* Tag Top Bar */}
          <div className={`flex items-center justify-between text-[11px] font-mono pb-3 border-b ${
            isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-[#96C2EC]'
          }`}>
            <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              MEMORY MIRROR TAG
            </span>
            <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{asset.uid}</span>
          </div>

          {/* Item details */}
          <div className="mt-3 text-left">
            <span className={`text-[10px] font-mono uppercase tracking-widest block ${
              isDark ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              {asset.category}
            </span>
            <h3 className={`font-heading font-bold text-base sm:text-lg truncate ${
              isDark ? 'text-white' : 'text-[#0B1528]'
            }`}>
              {asset.item_name}
            </h3>
            <div className={`flex items-center gap-1 text-xs font-mono mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <MapPin className="w-3 h-3 text-cyan-500" />
              <span>{asset.department}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div ref={qrRef} className="mt-5 inline-block p-4 rounded-2xl bg-white shadow-xl border border-slate-100">
            <QRCodeCanvas
              value={qrPayload}
              size={220}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Tag bottom info */}
          <div className={`mt-4 pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-[#96C2EC] text-slate-600'
          }`}>
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED LEDGER
            </span>
            <span className={`uppercase font-bold ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>{asset.status}</span>
          </div>

        </div>

        {/* Action Buttons Row */}
        <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${
          isDark ? 'border-slate-800' : 'border-[#96C2EC]'
        }`}>
          <button
            type="button"
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-heading font-semibold text-xs tracking-wider uppercase transition-all ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-[#F4F8FC] hover:bg-[#96C2EC] text-[#0B1528] border border-[#96C2EC]'
            }`}
          >
            <Printer className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
            <span>PRINT TAG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all shadow-md ${
              isDark
                ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white shadow-glow-magenta hover:shadow-[0_0_35px_rgba(244,63,94,0.7)] hover:scale-105'
                : 'bg-[#0B1528] hover:bg-[#1E293B] text-white hover:scale-105'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD PNG BADGE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
