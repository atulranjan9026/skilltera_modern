import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Heart,
    User,
    LogOut
} from 'lucide-react';

/**
 * Candidate Dashboard Layout
 * Layout wrapper for candidate dashboard pages
 */
export default function CandidateDashboardLayout() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/candidate/dashboard' },
    { icon: Briefcase, label: 'Applications', path: '/candidate/applications' },
    { icon: Heart, label: 'Saved Jobs', path: '/candidate/saved-jobs' },
    { icon: User, label: 'Profile', path: '/candidate/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
              C
            </div>
            <span className="text-xs text-slate-900 font-bold">Candidate</span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-2 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-center leading-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-2 border-t border-gray-100">
          <button className="flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-slate-600 hover:text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-center leading-tight">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
