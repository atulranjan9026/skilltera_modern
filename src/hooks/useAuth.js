import { useAuthContext } from '../store/context/AuthContext';

/**
 * Convenience hook that re-exports AuthContext.
 * Provides auth state + actions in a single import.
 */
export const useAuth = () => {
  return useAuthContext();
};
