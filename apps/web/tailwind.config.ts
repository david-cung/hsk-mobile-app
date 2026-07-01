import type { Config } from 'tailwindcss';

function color(token: string): string {
  return `var(--color-${token})`;
}

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: color('surface'),
        'surface-dim': color('surface-dim'),
        'surface-bright': color('surface-bright'),
        'surface-container-lowest': color('surface-container-lowest'),
        'surface-container-low': color('surface-container-low'),
        'surface-container': color('surface-container'),
        'surface-container-high': color('surface-container-high'),
        'surface-container-highest': color('surface-container-highest'),
        'surface-variant': color('surface-variant'),
        'surface-tint': color('surface-tint'),
        background: color('background'),
        'on-background': color('on-background'),
        'on-surface': color('on-surface'),
        'on-surface-variant': color('on-surface-variant'),
        'inverse-surface': color('inverse-surface'),
        'inverse-on-surface': color('inverse-on-surface'),
        outline: color('outline'),
        'outline-variant': color('outline-variant'),
        primary: color('primary'),
        'on-primary': color('on-primary'),
        'primary-container': color('primary-container'),
        'on-primary-container': color('on-primary-container'),
        'inverse-primary': color('inverse-primary'),
        'primary-fixed': color('primary-fixed'),
        'primary-fixed-dim': color('primary-fixed-dim'),
        'on-primary-fixed': color('on-primary-fixed'),
        'on-primary-fixed-variant': color('on-primary-fixed-variant'),
        secondary: color('secondary'),
        'on-secondary': color('on-secondary'),
        'secondary-container': color('secondary-container'),
        'on-secondary-container': color('on-secondary-container'),
        'secondary-fixed': color('secondary-fixed'),
        'secondary-fixed-dim': color('secondary-fixed-dim'),
        'on-secondary-fixed': color('on-secondary-fixed'),
        'on-secondary-fixed-variant': color('on-secondary-fixed-variant'),
        tertiary: color('tertiary'),
        'on-tertiary': color('on-tertiary'),
        'tertiary-container': color('tertiary-container'),
        'on-tertiary-container': color('on-tertiary-container'),
        'tertiary-fixed': color('tertiary-fixed'),
        'tertiary-fixed-dim': color('tertiary-fixed-dim'),
        'on-tertiary-fixed': color('on-tertiary-fixed'),
        'on-tertiary-fixed-variant': color('on-tertiary-fixed-variant'),
        error: color('error'),
        'on-error': color('on-error'),
        'error-container': color('error-container'),
        'on-error-container': color('on-error-container'),
      },
      spacing: {
        unit: 'var(--spacing-unit)',
        'margin-mobile': 'var(--spacing-margin-mobile)',
        'gutter-mobile': 'var(--spacing-gutter-mobile)',
        'stack-sm': 'var(--spacing-stack-sm)',
        'stack-md': 'var(--spacing-stack-md)',
        'stack-lg': 'var(--spacing-stack-lg)',
        'card-padding': 'var(--spacing-card-padding)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        latin: 'var(--font-latin)',
        chinese: 'var(--font-chinese)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        button: 'var(--shadow-button)',
      },
      ringWidth: {
        focus: 'var(--focus-ring-width)',
      },
      ringColor: {
        focus: 'var(--focus-ring-color)',
      },
    },
  },
  plugins: [],
};

export default config;
