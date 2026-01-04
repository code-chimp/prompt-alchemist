import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        base: 'var(--base)',
        mantle: 'var(--mantle)',
        crust: 'var(--crust)',
        text: 'var(--text)',
        subtext1: 'var(--subtext-1)',
        subtext0: 'var(--subtext-0)',
        mauve: 'var(--mauve)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        yellow: 'var(--yellow)',
        red: 'var(--red)',
        surface0: 'var(--surface-0)',
        surface1: 'var(--surface-1)',
        surface2: 'var(--surface-2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 20s linear infinite',
        'pulse-slow': 'pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  /* eslint-disable-next-line @typescript-eslint/no-require-imports */
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
