/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Core Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        health: {
          green: '#10b981', // Normal/Positive
          amber: '#f59e0b', // Attention
          red: '#ef4444',   // Urgent
        },
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          border: 'rgba(255, 255, 255, 0.05)',
          borderHover: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top center, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 1) 50%, rgba(15, 23, 42, 1) 100%)',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
      }
    },
  },
  plugins: [],
}
