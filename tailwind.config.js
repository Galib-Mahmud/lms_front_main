/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14231D',
        forest: '#1F3B32',
        'forest-light': '#2C5245',
        paper: '#ECEAE1',
        'paper-dim': '#E2DFD3',
        gold: '#C79A2E',
        'gold-light': '#E4C775',
        brick: '#B0463B',
        'ink-soft': '#4B5A54',
        line: '#CFCBBB',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '6px',
      },
      boxShadow: {
        stamp: '0 0 0 2px rgba(199,154,46,0.35)',
      },
    },
  },
  plugins: [],
};
