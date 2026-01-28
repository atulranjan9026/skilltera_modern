import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

/**
 * Filter Button Component - Shows filter count and opens modal
 */
const FilterButton = ({ activeFilterCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all duration-200 flex items-center gap-2"
    >
      <SlidersHorizontal size={18} />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
