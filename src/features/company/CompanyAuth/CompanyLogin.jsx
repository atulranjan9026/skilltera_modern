import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Building2, ChevronDown } from 'lucide-react';
import { post, setAuthToken, fetch } from '../../../services/api';

export default function CompanyLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const dropdownRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFormError,
        setValue,
    } = useForm();

    // Fetch companies on component mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/company/list'); // Use public endpoint
                if (response.data?.companies) {
                    setCompanies(response.data.companies);
                    setFilteredCompanies(response.data.companies);
                }
            } catch (error) {
                console.error('Failed to fetch companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    // Filter companies based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCompanies(companies);
        } else {
            const filtered = companies.filter(company =>
                company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCompanies(filtered);
        }
    }, [searchTerm, companies]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await post('/company/login', {
                companyName: data.companyName,
                email: data.email,
                password: data.password,
            });

            // Store token and user data
            if (response?.data?.accessToken) {
                setAuthToken(response.data.accessToken);
                localStorage.setItem('companyUser', JSON.stringify(response.data.user));
            }

            navigate('/company/dashboard');
        } catch (error) {
            setFormError('root', {
                type: 'manual',
                message: error.response?.data?.message || error.message || 'Login failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">

            {/* ── Role Switcher ─────────────────────────────────────────── */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">


                {/* Company — active (current page) */}
                <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3
                    rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-semibold
                    text-primary-600 cursor-default select-none">
                    <Building2 size={15} />
                    Company Sign In
                </div>
            </div>

            {/* ── Heading ───────────────────────────────────────────────── */}
            <div className="text-center">
                {/* <h2 className="text-xl font-bold text-slate-900">Company Sign In</h2> */}
                <p className="text-xs text-slate-500 mt-0.5">Access your employer dashboard</p>
            </div>

            {/* ── Form ─────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                {/* Work Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-0.5">
                        Work Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                            ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                            focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all`}
                        placeholder="you@company.com"
                        {...register('email', {
                            required: 'Work email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
                    )}
                </div>

                {/* Company Name */}
                <div>
                    <label htmlFor="companyName" className="block text-xs font-medium text-slate-700 mb-0.5">
                        Company Name
                    </label>
                    <div className="relative" ref={dropdownRef}>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 rounded-lg border text-sm border-slate-200 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all text-left pr-10`}
                            placeholder="Type to search companies..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedCompany(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                        />
                        <ChevronDown className="absolute right-3 top-3 h-4 text-slate-400" />
                        
                        {showDropdown && filteredCompanies.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredCompanies.map((company, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setSelectedCompany(company.companyName);
                                            setSearchTerm(company.companyName);
                                            setValue('companyName', company.companyName);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        {company.companyName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        type="hidden"
                        id="companyName"
                        {...register('companyName', {
                            required: 'Company name is required',
                            minLength: { value: 2, message: 'Must be at least 2 characters' },
                        })}
                        value={selectedCompany}
                        readOnly
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.companyName.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <label htmlFor="password" className="block text-xs font-medium text-slate-700">
                            Password
                        </label>
                        <Link to="/auth/forgot-password"
                            className="text-xs text-primary-500 hover:text-primary-600 font-medium">
                            Forgot?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        className={`w-full px-3 py-2 rounded-lg border text-sm
                            ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'}
                            focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all`}
                        placeholder="••••••••"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Must be at least 6 characters' },
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>
                    )}
                </div>

                {/* Error */}
                {errors.root && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                        {errors.root.message}
                    </div>
                )}

                {/* Submit */}
                <Button type="submit" className="w-full mt-2" size="sm" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In as Company'}
                </Button>

                {/* Register link */}
                <p className="text-center text-xs text-slate-500">
                    New to Skilltera?{' '}
                    <Link to="/auth/login"
                        className="text-primary-500 hover:text-primary-600 font-medium">
                        Register your company
                    </Link>
                </p>
            </form>
        </div>
    );
}