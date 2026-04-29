/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        parchment: '#F5EFE0',
        sand: '#E8DCC8',
        linen: '#EDE8DF',
        taupe: '#C4B49A',
        umber: '#8B7355',
        sienna: '#6B4F3A',
        espresso: '#2C1810',
        sage: '#7C8C6E',
        'sage-light': '#A8B89A',
        terracotta: '#C4704A',
        'terra-light': '#E8967A',
        slate: '#4A5568',
        muted: '#8B8074',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(139, 115, 85, 0.12)',
        'warm-lg': '0 8px 48px rgba(139, 115, 85, 0.18)',
        'inset-warm': 'inset 0 2px 8px rgba(139, 115, 85, 0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },

}
