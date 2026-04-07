import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, UserCircle2, Menu, X, ChevronRight } from 'lucide-react';

/**
 * Advanced Navbar with animated toggle between Candidate & Company login
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isCompanyActive =
    location.pathname.startsWith('/company/login') ||
    location.pathname.startsWith('/company');
  const isCandidateActive =
    location.pathname.startsWith('/auth/login') ||
    location.pathname.startsWith('/auth');

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl hover:bg-slate-50 px-2 py-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight hidden sm:block">
              Skill<span className="text-primary-600">tera</span>
            </span>
          </Link>

          {/* Desktop: Segmented Toggle + Refer */}
          <div className="hidden md:flex items-center gap-4">

            {/* Segmented control toggle */}
            <div className="relative flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
              {/* Sliding pill */}
              <div
                className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-slate-200 transition-all duration-300 ease-in-out ${
                  isCompanyActive ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
                style={{ left: '4px' }}
              />

              <Link
                to="/auth/login"
                className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isCandidateActive
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserCircle2 size={15} />
                Candidate
              </Link>

              <Link
                to="/company/login"
                className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isCompanyActive
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 size={15} />
                Company
              </Link>
            </div>

            {/* Refer CTA */}
            <Link
              to="/company/refer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white
                px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600
                hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-200
                transition-all hover:shadow-lg hover:shadow-primary-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Refer a Candidate
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-1.5 border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Sign in as
            </p>
            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isCandidateActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCandidateActive ? 'bg-primary-100' : 'bg-slate-100'}`}>
                <UserCircle2 size={15} className={isCandidateActive ? 'text-primary-600' : 'text-slate-500'} />
              </div>
              Candidate Login
              {isCandidateActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
            </Link>
            <Link
              to="/company/login"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isCompanyActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCompanyActive ? 'bg-primary-100' : 'bg-slate-100'}`}>
                <Building2 size={15} className={isCompanyActive ? 'text-primary-600' : 'text-slate-500'} />
              </div>
              Company Login
              {isCompanyActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
            </Link>
            <div className="pt-1">
              <Link
                to="/company/refer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold
                  text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-sm"
              >
                Refer a Candidate
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}