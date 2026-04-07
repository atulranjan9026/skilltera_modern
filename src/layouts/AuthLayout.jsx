import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Briefcase, Users, TrendingUp, Shield, CheckCircle,
  Building2, BarChart3, Globe2, UserCheck,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';

/* ─── Candidate Side ────────────────────────────────────────── */
const candidateFeatures = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Find Your Dream Job',
    desc: 'Access thousands of verified opportunities from top companies.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Grow Your Career',
    desc: 'Skill assessments, mentors, and resources to level you up.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Secure & Trusted',
    desc: 'Verified employers, private data, peace of mind.',
  },
];

const candidateBenefits = [
  'Smart job-match recommendations',
  'One-click applications',
  'Real-time application tracking',
  'Free career resources',
];

/* ─── Company Side ───────────────────────────────────────────── */
const companyFeatures = [
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Hire Top Talent',
    desc: 'Reach thousands of qualified, pre-screened professionals instantly.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Hiring Analytics',
    desc: 'Insights on applicants, pipeline health, and time-to-hire.',
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: 'Global Reach',
    desc: 'Post jobs and find talent across industries and geographies.',
  },
];

const companyBenefits = [
  'Unlimited job postings on Pro',
  'AI-powered candidate ranking',
  'Integrated ATS & calendar',
  'Dedicated hiring support',
];

/* ─── Stat bubbles ───────────────────────────────────────────── */
const candidateStats = [
  { value: '50K+', label: 'Jobs Posted' },
  { value: '98%', label: 'Match Rate' },
  { value: '4.9★', label: 'User Rating' },
];

const companyStats = [
  { value: '12K+', label: 'Companies' },
  { value: '3x', label: 'Faster Hiring' },
  { value: '200K+', label: 'Candidates' },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function AuthLayout() {
  const { pathname } = useLocation();
  const isCompany = pathname.startsWith('/company');

  const features = isCompany ? companyFeatures : candidateFeatures;
  const benefits = isCompany ? companyBenefits : candidateBenefits;
  const stats    = isCompany ? companyStats    : candidateStats;

  const accentGrad = isCompany
    ? 'from-violet-500 to-primary-600'   // company: violet→primary blend
    : 'from-primary-500 to-primary-600'; // candidate: primary brand

  const headingAccent = isCompany
    ? 'from-violet-500 to-primary-500'
    : 'from-primary-500 to-primary-600';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">

          {/* Subtle grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Soft gradient blob */}
          <div
            className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gradient-to-br ${accentGrad}`}
          />
          <div
            className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-gradient-to-tl ${accentGrad}`}
          />

          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">

            {/* Header */}
            <div className="space-y-8">
              {/* Role badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {isCompany
                  ? <><Building2 size={12} className="text-violet-500" /> For Companies</>
                  : <><UserCheck size={12} className="text-primary-500" /> For Candidates</>
                }
              </div>

              <div>
                <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-4 text-slate-900 tracking-tight">
                  {isCompany ? (
                    <>Hire Smarter,{' '}
                      <span className={`bg-gradient-to-r ${headingAccent} bg-clip-text text-transparent`}>
                        Grow Faster
                      </span>
                    </>
                  ) : (
                    <>Connect Talent{' '}
                      <span className={`bg-gradient-to-r ${headingAccent} bg-clip-text text-transparent`}>
                        with Opportunity
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                  {isCompany
                    ? 'Skilltera gives your hiring team the tools to find, evaluate, and onboard world-class talent — faster than ever.'
                    : 'Skilltera is your trusted platform for landing the perfect role or leveling up your career.'}
                </p>
              </div>

              {/* Stat row */}
              {/* <div className="flex gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className={`text-2xl font-extrabold bg-gradient-to-r ${headingAccent} bg-clip-text text-transparent`}>
                      {s.value}
                    </span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div> */}

              {/* Feature cards */}
              <div className="grid grid-cols-1 gap-3">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur border border-slate-200/80
                      shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${accentGrad}
                      flex items-center justify-center text-white shadow-md`}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{f.title}</h3>
                      <p className="text-slate-500 text-sm leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits list */}
              <div className="pt-5 border-t border-slate-200 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${accentGrad}
                      flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-600 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <p className="text-slate-400 text-xs mt-8">
              Trusted by 50,000+ professionals and 12,000+ companies worldwide.
            </p>
          </div>
        </div>

        {/* ── Right Panel (Auth Form) ── */}
        <div className="w-full lg:w-[48%] flex items-center justify-center p-4 lg:p-10 bg-slate-50">
          <div className="w-full max-w-[420px]">

            {/* Mobile branding */}
            <div className="text-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentGrad} flex items-center justify-center text-white text-lg shadow-lg`}>
                  S
                </div>
                <span className="text-primary-600">Skilltera</span>
              </Link>
              <p className="mt-2 text-sm text-slate-500">
                {isCompany ? 'Company Portal' : 'Candidate Portal'}
              </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 p-8 border border-slate-100">
              {/* Top portal indicator */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6
                ${isCompany
                  ? 'bg-violet-50 text-violet-600 border border-violet-100'
                  : 'bg-primary-50 text-primary-600 border border-primary-100'}`}>
                {isCompany
                  ? <><Building2 size={11} /> Company Portal</>
                  : <><UserCheck size={11} /> Candidate Portal</>
                }
              </div>
              <Outlet />
            </div>

            {/* Footer links */}
            <div className="mt-6 text-center text-slate-400 text-xs space-y-1.5">
              <p>
                By signing in, you agree to our{' '}
                <Link to="#" className="text-primary-500 hover:text-primary-600 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="#" className="text-primary-500 hover:text-primary-600 hover:underline">Privacy Policy</Link>
              </p>
              <p>
                <Link to="#" className="text-slate-400 hover:text-slate-600 hover:underline">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}