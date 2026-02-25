import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark, CheckCircle, Briefcase, MapPin, DollarSign,
  Clock, Search, User, ArrowUpRight, Building2, FileText,
  XCircle, RefreshCw, Star, UserCheck, AlertCircle,
  ChevronLeft, ChevronRight, RotateCcw,
} from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { useAuthContext } from '../../store/context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG — keys match Mongoose enum exactly
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-500',    icon: FileText,    description: 'Application submitted' },
  shortlisted: { label: 'Shortlisted', color: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500',   icon: Star,        description: 'Shortlisted by recruiter' },
  interviewed: { label: 'Interviewed', color: 'bg-violet-50 text-violet-700 border-violet-200',  dot: 'bg-violet-500',  icon: UserCheck,   description: 'Interview completed' },
  selected:    { label: 'Selected',    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',dot: 'bg-emerald-500', icon: CheckCircle, description: 'Congratulations! Selected' },
  rejected:    { label: 'Rejected',    color: 'bg-red-50 text-red-700 border-red-200',            dot: 'bg-red-400',     icon: XCircle,     description: 'Not selected' },
  withdrawn:   { label: 'Withdrawn',   color: 'bg-slate-100 text-slate-500 border-slate-200',    dot: 'bg-slate-400',   icon: RefreshCw,   description: 'You withdrew' },
};

const ACTIVE_STATUSES = ['applied', 'shortlisted', 'interviewed', 'selected'];
const PAGE_SIZE = 8;

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] ?? {
    label: status ?? 'Unknown',
    color: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
    icon: FileText,
  };

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED FETCHER HOOK
// - Module-level cache (stale-while-revalidate)
// - Request deduplication via AbortController
// - Auto-retry with exponential backoff (3 attempts max)
// - Unmount safety — never sets state after component unmounts
// ─────────────────────────────────────────────────────────────────────────────
const fetcherCache = new Map();

