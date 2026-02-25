import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Consistent card component used across all pages
 */
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm',
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Section card with header
 */
export function SectionCard({ title, subtitle, children, className, action }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="section-header flex items-center justify-between">
          <div>
            {title && <h3 className="section-header-title">{title}</h3>}
            {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </Card>
  );
}

/**
 * Stat card for dashboards
 */
export function StatCard({ value, label, sub, className }) {
  return (
    <Card className={cn('p-5', className)}>
      <p className="text-3xl font-bold text-primary-600 mb-0.5 tabular-nums">{value}</p>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </Card>
  );
}
