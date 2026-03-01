/**
 * ResultsView - Success message + scores/breakdown (Phase 5) + Continue to Profile
 * Practice mode: simple messaging, no scores
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, Check } from 'lucide-react';
import { THEME_CLASSES } from '../../../theme';
import { useAuthContext } from '../../../store/context/AuthContext';
import { toast } from '../../../utils/toast';
import { downloadPDF, copyToClipboard } from '../utils/exportResults';

function getRatingBadgeClass(rating) {
  const r = (rating || '').toLowerCase();
  if (r.includes('excellent')) return THEME_CLASSES.badges.success;
  if (r.includes('good')) return THEME_CLASSES.badges.success;
  if (r.includes('satisfactory')) return THEME_CLASSES.badges.warning;
  return THEME_CLASSES.badges.neutral;
}

export default function ResultsView({ state }) {
  const isPractice = state.practiceMode === true;
  const evalData = state.lastEvaluation;
  const { user } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      await downloadPDF(evalData, user);
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(evalData);
      setCopied(true);
      toast.success('Results copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy results.');
    }
  };

  return (
    <div className={THEME_CLASSES.cards + ' p-8'}>
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          {isPractice ? 'Practice Complete' : 'Assessment Complete'}
        </h2>
        <p className="text-slate-600">
          {isPractice
            ? 'This was a practice run. Your results were not recorded. Ready to take the real assessment?'
            : 'Thank you for completing the assessment. Your results have been recorded.'}
        </p>
      </div>

      {!isPractice && evalData && (
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">{evalData.overallScore ?? 0}/100</p>
              <p className="text-sm text-slate-500">Overall Score</p>
            </div>
            {evalData.rating && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRatingBadgeClass(evalData.rating)}`}>
                {evalData.rating}
              </span>
            )}
          </div>

          {(evalData.evaluations || []).length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Problem breakdown</h3>
              <div className="space-y-4">
                {evalData.evaluations.map((item, i) => {
                  const ev = item.evaluation || {};
                  const score = ev.finalScore ?? ev.baseScore ?? 0;
                  const title = item.problem?.title || `Problem ${i + 1}`;
                  return (
                    <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{title}</span>
                        <span className={score >= 70 ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                          {score}/100
                        </span>
                      </div>
                      {ev.feedback && (
                        <p className="text-sm text-slate-600">{ev.feedback}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(evalData.summary?.recommendations || []).length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Recommendations</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {evalData.summary.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Share / Download actions */}
          <div className="flex justify-center gap-3 border-t border-slate-200 pt-6">
            <button
              onClick={handleDownloadPDF}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm ${THEME_CLASSES.buttons.outline}`}
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm ${THEME_CLASSES.buttons.outline}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isPractice ? (
          <>
            <Link
              to="/assessments"
              className={`inline-block px-8 py-3 rounded-lg font-medium text-center ${THEME_CLASSES.buttons.primary}`}
            >
              Back to Assessments
            </Link>
            <Link
              to="/assessment"
              className={`inline-block px-8 py-3 rounded-lg font-medium text-center ${THEME_CLASSES.buttons.outline}`}
            >
              Start Real Assessment
            </Link>
          </>
        ) : (
          <Link
            to="/profile"
            className={`inline-block px-8 py-3 rounded-lg font-medium text-center ${THEME_CLASSES.buttons.primary}`}
          >
            Continue to Profile
          </Link>
        )}
      </div>
    </div>
  );
}
