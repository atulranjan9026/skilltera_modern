import React from 'react';
import { SlidersHorizontal, X, Briefcase, DollarSign, Clock, Building, MapPin } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';

/**
 * Advanced Filter Modal Component
 */
const AdvancedFilterModal = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      jobType: [],
      salaryRange: '',
      experience: [],
      companyType: [],
      datePosted: '',
      remote: false,
    };
    setLocalFilters(resetFilters);
  };

  const handleCheckboxChange = (filterType, value) => {
    setLocalFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-modal-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${THEME_CLASSES.borders} bg-slate-50`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-primary-100 rounded-lg`}>
                <SlidersHorizontal size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Advanced Filters</h2>
                <p className="text-sm text-slate-500">Refine your job search</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${THEME_CLASSES.buttons.ghost} rounded-lg transition-colors duration-200`}
              aria-label="Close modal"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Job Type Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Job Type</h3>
                </div>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(type => (
                    <label key={type} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={localFilters.jobType?.includes(type) || false}
                        onChange={() => handleCheckboxChange('jobType', type)}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Experience Level</h3>
                </div>
                <div className="space-y-2">
                  {['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Director', 'Executive'].map(level => (
                    <label key={level} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group`}>
                      <input
                        type="checkbox"
                        checked={localFilters.experience?.includes(level) || false}
                        onChange={() => handleCheckboxChange('experience', level)}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Salary Range</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { value: '$0-50k', label: '$0 - $50,000' },
                    { value: '$50k-75k', label: '$50,000 - $75,000' },
                    { value: '$75k-100k', label: '$75,000 - $100,000' },
                    { value: '$100k-150k', label: '$100,000 - $150,000' },
                    { value: '$150k-200k', label: '$150,000 - $200,000' },
                    { value: '$200k+', label: '$200,000+' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="radio"
                        name="salaryRange"
                        checked={localFilters.salaryRange === range.value}
                        onChange={() => setLocalFilters(prev => ({ ...prev, salaryRange: range.value }))}
                        className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Type Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Building size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Company Type</h3>
                </div>
                <div className="space-y-2">
                  {['Startup', 'Small Business', 'Mid Market', 'Enterprise', 'Non-profit', 'Government'].map(type => (
                    <label key={type} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={localFilters.companyType?.includes(type) || false}
                        onChange={() => handleCheckboxChange('companyType', type)}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Posted Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Date Posted</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { value: '24h', label: 'Last 24 hours' },
                    { value: '3d', label: 'Last 3 days' },
                    { value: '7d', label: 'Last week' },
                    { value: '14d', label: 'Last 2 weeks' },
                    { value: '30d', label: 'Last month' }
                  ].map(date => (
                    <label key={date.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={localFilters.datePosted === date.value}
                        onChange={() => setLocalFilters(prev => ({ ...prev, datePosted: date.value }))}
                        className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{date.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Work Option */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-primary-600" />
                  <h3 className="font-semibold text-slate-900">Work Location</h3>
                </div>
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-primary-300 cursor-pointer transition-all bg-slate-50">
                  <input
                    type="checkbox"
                    checked={localFilters.remote || false}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, remote: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900">Remote Only</span>
                    <p className="text-xs text-slate-500 mt-0.5">Show only remote positions</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors duration-200"
            >
              Reset All
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className={`${THEME_CLASSES.buttons.primary} px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilterModal;
