// Enhanced Design System Tokens
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    semantic: {
      success: {
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
        900: '#064e3b',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
        900: '#78350f',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        900: '#7f1d1d',
      },
      info: {
        50: '#f0fdfa',
        500: '#06b6d4',
        600: '#0891b2',
        900: '#134e4a',
      },
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  spacing: {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  animations: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  transitions: {
    colors: ['color', 'background-color', 'border-color', 'text-decoration-color', 'fill', 'stroke'],
    opacity: ['opacity'],
    shadow: ['box-shadow'],
    transform: ['transform'],
    all: ['all'],
  },
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    tooltip: '1600',
  },
};

// Component-specific tokens
export const componentTokens = {
  button: {
    sizes: {
      sm: {
        height: '2rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        borderRadius: tokens.borderRadius.md,
      },
      md: {
        height: '2.5rem',
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        borderRadius: tokens.borderRadius.md,
      },
      lg: {
        height: '3rem',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: tokens.borderRadius.md,
      },
      xl: {
        height: '3.5rem',
        padding: '1rem 2rem',
        fontSize: '1rem',
        borderRadius: tokens.borderRadius.lg,
      },
    },
    variants: {
      primary: {
        backgroundColor: tokens.colors.primary[500],
        color: 'white',
        '&:hover': {
          backgroundColor: tokens.colors.primary[600],
        },
        '&:active': {
          backgroundColor: tokens.colors.primary[700],
        },
      },
      secondary: {
        backgroundColor: tokens.colors.secondary[100],
        color: tokens.colors.secondary[900],
        '&:hover': {
          backgroundColor: tokens.colors.secondary[200],
        },
        '&:active': {
          backgroundColor: tokens.colors.secondary[300],
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: tokens.colors.primary[500],
        border: `1px solid ${tokens.colors.primary[500]}`,
        '&:hover': {
          backgroundColor: tokens.colors.primary[50],
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: tokens.colors.secondary[700],
        '&:hover': {
          backgroundColor: tokens.colors.secondary[100],
        },
      },
    },
  },
  card: {
    variants: {
      elevated: {
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        boxShadow: tokens.shadows.md,
        padding: tokens.spacing[6],
      },
      flat: {
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.secondary[200]}`,
        padding: tokens.spacing[6],
      },
      outlined: {
        backgroundColor: 'transparent',
        borderRadius: tokens.borderRadius.lg,
        border: `1px solid ${tokens.colors.secondary[300]}`,
        padding: tokens.spacing[6],
      },
    },
  },
  input: {
    sizes: {
      sm: {
        height: '2rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: tokens.borderRadius.md,
      },
      md: {
        height: '2.5rem',
        padding: '0.625rem 0.875rem',
        fontSize: '0.875rem',
        borderRadius: tokens.borderRadius.md,
      },
      lg: {
        height: '3rem',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        borderRadius: tokens.borderRadius.md,
      },
    },
    variants: {
      outline: {
        border: `1px solid ${tokens.colors.secondary[300]}`,
        '&:focus': {
          borderColor: tokens.colors.primary[500],
          boxShadow: `0 0 0 3px ${tokens.colors.primary[100]}`,
        },
        '&:error': {
          borderColor: tokens.colors.semantic.error[500],
          boxShadow: `0 0 0 3px ${tokens.colors.semantic.error[100]}`,
        },
      },
      filled: {
        backgroundColor: tokens.colors.secondary[100],
        border: '1px solid transparent',
        '&:focus': {
          backgroundColor: 'white',
          borderColor: tokens.colors.primary[500],
          boxShadow: `0 0 0 3px ${tokens.colors.primary[100]}`,
        },
      },
    },
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: tokens.animations.duration[300] },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: tokens.animations.duration[300] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: tokens.animations.duration[200] },
  },
  bounce: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: tokens.animations.duration[300] },
  },
  pulse: {
    initial: { opacity: 1 },
    animate: { opacity: [1, 0.5, 1] },
    transition: { duration: tokens.animations.duration[1000], repeat: Infinity },
  },
};

// Utility functions
export const utils = {
  // Color utilities
  getColor: (path) => {
    const keys = path.split('.');
    let value = tokens.colors;
    for (const key of keys) {
      value = value[key];
      if (!value) return null;
    }
    return value;
  },
  
  // Spacing utilities
  getSpacing: (value) => {
    return tokens.spacing[value] || value;
  },
  
  // Typography utilities
  getTypography: (size, weight = 'normal') => {
    const [fontSize, lineHeight] = tokens.typography.fontSize[size] || ['1rem', '1.5rem'];
    return {
      fontSize,
      lineHeight,
      fontWeight: tokens.typography.fontWeight[weight],
    };
  },
  
  // Responsive utilities
  responsive: (values) => {
    if (typeof values === 'string') return values;
    
    const mediaQueries = Object.keys(breakpoints)
      .sort((a, b) => breakpoints[a].replace('px', '') - breakpoints[b].replace('px', ''))
      .map(key => `@media (min-width: ${breakpoints[key]})`);
    
    return values.map((value, index) => {
      if (index === 0) return value;
      return {
        [mediaQueries[index - 1]]: value,
      };
    });
  },
};

export default tokens;
