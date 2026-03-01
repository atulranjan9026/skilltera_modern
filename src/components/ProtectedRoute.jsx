import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../store/context/AuthContext';

/**
 * ProtectedRoute - Redirects unauthenticated users to login
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
