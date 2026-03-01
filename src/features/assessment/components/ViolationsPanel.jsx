/**
 * ViolationsPanel - Collapsible "View issues" panel during problem/code stages
 */
import { useState } from 'react';

function getViolationLabel(type) {
  const labels = {
    gaze: 'Gaze deviation',
    presence: 'Face not detected',
    multiple_faces: 'Multiple faces',
    audio_silence: 'Audio silence',
    loud_noise: 'Loud noise',
    test: 'Test',
  };
  return labels[type] || type;
}

export default function ViolationsPanel({ violations = [], violationStats = {} }) {
  const [expanded, setExpanded] = useState(false);
  const count = violations.length;

  return (
    <div className="fixed bottom-5 left-5 z-[9999] max-w-sm">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        View issues ({count})
      </button>
      {expanded && (
        <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Proctoring alerts</h3>
          {count === 0 ? (
            <p className="text-sm text-slate-600">No proctoring alerts detected.</p>
          ) : (
            <ul className="space-y-2">
              {violations.map((v, i) => (
                <li
                  key={v.id ?? i}
                  className="text-sm p-2 rounded bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-800">{getViolationLabel(v.type)}</span>
                  <span className="text-slate-500 text-xs ml-2">
                    {v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : ''}
                  </span>
                  {v.alert && <p className="mt-1 text-slate-600">{v.alert}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
