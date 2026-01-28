import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut,
    Bell,
    Search
} from 'lucide-react';
import { cn } from '@/components/ui/Button';

export default function DashboardLayout() {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', end: true },
        { icon: Users, label: 'Candidates', path: '/dashboard/candidates' },
        { icon: Briefcase, label: 'Jobs', path: '/dashboard/jobs' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-20 bg-white border-r border-slate-200 fixed h-full z-20 hidden md:flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-slate-100">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                            S
                        </div>
                        <span className="text-xs text-slate-900 font-bold">Skilltera</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-2 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary-50 text-primary-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-center leading-tight">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="p-2 border-t border-slate-100">
                    <button className="flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-slate-600 hover:text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-center leading-tight">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-20 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search candidates, jobs..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-primary-100 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-50 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs ring-2 ring-white shadow-sm">
                            JD
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
