import React, { useState, useMemo } from 'react';
import { Radio, Search, Filter } from 'lucide-react';

export default function RfidSimulator({ onScan, scanning, isDark, assets = [] }) {
  const [deviceId] = useState('lab-reader-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Comprehensive Preset RFID Tag fleet with reliable, verified high-resolution lab images
  const defaultPresets = [
    {
      label: 'Tektronix Digital Oscilloscope',
      uid: '04A32F1B',
      category: 'Test & Measurement',
      status: 'active',
      department: 'Bay 2',
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Bantam Desktop CNC Router',
      uid: '82B41C90',
      category: 'Precision Machining',
      status: 'under_maintenance',
      department: 'Rapid Machining',
      image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Storage Cupboard #4 (Lockable Tools)',
      uid: 'F0E1D2C3',
      category: 'Storage & Tooling',
      status: 'active',
      department: 'Central Storage',
      image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Formlabs Form 4 SLA 3D Printer',
      uid: '1A2B3C4D',
      category: 'Additive Manufacturing',
      status: 'active',
      department: 'Prototyping Bay',
      image_url: 'https://images.unsplash.com/photo-1581092217951-a96860dbd637?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'KUKA KR 6 Articulated Robot Arm',
      uid: '99AA88BB',
      category: 'Robotics & Actuators',
      status: 'faulty',
      department: 'Workcell A',
      image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Weller WXsmart Soldering Station',
      uid: '55EE44FF',
      category: 'Assembly & Rework',
      status: 'active',
      department: 'SMT Bench 1',
      image_url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Rigol Real-Time Spectrum Analyzer',
      uid: 'AA11BB22',
      category: 'Test & Measurement',
      status: 'active',
      department: 'RF Shield Room',
      image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Chemical Flammables Cupboard #1',
      uid: 'CC33DD44',
      category: 'Storage & Tooling',
      status: 'active',
      department: 'Safety Cell',
      image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Unregistered RFID Test Tag #99',
      uid: 'E2000019',
      category: 'Unregistered',
      status: 'active',
      department: 'Unassigned',
      image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Merge with any dynamically added assets from props
  const allTags = useMemo(() => {
    const list = defaultPresets.map((preset) => {
      const match = assets.find((a) => a.uid.toUpperCase() === preset.uid.toUpperCase());
      return {
        ...preset,
        image_url: match?.image_url || preset.image_url,
      };
    });

    assets.forEach((a) => {
      if (!list.some((item) => item.uid.toUpperCase() === a.uid.toUpperCase())) {
        list.push({
          label: a.item_name,
          uid: a.uid,
          category: a.category || 'Test & Measurement',
          status: a.status || 'active',
          department: a.department || 'Main Lab',
          image_url: a.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        });
      }
    });
    return list;
  }, [assets]);

  const categories = useMemo(() => {
    const set = new Set(allTags.map((t) => t.category));
    return ['ALL', ...Array.from(set)];
  }, [allTags]);

  const statuses = [
    { label: 'ALL STATUS', value: 'ALL' },
    { label: 'ACTIVE', value: 'active' },
    { label: 'UNDER MAINTENANCE', value: 'under_maintenance' },
    { label: 'FAULTY', value: 'faulty' },
  ];

  // Filtered Tags
  const filteredTags = useMemo(() => {
    return allTags.filter((tag) => {
      const matchSearch =
        !searchQuery ||
        tag.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'ALL' || tag.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || tag.status === selectedStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [allTags, searchQuery, selectedCategory, selectedStatus]);

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
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            READY
          </span>
        );
    }
  };

  return (
    <div className="pb-8">

      {/* RECTANGLE TOOLBAR: Search, Category Select & Status Select Navbar */}
      <div className={`p-4 rounded-2xl border transition-all mb-6 ${
        isDark 
          ? 'bg-slate-900/60 border-slate-800' 
          : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.45)]'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* 1. Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-2.5 w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RFID tag name, UID, category, or location..."
              autoComplete="off"
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528] placeholder-slate-400 focus:border-sky-500'
              }`}
            />
          </div>

          {/* 2. Category Select Dropdown (Default: ALL) */}
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

            {/* 3. Status Select Dropdown (Default: ALL) */}
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

        {/* Counter & Reset Filter Bar */}
        <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-mono opacity-70">
          <span>SHOWING {filteredTags.length} OF {allTags.length} CONFIGURED RFID CARDS</span>
          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedStatus('ALL'); }}
              className="text-cyan-400 hover:underline font-bold"
            >
              RESET FILTERS
            </button>
          )}
        </div>
      </div>

      {/* FILTERED PRE-CONFIGURED RFID CARDS GRID */}
      <div>
        {filteredTags.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border text-xs font-mono opacity-60 ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-[#96C2EC] bg-[#F4F8FC]'
          }`}>
            No RFID chips match your search &amp; filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.uid}
                className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-400/50 hover:shadow-glow-cyan-sm'
                    : 'bg-white border-[#96C2EC] shadow-[0_4px_20px_-2px_rgba(186,215,238,0.4)] hover:border-sky-300 hover:shadow-[0_8px_25px_-2px_rgba(186,215,238,0.6)]'
                }`}
              >
                {/* Equipment Photo Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950/60">
                  <img
                    src={tag.image_url}
                    alt={tag.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* UID Badge (Top Left) */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold backdrop-blur-md border ${
                      isDark 
                        ? 'bg-slate-950/80 text-cyan-300 border-cyan-500/40 shadow-sm' 
                        : 'bg-[#F4F8FC] text-[#0B1528] border-[#96C2EC] shadow-sm'
                    }`}>
                      UID: {tag.uid}
                    </span>
                  </div>

                  {/* Status Badge (Top Right) */}
                  <div className="absolute top-2.5 right-2.5 backdrop-blur-md rounded-full">
                    {getStatusBadge(tag.status)}
                  </div>

                  {/* Department & Category Overlay (Bottom) */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="truncate max-w-[170px] bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {tag.department}
                    </span>
                    <span className="text-cyan-400 font-bold bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {tag.category}
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Button */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h4 className={`font-heading font-bold text-sm tracking-wide line-clamp-1 transition-colors ${
                      isDark ? 'text-white group-hover:text-cyan-300' : 'text-[#0B1528] group-hover:text-sky-600'
                    }`}>
                      {tag.label}
                    </h4>
                  </div>

                  {/* Tap Scan Action Button */}
                  <button
                    onClick={() => onScan(tag.uid, deviceId)}
                    disabled={scanning}
                    className={`w-full py-2.5 px-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isDark
                        ? 'bg-cyan-950/70 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 hover:shadow-glow-cyan-sm'
                        : 'bg-[#0B1528] hover:bg-[#1E293B] text-white shadow-sm'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-cyan-400 group-hover:text-current animate-pulse" />
                    <span>TAP RFID TO ESP32</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
