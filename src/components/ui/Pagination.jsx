import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Shared pagination component
 */
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-slate-100">
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
          text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors shadow-sm"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          // Show first, last, current, and adjacent pages
          const show =
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= page - 1 && pageNum <= page + 1);

          if (!show) {
            // Show ellipsis once between gaps
            const isLeftGap = pageNum === page - 2 && pageNum > 2;
            const isRightGap = pageNum === page + 2 && pageNum < totalPages - 1;
            if (isLeftGap || isRightGap) {
              return (
                <span key={pageNum} className="w-10 h-10 flex items-center justify-center text-slate-400">
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-xl font-medium text-sm transition-colors ${
                page === pageNum
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
          text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors shadow-sm"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
