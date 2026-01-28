import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Company Dashboard Layout
 * Layout wrapper for company dashboard pages
 */
export default function CompanyDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900">Company Menu</h2>
          <nav className="mt-8 space-y-2">
            <a href="/company/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Dashboard</a>
            <a href="/company/jobs" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Manage Jobs</a>
            <a href="/company/jobs/new" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Post New Job</a>
            <a href="/company/applications" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Applications</a>
            <a href="/company/team" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Team Members</a>
            <a href="/company/profile" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-slate-700">Company Profile</a>
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
