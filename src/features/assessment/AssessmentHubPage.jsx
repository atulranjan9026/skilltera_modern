/**
 * AssessmentHubPage - Landing page for assessments (Phase 4)
 * Shows status, value proposition, and CTA before entering full-screen flow
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../store/context/AuthContext';
import { useTestCompletion } from './hooks/useTestCompletion';
import { candidateService } from '../../services/candidateService';
import { THEME_CLASSES } from '../../theme';
import { ClipboardCheck, ArrowRight } from 'lucide-react';

export default function AssessmentHubPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { completed, canTakeTest, cooldownStatus, loading: completionLoading } = useTestCompletion(user?._id);

  const startAssessment = (practice = false) => {
    navigate(practice ? '/assessment?practice=1' : '/assessment');
  };
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchJobCount() {
      try {
        const response = await candidateService.getRankingJobs({ page: 1, limit: 1 });
        if (!cancelled && response?.data?.pagination) {
          setTotalJobs(response.data.pagination.totalJobs ?? 0);
        }
      } catch {
        if (!cancelled) setTotalJobs(0);
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    }
    if (user?._id) fetchJobCount();
    else setJobsLoading(false);
    return () => { cancelled = true; };
  }, [user?._id]);

  const daysRemaining = cooldownStatus?.daysRemaining ?? 0;
  const performanceLevel = cooldownStatus?.performanceLevel ?? '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className={THEME_CLASSES.cards + ' p-8'}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Skills Assessment</h1>
            <p className="text-slate-600 text-sm">Complete once, qualify for multiple roles</p>
          </div>
        </div>

        {completionLoading ? (
          <p className="text-slate-600">Loading...</p>
        ) : (
          <>
            {/* Value proposition */}
            {!jobsLoading && totalJobs > 0 && (
              <p className="text-slate-600 mb-6">
                Unlocks <strong>{totalJobs}</strong> {totalJobs === 1 ? 'role' : 'roles'} for you to apply
              </p>
            )}

            {/* Status and CTA */}
            {!completed ? (
              <div className="space-y-4">
                <p className="text-slate-600">
                  Take the assessment to demonstrate your skills and unlock job applications.
                </p>
                <button
                  type="button"
                  onClick={() => startAssessment(false)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
                >
                  Start Assessment
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : canTakeTest ? (
              <div className="space-y-4">
                <p className="text-slate-600">
                  You can retake the assessment. Your new score will replace the previous one.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => startAssessment(false)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
                  >
                    Take Test Again
                    <ArrowRight size={18} />
                  </button>
                  <Link
                    to="/test-results"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="font-medium text-amber-900 mb-1">
                    Next attempt available in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </p>
                  {performanceLevel && (
                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${THEME_CLASSES.badges.warning}`}>
                      {performanceLevel}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm">
                  You can retake after the cooldown period. Use practice mode to prepare in the meantime.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => startAssessment(true)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}
                  >
                    Practice Assessment
                    <ArrowRight size={18} />
                  </button>
                  <Link
                    to="/test-results"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}
                  >
                    View Results
                  </Link>
                </div>
              </div>
            )}

            {/* Practice mode CTA (always visible) */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-slate-600 text-sm mb-2">Want to try without affecting your record?</p>
              <button
                type="button"
                onClick={() => startAssessment(true)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Practice Assessment (does not count)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
