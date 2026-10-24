import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Tag, Cpu, DollarSign, Calendar, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { createAsset } from '../api/client';

export default function RegisterAssetModal({ isOpen, onClose, onCreated, initialUid = '', isDark = true, userRole }) {
  const [uid, setUid] = useState(initialUid || '');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Test & Measurement');
  const [department, setDepartment] = useState('Electronics Lab Alpha');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('active');

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleGenerateUid = () => {
    const hex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    setUid(hex);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype || file.type)) {
      setError('Please select a valid JPEG, PNG, or WebP photo.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo exceeds 5 MB file size limit.');
      return;
    }

    setError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, or WebP images are supported.');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!uid.trim()) {
      setError('RFID tag UID is required (8-20 hex characters).');
      return;
    }
    if (!itemName.trim()) {
      setError('Item name is required.');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('uid', uid.trim());
      fd.append('item_name', itemName.trim());
      fd.append('category', category.trim());
      fd.append('department', department.trim());
      if (purchaseDate) fd.append('purchase_date', purchaseDate);
      if (cost) fd.append('cost', cost);
      fd.append('status', status);
      if (imageFile) fd.append('image', imageFile);

      const created = await createAsset(fd);
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register equipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/60' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-2xl my-8 rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        isDark
          ? 'glass-aero-dark border-cyan-500/30 text-white'
          : 'border-[#96C2EC] bg-white text-[#0B1528] shadow-[0_20px_60px_-15px_rgba(186,215,238,0.7)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-cyan-500/20' : 'border-[#96C2EC]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
              isDark ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-[#EDF5FD] border-[#D0E3F7] text-cyan-700'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl uppercase tracking-wider">
                REGISTER PHYSICAL EQUIPMENT
              </h2>
              <span className={`text-xs font-mono ${isDark ? 'opacity-60' : 'text-slate-500'}`}>
                BIND RC522 RFID TAG &bull; UPLOAD PHOTO &bull; INITIALIZE AUDIT LOG
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-current/10 transition-colors"
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* RFID UID row with auto-generate button */}
          <div>
            <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
              RFID TAG UID (8-20 HEX CHARACTERS) *
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-2.5 w-4 h-4 text-cyan-500 opacity-60" />
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 04:A3:2F:1B"
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-xl font-mono text-xs border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-cyan-200 focus:border-cyan-400'
                      : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateUid}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300'
                    : 'bg-[#F4F8FC] hover:bg-[#96C2EC] border-[#96C2EC] text-[#0B1528] shadow-sm'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>GENERATE</span>
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
              EQUIPMENT NAME / MODEL *
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Tektronix 4-Channel Digital Storage Oscilloscope"
              required
              className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                  : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
              }`}
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              >
                <option value="Test & Measurement">Test &amp; Measurement</option>
                <option value="Additive Manufacturing">Additive Manufacturing</option>
                <option value="Rapid Fabrication">Rapid Fabrication</option>
                <option value="Assembly Tools">Assembly Tools</option>
                <option value="Precision Machining">Precision Machining</option>
                <option value="RF & Wireless Test">RF &amp; Wireless Test</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                LAB / DEPARTMENT *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Electronics Lab Alpha"
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-[#96C2EC] text-[#0B1528] focus:border-cyan-600'
                }`}
              />
            </div>
          </div>

          {/* Date, Cost & Initial Status */}
          {/* Date, Cost (Admin Only) & Initial Status */}
          <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                PURCHASE DATE
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-[#96C2EC] text-[#0B1528]'
                }`}
              />
            </div>

            {userRole === 'admin' && (
              <div>
                <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                  ESTIMATED VALUE (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-[#96C2EC] text-[#0B1528]'
                  }`}
                />
              </div>
            )}

            <div>
              <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                INITIAL STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-[#96C2EC] text-[#0B1528]'
                }`}
              >
                <option value="active">Active</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="faulty">Faulty</option>
              </select>
            </div>
          </div>

          {/* Photo Upload Area */}
          <div>
            <label className={`block text-[11px] font-mono font-semibold uppercase mb-1 ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
              EQUIPMENT PHOTO (JPEG, PNG, WEBP)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-current/20 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 text-xs font-mono text-white"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setPreviewUrl(''); }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-xs font-mono text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  isDark
                    ? 'border-slate-700 hover:border-cyan-400 bg-slate-900/60'
                    : 'border-[#96C2EC] hover:border-cyan-500 bg-[#F4F8FC]'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-1.5 opacity-60 animate-bounce text-cyan-500" />
                <p className="text-xs font-mono font-semibold">
                  Click to select photo or drag and drop
                </p>
                <span className={`text-[10px] font-mono block mt-0.5 ${isDark ? 'opacity-50' : 'text-slate-500'}`}>
                  Max file size: 5 MB &bull; Instant Cloud Sync
                </span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={`pt-4 flex items-center justify-end gap-3 border-t ${isDark ? 'border-current/10' : 'border-[#96C2EC]'}`}>
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
              {loading ? 'REGISTERING...' : 'REGISTER ASSET'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
