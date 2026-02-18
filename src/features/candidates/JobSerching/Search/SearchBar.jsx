import React, { lazy, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

import FilterChips from './FilterChips';
import SearchInput from './SearchInput';
import FilterButton from './FilterButton';
import { candidateService } from '../../../../services/candidateService';

const AdvancedFilterModal = lazy(() => import("./AdvancedFilterModal"));


/**
 * SearchBar Component - Unified Search with Advanced Filters
 */
export default function SearchBar({ onSearch }) {
  const [jobTitle, setJobTitle] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [jobSuggestions, setJobSuggestions] = React.useState({ titles: [], companies: [] });
  const [locationSuggestions, setLocationSuggestions] = React.useState({ cities: [], states: [], countries: [] });
  const [showJobSuggestions, setShowJobSuggestions] = React.useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = React.useState(false);

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
    // Split jobTitle input to extract company name if present
    const searchTerms = jobTitle.trim();
    let searchParams = { location, ...filters };

    if (searchTerms) {
      // Check if the input contains company indicators or treat as job title
      // For now, we'll send it as jobTitle and let the backend handle both
      searchParams.jobTitle = searchTerms;
    }

    onSearch(searchParams);
  };

  React.useEffect(() => {
    const trimmed = jobTitle.trim();
    if (!trimmed) {
      setJobSuggestions({ titles: [], companies: [] });
      setShowJobSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await candidateService.getJobSuggestions(trimmed, 8);
        if (response?.success) {
          setJobSuggestions(response.data || { titles: [], companies: [] });
        }
      } catch (err) {
        setJobSuggestions({ titles: [], companies: [] });
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [jobTitle]);

  React.useEffect(() => {
    const trimmed = location.trim();
    if (!trimmed) {
      setLocationSuggestions({ cities: [], states: [], countries: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await candidateService.getLocationSuggestions(trimmed, 8);
        if (response?.success) {
          setLocationSuggestions(response.data || { cities: [], states: [], countries: [] });
        }
      } catch (err) {
        setLocationSuggestions({ cities: [], states: [], countries: [] });
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [location]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

    const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);

    // Use the same search logic as handleSearch
    const searchTerms = jobTitle.trim();
    let searchParams = { location, ...newFilters };

    if (searchTerms) {
      searchParams.jobTitle = searchTerms;
    }

    onSearch(searchParams);
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

    // Trigger search with updated filters using consistent logic
    setTimeout(() => {
      const updated = { ...filters };
      if (value) {
        updated[filterType] = filters[filterType].filter(v => v !== value);
      } else {
        updated[filterType] = Array.isArray(filters[filterType]) ? [] : '';
      }

      const searchTerms = jobTitle.trim();
      let searchParams = { location, ...updated };

      if (searchTerms) {
        searchParams.jobTitle = searchTerms;
      }

      onSearch(searchParams);
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

    // Use consistent search logic
    const searchTerms = jobTitle.trim();
    let searchParams = { location, ...resetFilters };

    if (searchTerms) {
      searchParams.jobTitle = searchTerms;
    }

    onSearch(searchParams);
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200">
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Job Title Input */}
          <div className="relative flex-1 w-full">
            <SearchInput
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                setShowJobSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowJobSuggestions(true)}
              onBlur={() => setTimeout(() => setShowJobSuggestions(false), 150)}
              placeholder="Job title, keywords, or company"
            />
            {showJobSuggestions && (jobSuggestions.titles.length > 0 || jobSuggestions.companies.length > 0) && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                {jobSuggestions.titles.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 text-xs font-semibold text-slate-500">Job Titles</p>
                    {jobSuggestions.titles.map((title) => (
                      <button
                        key={`title-${title}`}
                        type="button"
                        onMouseDown={() => {
                          setJobTitle(title);
                          setShowJobSuggestions(false);
                          onSearch({
                            location,
                            ...filters,
                            jobTitle: title
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
                {jobSuggestions.companies.length > 0 && (
                  <div className="p-2 border-t border-slate-100">
                    <p className="px-2 text-xs font-semibold text-slate-500">Companies</p>
                    {jobSuggestions.companies.map((company) => (
                      <button
                        key={`company-${company}`}
                        type="button"
                        onMouseDown={() => {
                          setJobTitle(company);
                          setShowJobSuggestions(false);
                          onSearch({
                            location,
                            ...filters,
                            jobTitle: company
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="relative flex-1 w-full flex items-center px-4 py-3">
            <MapPin size={20} className="text-slate-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
              placeholder="State or country"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-400"
            />
            {showLocationSuggestions && ((locationSuggestions.cities?.length || 0) > 0 || (locationSuggestions.states?.length || 0) > 0 || (locationSuggestions.countries?.length || 0) > 0) && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
                {(locationSuggestions.cities?.length || 0) > 0 && (
                  <div className="p-2">
                    <p className="px-2 text-xs font-semibold text-slate-500">Cities</p>
                    {(locationSuggestions.cities || []).map((city) => (
                      <button
                        key={`city-${city}`}
                        type="button"
                        onMouseDown={() => {
                          setLocation(city);
                          setShowLocationSuggestions(false);
                          onSearch({
                            jobTitle: jobTitle.trim() || undefined,
                            ...filters,
                            location: city
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
                {(locationSuggestions.states?.length || 0) > 0 && (
                  <div className="p-2">
                    <p className="px-2 text-xs font-semibold text-slate-500">States</p>
                    {(locationSuggestions.states || []).map((state) => (
                      <button
                        key={`state-${state}`}
                        type="button"
                        onMouseDown={() => {
                          setLocation(state);
                          setShowLocationSuggestions(false);
                          onSearch({
                            jobTitle: jobTitle.trim() || undefined,
                            ...filters,
                            location: state
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                )}
                {(locationSuggestions.countries?.length || 0) > 0 && (
                  <div className="p-2 border-t border-slate-100">
                    <p className="px-2 text-xs font-semibold text-slate-500">Countries</p>
                    {(locationSuggestions.countries || []).map((country) => (
                      <button
                        key={`country-${country}`}
                        type="button"
                        onMouseDown={() => {
                          setLocation(country);
                          setShowLocationSuggestions(false);
                          onSearch({
                            jobTitle: jobTitle.trim() || undefined,
                            ...filters,
                            location: country
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
      <Suspense fallback={null}>
        <AdvancedFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApplyFilters={handleApplyFilters}
        />
      </Suspense>
    </div>
  );
}
