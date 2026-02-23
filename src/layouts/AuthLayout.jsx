import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, CheckCircle, ArrowRight, Building2, Menu, X } from 'lucide-react';

export default function AuthLayout() {
    const [isOpen, setIsOpen] = useState(false);
    
    const features = [
        {
            icon: <Briefcase className="w-6 h-6" />,
            title: 'Find Your Dream Job',
            description: 'Access thousands of job opportunities from top companies'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Connect with Talents',
            description: 'Build your team with the best professionals in your industry'
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Grow Your Career',
            description: 'Develop skills and advance your professional journey'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Secure & Trusted',
            description: 'Safe platform with verified employers and candidates'
        }
    ];

    const benefits = [
        'Easy job search and application',
        'Profile verification system',
        '24/7 customer support',
        'Career development resources'
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ── Navbar ───────────────────────────────────────────────────────── */}
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
                                  hover:text-primary-700 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
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

            <div className="min-h-screen bg-white flex flex-1">
            {/* Left Side - Brand & Features */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-white text-slate-900">
                {/* Logo */}
                {/* <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                        S
                    </div>
                    <span className="text-2xl font-bold text-primary-600">Skilltera</span>
                </Link> */}

                {/* Main Content */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-5xl font-bold leading-tight mb-4 text-slate-900">
                            Connect Talent with <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Opportunity</span>
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Skilltera is your trusted platform for finding the perfect job or hiring top talent.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-200 transition">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <span className="text-slate-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="text-slate-600 text-sm">
                    <p>Join thousands of professionals already using Skilltera</p>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:hidden">
                        <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg">
                                S
                            </div>
                            <span className="text-primary-600">Skilltera</span>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-slate-900">
                            Welcome
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-500/20 p-8 border border-slate-100">
                        <Outlet />
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center text-slate-600 text-sm space-y-2">
                        <p>By signing in, you agree to our <Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">Terms of Service</Link></p>
                        <p><Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">Privacy Policy</Link> • <Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">Contact Us</Link></p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
