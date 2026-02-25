import { useMemo } from 'react';
import { useAuthContext } from '../store/context/AuthContext';

/**
 * Hook to determine user role from auth context.
 * Returns the user's role and boolean helpers.
 */
export const useUserRole = () => {
  const { user, isLoading } = useAuthContext();

  const role = useMemo(() => {
    if (!user) return null;
    return user.role || 'candidate'; // Default to candidate
  }, [user]);

  return {
    role,
    isLoading,
    isCandidate: role === 'candidate',
    isCompany: role === 'company',
    isAdmin: role === 'admin',
    isAuthenticated: !!user,
  };
};
