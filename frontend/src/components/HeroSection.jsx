import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, Zap, Radio, Activity, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ stats, onLaunchConsole, onOpenRegister, onSimulateScan }) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden border-b border-cyan-500/10">
      
      {/* Ambient Atmospheric Lighting Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-sky-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[350px] h-[250px] bg-magenta-vibrant/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Technical Coordinate Crosses */}
      <div className="absolute top-6 left-8 text-cyan-500/30 font-mono text-xs select-none">+ 01 // SYS.ROOT</div>
      <div className="absolute top-6 right-8 text-cyan-500/30 font-mono text-xs select-none">NODE.LOC: 127.0.0.1:3000 +</div>
      <div className="absolute bottom-6 left-8 text-cyan-500/20 font-mono text-xs select-none">+ SEC.PROT: RC522-SPI</div>
      <div className="absolute bottom-6 right-8 text-cyan-500/20 font-mono text-xs select-none">OLED: SSD1306-I2C +</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Aero Badge */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-glow-cyan-sm text-xs font-mono text-cyan-300"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ESP32 MINI &bull; RC522 13.56MHz RFID &bull; OLED SSD1306</span>
          </motion.div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-[0.08em] uppercase text-white leading-tight"
          >
            PROJECT <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">MEMORY</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-vibrant to-magenta-glow">MIRROR</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-slate-300 text-base sm:text-xl font-sans font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Universal Physical Object Digital History &amp; Asset Maintenance Tracker. Tap any physical tag to instantly reveal equipment telemetry, cryptographic audit logs, and printable emergency QR codes.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {/* Glowing Pink Launch Console Button */}
            <button
              onClick={onLaunchConsole}
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-magenta-vibrant via-magenta-dark to-[#99004d] text-white font-heading font-bold text-sm tracking-[0.16em] uppercase shadow-glow-magenta hover:shadow-[0_0_40px_rgba(244,63,94,0.75)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>LAUNCH CONSOLE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>

            {/* Cyan Outlined Secondary Action */}
            <button
              onClick={() => onSimulateScan('04A32F1B')}
              className="flex items-center gap-2.5 px-6 py-4 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 font-heading font-semibold text-sm tracking-[0.12em] uppercase transition-all duration-300 shadow-glow-cyan-sm hover:scale-105"
            >
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>TEST RFID SCAN</span>
            </button>
          </motion.div>
        </div>

        {/* Live Status Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Card 1: Active Equipment */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 relative group hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">TRACKED ASSETS</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              {stats?.total_assets ?? 0}
            </div>
            <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{stats?.active ?? 0} Active in Service</span>
            </div>
          </div>

          {/* Card 2: Under Maintenance */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 relative group hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">IN MAINTENANCE</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-amber-300 tracking-wide">
              {stats?.under_maintenance ?? 0}
            </div>
            <div className="mt-2 text-xs font-mono text-amber-400/80">
              {stats?.faulty ?? 0} Pending Repairs
            </div>
          </div>

          {/* Card 3: Total Audit Logs */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 relative group hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">AUDIT LOG TRAIL</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              {stats?.total_logs ?? 0}
            </div>
            <div className="mt-2 text-xs font-mono text-cyan-300">
              Immutable Records
            </div>
          </div>

          {/* Card 4: ESP32 Hardware Scans */}
          <div className="glass-panel rounded-2xl p-5 border border-magenta-500/25 relative group hover:border-magenta-400/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase">TOTAL RFID SCANS</span>
              <Radio className="w-4 h-4 text-magenta-vibrant" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-magenta-300 tracking-wide">
              {stats?.total_scans ?? 0}
            </div>
            <div className="mt-2 text-xs font-mono text-magenta-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-magenta-400" />
              <span>Real-Time Broadcast</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
