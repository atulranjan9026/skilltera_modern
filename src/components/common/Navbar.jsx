import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Menu, X } from 'lucide-react';

/**
 * Shared Navbar - Used in both AuthLayout and RootLayout.
 * Eliminates duplicate navbar code.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-slate-50 px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">Skilltera</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/company/login"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600
                hover:text-slate-900 transition-colors"
            >
              <Building2 size={15} />
              Company Login
            </Link>
            <Link
              to="/company/refer"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-600
                hover:text-primary-700 px-3 py-1.5 rounded-lg bg-primary-50
                hover:bg-primary-100 transition-colors"
            >
              <Users size={15} />
              Refer Candidate
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-1 border-t border-slate-100 pt-4">
            <Link
              to="/company/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Building2 size={15} />
              Company Login
            </Link>
            <Link
              to="/company/refer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <Users size={15} />
              Refer Candidate
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
