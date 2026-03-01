/**
 * AssessmentLayout - Full-screen layout for assessment flow
 * No sidebar; minimal header with logo + Assessment + Exit
 */
import { Outlet, Link } from 'react-router-dom';
import { THEME_CLASSES } from '../../theme';

export default function AssessmentLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-primary-500 font-semibold">
          <span className="text-xl">SkillTera</span>
          <span className="text-slate-500 font-normal">|</span>
          <span className="text-slate-700">Assessment</span>
        </Link>
        <Link
          to="/profile"
          className="text-slate-600 hover:text-slate-900 text-sm"
        >
          Exit
        </Link>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
