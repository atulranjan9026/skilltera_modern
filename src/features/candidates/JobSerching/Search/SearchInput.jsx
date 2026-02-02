import React from 'react';
import { Search } from 'lucide-react';
// import { THEME_CLASSES } from '../../../theme';

/**
 * Search Input Component
 */
const SearchInput = ({ value, onChange, onKeyPress, placeholder, ...rest }) => {
  return (
    <div className="flex-1 w-full flex items-center px-4 py-3">
      <Search size={20} className="text-slate-400 mr-3 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        {...rest}
        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchInput;
