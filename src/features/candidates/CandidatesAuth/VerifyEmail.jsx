import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import { get } from '../../../services/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setErrorMessage('Invalid verification link. No token provided.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await get(`/candidates/auth/verify-email/${token}`);
        setSuccessMessage(response.message || 'Email verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (error) {
        console.error('Email verification error:', error);
        setErrorMessage(
          error.response?.data?.message ||
          error.message ||
          'Failed to verify email. The link may be expired or invalid.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Email Verification</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verifying your email address...
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-slate-600">Verifying your email...</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
            {successMessage}
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Redirecting to login page in a few seconds...
          </p>
          <Link to="/auth/login">
            <Button size="sm">Go to Login</Button>
          </Link>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            {errorMessage}
          </div>
          <div className="space-y-2">
            <Link to="/auth/login">
              <Button size="sm" className="mr-2">Go to Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
