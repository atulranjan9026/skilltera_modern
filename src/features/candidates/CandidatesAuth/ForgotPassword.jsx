import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../store/context/AuthContext';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

export default function ForgotPassword() {
  const { forgotPassword, isLoading, error: authError } = useAuthContext();
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSuccessMessage('');
      await forgotPassword(data.email);
      setSuccessMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      setFormError('root', {
        type: 'manual',
        message:
          error.response?.data?.message || error.message || 'Failed to send reset email. Please try again.',
      });
    }
  };

  const inputClass = (hasError) =>
    cn(
      'input text-sm',
      hasError && 'border-red-300 focus:ring-red-400 focus:border-red-500'
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
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className={inputClass(errors.email)}
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

        {/* Success Message */}
        {successMessage && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {(errors.root || authError) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            {errors.root?.message || authError}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-2" size="sm" loading={isLoading}>
          Send Reset Link
        </Button>

        {/* Back to Login Link */}
        <p className="text-center text-xs text-slate-500">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}