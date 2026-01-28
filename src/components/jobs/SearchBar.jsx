import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';

/**
 * SearchBar Component - Unified Search and Filter Bar
 */
export default function SearchBar({ onSearch }) {
  const [jobTitle, setJobTitle] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    onSearch({ jobTitle, location });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">

          {/* Job Title Input */}
          <div className="flex-1 w-full flex items-center px-4 py-3">
            <Search size={20} className="text-slate-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Job title, keywords, or company"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-400"
            />
          </div>

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

          {/* Search Button */}
          <div className="w-full md:w-auto p-2">
            <button
              onClick={handleSearch}
              className={`${THEME_CLASSES.buttons.primary} w-full md:w-auto px-8 h-[44px] rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
