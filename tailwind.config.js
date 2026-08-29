/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0D1512',
        'dark-surface': '#13221C',
        'dark-card': '#17251F',
        ink: '#F3F4F6',
        'ink-soft': '#9CA3AF',
        'ink-muted': '#6B7280',
        forest: '#10B981',
        'forest-dark': '#065F46',
        'forest-light': '#34D399',
        paper: '#13221C',
        'paper-dim': '#0F1A15',
        gold: '#F59E0B',
        'gold-light': '#FCD34D',
        brick: '#EF4444',
        line: 'rgba(207, 203, 187, 0.15)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        stamp: '0 0 15px rgba(199,154,46,0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
