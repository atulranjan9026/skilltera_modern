import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, Briefcase, DollarSign, Clock, Building, MapPin } from 'lucide-react';

// Reusable Filter Section Component
const FilterSection = ({ icon: Icon, title, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} className="text-primary-600" />
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

// Reusable Checkbox Item
const CheckboxItem = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
    />
    <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
  </label>
);

// Reusable Radio Item
const RadioItem = ({ name, checked, onChange, label }) => (
  <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
    />
    <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
  </label>
);

const AdvancedFilterModal = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => setLocalFilters(filters), [filters]);

  if (!isOpen) return null;

  const toggleArray = (key, value) => {
    const arr = localFilters[key] || [];
    setLocalFilters(prev => ({
      ...prev,
      [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
    }));
  };

  const setValue = (key, value) => setLocalFilters(prev => ({ ...prev, [key]: value }));

  const handleReset = () => setLocalFilters({
    jobType: [], salaryRange: '', experience: [], companyType: [], datePosted: '', remote: false
  });
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const filterConfig = {
    jobType: ['Full Time','Part Time','Contract', 'Internship', 'Freelance'],
    experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Director', 'Executive'],
    companyType: ['Startup', 'Small Business', 'Mid Market', 'Enterprise', 'Non-profit', 'Government']
  };

  const salaryRanges = [
    { value: '$0-50k', label: '$0 - $50,000' },
    { value: '$50k-75k', label: '$50,000 - $75,000' },
    { value: '$75k-100k', label: '$75,000 - $100,000' },
    { value: '$100k-150k', label: '$100,000 - $150,000' },
    { value: '$150k-200k', label: '$150,000 - $200,000' },
    { value: '$200k+', label: '$200,000+' }
  ];

  const postedOn = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '3d', label: 'Last 3 days' },
    { value: '7d', label: 'Last week' },
    { value: '14d', label: 'Last 2 weeks' },
    { value: '30d', label: 'Last month' },
    // { value: 'any', label: 'Any time' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <SlidersHorizontal size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Advanced Filters</h2>
              <p className="text-xs text-slate-500">Refine your job search</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Type */}
            <FilterSection icon={Briefcase} title="Job Type">
              {filterConfig.jobType.map(type => (
                <CheckboxItem
                  key={type}
                  checked={localFilters.jobType?.includes(type)}
                  onChange={() => toggleArray('jobType', type)}
                  label={type}
                />
              ))}
            </FilterSection>

            {/* Experience */}
            <FilterSection icon={Clock} title="Experience">
              {filterConfig.experience.map(level => (
                <CheckboxItem
                  key={level}
                  checked={localFilters.experience?.includes(level)}
                  onChange={() => toggleArray('experience', level)}
                  label={level}
                />
              ))}
            </FilterSection>

            {/* Salary Range */}
            <FilterSection icon={DollarSign} title="Salary Range">
              {salaryRanges.map(range => (
                <RadioItem
                  key={range.value}
                  name="salaryRange"
                  checked={localFilters.salaryRange === range.value}
                  onChange={() => setValue('salaryRange', range.value)}
                  label={range.label}
                />
              ))}
            </FilterSection>

            {/* Company Type */}
            <FilterSection icon={Building} title="Company Type">
              {filterConfig.companyType.map(type => (
                <CheckboxItem
                  key={type}
                  checked={localFilters.companyType?.includes(type)}
                  onChange={() => toggleArray('companyType', type)}
                  label={type}
                />
              ))}
            </FilterSection>

            {/* Date Posted */}
            <FilterSection icon={Clock} title="Date Posted">
              {postedOn.map(date => (
                <RadioItem
                  key={date.value}
                  name="datePosted"
                  checked={localFilters.datePosted === date.value}
                  onChange={() => setValue('datePosted', date.value)}
                  label={date.label}
                />
              ))}
            </FilterSection>

            {/* Remote */}
            <FilterSection icon={MapPin} title="Work Location">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 hover:border-primary-300 cursor-pointer transition-all bg-slate-50">
                <input
                  type="checkbox"
                  checked={localFilters.remote}
                  onChange={(e) => setValue('remote', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900">Remote Only</span>
                  <p className="text-xs text-slate-500">Show only remote positions</p>
                </div>
              </label>
            </FilterSection>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={handleReset}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterModal;