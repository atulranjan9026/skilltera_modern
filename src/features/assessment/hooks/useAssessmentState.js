/**
 * useAssessmentState - Assessment flow state management
 * Pure in-memory state — no localStorage caching.
 * Each assessment start is fresh; data is persisted server-side via API calls.
 */
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testService } from '../services/testService';

const STAGES = [
  'privacy-check',
  'setup',
  'self-introduction',
  'code',
  'results',
];

const defaultState = {
  currentStage: 'privacy-check',
  testConfig: null,
  problem: null,
  problems: [],
  currentProblemIndex: 0,
  allSolutions: [],
  testPlan: null,
  privacyAccepted: false,
  envScanCompleted: false,
  selfIntroData: [],
  envScanData: [],
  solutions: {},
  practiceMode: false,
  lastEvaluation: null,
  prefetchedProblems: null,
  problemsLoading: false,
  problemsError: null,
};

export function useAssessmentState() {
  const [searchParams] = useSearchParams();
  const practiceFromUrl = searchParams.get('practice') === '1' || searchParams.get('practice') === 'true';

  const [state, setState] = useState({ ...defaultState });

  useEffect(() => {
    setState((s) => ({ ...s, practiceMode: practiceFromUrl }));
  }, [practiceFromUrl]);

  const setStage = useCallback((stage) => {
    if (STAGES.includes(stage)) {
      setState((s) => ({ ...s, currentStage: stage }));
    }
  }, []);

  const handlePrivacyAccept = useCallback((envScanData = []) => {
    setState((s) => ({
      ...s,
      privacyAccepted: true,
      envScanCompleted: true,
      envScanData,
      currentStage: 'setup',
    }));

    // Upload env scan to backend in background
    if (envScanData.length > 0) {
      testService.uploadEnvScan({ envScan: envScanData }, practiceFromUrl)
        .catch((err) => console.warn('Env scan upload failed:', err));
    }
  }, [practiceFromUrl]);

  const handleSetupComplete = useCallback(async (config) => {
    setState((s) => ({
      ...s,
      testConfig: config,
      testPlan: config,
      currentStage: 'self-introduction',
      problemsLoading: true,
      problemsError: null,
    }));

    // Fire problem generation in background during self-intro
    try {
      const problemConfig = {
        recommendedSkills: (config.skillNeedToTest || []).map((s) => ({
          skill: s.skill,
          difficulty: s.difficulty,
          programmingLanguage: s.programmingLanguage,
        })),
        testType: config.typeOfTest || 'Technical',
        overallExperience: config.conditionSkills?.overallExperience ?? 0,
        roleYouWant: config.conditionSkills?.roleYouWant || '',
      };
      const res = await testService.generateProblem(problemConfig, { timeout: 180000 });
      const data = res?.data ?? res;
      const list = data?.problems || [];
      setState((s) => ({
        ...s,
        prefetchedProblems: list.length > 0 ? data : null,
        problemsLoading: false,
      }));
      if (list.length > 0) {
        await testService.storeProblem(data, config.practiceMode);
      }
    } catch (err) {
      setState((s) => ({
        ...s,
        problemsLoading: false,
        problemsError: err?.message || 'Problem generation failed',
      }));
    }
  }, []);

  const handleSelfIntroComplete = useCallback((data = []) => {
    setState((s) => {
      const list = s.prefetchedProblems?.problems || [];
      return {
        ...s,
        selfIntroData: data,
        problems: list,
        currentProblemIndex: 0,
        allSolutions: [],
        problem: list[0] || null,
        currentStage: 'code',
      };
    });
  }, []);

  // When prefetchedProblems arrive after we've already moved to 'code' stage
  // (i.e. self-intro finished before problem generation), load them in
  useEffect(() => {
    if (
      state.currentStage === 'code' &&
      state.problems.length === 0 &&
      !state.problemsLoading &&
      state.prefetchedProblems?.problems?.length > 0
    ) {
      const list = state.prefetchedProblems.problems;
      setState((s) => ({
        ...s,
        problems: list,
        currentProblemIndex: 0,
        problem: list[0] || null,
      }));
    }
  }, [state.currentStage, state.problems.length, state.problemsLoading, state.prefetchedProblems]);

  const handleNextProblem = useCallback((code) => {
    setState((s) => {
      const updatedSolutions = [...s.allSolutions, { problem: s.problem, solution: code }];
      const nextIndex = s.currentProblemIndex + 1;
      return {
        ...s,
        allSolutions: updatedSolutions,
        currentProblemIndex: nextIndex,
        problem: s.problems[nextIndex] || null,
      };
    });
  }, []);

  const handleCodeComplete = useCallback((solutions, evaluation) => {
    setState((s) => ({
      ...s,
      solutions: typeof solutions === 'object' ? solutions : { ...s.solutions, ...solutions },
      lastEvaluation: evaluation ?? null,
      currentStage: 'results',
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ ...defaultState });
  }, []);

  const currentStepIndex = STAGES.indexOf(state.currentStage);
  const totalSteps = 4; // UX shows "Step X of 4"
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return {
    ...state,
    practiceMode: practiceFromUrl || state.practiceMode,
    setStage,
    handlePrivacyAccept,
    handleSetupComplete,
    handleSelfIntroComplete,
    handleNextProblem,
    handleCodeComplete,
    reset,
    stages: STAGES,
    currentStepIndex: Math.min(currentStepIndex + 1, totalSteps),
    totalSteps,
    progressPercent,
  };
}
