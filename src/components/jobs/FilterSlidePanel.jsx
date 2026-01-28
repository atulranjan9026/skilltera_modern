import React from 'react';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import { THEME_CLASSES } from '../../theme';

/**
 * FilterSlidePanel - Sliding panel with filters that slides in from the left
 */
export default function FilterSlidePanel({ isOpen, onClose, filters, onFilterChange }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4">
          <FilterSidebar filters={filters} onFilterChange={onFilterChange} />
        </div>
      </div>
    </>
  );
}
