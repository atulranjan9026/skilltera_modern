import React from 'react';
import { Search } from 'lucide-react';

/**
 * EmptyState Component - Show when no results found
 */
export default function EmptyState({
  icon: Icon = Search,
  title = 'No results found',
  jobDescription = 'Try adjusting your filters or search terms',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
        <Icon size={26} className="text-slate-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{jobDescription}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
