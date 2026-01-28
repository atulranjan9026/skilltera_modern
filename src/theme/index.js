/**
 * Global Theme Configuration
 * Centralized color system that can be changed from one place
 */

export const THEME = {
  colors: {
    primary: {
      50: '#fff5eb',
      100: '#ffe8d1',
      200: '#ffd1a3',
      300: '#ffb370',
      400: '#ff8c3a',
      500: '#fd7e14', // Main brand color
      600: '#e06b00',
      700: '#c25d00',
      800: '#9e4d00',
      900: '#7a3c00',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8',
    },
    border: '#e2e8f0',
    accent: '#fd7e14',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Tailwind CSS class utilities based on theme
 * Use these classes throughout the app for consistency
 */
export const THEME_CLASSES = {
  buttons: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  },
  cards: 'bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
  inputs: 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  badges: {
    primary: 'bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    success: 'bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    warning: 'bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    info: 'bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
  },
};
