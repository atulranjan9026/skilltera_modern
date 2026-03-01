/**
 * TestResultsPage - Persistent page for viewing completed assessment results
 * Fetches stored evaluation data from the backend so results survive page refreshes
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, Check } from 'lucide-react';
import { THEME_CLASSES } from '../../../theme';
import { useAuthContext } from '../../../store/context/AuthContext';
import { toast } from '../../../utils/toast';
import { testService } from '../services/testService';
import { downloadPDF, copyToClipboard } from '../utils/exportResults';

function getRatingBadgeClass(rating) {
  const r = (rating || '').toLowerCase();
  if (r.includes('excellent')) return THEME_CLASSES.badges.success;
  if (r.includes('good')) return THEME_CLASSES.badges.success;
  if (r.includes('satisfactory')) return THEME_CLASSES.badges.warning;
  return THEME_CLASSES.badges.neutral;
}

export default function TestResultsPage() {
  const { user } = useAuthContext();
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchResults() {
      try {
        const response = await testService.getTestResults();
        if (!cancelled) {
          const data = response?.data;
          setEvalData(data && data.overallScore !== undefined ? data : null);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load test results.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResults();
    return () => { cancelled = true; };
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={THEME_CLASSES.cards + ' p-8 text-center'}>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={THEME_CLASSES.cards + ' p-8 text-center'}>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/assessments" className={`inline-block px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}>
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  if (!evalData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={THEME_CLASSES.cards + ' p-8 text-center'}>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Results Yet</h2>
          <p className="text-slate-600 mb-6">You haven't completed an assessment yet. Take one to see your results here.</p>
          <Link to="/assessments" className={`inline-block px-6 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}>
            Go to Assessments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className={THEME_CLASSES.cards + ' p-8'}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Assessment Results</h2>
          <p className="text-slate-600">Your most recent assessment performance</p>
        </div>

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

        <div className="text-center">
          <Link
            to="/assessments"
            className={`inline-block px-8 py-3 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    </div>
  );
}
