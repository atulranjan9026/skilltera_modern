import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Dismissible error block with optional retry
 */
export function ErrorBlock({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mb-4">
      <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
      <p className="flex-1 text-red-700 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-red-600
            hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
        >
          <RotateCcw size={11} /> Retry
        </button>
      )}
    </div>
  );
}
