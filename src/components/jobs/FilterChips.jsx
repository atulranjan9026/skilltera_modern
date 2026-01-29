import React from 'react';
import { X, Briefcase, DollarSign, Clock, Building, MapPin } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';

/**
 * Filter Chips Component - Displays active filter chips with remove functionality
 */
const FilterChips = ({ filters, onRemoveFilter, onClearAllFilters }) => {
  const getFilterChips = () => {
    const chips = [];
    
    // Job Type chips
    filters.jobType.forEach(type => {
      chips.push({ type: 'jobType', value: type, label: type, icon: Briefcase });
    });
    
    // Salary Range chip
    if (filters.salaryRange) {
      chips.push({ type: 'salaryRange', value: null, label: filters.salaryRange, icon: DollarSign });
    }
    
    // Experience chips
    filters.experience.forEach(exp => {
      chips.push({ type: 'experience', value: exp, label: exp, icon: Clock });
    });
    
    // Company Type chips
    filters.companyType.forEach(company => {
      chips.push({ type: 'companyType', value: company, label: company, icon: Building });
    });
    
    // Date Posted chip
    if (filters.datePosted) {
      const dateLabels = {
        '24h': 'Last 24 hours',
        '3d': 'Last 3 days',
        '7d': 'Last week',
        '14d': 'Last 2 weeks',
        '30d': 'Last month'
      };
      chips.push({ type: 'datePosted', value: null, label: dateLabels[filters.datePosted], icon: Clock });
    }
    
    // Remote chip
    if (filters.remote) {
      chips.push({ type: 'remote', value: null, label: 'Remote Only', icon: MapPin });
    }
    
    return chips;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.jobType.length > 0) count += filters.jobType.length;
    if (filters.salaryRange) count += 1;
    if (filters.experience.length > 0) count += filters.experience.length;
    if (filters.companyType.length > 0) count += filters.companyType.length;
    if (filters.datePosted) count += 1;
    if (filters.remote) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const filterChips = getFilterChips();

  if (filterChips.length === 0) return null;

  return (
    <div className="w-full">
      <div className={`${THEME_CLASSES.cards} p-4`}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-slate-600">
            Active Filters ({activeFilterCount})
          </span>
          <div className="flex flex-wrap gap-2 flex-1">
            {filterChips.map((chip, index) => {
              const Icon = chip.icon;
              return (
                <div
                  key={`${chip.type}-${chip.value}-${index}`}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-sm font-medium transition-colors group`}
                >
                  <Icon size={14} />
                  <span>{chip.label}</span>
                  <button
                    onClick={() => onRemoveFilter(chip.type, chip.value)}
                    className="ml-1 hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={onClearAllFilters}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterChips;
