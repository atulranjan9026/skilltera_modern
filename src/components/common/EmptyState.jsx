import React from 'react';

/**
 * EmptyState Component - Show when no results found
 */
export default function EmptyState({ title = 'No jobs found', description = 'Try adjusting your filters or search terms' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center max-w-md">{description}</p>
    </div>
  );
}
