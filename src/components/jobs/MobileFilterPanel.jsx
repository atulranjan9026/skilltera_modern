import React from 'react';
import { Menu, X } from 'lucide-react';

/**
 * MobileFilterPanel Component - Mobile filters dropdown
 */
export default function MobileFilterPanel({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 md:hidden max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
