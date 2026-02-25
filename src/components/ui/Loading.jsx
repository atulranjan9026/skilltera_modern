import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Full-page loading spinner
 */
export function PageLoading({ message = 'Loading...' }) {
  return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <Loader size={32} className="animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-slate-600 text-sm">{message}</p>
      </div>
    </div>
  );
}

/**
 * Inline loading spinner
 */
export function Spinner({ size = 20, className }) {
  return <Loader size={size} className={cn('animate-spin text-primary-600', className)} />;
}

/**
 * Shimmer skeleton block for loading states
 */
export function Shimmer({ className = '' }) {
  return (
    <div className={cn('relative overflow-hidden bg-slate-100 rounded-xl', className)}>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ animation: 'shimmer 1.4s infinite' }}
      />
    </div>
  );
}
