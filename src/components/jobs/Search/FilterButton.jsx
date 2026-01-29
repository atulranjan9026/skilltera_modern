import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { THEME_CLASSES } from '../../../theme';

/**
 * Filter Button Component - Shows filter count and opens modal
 */
const FilterButton = ({ activeFilterCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-medium ${THEME_CLASSES.buttons.secondary} border border-slate-300 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md`}
    >
      <SlidersHorizontal size={18} />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
