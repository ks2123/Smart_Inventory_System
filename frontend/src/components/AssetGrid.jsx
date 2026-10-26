import React, { useState, useMemo } from 'react';
import AssetCard from './AssetCard';
import { Search, Plus, Tag, Cpu, Layers } from 'lucide-react';

export default function AssetGrid({
  assets = [],
  loading,
  onSelect,
  onLogMaintenance,
  onOpenQr,
  onSimulateScan,
  onDelete,
  onOpenRegister,
  isDark,
  user,
}) {
  const isAdmin = user?.role === 'admin';
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Dynamically extract categories from registered assets
  const categories = useMemo(() => {
    const set = new Set(assets.map((a) => a.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [assets]);

  const statuses = [
    { label: 'ALL STATUS', value: 'ALL' },
    { label: 'ACTIVE', value: 'active' },
    { label: 'UNDER MAINTENANCE', value: 'under_maintenance' },
    { label: 'FAULTY', value: 'faulty' },
  ];

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchCat = selectedCategory === 'ALL' || asset.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || asset.status === selectedStatus;
      const matchSearch =
        !search ||
        asset.item_name.toLowerCase().includes(search.toLowerCase()) ||
        asset.uid.toLowerCase().includes(search.toLowerCase()) ||
        (asset.department && asset.department.toLowerCase().includes(search.toLowerCase())) ||
        (asset.category && asset.category.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    });
  }, [assets, selectedCategory, selectedStatus, search]);

  return (
    <section className="pt-2 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`font-heading font-extrabold text-xl sm:text-2xl uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {isAdmin ? 'LAB ASSET FLEET & INVENTORY' : 'ASSIGNED LAB EQUIPMENT FLEET'}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              isDark ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-white border-transparent'
            }`}>
              {filtered.length} UNITS
            </span>
          </div>
          <p className="text-xs font-mono opacity-60 mt-1">
            {isAdmin
              ? 'Executive fleet oversight, asset valuations, and tamper-proof maintenance audit trails.'
              : 'Assigned equipment checklist for physical maintenance, RFID scanning, and service notes.'}
          </p>
        </div>

        {/* Register Action Button */}
        <button
          onClick={onOpenRegister}
          className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-heading font-bold uppercase tracking-wider rounded-full shadow-md transition-all self-start sm:self-auto active:scale-95 ${
            isDark
              ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white hover:shadow-glow-magenta'
              : 'bg-[#0B1528] text-white hover:bg-[#1E293B]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>NEW ASSET</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR (RECTANGULAR CONTROL BAR — IDENTICAL TO RFID SIMULATOR) */}
      <div className={`p-4 rounded-2xl border transition-all mb-6 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.45)]'
      }`}>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-2.5 w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset name, RFID UID, category, or lab location..."
              autoComplete="off"
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500'
              }`}
            />
          </div>

          {/* Category Dropdown Select (Default: ALL) */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-cyan-300 focus:border-cyan-400'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] focus:border-sky-500'
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'ALL CATEGORIES' : cat}
                </option>
              ))}
            </select>

            {/* Status Dropdown Select (Default: ALL) */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-cyan-300 focus:border-cyan-400'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] focus:border-sky-500'
              }`}
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Bar Info & Reset */}
        <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-mono opacity-70">
          <span>SHOWING {filtered.length} OF {assets.length} REGISTERED ASSETS</span>
          {(search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-cyan-400 hover:underline font-bold"
            >
              RESET FILTERS
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs font-mono opacity-60 uppercase tracking-widest">LOADING ASSETS...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-3xl p-12 text-center border max-w-md mx-auto ${
          isDark ? 'glass-aero-dark border-slate-800' : 'glass-aero-light border-[#0F172A]/15'
        }`}>
          <Tag className="w-10 h-10 mx-auto mb-3 opacity-40 text-cyan-400" />
          <h4 className="font-heading font-bold text-base uppercase">NO MATCHING EQUIPMENT</h4>
          <p className="text-xs font-mono opacity-60 mt-1 mb-5">
            No equipment matches your current search or category filter.
          </p>
          <button
            onClick={onOpenRegister}
            className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase transition-all shadow-md ${
              isDark
                ? 'bg-gradient-to-r from-magenta-vibrant to-magenta-dark text-white hover:shadow-glow-magenta'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            REGISTER NEW ITEM
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.uid}
              asset={asset}
              onSelect={onSelect}
              onLogMaintenance={onLogMaintenance}
              onOpenQr={onOpenQr}
              onSimulateScan={onSimulateScan}
              onDelete={onDelete}
              isDark={isDark}
              userRole={user?.role}
            />
          ))}
        </div>
      )}

    </section>
  );
}
