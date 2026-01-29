import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../features/candidates/Sidebar';
import Footer from '../features/candidates/Footer';

/**
 * User Layout - Main layout for authenticated user pages
 * Includes left sidebar (Sidebar), main content area, and Footer
 */
export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-20 transition-all duration-300">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
