import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { useAuthContext } from '../../store/context/AuthContext';

/**
 * Sidebar Navigation - Left sidebar with icon-based navigation
 */
export default React.memo(function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout API fails
      navigate('/auth/login');
    }
  };

  const navItems = [
    {
      label: 'Search Jobs',
      icon: Search,
      path: '/jobs-search',
      color: 'text-blue-600'
    },
    {
      label: 'Dashboard',
      icon: BarChart3,
      path: '/dashboard',
      color: 'text-green-600'
    },
    {
      label: 'Profile',
      icon: User,
      path: '/profile',
      color: 'text-purple-600'
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '#',
      color: 'text-slate-600'
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-20 bg-white border-r border-slate-200 z-30 flex flex-col"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link to="/" className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xs text-slate-900 font-bold">Skilltera</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-2 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors group"
              >
                <Icon size={20} className={`flex-shrink-0 ${item.color}`} />
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-2 border-t border-slate-200" />

        {/* User Section */}
        <div className="p-2 space-y-2">
          {/* User Avatar */}
          <div className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
              {user?.fullname?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-slate-900 truncate max-w-[60px]">
                {user?.fullname?.split(' ')[0] || 'User'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="text-xs font-medium text-center leading-tight">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
)
