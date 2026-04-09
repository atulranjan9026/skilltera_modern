import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import { post } from '../../../services/api';

export default function CompanyForgotPassword() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      setSuccessMessage('');
      await post('/company/auth/forgot-password', { email: data.email });
      setSuccessMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setFormError('root', {
        type: 'manual',
        message:
          err.response?.data?.message || err.message || 'Failed to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    cn(
      'w-full px-3 py-2 rounded-lg border text-sm',
      hasError ? 'border-red-300 bg-red-50' : 'border-slate-200',
      'focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all'
    );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Forgot Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-0.5">
            Work Email
          </label>
          <input
            type="email"
            id="email"
            className={inputClass(errors.email)}
            placeholder="you@company.com"
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

        {/* Success Message */}
        {successMessage && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {(errors.root || error) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            {errors.root?.message || error}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-2" size="sm" loading={isLoading}>
          Send Reset Link
        </Button>

        {/* Back to Login Link */}
        <p className="text-center text-xs text-slate-500">
          Remember your password?{' '}
          <Link to="/company/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
