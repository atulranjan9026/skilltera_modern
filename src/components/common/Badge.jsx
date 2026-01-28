import React from 'react';
import { THEME_CLASSES } from '../../theme';

/**
 * Badge Component - Display tags and labels
 */
export default function Badge({ children, variant = 'primary' }) {
  const variantClass = THEME_CLASSES.badges[variant] || THEME_CLASSES.badges.primary;
  return <span className={variantClass}>{children}</span>;
}