function useFetcher(fetcher, deps, { cacheKey, enabled = true, retries = 3 } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null, stale: false });
  const abortRef   = useRef(null);
  const retryCount = useRef(0);
  const isMounted  = useRef(true);

  const run = useCallback(async (isRetry = false) => {
    if (!enabled) return;

    // Serve stale data immediately while fresh data loads
    if (cacheKey && fetcherCache.has(cacheKey) && !isRetry) {
      setState((s) => ({ ...s, data: fetcherCache.get(cacheKey), loading: true, stale: true, error: null }));
    } else if (!isRetry) {
      setState((s) => ({ ...s, loading: true, error: null }));
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await fetcher(controller.signal);
      if (!isMounted.current || controller.signal.aborted) return;
      if (cacheKey) fetcherCache.set(cacheKey, data);
      retryCount.current = 0;
      setState({ data, loading: false, error: null, stale: false });
    } catch (err) {
      if (!isMounted.current || controller.signal.aborted) return;
      if (retryCount.current < retries && err?.name !== 'AbortError') {
        retryCount.current += 1;
        const backoff = Math.min(1000 * 2 ** retryCount.current, 8000);
        setState((s) => ({ ...s, error: `Retrying… (${retryCount.current}/${retries})` }));
        setTimeout(() => run(true), backoff);
      } else {
        retryCount.current = 0;
        setState((s) => ({
          ...s,
          loading: false,
          error: err?.response?.data?.message || err?.message || 'Something went wrong',
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, cacheKey, ...deps]);

  useEffect(() => {
    isMounted.current = true;
    run();
    return () => {
      isMounted.current = false;
      abortRef.current?.abort();
    };
  }, [run]);

  const refetch = useCallback(() => {
    retryCount.current = 0;
    if (cacheKey) fetcherCache.delete(cacheKey);
    run();
  }, [run, cacheKey]);

  return { ...state, refetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA TRANSFORMERS
// ─────────────────────────────────────────────────────────────────────────────
const formatSalary = (salary) => {
  if (!salary) return null;
  if (typeof salary === 'string') return salary;
  if (typeof salary === 'object') {
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} – $${salary.max.toLocaleString()}`;
    if (salary.min) return `$${salary.min.toLocaleString()}+`;
  }
  return null;
};

const transformApp = (app) => ({
  id: app._id,
  title: app.job?.jobTitle || app.job?.title || 'Job Title',
  company: app.job?.companyId?.companyName || null,
  location: [app.job?.city, app.job?.state, app.job?.country].filter(Boolean).join(', ') || null,
  salary: formatSalary(app.job?.salary),
  jobType: app.job?.jobType || null,
  experience: app.job?.workExperience ?? null,
  postedTime: app.job?.postedOn
    ? new Date(app.job.postedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null,
  appliedAt: app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null,
  status: app.status ?? 'applied',
  statusHistory: app.statusHistory ?? [],
});

const transformJob = (job) => ({
  id: job._id,
  title: job.jobTitle || job.title,
  company: job.companyId?.companyName || null,
  location: [job.city, job.state, job.country].filter(Boolean).join(', ') || null,
  salary: formatSalary(job.salary),
  jobType: job.jobType || null,
  experience: job.workExperience ?? null,
  postedTime: job.postedOn
    ? new Date(job.postedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null,
});

// ─────────────────────────────────────────────────────────────────────────────
// UI ATOMS
// ─────────────────────────────────────────────────────────────────────────────

/** Animated shimmer skeleton block */
const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-slate-100 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
      style={{ animation: 'shimmer 1.4s infinite' }} />
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 shadow-sm">
    <Shimmer className="w-11 h-11 shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-4 w-3/5" />
      <Shimmer className="h-3 w-2/5" />
      <div className="flex gap-2 pt-1">
        <Shimmer className="h-4 w-14 rounded-md" />
        <Shimmer className="h-4 w-12 rounded-md" />
      </div>
      <div className="flex gap-3">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-24" />
      </div>
    </div>
    <Shimmer className="w-8 h-8 rounded-xl shrink-0" />
  </div>
);

const SkeletonList = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ opacity: 0, animation: `fadeIn 0.4s ease ${i * 80}ms forwards` }}>
        <CardSkeleton />
      </div>
    ))}
  </div>
);

/** Colored status pill */
const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/** Summary stat card */
const StatCard = ({ value, label, sub, delay = 0 }) => (
  <div
    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
    style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease ${delay}ms forwards` }}
  >
    <p className="text-3xl font-bold text-primary-600 mb-0.5 tabular-nums">{value}</p>
    <p className="text-sm font-semibold text-slate-700">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

/** Illustrated empty state */
const EmptyState = ({ icon: Icon, title, body, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
      <Icon size={26} className="text-slate-300" />
    </div>
    <p className="text-slate-700 font-semibold text-base mb-1">{title}</p>
    <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{body}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/** Dismissible error block with retry CTA */
const ErrorBlock = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mb-4">
    <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
    <p className="flex-1 text-red-700 text-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
      >
        <RotateCcw size={11} /> Retry
      </button>
    )}
  </div>
);

/** Status filter pill row — shows only statuses present in data */
const StatusFilterChips = ({ activeFilter, onChange, counts }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  
  // Debug log
  // console.log('StatusFilterChips - counts:', counts, 'activeFilter:', activeFilter);
  
  return (
    <div className="flex gap-2 flex-wrap mb-5" style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease 0ms forwards' }}>
      {['all', ...Object.keys(STATUS_CONFIG)].map((key) => {
        const isAll  = key === 'all';
        const cfg    = isAll ? null : getStatusConfig(key);
        const count  = isAll ? total : (counts[key] ?? 0);
        const active = activeFilter === key;
        if (!isAll && count === 0) return null;

        return (
          <button
            key={key}
            onClick={() => {
              // console.log('Clicked status:', key);
              onChange(key);
            }}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold
              transition-all duration-150 select-none cursor-pointer
              ${active
                ? isAll
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : `${cfg.color} shadow-sm scale-[1.04]`
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'}
            `}
          >
            {!isAll && <span className={`w-1.5 h-1.5 rounded-full ${active ? cfg.dot : 'bg-slate-300'}`} />}
            {isAll ? 'All' : cfg.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${
              active
                ? isAll ? 'bg-white/20 text-white' : 'bg-white/60 text-inherit'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/** Prev / Next pagination strip */
const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100">
      <button
        onClick={onPrev} disabled={page === 1}
        className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
          text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm font-semibold text-slate-500 tabular-nums">
        {page} <span className="text-slate-300 mx-1">/</span> {totalPages}
      </span>
      <button
        onClick={onNext} disabled={page === totalPages}
        className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
          text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS TIMELINE (export for use in a side drawer/modal)
// Feed it job.statusHistory[] — no extra API call needed.
// ─────────────────────────────────────────────────────────────────────────────
export const StatusTimeline = ({ history = [] }) => (
  <div className="pl-4 border-l-2 border-slate-100 space-y-4">
    {history.map((entry, i) => {
      const cfg      = getStatusConfig(entry.status);
      const Icon     = cfg.icon;
      const isLatest = i === history.length - 1;
      return (
        <div key={entry._id ?? i} className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${cfg.color}
            ${isLatest ? 'ring-2 ring-offset-1 ring-primary-200' : ''}`}>
            <Icon size={13} />
          </div>
          <div className="pt-0.5">
            <p className={`text-sm font-semibold ${isLatest ? 'text-slate-900' : 'text-slate-500'}`}>{cfg.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {entry.changedAt
                ? new Date(entry.changedAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : '—'}
            </p>
            <p className="text-xs text-slate-400">{cfg.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// JOB CARD
// ─────────────────────────────────────────────────────────────────────────────
const JobCard = ({ job, isApplied, index = 0, onJobClick }) => (
  <div
    className="group bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm
      hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200
      transition-all duration-200 cursor-pointer"
    style={{ opacity: 0, animation: `fadeSlideUp 0.4s ease ${index * 55}ms forwards` }}
    onClick={() => onJobClick?.(job.id)}
  >
    {/* Avatar */}
    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100
      border border-primary-100 flex items-center justify-center shrink-0">
      <Building2 size={19} className="text-primary-400" />
    </div>

    {/* Body */}
    <div className="flex-1 min-w-0">
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <h3 className="font-semibold text-slate-900 truncate text-[15px] leading-snug
          group-hover:text-primary-600 transition-colors">
          {job.title}
        </h3>
        {isApplied && <StatusBadge status={job.status} />}
      </div>

      {/* Company */}
      {job.company && (
        <p className="text-sm text-slate-500 font-medium mb-2 truncate">{job.company}</p>
      )}

      {/* Tags */}
      {(job.jobType || job.experience != null) && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {job.jobType && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
              {job.jobType}
            </span>
          )}
          {job.experience != null && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
              <Briefcase size={9} /> {job.experience}+ yrs
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={11} className="shrink-0" />{job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <DollarSign size={11} className="shrink-0" />{job.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={11} className="shrink-0" />
          {isApplied
            ? job.appliedAt ? `Applied ${job.appliedAt}` : 'Applied recently'
            : job.postedTime ? `Posted ${job.postedTime}` : 'Recently posted'}
        </span>
      </div>
    </div>

    {/* Action */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onJobClick?.(job.id);
      }}
      className="shrink-0 w-8 h-8 rounded-xl bg-slate-50 border border-slate-100
        hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600
        flex items-center justify-center text-slate-300
        transition-all duration-150 active:scale-95"
      aria-label="Open job details"
      title="View job details"
    >
      <ArrowUpRight size={15} />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab,    setActiveTab]    = useState('saved');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [savedPage,    setSavedPage]    = useState(1);
  const [appsPage,     setAppsPage]     = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const userId = user?._id;

  // ── Fetch: saved jobs ─────────────────────────────────────────────────────
  const { data: savedData, loading: savedLoading, error: savedError, refetch: refetchSaved } =
    useFetcher(
      async () => {
        const res = await candidateService.getSavedJobs(userId);
        if (!res?.success) throw new Error(res?.message || 'Failed to load saved jobs');
        return (res.data?.jobs ?? []).map(transformJob);
      },
      [userId],
      { cacheKey: `saved-${userId}`, enabled: !!userId }
    );

  // ── Fetch: ALL applications (for status counts + total count) ─────────────
  const { data: allAppsData, loading: allAppsLoading, error: allAppsError, refetch: refetchAll } =
    useFetcher(
      async () => {
        const res = await candidateService.getApplications(userId);
        if (!res?.success) throw new Error(res?.message || 'Failed to load applications');
        const apps = (res.data?.applications ?? []).map(transformApp);
        const counts = {};
        apps.forEach((a) => { counts[a.status] = (counts[a.status] ?? 0) + 1; });
        return { apps, counts };
      },
      [userId],
      { cacheKey: `apps-all-${userId}`, enabled: !!userId, retries: 3 }
    );

  // ── Fetch: filtered applications (driven by status chip) ──────────────────
  // Only fires when a specific status is active; caches each status slice separately
  const { data: filteredData, loading: filteredLoading, error: filteredError, refetch: refetchFiltered } =
    useFetcher(
      async () => {
        const opts = statusFilter !== 'all' ? { status: statusFilter } : {};
        const res  = await candidateService.getApplications(userId, opts);
        if (!res?.success) throw new Error(res?.message || 'Failed to load applications');
        return (res.data?.applications ?? []).map(transformApp);
      },
      [userId, statusFilter],
      { cacheKey: `apps-${statusFilter}-${userId}`, enabled: !!userId, retries: 2 }
    );

  // Reset pagination when filter / search changes
  useEffect(() => { setAppsPage(1);  }, [statusFilter, debouncedSearch]);
  useEffect(() => { setSavedPage(1); }, [debouncedSearch]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const savedJobs    = savedData ?? [];
  const statusCounts = allAppsData?.counts ?? {};
  const allAppsCount = allAppsData?.apps?.length ?? 0;
  const displayApps  = filteredData ?? allAppsData?.apps ?? [];


  const activeJobsCount = ACTIVE_STATUSES.reduce((acc, s) => acc + (statusCounts[s] ?? 0), 0);
  const applyRate = savedJobs.length + allAppsCount > 0
    ? Math.round((allAppsCount / (savedJobs.length + allAppsCount)) * 100)
    : 0;

  // Client-side search
  const q = debouncedSearch.toLowerCase();
  const filteredSaved = savedJobs.filter(
    (j) => (j.title ?? '').toLowerCase().includes(q) || (j.company ?? '').toLowerCase().includes(q)
  );
  const filteredApps = displayApps.filter(
    (j) => (j.title ?? '').toLowerCase().includes(q) || (j.company ?? '').toLowerCase().includes(q)
  );

  // Paginate
  const paginatedSaved = filteredSaved.slice((savedPage - 1) * PAGE_SIZE, savedPage * PAGE_SIZE);
  const paginatedApps  = filteredApps.slice((appsPage - 1) * PAGE_SIZE, appsPage * PAGE_SIZE);
  const savedTotalPages = Math.ceil(filteredSaved.length / PAGE_SIZE);
  const appsTotalPages  = Math.ceil(filteredApps.length / PAGE_SIZE);

  const isAppsLoading  = allAppsLoading || filteredLoading;
  const isSavedLoading = savedLoading;

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100
            flex items-center justify-center mx-auto mb-3 shadow-sm">
            <User size={24} className="text-primary-400" />
          </div>
          <p className="text-slate-700 font-semibold text-sm">Please log in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-[75rem]">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-9" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease 0ms forwards' }}>
          <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.14em] mb-1.5">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Hey, {user.fullname || user.name || 'there'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track your applications and saved jobs</p>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <StatCard
            value={isSavedLoading ? '—' : savedJobs.length}
            label="Saved Jobs"
            sub="Ready to apply"
            delay={80}
          />
          <StatCard
            value={isAppsLoading ? '—' : allAppsCount}
            label="Applications"
            sub={isAppsLoading ? '' : `${activeJobsCount} in progress`}
            delay={160}
          />
          <div
            className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
            style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease 240ms forwards' }}
          >
            <p className="text-3xl font-bold text-primary-600 mb-0.5 tabular-nums">{applyRate}%</p>
            <p className="text-sm font-semibold text-slate-700">Apply Rate</p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                style={{ width: `${applyRate}%`, transition: 'width 1s cubic-bezier(0.25,1,0.5,1)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div
          className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5"
          style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease 300ms forwards' }}
        >
          {[
            { key: 'saved',   label: 'Saved',       count: savedJobs.length, loading: isSavedLoading, icon: Bookmark },
            { key: 'applied', label: 'Applications', count: allAppsCount,     loading: allAppsLoading, icon: CheckCircle },
          ].map(({ key, label, count, loading, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                if (key === 'saved') setStatusFilter('all');
                setSearchQuery('');
              }}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                text-sm font-semibold transition-all duration-200 select-none
                ${activeTab === key
                  ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              <Icon size={14} />
              {label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold tabular-nums ${
                activeTab === key ? 'bg-primary-50 text-primary-600' : 'bg-slate-200 text-slate-400'
              }`}>
                {loading ? '…' : count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <div
          className="relative mb-4"
          style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease 360ms forwards' }}
        >
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'saved' ? 'Search saved jobs…' : 'Search applications…'}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl
              text-sm text-slate-800 placeholder-slate-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300
              transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              aria-label="Clear search"
            >
              <XCircle size={15} />
            </button>
          )}
        </div>

        {/* ── Status chips ─────────────────────────────────────────────── */}
        {activeTab === 'applied' && !allAppsLoading && Object.keys(statusCounts).length > 0 && (
          <StatusFilterChips
            activeFilter={statusFilter}
            onChange={(key) => { setStatusFilter(key); setSearchQuery(''); }}
            counts={statusCounts}
          />
        )}

        {/* ── Content ─────────────────────────────────────────────────── */}
        {activeTab === 'saved' ? (
          <>
            {savedError && !isSavedLoading && (
              <ErrorBlock message={savedError} onRetry={refetchSaved} />
            )}
            {isSavedLoading ? (
              <SkeletonList count={4} />
            ) : paginatedSaved.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginatedSaved.map((job, i) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      isApplied={false} 
                      index={i}
                      onJobClick={(jobId) => {
                        navigate(`/job/${jobId}`);
                      }}
                    />
                  ))}
                </div>
                <Pagination
                  page={savedPage} totalPages={savedTotalPages}
                  onPrev={() => setSavedPage((p) => Math.max(1, p - 1))}
                  onNext={() => setSavedPage((p) => Math.min(savedTotalPages, p + 1))}
                />
              </>
            ) : (
              <EmptyState
                icon={Bookmark}
                title={debouncedSearch ? 'No results found' : 'No saved jobs yet'}
                body={debouncedSearch ? 'Try a different search term.' : 'Browse jobs and bookmark them to revisit here.'}
                action={debouncedSearch && (
                  <button onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-primary-600 hover:underline">
                    Clear search
                  </button>
                )}
              />
            )}
          </>
        ) : (
          <>
            {(allAppsError || filteredError) && !isAppsLoading && (
              <ErrorBlock
                message={allAppsError || filteredError}
                onRetry={() => { refetchAll(); refetchFiltered(); }}
              />
            )}
            {isAppsLoading ? (
              <SkeletonList count={4} />
            ) : paginatedApps.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginatedApps.map((job, i) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      isApplied={true} 
                      index={i}
                      onJobClick={(jobId) => {
                        navigate(`/job/${jobId}`);
                      }}
                    />
                  ))}
                </div>
                <Pagination
                  page={appsPage} totalPages={appsTotalPages}
                  onPrev={() => setAppsPage((p) => Math.max(1, p - 1))}
                  onNext={() => setAppsPage((p) => Math.min(appsTotalPages, p + 1))}
                />
              </>
            ) : (
              <EmptyState
                icon={statusFilter !== 'all' ? getStatusConfig(statusFilter).icon : Briefcase}
                title={
                  debouncedSearch ? 'No results found' :
                  statusFilter !== 'all' ? `No "${getStatusConfig(statusFilter).label}" applications` :
                  'No applications yet'
                }
                body={
                  debouncedSearch ? 'Try a different search term.' :
                  statusFilter !== 'all' ? 'Try a different status filter above.' :
                  'Apply to jobs and track your progress here.'
                }
                action={(debouncedSearch || statusFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              />
            )}
          </>
        )}

      </div>
    </div>
  );
}