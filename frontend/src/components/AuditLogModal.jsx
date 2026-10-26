import React, { useState, useEffect } from 'react';
import { X, Wrench, ShieldCheck, Tag, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { addMaintenanceLog } from '../api/client';
import confetti from 'canvas-confetti';

export default function AuditLogModal({ isOpen, onClose, asset, onLogged, isDark = true }) {
  const [assistantName, setAssistantName] = useState('Dr. Evelyn Vance');
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logType, setLogType] = useState('inspection');
  const [description, setDescription] = useState('');
  const [partsInput, setPartsInput] = useState('');
  const [partsList, setPartsList] = useState([]);
  const [statusAfter, setStatusAfter] = useState(asset?.status || 'active');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear stale fields when opening a new audit log
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setPartsInput('');
      setPartsList([]);
      setError('');
      if (asset?.status) setStatusAfter(asset.status);
    }
  }, [isOpen, asset?.uid]);

  if (!isOpen || !asset) return null;

  const handleAddPart = () => {
    if (!partsInput.trim()) return;
    setPartsList([...partsList, partsInput.trim()]);
    setPartsInput('');
  };

  const handleRemovePart = (index) => {
    setPartsList(partsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim() || description.trim().length < 3) {
      setError('Description must be at least 3 characters.');
      return;
    }

    try {
      setLoading(true);
      const newLog = await addMaintenanceLog(asset.uid, {
        assistant_name: assistantName.trim(),
        log_date: logDate,
        log_type: logType,
        description: description.trim(),
        parts_replaced: partsList,
        status_after: statusAfter,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#FF007F', '#38BDF8'],
      });

      onLogged(newLog, statusAfter);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit maintenance log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-xl my-8 rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        isDark
          ? 'glass-aero-dark border-magenta-500/30 text-white'
          : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-magenta-500/20' : 'border-[#96C2EC]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
              isDark ? 'bg-magenta-950/80 border-magenta-500/40 text-magenta-300' : 'bg-magenta-50 border-magenta-200 text-magenta-700'
            }`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl uppercase tracking-wider">
                APPEND MAINTENANCE LOG
              </h2>
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                {asset.item_name} &bull; [{asset.uid}]
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-[#F4F8FC] text-slate-500 hover:text-[#0B1528]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-5 space-y-4">
          
          {/* Assistant Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                TECHNICIAN / ASSISTANT *
              </label>
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                autoComplete="off"
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                LOG DATE *
              </label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              />
            </div>
          </div>

          {/* Classification & Status After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                LOG CLASSIFICATION *
              </label>
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              >
                <option value="inspection">Regular Inspection</option>
                <option value="repair">Corrective Repair</option>
                <option value="calibration">Traceable Calibration</option>
                <option value="cleaning">Cleaning / Decon</option>
                <option value="part_replacement">Part Replacement</option>
                <option value="other">Other Incident</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                UPDATE STATUS TO
              </label>
              <select
                value={statusAfter}
                onChange={(e) => setStatusAfter(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-cyan-200 focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              >
                <option value="active">Active in Service</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="faulty">Flagged as Faulty</option>
                <option value="retired">Decommissioned</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
              WORK DESCRIPTION &amp; NOTES *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Recalibrated NIST frequency reference, cleaned optical window, verified grounding."
              required
              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-white border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-cyan-600'
              }`}
            />
          </div>

          {/* Parts Replaced */}
          <div>
            <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
              PARTS REPLACED (OPTIONAL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={partsInput}
                onChange={(e) => setPartsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPart(); } }}
                placeholder="e.g. Probe Cable, Fuse 5A"
                autoComplete="off"
                className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              />
              <button
                type="button"
                onClick={handleAddPart}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
                    : 'bg-[#F4F8FC] hover:bg-[#96C2EC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                }`}
              >
                + ADD
              </button>
            </div>

            {partsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {partsList.map((part, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                      isDark ? 'bg-slate-800 border-slate-700 text-cyan-300' : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528]'
                    }`}
                  >
                    <span>+{part}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePart(i)}
                      className="opacity-50 hover:opacity-100 hover:text-rose-500 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Audit guarantee note */}
          <div className={`p-3 rounded-xl border text-[11px] font-mono flex items-center gap-2 ${
            isDark ? 'border-current/10 opacity-60 text-slate-300' : 'border-[#96C2EC] bg-[#F4F8FC] text-slate-600'
          }`}>
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>Immutable Audit Trail: Once committed, entries cannot be deleted or edited.</span>
          </div>

          {/* Submit Buttons */}
          <div className={`pt-3 flex items-center justify-end gap-3 border-t ${isDark ? 'border-current/10' : 'border-[#96C2EC]'}`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-5 py-2 rounded-full text-xs font-heading font-semibold uppercase transition-opacity ${
                isDark ? 'opacity-70 hover:opacity-100 text-slate-300' : 'text-slate-600 hover:text-[#0B1528]'
              }`}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 ${
                isDark
                  ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white hover:shadow-glow-magenta'
                  : 'bg-[#0B1528] text-white hover:bg-[#1E293B]'
              }`}
            >
              {loading ? 'COMMITTING...' : 'SAVE AUDIT ENTRY'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
