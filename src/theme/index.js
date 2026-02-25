/**
 * Design System Tokens
 * 
 * Primary source of truth: tailwind.config.js
 * This file provides JS-accessible tokens for programmatic use
 * and Tailwind class presets for component consistency.
 */

export const COLORS = {
  primary: {
    50: '#fff5eb',
    100: '#ffe8d1',
    200: '#ffd1a3',
    300: '#ffb370',
    400: '#ff8c3a',
    500: '#fd7e14',
    600: '#e06b00',
    700: '#c25d00',
    800: '#9e4d00',
    900: '#7a3c00',
  },
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};

/**
 * Reusable Tailwind class presets.
 * Use these to ensure consistent styling across all components.
 * 
 * Prefer using the CSS component classes (.card, .btn-primary, etc.)
 * defined in styles/index.css for common patterns.
 */
export const THEME_CLASSES = {
  // Card styles
  cards: 'bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow',

  // Input styles
  inputs: 'w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all duration-200',

  // Badge variants
  badges: {
    primary: 'bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    success: 'bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    warning: 'bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    error: 'bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    info: 'bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
    neutral: 'bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full',
  },

  // Button variants (for inline use; prefer <Button> component)
  buttons: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50',
  },
};
