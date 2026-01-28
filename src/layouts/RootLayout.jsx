import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, Menu } from 'lucide-react';

export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary-500">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                            S
                        </div>
                        <span>Skilltera</span>
                    </div>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
                        <Link to="/auth/login" className="hover:text-primary-500 transition-colors">Login</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
                © 2024 Skilltera. All rights reserved.
            </footer>
        </div>
    );
}
