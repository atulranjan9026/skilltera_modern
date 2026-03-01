/**
 * ProblemSelect - Select problem to solve (technical or non-technical)
 */
import { useState, useEffect, useCallback } from 'react';
import { testService } from '../services/testService';
import { THEME_CLASSES } from '../../../theme';

export default function ProblemSelect({ state }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        recommendedSkills: state.testConfig?.skillNeedToTest || state.testPlan?.recommendedSkills || [],
        testType: state.testConfig?.typeOfTest || 'Technical',
        overallExperience: state.testConfig?.conditionSkills?.overallExperience ?? 0,
        roleYouWant: state.testConfig?.conditionSkills?.roleYouWant || '',
      };
      const res = await testService.generateProblem(config);
      const data = res?.data ?? res;
      const list = data?.problems || [];
      setProblems(list);
      if (list.length > 0) {
        await testService.storeProblem(data, state.practiceMode);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  }, [state.testConfig, state.testPlan, state.practiceMode]);

  useEffect(() => {
    // If problems were prefetched during self-intro, use them immediately
    if (state.prefetchedProblems) {
      const list = state.prefetchedProblems.problems || [];
      setProblems(list);
      setLoading(false);
      return;
    }
    // If still loading in background, wait for next render
    if (state.problemsLoading) return;

    // Fallback: fetch on mount (prefetch failed or wasn't triggered)
    fetchProblems();
  }, [state.prefetchedProblems, state.problemsLoading, fetchProblems]);

  const handleSelect = (problem) => {
    state.handleProblemSelect(problem);
  };

  if (loading) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <p className="text-slate-600">Loading problems...</p>
      </div>
    );
  }

  if (error || problems.length === 0) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <p className="text-slate-600 mb-4">No problems available. Please try again.</p>
        <button
          onClick={fetchProblems}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Select a Problem</h2>
      <div className="space-y-4">
        {problems.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-lg border border-slate-200 hover:border-primary-500 cursor-pointer transition-colors"
            onClick={() => handleSelect(p)}
          >
            <h3 className="font-medium text-slate-900">{p.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {p.skill || p.language} • {p.difficulty}
              {p.estimatedSolveTime ? ` • ~${p.estimatedSolveTime} min` : ''}
            </p>
            <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
