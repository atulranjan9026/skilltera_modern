import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UploadCloud, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthContext } from '../../../store/context/AuthContext';
import { cn } from '@/utils/cn';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const PASSWORD_REQUIREMENTS = [
  'At least 8 characters',
  'At least one special character',
  'At least one number',
  'At least one upper and one lower case',
];

export default function CandidateSignup() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ── Resume helpers ──────────────────────────────────────────────── */
  const handleResumeChange = (e) => {
    const file = e.target?.files?.[0] ?? e.dataTransfer?.files?.[0] ?? null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size should be less than 2 MB');
      setResumeFile(null);
      setResumeName('');
      return;
    }
    setResumeFile(file);
    setResumeName(file.name);
    setErrorMessage('');
  };

  const showPasswordHint = () => {
    toast.info('Password Requirements', {
      description: PASSWORD_REQUIREMENTS.join(' • '),
      duration: 6000,
    });
  };

  /* ── Submit ──────────────────────────────────────────────────────── */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Registration Successful!', {
        description: 'Please check your inbox and verify your email.',
      });

      reset();
      setResumeFile(null);
      setResumeName('');
      navigate('/auth/login');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Shared input styles ─────────────────────────────────────────── */
  const inputClass = (hasError) =>
    cn('input text-sm', hasError && 'border-red-300 focus:ring-red-400 focus:border-red-500');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Join Skilltera</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Create your account and land your dream job
        </p>
      </div>

      {/* Google Sign Up */}
      <div className="flex justify-center mb-3">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const credential = credentialResponse?.credential;
            if (!credential) {
              setErrorMessage('Google sign-up did not return a credential.');
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
              setErrorMessage(errDetails ? `${errMsg} (${errDetails})` : errMsg);
            }
          }}
          onError={() => setErrorMessage('Google sign-up was cancelled or failed.')}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
          width="320"
        />
      </div>

      {/* Divider */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-500">or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5">Full Name</label>
          <input
            type="text"
            className={inputClass(errors.fullname)}
            placeholder="John Doe"
            {...register('fullname', {
              required: 'Full name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            })}
            onClick={() => setErrorMessage('')}
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs mt-0.5">{errors.fullname.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5">Email Address</label>
          <input
            type="email"
            className={inputClass(errors.email)}
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
            onClick={() => setErrorMessage('')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5">Password</label>
          <div className="relative">
            <input
              type="password"
              className={cn(inputClass(errors.password), 'pr-9')}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/,
                  message: 'Password must meet requirements',
                },
              })}
              onClick={() => setErrorMessage('')}
            />
            <button
              type="button"
              onClick={showPasswordHint}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
              title="Password Requirements"
            >
              <Info size={14} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Resume (Optional)
          </label>
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all',
              isDragging && 'border-primary-500 bg-primary-50',
              resumeFile && !isDragging && 'border-primary-400 bg-primary-50',
              !isDragging && !resumeFile && 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleResumeChange(e);
            }}
            onClick={() => document.getElementById('resume-upload-input').click()}
          >
            <div className="flex flex-col items-center gap-2">
              <UploadCloud
                className={cn('w-7 h-7', resumeFile ? 'text-primary-500' : 'text-slate-400')}
              />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {resumeName ? 'Resume Selected' : 'Upload your resume'}
                </h4>
                {!resumeName && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drag &amp; drop or click (PDF, DOC – Max 2 MB)
                  </p>
                )}
              </div>
              {resumeName && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary-300 rounded-full text-xs font-medium text-primary-600">
                  {resumeName}
                </span>
              )}
            </div>
            <input
              id="resume-upload-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="policyCheck"
            className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-400"
            {...register('policyCheck', { required: 'You must agree to the terms' })}
          />
          <label htmlFor="policyCheck" className="text-xs text-slate-600">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-500 hover:text-primary-600 font-medium">
              terms and conditions
            </Link>{' '}
            and understand how my data is handled.
          </label>
        </div>
        {errors.policyCheck && (
          <p className="text-red-500 text-xs">{errors.policyCheck.message}</p>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full mt-2" size="sm" loading={isLoading}>
          Create My Account
        </Button>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Login Link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
