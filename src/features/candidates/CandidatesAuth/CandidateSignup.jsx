import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../store/context/AuthContext';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';


export default function CandidateSignup() {
  const navigate = useNavigate();
  const { loginWithGoogle, signup, isLoading, error: authError } = useAuthContext();
  const [signUpMethod, setSignUpMethod] = useState('google'); // 'google' or 'email'
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    watch,
  } = useForm();

  const password = watch('password');

  /* ── Shared input styles ─────────────────────────────────────────── */
  const inputClass = (hasError) =>
    cn(
      'w-full px-3 py-2 rounded-lg border text-sm',
      hasError ? 'border-red-300 bg-red-50' : 'border-slate-200',
      'focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all'
    );

  const onEmailSignup = async (data) => {
    try {
      setSuccessMessage('');
      await signup({
        email: data.email,
        password: data.password,
      });
      setSuccessMessage(
        'Account created successfully! Please check your email to verify your account before logging in.'
      );
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Signup error:', error);
      setFormError('root', {
        type: 'manual',
        message:
          error.response?.data?.message || error.message || 'Failed to create account. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Join Skilltera</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Create your account and land your dream job
        </p>
      </div>

      {/* ── Sign Up Method Toggle ─────────────────────────────────────── */}
      <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => setSignUpMethod('google')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            signUpMethod === 'google'
              ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Google
        </button>
        <button
          onClick={() => setSignUpMethod('email')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            signUpMethod === 'email'
              ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Email
        </button>
      </div>

      {/* ── Google Sign Up ─────────────────────────────────────────────────── */}
      {signUpMethod === 'google' && (
        <div className="flex justify-center mb-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const credential = credentialResponse?.credential;
              if (!credential) {
                setFormError('root', {
                  type: 'manual',
                  message: 'Google sign-up did not return a credential.',
                });
                return;
              }
              try {
                await loginWithGoogle(credential);
                navigate('/profile');
              } catch (error) {
                const errData = error.response?.data;
                const errMsg = errData?.message || error.message || 'Google sign-up failed.';
                const errDetails = errData?.errors
                  ?.map((e) => `${e.field}: ${e.message}`)
                  .join('; ');
                setFormError('root', {
                  type: 'manual',
                  message: errDetails ? `${errMsg} (${errDetails})` : errMsg,
                });
              }
            }}
            onError={() =>
              setFormError('root', {
                type: 'manual',
                message: 'Google sign-up was cancelled or failed.',
              })
            }
            useOneTap={false}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="320"
          />
        </div>
      )}

      {/* ── Email Sign Up Form ────────────────────────────────────────────── */}
      {signUpMethod === 'email' && (
        <form onSubmit={handleSubmit(onEmailSignup)} className="space-y-3">
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-0.5">
              Password
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
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-slate-700 mb-0.5"
            >
              Confirm Password
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
          {(errors.root || authError) && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              {errors.root?.message || authError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            size="sm"
            loading={isLoading}
          >
            Create Account
          </Button>
        </form>
      )}

      {/* ── Sign In Link ─────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
