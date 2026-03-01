/**
 * TestSetup - Test configuration / skill selection
 */
import { useState, useEffect } from 'react';
import { testService } from '../services/testService';
import { useAuthContext } from '../../../store/context/AuthContext';
import { THEME_CLASSES } from '../../../theme';

export default function TestSetup({ state }) {
  const { user } = useAuthContext() || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testPlan, setTestPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await testService.generateTestPlan({
          skillsRating: user?.skillsRating || user?.skills || [],
          overallExperience: user?.overallExperience ?? 0,
          roleYouWant: user?.currentRole || user?.roleYouWant || 'Developer',
        });
        const data = res?.data ?? res;
        if (!cancelled && data?.recommendedSkills) {
          setTestPlan(data);
        } else {
          setTestPlan({ testType: 'Technical', recommendedSkills: [] });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load test plan');
          setTestPlan({ testType: 'Technical', recommendedSkills: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (user) load();
    else setLoading(false);
    return () => { cancelled = true; };
  }, [user]);

  const handleStart = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const config = {
        typeOfTest: testPlan?.testType || 'Technical',
        skillNeedToTest: (testPlan?.recommendedSkills || []).map((s) => ({
          skill: s.skill,
          difficulty: s.difficulty,
          programmingLanguage: s.programmingLanguage,
        })),
        conditionSkills: {
          overallExperience: user?.overallExperience ?? 0,
          roleYouWant: user?.currentRole || user?.roleYouWant || 'Developer',
          skillsRating: user?.skillsRating || user?.skills || [],
        },
        practiceMode: state.practiceMode || false,
      };
      await testService.createUpdateTest(config);
      state.handleSetupComplete(config);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start test');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <p className="text-slate-600">Loading test setup...</p>
      </div>
    );
  }

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Test Setup</h2>
      <p className="text-slate-600 mb-4">
        Test type: <strong>{testPlan?.testType || 'Technical'}</strong>
      </p>
      {(testPlan?.recommendedSkills || []).length > 0 && (
        <ul className="list-disc list-inside text-slate-600 mb-6">
          {testPlan.recommendedSkills.map((s, i) => (
            <li key={i}>
              {s.skill} ({s.difficulty})
              {s.programmingLanguage ? ` - ${s.programmingLanguage}` : ''}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <p className="text-sm text-slate-500 mb-4">Estimated time: ~25 minutes</p>
      <button
        onClick={handleStart}
        disabled={submitting}
        className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
      >
        {submitting ? 'Starting...' : 'Start Assessment'}
      </button>
    </div>
  );
}
