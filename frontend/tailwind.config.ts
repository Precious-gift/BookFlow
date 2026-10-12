import type { Config } from 'tailwindcss';

/**
 * Authoritative BookFlow Design Tokens Configuration
 * Aligned with ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md §5, §6, §7, §8
 *
 * Serves as the typed TypeScript token reference catalog satisfying Ticket T-06.
 * Runtime CSS utility class generation in Tailwind CSS v4 is executed directly
 * via the @theme directive in src/app/globals.css.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Tokens (AUTHORITATIVE_FOUNDATION_v1.1 §5)
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#EFF6FF',
        },
        secondary: {
          accent: '#0D9488',
          hover: '#0F766E',
        },
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F1F5F9',
          tertiary: '#E2E8F0',
        },
        border: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1',
          focus: '#2563EB',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        // Semantic Status Tokens (AUTHORITATIVE_FOUNDATION_v1.1 §6 & Backlog T-06)
        status: {
          pending: {
            DEFAULT: '#F59E0B',
            text: '#B45309',
            bg: '#FEF3C7',
            border: '#FCD34D',
          },
          confirmed: {
            DEFAULT: '#0284C7',
            text: '#0369A1',
            bg: '#E0F2FE',
            border: '#BAE6FD',
          },
          completed: {
            DEFAULT: '#10B981',
            text: '#047857',
            bg: '#D1FAE5',
            border: '#A7F3D0',
          },
          cancelled: {
            DEFAULT: '#F43F5E',
            text: '#BE123C',
            bg: '#FFE4E6',
            border: '#FECDD3',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography System (AUTHORITATIVE_FOUNDATION_v1.1 §7)
        'display': ['2rem', { lineHeight: '2.375rem', fontWeight: '600' }], // 32px / 38px
        'heading-page': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px / 32px
        'heading-section': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '600' }], // 18px / 26px
        'heading-card': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }], // 16px / 24px
        'metric-value': ['1.75rem', { lineHeight: '2.125rem', fontWeight: '700' }], // 28px / 34px
        'body-primary': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px / 20px
        'body-secondary': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '400' }], // 13px / 18px
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }], // 12px / 16px
        'button': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }], // 14px / 20px
      },
      borderRadius: {
        // Border Radius Tokens (AUTHORITATIVE_FOUNDATION_v1.1 §8)
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      spacing: {
        // 8-Point Grid Rhythm Spacing (AUTHORITATIVE_FOUNDATION_v1.1 §8)
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};

export default config;
