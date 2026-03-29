import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const features = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'Find Your Dream Job',
    jobDescription: 'Access thousands of job opportunities from top companies',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Connect with Talents',
    jobDescription: 'Build your team with the best professionals in your industry',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Grow Your Career',
    jobDescription: 'Develop skills and advance your professional journey',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure & Trusted',
    jobDescription: 'Safe platform with verified employers and candidates',
  },
];

const benefits = [
  'Easy job search and application',
  'Profile verification system',
  '24/7 customer support',
  'Career development resources',
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Left Side – Brand & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-white text-slate-900">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-4 text-slate-900">
                Connect Talent with{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h1>
              <p className="text-slate-600 text-lg">
                Skilltera is your trusted platform for finding the perfect job or hiring top talent.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-200 transition">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.jobDescription}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-sm">
            Join thousands of professionals already using Skilltera
          </p>
        </div>

        {/* Right Side – Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile-only branding */}
            <div className="text-center mb-10 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg">
                  S
                </div>
                <span className="text-primary-600">Skilltera</span>
              </Link>
              <h2 className="mt-6 text-3xl font-bold text-slate-900">Welcome</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-500/20 p-8 border border-slate-100">
              <Outlet />
            </div>

            <div className="mt-8 text-center text-slate-600 text-sm space-y-2">
              <p>
                By signing in, you agree to our{' '}
                <Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Terms of Service
                </Link>
              </p>
              <p>
                <Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Privacy Policy
                </Link>{' '}
                •{' '}
                <Link to="#" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Contact Us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
