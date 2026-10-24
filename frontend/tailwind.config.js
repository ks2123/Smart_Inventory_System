/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#070B14',
          subtle: '#0B1120',
          elevated: '#0F172A',
        },
        navy: {
          950: '#040711',
          900: '#070B14',
          850: '#0B1120',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        cyan: {
          glow: '#00F0FF',
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0284C7',
        },
        magenta: {
          glow: '#FF007F',
          DEFAULT: '#F43F5E',
          vibrant: '#EC4899',
          dark: '#BE123C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -3px rgba(0, 240, 255, 0.45)',
        'glow-cyan-sm': '0 0 12px 0 rgba(56, 189, 248, 0.35)',
        'glow-magenta': '0 0 30px -3px rgba(244, 63, 94, 0.55)',
        'glow-magenta-sm': '0 0 14px 0 rgba(236, 72, 153, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 4s linear infinite',
        'glow-ping': 'glowPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        glowPing: {
          '75%, 100%': {
            transform: 'scale(1.6)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
}
