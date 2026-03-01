/**
 * RoomCheck - 3-area environment scan + skip option (Phase 2 style)
 */
import { useState } from 'react';
import { THEME_CLASSES } from '../../../theme';

const AREAS = [
  { id: 'desk', label: 'Desk surface', description: 'Show your desk/work area' },
  { id: 'left', label: 'Left side', description: 'Pan to your left' },
  { id: 'right', label: 'Right side', description: 'Pan to your right' },
];

export default function RoomCheck({ state }) {
  const [completed, setCompleted] = useState([]);
  const [skipped, setSkipped] = useState(false);

  const handleAreaComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted((c) => [...c, id]);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    state.handleEnvScanComplete([]);
  };

  const handleFinish = () => {
    state.handleEnvScanComplete(
      completed.map((id) => ({
        label: id,
        durationMs: 5000,
        s3Location: '',
      }))
    );
  };

  if (skipped) return null;

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Environment Scan</h2>
      <p className="text-slate-600 mb-6">
        Please show each area of your room. This helps ensure test integrity.
      </p>
      <div className="space-y-4 mb-6">
        {AREAS.map((area) => (
          <div
            key={area.id}
            className={`p-4 rounded-lg border ${
              completed.includes(area.id) ? 'border-green-500 bg-green-50' : 'border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{area.label}</span>
                <p className="text-sm text-slate-500">{area.description}</p>
              </div>
              {completed.includes(area.id) ? (
                <span className="text-green-600 text-sm">Done</span>
              ) : (
                <button
                  onClick={() => handleAreaComplete(area.id)}
                  className={`px-3 py-1 rounded text-sm ${THEME_CLASSES.buttons.secondary}`}
                >
                  Mark done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleFinish}
          disabled={completed.length === 0}
          className={`px-6 py-2 rounded-lg font-medium ${
            completed.length > 0 ? THEME_CLASSES.buttons.primary : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        <button onClick={handleSkip} className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.outline}`}>
          Skip (24h cooldown)
        </button>
      </div>
    </div>
  );
}
