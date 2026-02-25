import React from 'react';

/**
 * Consistent page header used across all pages
 */
export function PageHeader({ label, title, subtitle, action }) {
  return (
    <div className="page-header flex items-start justify-between">
      <div>
        {label && <p className="page-header-label">{label}</p>}
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
