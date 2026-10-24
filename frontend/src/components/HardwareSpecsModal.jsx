import React from 'react';
import { X, Cpu, Terminal, Radio, ShieldCheck, Copy, Check } from 'lucide-react';

export default function HardwareSpecsModal({ isOpen, onClose, isDark = true }) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-3xl my-8 rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-heading font-bold text-lg sm:text-xl tracking-wide uppercase ${
                isDark ? 'text-white' : 'text-[#0B1528]'
              }`}>
                HARDWARE INTEGRATION &amp; PINOUT ARCHITECTURE
              </h2>
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                ESP32 MINI &bull; RC522 13.56MHZ SPI &bull; SSD1306 128x64 I2C
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

        <div className="mt-6 space-y-6 text-xs font-mono">
          
          {/* Wiring Pinout Table */}
          <div>
            <h3 className={`font-heading font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2 ${
              isDark ? 'text-cyan-400' : 'text-cyan-800'
            }`}>
              <Radio className="w-4 h-4" />
              1. PHYSICAL GPIO WIRING SCHEMA
            </h3>
            <div className={`overflow-x-auto rounded-xl border ${
              isDark ? 'border-slate-800' : 'border-[#96C2EC]'
            }`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b ${
                  isDark ? 'bg-slate-900/90 text-cyan-300 border-slate-800' : 'bg-[#F4F8FC] text-[#0B1528] border-[#96C2EC]'
                }`}>
                  <tr>
                    <th className="p-2.5">Peripheral</th>
                    <th className="p-2.5">Module Pin</th>
                    <th className="p-2.5">ESP32 Pin</th>
                    <th className="p-2.5">Bus / Protocol</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-[#96C2EC] text-slate-600'
                }`}>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>RC522 RFID</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>SDA (SS)</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 5</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SPI Chip Select</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>RC522 RFID</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>SCK</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 18</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VSPI Clock</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>RC522 RFID</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>MOSI</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 23</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VSPI Master Out</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>RC522 RFID</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>MISO</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 19</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VSPI Master In</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>RC522 RFID</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>RST</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 27</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Module Reset</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>SSD1306 OLED</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>SDA</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 21</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>I2C Data (0x3C)</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>SSD1306 OLED</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>SCL</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>GPIO 22</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>I2C Clock</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-[#F4F8FC]/60'}>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-white' : 'text-[#0B1528]'}`}>VCC &amp; GND</td>
                    <td className={`p-2.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>VCC / GND</td>
                    <td className={`p-2.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>3.3V / GND</td>
                    <td className={`p-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Do not use 5V on RC522</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* API Contract */}
          <div>
            <h3 className={`font-heading font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2 ${
              isDark ? 'text-cyan-400' : 'text-cyan-800'
            }`}>
              <Terminal className="w-4 h-4" />
              2. ESP32 HARDWARE SCAN ENDPOINT CONTRACT
            </h3>
            <div className={`p-4 rounded-xl border text-xs ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-[#F4F8FC] border-[#96C2EC] text-[#0B1528]'
            }`}>
              <div className={`font-bold mb-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                POST /api/scan
              </div>
              <div className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Headers: <code className="text-magenta-500">x-device-key: esp32-memory-mirror-device-secret-key-9988</code>
              </div>
              <pre className={`p-3 rounded-lg overflow-x-auto text-[11px] ${
                isDark ? 'bg-slate-900 text-cyan-300' : 'bg-white text-[#0B1528] border border-[#96C2EC]'
              }`}>
{`// Payload sent by ESP32:
{
  "uid": "04:A3:2F:1B",
  "device_id": "lab-reader-1"
}

// 200 OK Response (Formatted for 128x64 OLED display):
{
  "registered": true,
  "uid": "04A32F1B",
  "asset": { "item_name": "Digital Oscilloscope", "status": "active", ... },
  "display": {
    "line1": "Tektronix TBS2000B Di",
    "line2": "Electronics Lab Alpha",
    "line3": "Status: active",
    "line4": "Last: 2026-10-15 cali"
  }
}`}
              </pre>
            </div>
          </div>

          {/* Firmware Flash Instructions */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-slate-900/80 border-cyan-500/20' : 'bg-[#F4F8FC] border-[#96C2EC]'
          }`}>
            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
            <div>
              <span className={`font-heading font-bold text-xs uppercase block ${
                isDark ? 'text-white' : 'text-[#0B1528]'
              }`}>
                FIRMWARE SOURCE CODE READY
              </span>
              <p className={`text-[11px] mt-1 leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                The complete Arduino C++ sketch is available in <code className={isDark ? 'text-cyan-400' : 'text-cyan-700 font-semibold'}>firmware/memory_mirror_esp32.ino</code>. Open it in Arduino IDE or PlatformIO, enter your WiFi SSID/Password, and upload to your ESP32 Mini!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
