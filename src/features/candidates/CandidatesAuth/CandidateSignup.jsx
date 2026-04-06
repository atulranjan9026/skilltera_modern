import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../store/context/AuthContext';
import { cn } from '../../../utils/cn';


export default function CandidateSignup() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthContext();
  const {
    formState: { errors },
  } = useForm();


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
       <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
    </div>
  );
}
