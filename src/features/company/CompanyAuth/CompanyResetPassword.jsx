import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import { post } from '../../../services/api';

export default function CompanyResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    watch,
  } = useForm();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setFormError('root', {
        type: 'manual',
        message: 'Invalid or missing reset token. Please request a new password reset.',
      });
    }
  }, [searchParams, setFormError]);

  const onSubmit = async (data) => {
    if (!token) {
      setFormError('root', {
        type: 'manual',
        message: 'Invalid reset token.',
      });
      return;
    }

    setIsLoading(true);
    try {
      setSuccessMessage('');
      await post('/company/auth/reset-password', {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/company/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setFormError('root', {
        type: 'manual',
        message:
          error.response?.data?.message || error.message || 'Failed to reset password. Please try again.',
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

  const password = watch('password');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-0.5">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className={inputClass(errors.password)}
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must contain uppercase, lowercase, number and special character',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-0.5">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={inputClass(errors.confirmPassword)}
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.root && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            {errors.root?.message}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-2" size="sm" loading={isLoading} disabled={!token}>
          Reset Password
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
