import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Candidate Dashboard Layout
 * Layout wrapper for candidate dashboard pages
 */
export default function CandidateDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900">My Menu</h2>
          <nav className="mt-8 space-y-2">
            <a href="/candidate/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Dashboard</a>
            <a href="/candidate/applications" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">My Applications</a>
            <a href="/candidate/saved-jobs" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Saved Jobs</a>
            <a href="/candidate/profile" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">My Profile</a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
