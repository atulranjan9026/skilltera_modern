import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../store/context/AuthContext';
import { cn } from '../../../utils/cn';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error: authError } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      setFormError('root', {
        type: 'manual',
        message:
          error.response?.data?.message || error.message || 'Login failed. Please try again.',
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
          <div className="flex justify-between items-center mb-0.5">
            <label htmlFor="password" className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary-500 hover:text-primary-600 font-medium"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            className={inputClass(errors.password)}
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
        {(errors.root || authError) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            {errors.root?.message || authError}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-2" size="sm" loading={isLoading}>
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-500">or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const credential = credentialResponse?.credential;
              if (!credential) {
                setFormError('root', {
                  type: 'manual',
                  message: 'Google sign-in did not return a credential.',
                });
                return;
              }
              try {
                await loginWithGoogle(credential);
                navigate('/profile');
              } catch (error) {
                const errData = error.response?.data;
                const errMsg = errData?.message || error.message || 'Google sign-in failed.';
                const errDetails = errData?.errors
                  ?.map((e) => `${e.field}: ${e.message}`)
                  .join('; ');
                console.error('Google login error:', errData || error);
                setFormError('root', {
                  type: 'manual',
                  message: errDetails ? `${errMsg} (${errDetails})` : errMsg,
                });
              }
            }}
            onError={() => {
              setFormError('root', {
                type: 'manual',
                message: 'Google sign-in was cancelled or failed.',
              });
            }}
            useOneTap={false}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="320"
          />
        </div>

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
