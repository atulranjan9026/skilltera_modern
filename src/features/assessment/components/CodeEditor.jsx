/**
 * CodeEditor - Monaco-based code editor for technical problems
 * Handles sequential multi-problem flow: solve each problem, then evaluate all at once
 */
import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { testService } from '../services/testService';
import { THEME_CLASSES } from '../../../theme';

const LANG_MAP = {
  javascript: 'javascript', JavaScript: 'javascript', js: 'javascript',
  python: 'python', Python: 'python', py: 'python',
  java: 'java', Java: 'java',
  sql: 'sql', SQL: 'sql',
  typescript: 'typescript', TypeScript: 'typescript', ts: 'typescript',
};

function getMonacoLanguage(lang) {
  const key = (lang || 'javascript').toString().trim();
  return LANG_MAP[key] || 'javascript';
}

export default function CodeEditor({ state }) {
  const problem = state.problem;
  const problems = state.problems || [];
  const currentIndex = state.currentProblemIndex ?? 0;
  const totalProblems = problems.length;
  const isLastProblem = currentIndex >= totalProblems - 1;

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (problem) {
      setCode(`// ${problem.title}\n// Language: ${problem.language || problem.skill || 'JavaScript'}\n\nfunction solution() {\n  // Your code here\n  return;\n}\n`);
      setError(null);
    }
  }, [problem]);

  const handleEditorChange = useCallback((value) => setCode(value ?? ''), []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (!isLastProblem) {
        // Save solution and move to next problem
        state.handleNextProblem(code);
      } else {
        // Last problem — collect all solutions and evaluate
        const allPairs = [
          ...(state.allSolutions || []),
          { problem, solution: code },
        ];
        const isNonTechnical = problem?.questionType != null;
        const evaluate = isNonTechnical ? testService.evaluateNonTechnical : testService.evaluateCode;
        const res = await evaluate(allPairs);
        const data = res?.data ?? res;
        await testService.uploadEvaluation(
          {
            overallScore: data?.overallScore ?? 0,
            rating: data?.rating ?? 'N/A',
            evaluations: data?.evaluations ?? [],
            techAnalysis: data?.techAnalysis ?? {},
            summary: data?.summary ?? {},
          },
          state.practiceMode
        );
        const evaluationData = {
          overallScore: data?.overallScore ?? 0,
          rating: data?.rating ?? 'N/A',
          evaluations: data?.evaluations ?? [],
          summary: data?.summary ?? {},
        };
        const solutionMap = {};
        allPairs.forEach((p) => { solutionMap[p.problem?.id] = p.solution; });
        state.handleCodeComplete(solutionMap, evaluationData);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Evaluation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (state.problemsLoading) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <p className="text-slate-600">Generating problems...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <p className="text-slate-600">No problems available.</p>
      </div>
    );
  }

  const submitLabel = submitting
    ? (isLastProblem ? 'Evaluating...' : 'Saving...')
    : (isLastProblem ? 'Submit All' : 'Next Problem');

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{problem.title}</h2>
        {totalProblems > 1 && (
          <span className="text-sm text-slate-500 font-medium">
            Problem {currentIndex + 1} of {totalProblems}
          </span>
        )}
      </div>
      <div className="mb-2 text-sm text-slate-500">
        {problem.skill || problem.language} • {problem.difficulty}
        {problem.estimatedSolveTime ? ` • ~${problem.estimatedSolveTime} min` : ''}
      </div>
      <div className="mb-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
        {problem.description}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Your solution</label>
        <div className="border border-slate-200 rounded-lg overflow-hidden min-h-[300px]">
          <Editor
            height="300px"
            language={getMonacoLanguage(problem?.language || problem?.skill)}
            value={code}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              fontSize: 14,
            }}
          />
        </div>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
      >
        {submitLabel}
      </button>
    </div>
  );
}
