import React, { lazy, Suspense, useEffect } from 'react';
import JobCard from './JobCard';
import { Loader2, Briefcase } from 'lucide-react';

const JobDescription = lazy(() => import('./JobDescription'));

// ─── Suspense fallback ────────────────────────────────────────────────────────
const DescriptionSkeleton = () => (
  <div className="h-full flex flex-col bg-white p-6 animate-pulse">
    {/* Header */}
    <div className="flex items-start gap-4 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-5 bg-slate-100 rounded-lg w-3/5" />
        <div className="h-3.5 bg-slate-100 rounded-lg w-2/5" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-slate-100 rounded-md" />
          <div className="h-5 w-20 bg-slate-100 rounded-md" />
        </div>
      </div>
    </div>
    {/* Quick info grid */}
    <div className="grid grid-cols-2 gap-2 mb-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-xl" />
      ))}
    </div>
    {/* CTA */}
    <div className="h-11 bg-slate-100 rounded-xl mb-6" />
    {/* Body lines */}
    <div className="space-y-3 flex-1">
      <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-100 rounded-lg" style={{ width: `${85 - i * 6}%` }} />
      ))}
    </div>
    {/* Center spinner */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader2 size={28} className="text-primary-400 animate-spin" />
    </div>
  </div>
);

// ─── Empty state when no jobs ─────────────────────────────────────────────────
const NoJobs = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
      <Briefcase size={26} className="text-slate-300" />
    </div>
    <p className="text-slate-600 font-semibold mb-1">No jobs found</p>
    <p className="text-slate-400 text-sm">Try adjusting your filters</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobListings({ jobs, savedJobs, onSave, onApply, assessmentCompleted = true }) {
  const [selectedJob, setSelectedJob] = React.useState(null);
  const detailPanelRef = React.useRef(null);

  const handleViewDetails = (job) => setSelectedJob(job);
  const handleClose = () => setSelectedJob(null);

  // Close detail panel on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll detail panel to top when job changes
  useEffect(() => {
    if (detailPanelRef.current) {
      detailPanelRef.current.scrollTop = 0;
    }
  }, [selectedJob?.id]);

  // Prevent body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = selectedJob ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [!!selectedJob]);

  const panelOpen = !!selectedJob;

  return (
    <div className="relative flex gap-5">

      {/* ── Left: Job Cards ─────────────────────────────────────────────── */}
      <div
        className={`
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${panelOpen ? 'w-full lg:w-[42%] xl:w-1/3' : 'w-full'}
        `}
      >
        {/* Sticky height container so the list scrolls independently */}
        <div
          className={`
            sticky top-0
            max-h-[calc(100vh-80px)]
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
            hover:scrollbar-thumb-slate-300
            ${panelOpen
              ? 'space-y-3 pr-1'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}
          `}
        >
          {jobs && jobs.length > 0 ? (
            jobs.map((job, i) => (
              <div
                key={job.id}
                style={{ opacity: 0, animation: `fadeSlideUp 0.4s ease ${i * 50}ms forwards` }}
              >
                <JobCard
                  job={job}
                  onViewDetails={handleViewDetails}
                  onSave={onSave}
                  isSaved={savedJobs.includes(job.id)}
                  isActive={selectedJob?.id === job.id}
                />
              </div>
            ))
          ) : (
            <div className={panelOpen ? '' : 'col-span-full'}>
              <NoJobs />
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Detail Panel ──────────────────────────────────────────── */}
      {/* Mobile: full-screen overlay | Desktop: inline panel */}
      {panelOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            className={`
              fixed inset-y-0 right-0 w-full sm:w-[480px]
              lg:relative lg:inset-auto lg:w-[58%] xl:w-2/3
              z-50 lg:z-auto
              transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${panelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Panel card */}
            <div
              ref={detailPanelRef}
              className="
                sticky top-0
                h-[100dvh] lg:h-[calc(100vh-80px)]
                overflow-hidden
                bg-white
                rounded-none sm:rounded-2xl lg:rounded-2xl
                border-0 lg:border border-slate-100
                shadow-2xl lg:shadow-lg
              "
            >
              <Suspense fallback={<div className="relative h-full"><DescriptionSkeleton /></div>}>
                <JobDescription
                  job={selectedJob}
                  onClose={handleClose}
                  onApply={onApply}
                  onSave={onSave}
                  isSaved={savedJobs.includes(selectedJob.id)}
                  assessmentCompleted={assessmentCompleted}
                />
              </Suspense>
            </div>
          </div>
        </>
      )}

      {/* Keyframe injection */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}