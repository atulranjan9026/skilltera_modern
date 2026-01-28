import React from 'react';
import { THEME_CLASSES } from '../../theme';

/**
 * Input Component - Reusable input field
 */
export default function Input({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <input {...props} className={`${THEME_CLASSES.inputs} text-sm`} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
