import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            // TODO: Replace with actual login API call
            // const response = await authService.login(data.email, data.password);

            // Simulate login
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/candidate/dashboard');
        } catch (error) {
            setErrorMessage(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-xs text-slate-500 mt-0.5">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-0.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors.email ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none transition-all`}
                        placeholder="you@example.com"
                        {...register('email', {
                            required: 'Email is required',
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

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <label htmlFor="password" className="block text-xs font-medium text-slate-700">
                            Password
                        </label>
                        <Link to="/auth/forgot-password" className="text-xs text-primary-500 hover:text-primary-600 font-medium">
                            Forgot?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors.password ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none transition-all`}
                        placeholder="••••••••"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="w-3.5 h-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-400"
                        {...register('remember')}
                    />
                    <label htmlFor="remember" className="ml-2 text-xs text-slate-600">
                        Remember me
                    </label>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                        {errorMessage}
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full mt-2"
                    size="sm"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* Sign Up Link */}
                <p className="text-center text-xs text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/auth/signup" className="text-primary-500 hover:text-primary-600 font-medium">
                        Sign up free
                    </Link>
                </p>
            </form>
        </div>
    );
}
