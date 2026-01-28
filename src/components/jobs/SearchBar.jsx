import React from 'react';
import { MapPin } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';
import AdvancedFilterModal from './AdvancedFilterModal';
import FilterChips from './FilterChips';
import SearchInput from './SearchInput';
import FilterButton from './FilterButton';

/**
 * SearchBar Component - Unified Search with Advanced Filters
 */
export default function SearchBar({ onSearch }) {
  const [jobTitle, setJobTitle] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  
  // Advanced filter states
  const [filters, setFilters] = React.useState({
    jobType: [],
    salaryRange: '',
    experience: [],
    companyType: [],
    datePosted: '',
    remote: false,
  });

  const handleSearch = () => {
    onSearch({ jobTitle, location, ...filters });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    onSearch({ jobTitle, location, ...newFilters });
  };

  const removeFilter = (filterType, value = null) => {
    setFilters(prev => {
      let updated = { ...prev };
      if (value) {
        // Remove specific value from array
        updated[filterType] = prev[filterType].filter(v => v !== value);
      } else {
        // Clear entire filter
        updated[filterType] = Array.isArray(prev[filterType]) ? [] : '';
      }
      return updated;
    });
    // Trigger search with updated filters
    setTimeout(() => {
      const updated = { ...filters };
      if (value) {
        updated[filterType] = filters[filterType].filter(v => v !== value);
      } else {
        updated[filterType] = Array.isArray(filters[filterType]) ? [] : '';
      }
      onSearch({ jobTitle, location, ...updated });
    }, 0);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      jobType: [],
      salaryRange: '',
      experience: [],
      companyType: [],
      datePosted: '',
      remote: false,
    };
    setFilters(resetFilters);
    onSearch({ jobTitle, location, ...resetFilters });
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

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Job Title Input */}
          <SearchInput
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Job title, keywords, or company"
          />

          {/* Location Input */}
          <div className="flex-1 w-full flex items-center px-4 py-3">
            <MapPin size={20} className="text-slate-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="City, state, or zip"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Advanced Filter Button */}
          <div className="w-full md:w-auto p-2 flex gap-2">
            <FilterButton
              activeFilterCount={activeFilterCount}
              onClick={() => setShowFilterModal(true)}
            />
            
            <button
              onClick={handleSearch}
              className={`${THEME_CLASSES.buttons.primary} px-8 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm`}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <FilterChips
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAllFilters={clearAllFilters}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Add CSS animation for modal */}
      <style jsx>{`
        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal-slide-up {
          animation: modal-slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
