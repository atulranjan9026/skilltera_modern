import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Input Component - Reusable input field with label, error, and icon support
 */
const Input = React.forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="group">
      {label && (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={cn('input', Icon && 'pl-10', className)}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
