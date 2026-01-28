import React from 'react';
import { THEME_CLASSES } from '../../theme';
import { JOB_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES } from '../../data/mockData';
import FilterDropdown from './FilterDropdown';

/**
 * FilterSidebar Component - Job filters
 */
export default function FilterSidebar({ filters, onFilterChange, isInline = false }) {
  const handleJobTypeChange = (selectedTypes) => {
    onFilterChange({ ...filters, jobTypes: selectedTypes });
  };

  const handleExperienceChange = (selectedExp) => {
    onFilterChange({ ...filters, experience: selectedExp });
  };

  const handleSalaryChange = (selectedSalary) => {
    onFilterChange({ ...filters, salaryRange: selectedSalary });
  };

  const handleReset = () => {
    onFilterChange({
      jobTypes: [],
      experience: [],
      salaryRange: '',
    });
  };

  return (
    <div className={`${isInline ? 'grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-end' : THEME_CLASSES.cards + ' p-6 h-fit sticky top-4'}`}>
      {/* {!isInline && <h2 className="text-lg font-semibold text-slate-900 mb-6">Filters</h2>} */}

      {/* Job Type Filter */}
      <FilterDropdown
        label="Job Type"
        options={JOB_TYPES}
        value={filters.jobTypes}
        onChange={handleJobTypeChange}
        isMulti={true}
        placeholder="All Types"
      />

      {/* Experience Level Filter */}
      <FilterDropdown
        label="Experience"
        options={EXPERIENCE_LEVELS}
        value={filters.experience}
        onChange={handleExperienceChange}
        isMulti={true}
        placeholder="All Levels"
      />

      {/* Salary Range Filter */}
      <FilterDropdown
        label="Salary Range"
        options={SALARY_RANGES.map(r => r.label)}
        value={filters.salaryRange}
        onChange={handleSalaryChange}
        placeholder="All Salaries"
      />

      {/* Reset Button */}
      <div className={`flex items-end ${isInline ? 'md:col-span-1' : 'mt-6'}`}>
        <button
          onClick={handleReset}
          className={`w-full ${THEME_CLASSES.buttons.outline} py-2 rounded-lg font-medium text-sm transition-all duration-200 h-[42px]`}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
